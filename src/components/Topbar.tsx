
import { MoreOutlined } from '@ant-design/icons'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'

interface TopbarProps {
   handleToggleMenu: () => void
}
const Topbar: React.FC<TopbarProps> = ({ handleToggleMenu }) => {
   const onClick = () => handleToggleMenu()

   return (
      <div className='bg-red-500 text-white' >
         <AppBar position="static" color="transparent" >
            <Toolbar>
               <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={onClick}
               >
                  <MoreOutlined />
               </IconButton>
            </Toolbar>
         </AppBar>
      </div>
   )
}

export default Topbar