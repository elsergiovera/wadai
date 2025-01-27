import { useState } from 'react'
import Menu from './components/Menu'
import Topbar from './components/Topbar'
import Day from './components/Day'

const App = () => {
  const [openMenu, setOpenMenu] = useState(false)
  const handleToggleMenu = () => setOpenMenu(!openMenu)

  return (
    <div className='w-screen h-screen bg-gray-50 space-y-5'>
      <Menu isOpen={openMenu} handleToggleMenu={handleToggleMenu} />
      <Topbar handleToggleMenu={handleToggleMenu} />
      <Day />
    </div>
  )
}

export default App