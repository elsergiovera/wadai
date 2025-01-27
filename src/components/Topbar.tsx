
import { AlignJustify } from 'lucide-react'
const VITE_ENV_APP_NAME = import.meta.env.VITE_ENV_APP_NAME

interface TopbarProps {
   handleToggleMenu: () => void
}
const Topbar: React.FC<TopbarProps> = ({ handleToggleMenu }) => {
   const onClick = () => handleToggleMenu()

   return (
      <div className='w-full min-h-[50px] grid grid-cols-3 bg-red-500 text-white'>
         <div className='place-content-center pl-3'><AlignJustify onClick={onClick} /></div>
         <div className='place-content-center text-center text-3xl'>{VITE_ENV_APP_NAME}</div>
         <div></div>
      </div>
   )
}

export default Topbar