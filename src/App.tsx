import { useState, useEffect, useRef } from 'react'
import useStore from '@/store'
import Menu from '@/components/Menu'
import Topbar from '@/components/Topbar'
import Board from '@/components/Board'
import Keyboard from '@/components/Keyboard'

const App = () => {
  const { day, answer, setAnswer, resetAnswer, backspaceAnswer, setCheckAnswer } = useStore()
  const [openMenu, setOpenMenu] = useState(false)
  const dayWithNoSpaces: string = day.replace(/ /g, '')
  const answerRef = useRef(answer)

  const handleToggleMenu = () => setOpenMenu(!openMenu)
  const handleKeyDown = (event: KeyboardEvent | string) => {
    const slotAvailable: boolean = dayWithNoSpaces.length >= answerRef.current.length + 1
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
    if (dayWithNoSpaces.length === answer.length) setCheckAnswer(true)
  }, [answer])

  return (
    <div className='w-screen h-full space-y-2'>
      <Menu isOpen={openMenu} handleToggleMenu={handleToggleMenu} />
      <Topbar handleToggleMenu={handleToggleMenu} />
      <div className='flex justify-center'>
        <div className='flex w-[400px] h-[600px]'>
          <div className='flex flex-col justify-between'>
            <Board />
            <Keyboard handleKeyDown={handleKeyDown} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App