import { useState, useEffect, useRef } from 'react'
import useStore, { Status, Day } from '@/store'
import lodash from 'lodash'
import Menu from '@/components/Menu'
import Topbar from '@/components/Topbar'
import Board from '@/components/Board'
import Keyboard from '@/components/Keyboard'
// import Dialog from '@mui/material/Dialog'
import days from '@/data/2025/en-US.json'

const App = () => {
   const { appStatus, setAppStatus } = useStore()
   const [openMenu, setOpenMenu] = useState(false)
   const appStatusRef = useRef(appStatus)
   // const [openDialog, setOpenDialog] = useState(false)

   // console.log("appStatus", appStatus)
   useEffect(() => {
      setInitialStatus()

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
   }, [])
   useEffect(() => {
      appStatusRef.current = appStatus
   }, [appStatus])

   const setInitialStatus = () => {
      // TODO add try-catch
      // const formattedDate: string = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })
      const formattedDate: string = '01/16'
      const day: Day | undefined = lodash.find((days as Day[]), { date: formattedDate })

      setAppStatus({
         date: formattedDate,
         phrase: day?.festivity ? day?.festivity : '',
         phraseByChar: day?.festivity ? day?.festivity.replace(/ /g, '').toUpperCase().split('') : [],
         // answerByChar: [],
         answerByChar: day?.festivity ? day?.festivity.split('').map(char => (char === ' ' ? char : null)) : [],
         matchsByChar: [],
         activeSlot: 1,
         round: 1,
         score: 100,
         paused: false
      } as Status)
   }
   const insertKey = (key: string) => {
      const _slotIndex = appStatusRef.current.activeSlot - 1
      const _answerByChar = appStatusRef.current.answerByChar
      const _phraseByChar = appStatusRef.current.phrase.split('')
      let _activeSlot = 0

      // // Set the key at the current active slot.
      _answerByChar[_slotIndex] = key.toUpperCase()

      if (appStatusRef.current.round === 1) {
         const _nextSlotAvailable = appStatusRef.current.activeSlot < _phraseByChar.length

         if (_nextSlotAvailable) {
            const _isNextSlotSpace = _phraseByChar[appStatusRef.current.activeSlot] === ' '

            _activeSlot = (appStatusRef.current.activeSlot + 1) + (_isNextSlotSpace ? 1 : 0)
         }
         else
            _activeSlot = appStatusRef.current.activeSlot
      }

      const _status: Status = ({
         ...appStatusRef.current,
         answerByChar: _answerByChar,
         activeSlot: _activeSlot
      })

      setAppStatus(_status)
   }
   const deleteKey = () => {
      // If it's the first slot, exits the function.
      if (appStatusRef.current.activeSlot === 1) return

      const _slotIndex = appStatusRef.current.activeSlot - 1
      const _answerByChar = appStatusRef.current.answerByChar
      const _phraseByChar = appStatusRef.current.phrase.split('')
      const _isPreviousSlotSpace = _phraseByChar[_slotIndex - 1] === ' '
      const _isLastSlot = appStatusRef.current.activeSlot === _phraseByChar.length
      let _activeSlot = _slotIndex

      if (_isLastSlot) {
         // If deleting at the last slot, check if it's empty
         const _isLastSlotEmpty = _answerByChar[_slotIndex] === null

         // Remove the last character, considering if it's already empty
         _answerByChar[_slotIndex - (_isLastSlotEmpty ? 1 : 0)] = null

         // Adjust the active slot, skipping an extra space if the last slot i's empty
         _activeSlot = appStatusRef.current.activeSlot - (_isLastSlotEmpty ? 1 : 0)
      }
      else {
         // If not at the last slot, remove the previous character.
         // Skips an extra slot if the previous one is a space.
         _answerByChar[_slotIndex - (_isPreviousSlotSpace ? 2 : 1)] = null

         // Adjust the active slot, skipping an extra space if the previous one is a space.
         _activeSlot = (appStatusRef.current.activeSlot - 1) - (_isPreviousSlotSpace ? 1 : 0)
      }

      setAppStatus({
         ...appStatusRef.current,
         answerByChar: _answerByChar,
         activeSlot: _activeSlot
      } as Status)
   }
   const validateKeys = () => {
      // Makes sure that all characters in the answer are filled before validating.
      const _fullAnswer = appStatusRef.current.answerByChar.includes(null)
      if (_fullAnswer) return
      
      // Compares each character of the user's answer with the corresponding character in the correct phrase.
      const _phraseByChar = appStatusRef.current.phrase.split('')
      const _matchsByChar: (boolean | null)[] = []
      let _activeSlot: number | null = null

      appStatusRef.current.answerByChar.map((char, index) => {
         const _match = char === _phraseByChar[index].toUpperCase()
         _matchsByChar.push(_match)

         // If there's wrong answers, set the first as active slot for next round.
         if (!_match && _activeSlot === null) _activeSlot = index + 1
      })

      const _status: Status = ({
         ...appStatusRef.current,
         matchsByChar: _matchsByChar,
         activeSlot: _activeSlot ?? 1,
         round: appStatusRef.current.round + 1,
      })
      setAppStatus(_status)
   }

   const handleToggleMenu = () => setOpenMenu(!openMenu)
   const handleKeyDown = (event: KeyboardEvent | string) => {
      if (appStatusRef.current.paused) return

      const key = typeof event === 'string' ? event : (event as KeyboardEvent).key
      const isChar = /^[A-Za-z]$/.test(key)

      if (isChar) insertKey(key)
      else if (key === 'Backspace') deleteKey()
      else if (key === 'Enter') validateKeys()
   }

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

         {/* <Dialog
            fullScreen
            open={false}
            onClose={() => setOpenDialog(false)}
         >
            <div className='flex place-content-center h-full'>
               <div className='flex flex-col justify-center w-[450px]'>
                  <div className='h-[300px] border'>
                     {

                     }
                  </div>
               </div>
            </div>
         </Dialog> */}
      </>
   )
}

export default App