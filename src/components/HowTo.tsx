import Dialog from '@mui/material/Dialog'

interface HowToProps {
   isOpen: boolean
   handleToggleHowTo: () => void
}
const HowTo: React.FC<HowToProps> = ({ isOpen, handleToggleHowTo }) => {
   return (
      <Dialog
         open={isOpen}
         onClose={handleToggleHowTo}
         maxWidth={'xs'}
         slotProps={{
            transition: { timeout: 400 },
            backdrop: {
               sx : {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)'
               }
            },
            container: {
               sx: {
                  alignItems: 'flex-start'
               }
            },
            paper: {
               sx: {
                  margin: 0,
                  marginTop: '50px',
                  width: '420px',
                  height: '420px',
                  borderRadius: 0,
                  boxShadow: 0
               },
            },
         }}
      >
         <div className='flex justify-center items-center'>
            HOW TO
         </div>
      </Dialog>
   )
}

export default HowTo