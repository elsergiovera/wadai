const VITE_ENV_APP_MAX_ROUNDS = import.meta.env.VITE_ENV_APP_MAX_ROUNDS
import { useEffect, useRef } from 'react'
import useStore, { Status, Day, AppSound } from '@/store'
import Board from '@/components/Board'
import Keyboard from '@/components/Keyboard'
import FinalScreen from '@/components/FinalScreen'
import data from '@/data/2025/en-US.json'
import lodash from 'lodash'

const Game: React.FC<AppSound> = ({ playSound }) => {
   const { appStatus, setAppStatus } = useStore()
   const appStatusRef = useRef(appStatus)

   useEffect(() => {
      setInitialStatus()

      // Add Event Listener and it respective cleanup to handle key functions.
      window.addEventListener('keydown', handleKeyDown)
      return () => {
         window.removeEventListener('keydown', handleKeyDown)
      }
   }, [])
   useEffect(() => {
      // console.log("--- appStatus updated ---", appStatus)
      appStatusRef.current = appStatus
   }, [appStatus])

   const setInitialStatus = () => {
      const formattedDate: string = '01/16'
      // const formattedDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })
      const day: Day | undefined = lodash.find((data as Day[]), { date: formattedDate })
      const _festivity = day?.festivity ?? ''

      setAppStatus({
         date: formattedDate,
         phrase: _festivity,
         answerByChar: _festivity.split('').map(char => (char === ' ' ? char : null)),
         // answerByChar: ["X", "A", "R", "T", "X", "N", " ", "X", "U", "T", "H", "E", "X", " ", "K", "X", "N", "G", " ", "X", "X"],
         matchsByChar: [],
         activeSlot: 1,
         round: 1,
         score: 100,
         paused: false,
         gameOver: false
      } as Status)
   }
   const insertKey = (status: Status, key: string) => {
      const { answerByChar, matchsByChar, activeSlot, round } = status
      const _answerByChar = answerByChar
      let _nextSlotAvailable
      let _activeSlot = 0

      // Set the key at the current active slot.
      _answerByChar[activeSlot - 1] = key.toUpperCase()

      // Determines the next active slot.
      // If no plays have been made yet (round === 1), move to the next slot if it's not at the last one.
      // If plays have been made (round > 1), find the next available slot wheres matches are marked as 'false' in the previous round.
      if (round === 1) {
         const _isNextSlotSpace = _answerByChar[activeSlot] === ' '
         _nextSlotAvailable = activeSlot < _answerByChar.length
         _activeSlot = activeSlot + (_nextSlotAvailable ? 1 + (_isNextSlotSpace ? 1 : 0) : 0)

         !_nextSlotAvailable && playSound('bump')
      }
      else {
         _nextSlotAvailable = matchsByChar.slice(activeSlot).findIndex((match) => match === false) + 1
         _activeSlot = activeSlot + (_nextSlotAvailable >= 1 ? _nextSlotAvailable : 0)

         if (_nextSlotAvailable === 0) playSound('bump')
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
      const activeSlotIndex = activeSlot - 1
      const _answerByChar = answerByChar
      const _phraseByChar = phrase.split('')
      const _isPreviousSlotSpace = _phraseByChar[activeSlotIndex - 1] === ' '
      const _isSlotEmpty = _answerByChar[activeSlotIndex] === null
      let _activeSlot = 0

      // Removes the corresponding key and determines the next active slot.
      // If no plays have been made yet (round === 1), moves to the previous slot if it's not at the first one already.
      // If plays have been made (round > 1), find the previous available slot where match was marked as 'false' in the previous round.
      if (round === 1) {
         // If it's the first slot, plays the sound and exits the function.
         if (activeSlotIndex === 0) {
            playSound('bump')
            return
         }

         // Set activeSlot based on the current position and conditions.
         // If it's the last slot available in the board, and it's not empty, it removes the key and sets the activeSlot to itself.
         // Oherwise, moves to the next available slot.
         const _isLastSlot = activeSlot === _phraseByChar.length

         if (_isLastSlot) {
            _answerByChar[activeSlotIndex - (_isSlotEmpty ? 1 : 0)] = null
            _activeSlot = activeSlot - (_isSlotEmpty ? 1 : 0)
         }
         else {
            _answerByChar[activeSlotIndex - (_isPreviousSlotSpace ? 2 : 1)] = null
            _activeSlot = (activeSlot - 1) - (_isPreviousSlotSpace ? 1 : 0)
         }
      }
      else {
         const _nextSlotIndex = matchsByChar.slice(0, activeSlotIndex).lastIndexOf(false)
         const _isFirstSlot = _nextSlotIndex === -1
         const _isLastSlot = activeSlotIndex === matchsByChar.lastIndexOf(false)
         _answerByChar[activeSlotIndex] = null

         // Set activeSlot based on the current position and conditions.
         // If it's the first available slot or if it's the last available slot and it's not empty, sets the activeSlot to itself. 
         // Otherwise, moves to the next available slot.
         // Note: A slot can be first and last at the same time, if it's the only one available in the board.
         _activeSlot = ((_isLastSlot && !_isSlotEmpty) || _isFirstSlot) ? activeSlot : _nextSlotIndex + 1

         if (_isFirstSlot) playSound('bump')
      }

      setAppStatus({
         ...status,
         answerByChar: _answerByChar,
         activeSlot: _activeSlot
      } as Status)
   }
   const validateKeys = (status: Status) => {
      const { phrase, answerByChar, matchsByChar, activeSlot, round } = status

      // Makes sure there's no slots left empty before validating and that the active slot is the last slot available in the board.
      // To make sure it's getting the actual last available slot in the board, it checks if it's the final character in round 1 or the last unmatched character in subsequent rounds.  
      const _areEmptySlots = answerByChar.includes(null)
      const _isLastSlot = activeSlot === (round === 1 ? phrase.length : matchsByChar.lastIndexOf(false) + 1)
      const validate = !_areEmptySlots && _isLastSlot

      if (!validate) {
         playSound('bump')
         return
      }

      // If it's ok to validate, it compares each character of the user's answer with the corresponding character in the correct phrase.
      const _phraseByChar = phrase.split('')
      const _matchsByChar: (boolean | null)[] = []
      let _activeSlot: number | null = null
      let _boardComplete = true

      answerByChar.map((char, index) => {
         const _match = (char !== ' ') ? char === _phraseByChar[index].toUpperCase() : null
         _matchsByChar.push(_match)

         // If there's wrong answers, set the first active slot for next round and the board as incomplete.
         if (_match === false && _activeSlot === null) _activeSlot = index + 1
         if (_match === false && _boardComplete) _boardComplete = false
      })

      // Determine if the game is over based on whether the board is complete or the maximum number of rounds has been reached.
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
   const handleKeyDown = (event: KeyboardEvent | string) => {
      if (appStatusRef.current.paused) return

      // Extract the key from the event. If 'event' is a string, it comes directly from the Virtual Keyboard 
      // Otherwise, it's a KeyboardEvent coming from the device keyboard and gets the 'key' property.
      const key = typeof event === 'string' ? event : (event as KeyboardEvent).key

      // Makes sure the key is a single alphabetic character (A-Z or a-z).
      const isChar = /^[A-Za-z]$/.test(key)

      if (isChar) insertKey(appStatusRef.current, key)
      else if (key === 'Backspace') deleteKey(appStatusRef.current)
      else if (key === 'Enter') validateKeys(appStatusRef.current)
   }

   return (
      <>
         <div className='flex justify-center'>
            <div className={`flex flex-col justify-between w-app min-w-app h-[600px]`}>
               <Board playSound={playSound} />
               <Keyboard handleKeyDown={handleKeyDown} playSound={playSound} />
            </div>
         </div>

         {appStatus.gameOver &&
            <FinalScreen playSound={playSound} />
         }
      </>
   )
}

export default Game