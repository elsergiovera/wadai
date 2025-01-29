import { useState, useEffect, useRef } from 'react'
import useStore, { Status, Day } from '@/store'
import lodash from 'lodash'
import Menu from '@/components/Menu'
import Topbar from '@/components/Topbar'
import Board from '@/components/Board'
import Keyboard from '@/components/Keyboard'
import days from '@/data/2025/en-US.json'

const App = () => {
   const { appStatus, setAppStatus, setAnswer, deleteAnswer, resetAnswer, setCheckAnswer } = useStore()
   const [openMenu, setOpenMenu] = useState(false)
   const statusRef = useRef(appStatus)

   // console.log("appStatus", appStatus)
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
         plays: 0,
         score: 0
      } as Status)
   }

   const checkAnswer = () => {
      // setCheckAnswer(true)
   }
   const handleToggleMenu = () => setOpenMenu(!openMenu)
   const handleKeyDown = (event: KeyboardEvent | string) => {
      const key: string = typeof event === 'string' ? event : (event as KeyboardEvent).key
      const isChar: boolean = /^[A-Za-z]$/.test(key)
      const slotAvailable: boolean = statusRef.current.phraseByChar.length >= statusRef.current.answerByChar.length + 1

      if (slotAvailable && isChar) setAnswer(key)
      else if (key === 'Backspace') deleteAnswer()
      else if (key === 'Enter' && !slotAvailable) checkAnswer()
   }

   useEffect(() => {
      // resetAnswer()
      // setCheckAnswer(false)
      setInitialStatus()

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
   }, [])
   useEffect(() => {
      statusRef.current = appStatus
   }, [appStatus])

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