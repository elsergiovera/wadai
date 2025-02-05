import Dialog from '@mui/material/Dialog'
import example_rounds from '@/assets/img/example_rounds.png'
import example_board from '@/assets/img/example_board.png'
import { XIcon } from 'lucide-react'

interface HowToProps {
   isOpen: boolean
   handleToggle: () => void
}
const HowToPlay: React.FC<HowToProps> = ({ isOpen, handleToggle }) => {
   return (
      <Dialog
         open={isOpen}
         onClose={handleToggle}
         fullWidth={false}
         maxWidth={false}
         slotProps={{
            transition: { timeout: 400 },
            backdrop: {
               sx: {
                  backgroundColor: 'rgba(0, 0, 0, 0.3)'
               }
            },
            container: {
               sx: {
                  alignItems: 'flex-start'
               }
            },
            paper: {
               sx: {
                  width: '380px',
                  minWidth: '380px',
                  height: '400px',
                  minHeight: '400px',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  margin: '60px 0 0',
                  borderRadius: '0'
               },
            },
         }}
      >
         <div className='flex justify-end pt-2 px-2'>
            <XIcon className='w-5 h-5 text-gray-300 cursor-pointer' onClick={handleToggle} />
         </div>
         <div className='flex justify-center place-content-center overflow-hidden'>
            <div className='grid grid-col gap-5'>
               <div className='font-title text-center outlined-text-reverse text-[24px]'>HOW TO PLAY</div>
               <ul className='list-disc list-inside font-text text-[12px] tracking-tighter whitespace-nowrap space-y-2'>
                  <li>
                     Guess the <strong>Daily Festivity</strong> around the world.
                  </li>
                  <li>
                     <strong>You can only play one time per day</strong>.
                  </li>
                  <li>
                     You have <strong>5 rounds</strong> to play.
                  </li>
                  <li>
                     The <strong>rounds count</strong> is represented at the top.
                  </li>
                  <img src={example_rounds} width={'120px'} className='ml-[90px]' />
                  <li>
                     The results are displayed <strong>after every round</strong>.
                  </li>
                  <img src={example_board} width={'140px'} className='ml-[80px]' />
               </ul>
            </div>
         </div>
      </Dialog>
   )
}

export default HowToPlay