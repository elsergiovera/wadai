import { useState, useEffect, useRef } from 'react'
import useStore, { Status, Day } from '@/store'
import lodash from 'lodash'
import Menu from '@/components/Menu'
import Topbar from '@/components/Topbar'
import Board from '@/components/Board'
import Keyboard from '@/components/Keyboard'
import Dialog from '@mui/material/Dialog'
import bumpSound from '/assets/audio/bump.mp3'
import days from '@/data/2025/en-US.json'

const VITE_ENV_APP_MAX_ROUNDS = import.meta.env.VITE_ENV_APP_MAX_ROUNDS

const App = () => {
   const { appStatus, setAppStatus } = useStore()
   const appStatusRef = useRef(appStatus)
   const audioContextRef = useRef<AudioContext | null>(null)
   const audioBuffersRef = useRef<Map<string, AudioBuffer>>(new Map())

   const [openMenu, setOpenMenu] = useState(false)

   useEffect(() => {
      setInitialStatus()

      // Optimized playback audio functions.
      const loadAudio = async (url: string) => {
         const response = await fetch(url)
         const arrayBuffer = await response.arrayBuffer()
         const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer)

         audioBuffersRef.current.set(url, audioBuffer)
      }
      const initializeAudio = async () => {
         if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext()
         }
         await Promise.all([
            loadAudio(bumpSound)
         ])
      }
      initializeAudio()

      // Keep the AudioContext Active (important for mobile).
      // Mobile browsers pause the AudioContext when inactive, which adds delays.
      const unlockAudio = () => {
         if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume()
         }
      }
      
      // Add Event Listeners and their respectives cleanup function.
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('touchstart', unlockAudio)
      window.addEventListener('click', unlockAudio)

      return () => {
         window.removeEventListener('keydown', handleKeyDown)
         window.removeEventListener('touchstart', unlockAudio)
         window.removeEventListener('click', unlockAudio)
      }
   }, [])
   useEffect(() => {
      appStatusRef.current = appStatus
      handleStatusUpdate(appStatus)
   }, [appStatus])

   const setInitialStatus = () => {
      // TODO add try-catch
      const _formattedDate: string = '01/16'
      // const _formattedDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })
      const _day: Day | undefined = lodash.find((days as Day[]), { date: _formattedDate })
      // const _festivity = _day ? _day.festivity : ''

      setAppStatus({
         date: _formattedDate,
         phrase: _day?.festivity ? _day.festivity : '',
         answerByChar: _day?.festivity ? _day.festivity.split('').map(char => (char === ' ' ? char : null)) : [],
         // answerByChar: [
         //    "X",
         //    "A",
         //    "R",
         //    "T",
         //    "X",
         //    "N",
         //    " ",
         //    "X",
         //    "U",
         //    "T",
         //    "H",
         //    "E",
         //    "X",
         //    " ",
         //    "K",
         //    "X",
         //    "N",
         //    "G",
         //    " ",
         //    "X",
         //    "X"
         // ],
         matchsByChar: [],
         activeSlot: 1,
         round: 1,
         score: 100,
         paused: false,
         gameOver: false
      } as Status)
   }
   const playSound = (url: string) => {
      if (!audioBuffersRef.current.has(url)) return
      const source = audioContextRef.current!.createBufferSource()

      source.buffer = audioBuffersRef.current.get(url)!
      source.connect(audioContextRef.current!.destination)
      source.start(0)
   }
   const insertKey = (status: Status, key: string) => {
      const { phrase, answerByChar, matchsByChar, activeSlot, round } = status
      const _slotIndex = activeSlot - 1
      const _answerByChar = answerByChar
      const _phraseByChar = phrase.split('')
      let _activeSlot = 0

      // Set the key at the current active slot.
      _answerByChar[_slotIndex] = key.toUpperCase()

      // Determine the next active slot.
      // If no plays have been made yet (round === 1), move to the next slot if it's not at the last one.
      // If plays have been made (round > 1), find the next available slot wheres matches are marked as 'false' in the previous round.
      if (round === 1) {
         const _nextSlotAvailable = activeSlot < _phraseByChar.length

         if (_nextSlotAvailable) {
            const _isNextSlotSpace = _phraseByChar[activeSlot] === ' '
            _activeSlot = (activeSlot + 1) + (_isNextSlotSpace ? 1 : 0)
         }
         else {
            _activeSlot = activeSlot
            playSound(bumpSound)
         }
      }
      else {
         const _nextSlotIndex = matchsByChar.slice(activeSlot).findIndex((match) => match === false)

         if (_nextSlotIndex === -1) {
            _activeSlot = activeSlot
            playSound(bumpSound)

         }
         else if (_nextSlotIndex >= 0)
            _activeSlot = activeSlot + _nextSlotIndex + 1
      }

      const _status: Status = ({
         ...status,
         answerByChar: _answerByChar,
         activeSlot: _activeSlot
      })

      setAppStatus(_status)
   }
   const deleteKey = (status: Status) => {
      const { phrase, answerByChar, matchsByChar, activeSlot, round } = status
      const _slotIndex = activeSlot - 1
      const _answerByChar = answerByChar
      const _phraseByChar = phrase.split('')
      const _isPreviousSlotSpace = _phraseByChar[_slotIndex - 1] === ' '
      let _activeSlot = _slotIndex

      // Determine the next active slot.
      // If no plays have been made yet (round === 1), move to the previous slot if it's not at the first one.
      // If plays have been made (round > 1), find the previous available slot wheres matches are marked as 'false' in the previous round.
      if (round === 1) {
         // If it's the first slot, plays the sound and exits the function.
         if (_activeSlot === 0) {
            playSound(bumpSound)
            return
         }

         const _isLastSlot = activeSlot === _phraseByChar.length
         if (_isLastSlot) {
            // Check if the last slot and removes it, considering it's not already empty
            const _isLastSlotEmpty = _answerByChar[_slotIndex] === null

            _answerByChar[_slotIndex - (_isLastSlotEmpty ? 1 : 0)] = null
            _activeSlot = activeSlot - (_isLastSlotEmpty ? 1 : 0)
         }
         else {
            // Remove the previous character and skips an extra slot if the previous one is a space.
            _answerByChar[_slotIndex - (_isPreviousSlotSpace ? 2 : 1)] = null
            _activeSlot = (activeSlot - 1) - (_isPreviousSlotSpace ? 1 : 0)
         }
      }
      else {
         const _isLastSlot = activeSlot === matchsByChar.lastIndexOf(false) + 1
         if (_isLastSlot) {
            // Check if the last slot and removes it, considering it's not already empty
            const _isLastSlotEmpty = _answerByChar[_slotIndex] === null
            const _nextSlotIndex = matchsByChar.slice(0, activeSlot - 1).lastIndexOf(false)

            _answerByChar[activeSlot - 1] = null
            _activeSlot = _isLastSlotEmpty ? _nextSlotIndex + 1 : activeSlot
         }
         else {
            // Remove the previous character and skips an extra slot if the previous one is a space.
            const _nextSlotIndex = matchsByChar.slice(0, activeSlot - 1).lastIndexOf(false)
            const _isFirstSlot = _nextSlotIndex === -1

            _answerByChar[_slotIndex] = null
            _activeSlot = (_isFirstSlot) ? _activeSlot = activeSlot : _nextSlotIndex + 1

            if (_isFirstSlot) playSound(bumpSound)
         }
      }

      setAppStatus({
         ...status,
         answerByChar: _answerByChar,
         activeSlot: _activeSlot
      } as Status)
   }
   const validateKeys = (status: Status) => {
      // Makes sure there's no slots left empty before validating.
      const _slotsAvailable = status.answerByChar.includes(null)
      if (_slotsAvailable) return

      // Compares each character of the user's answer with the corresponding character in the correct phrase.
      const { phrase, answerByChar, round } = status
      const _phraseByChar = phrase.split('')
      const _matchsByChar: (boolean | null)[] = []
      let _activeSlot: number | null = null
      let _boardComplete = true

      answerByChar.map((char, index) => {
         const _match = char === _phraseByChar[index].toUpperCase()
         _matchsByChar.push(_match)

         // If there's wrong answers, set the first active slot for next round and the board as incomplete.
         if (!_match && _activeSlot === null) _activeSlot = index + 1
         if (!_match && _boardComplete) _boardComplete = false
      })

      // Determine if the game is over based on whether the board is complete or the maximum number of rounds has been reached
      const _gameOver = ((VITE_ENV_APP_MAX_ROUNDS - round) <= 0) || _boardComplete === true

      const _status: Status = ({
         ...status,
         matchsByChar: _matchsByChar,
         activeSlot: _activeSlot ?? 1,
         round: status.round + 1,
         paused: _gameOver,
         gameOver: _gameOver
      })
      setAppStatus(_status)
   }
   const handleStatusUpdate = (status: Status) => {
      console.log("--- status updated ---", status)
   }
   const handleKeyDown = (event: KeyboardEvent | string) => {
      if (appStatusRef.current.paused) return

      const key = typeof event === 'string' ? event : (event as KeyboardEvent).key
      const isChar = /^[A-Za-z]$/.test(key)

      if (isChar) insertKey(appStatusRef.current, key)
      else if (key === 'Backspace') deleteKey(appStatusRef.current)
      else if (key === 'Enter') validateKeys(appStatusRef.current)
   }
   const handleToggleMenu = () => setOpenMenu(!openMenu)

   return (
      <>
         <div className='w-screen h-full space-y-6'>
            <Menu isOpen={openMenu} handleToggleMenu={handleToggleMenu} />
            <Topbar handleToggleMenu={handleToggleMenu} />
            <div className='flex justify-center'>
               <div className='flex flex-col justify-between w-[450px] h-[600px]'>
                  <Board />
                  <Keyboard handleKeyDown={handleKeyDown} />
               </div>
            </div>
         </div>

         {appStatus.gameOver &&
            <Dialog
               fullScreen
               open={appStatus.gameOver}
               onClose={() => { }}
            >
               <div className='flex place-content-center h-full'>
                  <div className='flex flex-col justify-center w-[450px]'>
                     <div className='place-content-center h-[300px]'>
                        <span className='flex justify-center text-5xl font-custom pb-5'>YOU {appStatus.matchsByChar.includes(false) ? 'LOSE' : 'WIN'}</span>

                        {/* <div className='w-[250px]'> */}
                        <Board />
                        {/* </div> */}
                     </div>
                  </div>
               </div>
            </Dialog>
         }
      </>
   )
}

export default App