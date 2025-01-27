
import { AlignJustify } from 'lucide-react'

interface TopbarProps {
   handleToggleMenu: () => void
}
const Topbar: React.FC<TopbarProps> = ({ handleToggleMenu }) => {
   const onClick = () => handleToggleMenu()

   return (
      <div className='w-full min-h-[50px] grid grid-cols-3 bg-red-500 text-white'>
         <div className='place-content-center pl-3'><AlignJustify onClick={onClick} /></div>
         <div className='place-content-center text-center text-3xl'>WADAI</div>
         <div></div>
      </div>
   )
}

export default Topbar