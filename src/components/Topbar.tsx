
const VITE_ENV_APP_NAME = import.meta.env.VITE_ENV_APP_NAME
import { useState } from 'react'
import Menu from '@/components/Menu'
import { AlignJustify } from 'lucide-react'

const Topbar = () => {
   const [openMenu, setOpenMenu] = useState(false)
   const handleToggleMenu = () => setOpenMenu(!openMenu)

   return (
      <>
         <Menu isOpen={openMenu} handleToggleMenu={handleToggleMenu} />

         <div className='w-full min-h-[50px] grid grid-cols-3 bg-red-500 text-white'>
            <div className='place-content-center pl-2'><AlignJustify onClick={handleToggleMenu} /></div>
            <div className='place-content-center text-center text-3xl'><span className='font-custom'>{VITE_ENV_APP_NAME}</span></div>
            <div></div>
         </div>
      </>
   )
}

export default Topbar