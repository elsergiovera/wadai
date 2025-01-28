import Drawer from '@mui/material/Drawer'

interface MenuProps {
   isOpen: boolean
   handleToggleMenu: () => void
}
const Menu: React.FC<MenuProps> = ({ isOpen, handleToggleMenu }) => {
   return (
      <Drawer open={isOpen} onClose={handleToggleMenu}>
         <div className='w-[300px]'>
         </div>
      </Drawer>
   )
}

export default Menu