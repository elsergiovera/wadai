import { useState, useEffect, useRef } from 'react'
import useStore, { Status, Day } from '@/store'
import lodash from 'lodash'
import Menu from '@/components/Menu'
import Topbar from '@/components/Topbar'
import Board from '@/components/Board'
import Keyboard from '@/components/Keyboard'
import days from '@/data/2025/en-US.json'

const App = () => {
   const { appStatus, setAppStatus } = useStore()
   const [openMenu, setOpenMenu] = useState(false)
   const appStatusRef = useRef(appStatus)

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
         phrase: day?.festivity,
         phraseByChar: day?.festivity.replace(/ /g, '').toUpperCase().split(''),
         answerByChar: [],
         matchsByChar: [],
         plays: 0,
         score: 100,
         paused: false
      } as Status)
   }
   const insertKey = (key: string) => {
      const _answerByChar = appStatusRef.current.answerByChar
      _answerByChar.push(key.toUpperCase())

      const _status: Status = ({
         ...appStatusRef.current,
         answerByChar: _answerByChar
      })
      setAppStatus(_status)
   }
   const deleteKey = () =>{
      const _answerByChar = appStatusRef.current.answerByChar
      _answerByChar.pop()

      setAppStatus({
         ...appStatusRef.current,
         answerByChar: _answerByChar
      } as Status)
   }
   const resetKeys = () => {
      setAppStatus({
         ...appStatusRef.current,
         answerByChar: []
      } as Status)
   }
   const validateKeys = () => {
      const _matchsByChar: (boolean | null)[] = []
      const _plays = appStatusRef.current.plays

      // Compares each character of the user's answer with the corresponding character in the correct phrase.
      appStatusRef.current.answerByChar.map((char, index) => {
         const _match = char === appStatusRef.current.phraseByChar[index]
         _matchsByChar.push(_match)
      })

      const _status: Status = ({
         ...appStatusRef.current,
         matchsByChar: _matchsByChar,
         plays: _plays + 1,
         paused: true
      })
      setAppStatus(_status)
   }

   const handleToggleMenu = () => setOpenMenu(!openMenu)
   const handleKeyDown = (event: KeyboardEvent | string) => {
      if (appStatusRef.current.paused) return

      const key = typeof event === 'string' ? event : (event as KeyboardEvent).key
      const isChar = /^[A-Za-z]$/.test(key)
      const slotAvailable = appStatusRef.current.phraseByChar.length >= appStatusRef.current.answerByChar.length + 1

      if (slotAvailable && isChar) insertKey(key)
      else if (key === 'Backspace') deleteKey()
      else if (key === 'Enter' && !slotAvailable) validateKeys()
   }

   return (
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
   )
}

export default App