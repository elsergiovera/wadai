import { useState, useEffect, useRef } from 'react'
import _ from 'lodash'
import useStore from '@/store'
import Menu from '@/components/Menu'
import Topbar from '@/components/Topbar'
import Board from '@/components/Board'
import Keyboard from '@/components/Keyboard'
import days from '@/data/2025/en-US.json'

type Day = {
  date: string
  national: string | null
  international: string | null
  region: string
}
const App = () => {
  const { answer, setAnswer, resetAnswer, backspaceAnswer, setCheckAnswer } = useStore()
  const [openMenu, setOpenMenu] = useState(false)
  const answerRef = useRef(answer)
  const formattedDate: string = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })
  const day: Day | undefined = _.find((days as Day[]), { date: '01/16' })
  // const day: Day | undefined = _.find((days as Day[]), { date: formattedDate })
  const phrase: string = day?.national ?? ""
  const phraseWithNoSpaces: string = phrase.replace(/ /g, '')

  const handleToggleMenu = () => setOpenMenu(!openMenu)
  const handleKeyDown = (event: KeyboardEvent | string) => {

    const slotAvailable: boolean = phraseWithNoSpaces.length >= answerRef.current.length + 1
    const key: string = typeof event === 'string' ? event : (event as KeyboardEvent).key
    const isChar: boolean = /^[A-Za-z]$/.test(key)

    if (slotAvailable && isChar) setAnswer(key)
    if (key.toLowerCase() === 'backspace') backspaceAnswer()
  }

  useEffect(() => {
    resetAnswer()
    setCheckAnswer(false)

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  useEffect(() => {
    answerRef.current = answer
    if (phraseWithNoSpaces.length === answer.length) setCheckAnswer(true)
  }, [answer])

  return (
    <div className='w-screen h-full space-y-6'>
      <Menu isOpen={openMenu} handleToggleMenu={handleToggleMenu} />
      <Topbar handleToggleMenu={handleToggleMenu} />
      <div className='flex justify-center'>
        <div className='flex flex-col justify-between w-[450px] h-[600px]'>
          <Board phrase={phrase} />
          <Keyboard handleKeyDown={handleKeyDown} />
        </div>
      </div>
    </div>
  )
}

export default App