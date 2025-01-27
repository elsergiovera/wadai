import { useState } from 'react'
import Menu from './components/Menu'
import Topbar from './components/Topbar'
import Day from './components/Day'
import Keyboard from './components/Keyboard'



const App = () => {
  const [openMenu, setOpenMenu] = useState(false)
  const handleToggleMenu = () => setOpenMenu(!openMenu)

  return (
    <div className='w-screen h-screen space-y-5'>
      <Menu isOpen={openMenu} handleToggleMenu={handleToggleMenu} />
      <Topbar handleToggleMenu={handleToggleMenu} />
      <div className="min-h-9/10 flex justify-center">
        <div className="flex flex-col w-[400px] max-h-[600px]">
          <div className="flex flex-col h-full justify-between">
            <Day />
            <Keyboard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App