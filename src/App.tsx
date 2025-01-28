import useStore from './store'
import { useState, useEffect } from 'react'
import Menu from './components/Menu'
import Topbar from './components/Topbar'
import Board from './components/Board'
import Keyboard from './components/Keyboard'

const App = () => {
  const { day, answer, setAnswer, resetAnswer, backspaceAnswer, setCheckAnswer } = useStore()
  const [openMenu, setOpenMenu] = useState(false)

  const handleToggleMenu = () => setOpenMenu(!openMenu)
  const handleKeyDown = (event: KeyboardEvent | string) => {
    const _key = typeof event === "string" ? (event as string).replace(/[{}]/g, '') : (event as KeyboardEvent).key
    const isChar = /^[A-Za-z]$/.test(_key)

    if (isChar) setAnswer(_key)
    if (_key.toLowerCase() === 'backspace') backspaceAnswer()
  }

  useEffect(() => {
    resetAnswer()
    setCheckAnswer(false)

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  useEffect(() => {
    if (day.replace(/ /g, '').length === answer.length) setCheckAnswer(true)
  }, [answer])

  return (
    <div className='w-screen h-screen space-y-5'>
      <Menu isOpen={openMenu} handleToggleMenu={handleToggleMenu} />
      <Topbar handleToggleMenu={handleToggleMenu} />
      <div className="min-h-9/10 flex justify-center">
        <div className="flex flex-col w-[400px] max-h-[600px]">
          <div className="flex flex-col h-full justify-between">
            <Board />
            <Keyboard handleKeyDown={handleKeyDown} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App