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

   console.log("appStatus", appStatus)
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
         answerByChar: [],
         matchsByChar: [],
         activeSlot: 1,
         round: 1,
         score: 100,
         paused: false
      } as Status)
   }
   const insertKey = (key: string) => {
      const _answerByChar = appStatusRef.current.answerByChar
      const _matchsByChar = appStatusRef.current.matchsByChar

      // Set the key at the current active slot.
      let _activeSlot = 0
      const _currentSearchIndex = appStatusRef.current.activeSlot - 1
      _answerByChar[_currentSearchIndex] = key.toUpperCase()

      // Determine the next active slot.
      // If no plays have been made yet (round === 1), move to the next slot if it's not at the last one.
      // If plays have been made (round > 1), find the next available slot wheres matches are 'false' marked as false in the previous round.
      if (appStatusRef.current.round === 1) {
         const _nextSlotIndex = appStatusRef.current.activeSlot < appStatusRef.current.phraseByChar.length

         if (_nextSlotIndex)
            _activeSlot = appStatusRef.current.activeSlot + 1
         else
            _activeSlot = appStatusRef.current.activeSlot
      }
      else {
         const _nextSlotIndex = appStatusRef.current.matchsByChar.slice(_currentSearchIndex + 1).findIndex((match) => match === false)

         if (_nextSlotIndex === -1) {
            _activeSlot = appStatusRef.current.activeSlot
         }
         else if (_nextSlotIndex >= 0) {
            _activeSlot = appStatusRef.current.activeSlot + _nextSlotIndex + 1
         }
      }

      const _status: Status = ({
         ...appStatusRef.current,
         answerByChar: _answerByChar,
         matchsByChar: _matchsByChar,
         activeSlot: _activeSlot
      })
      setAppStatus(_status)
   }
   const deleteKey = () => {
      const _answerByChar = appStatusRef.current.answerByChar
      _answerByChar.pop()

      setAppStatus({
         ...appStatusRef.current,
         answerByChar: _answerByChar,
         activeSlot: appStatusRef.current.activeSlot - 1
      } as Status)
   }
   const validateKeys = () => {
      // Compares phrase and answer length. Only if the answer is typed completely, it can validate it.
      const _fullAnswer = appStatusRef.current.answerByChar.length === appStatusRef.current.phraseByChar.length
      if (!_fullAnswer) return

      // Compares each character of the user's answer with the corresponding character in the correct phrase.
      const _matchsByChar: (boolean | null)[] = []
      let _activeSlot: number | null = null

      appStatusRef.current.answerByChar.map((char, index) => {
         const _match = char === appStatusRef.current.phraseByChar[index]
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