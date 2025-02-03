import { XIcon } from 'lucide-react'
import Dialog from '@mui/material/Dialog'
import example_rounds from '@/assets/img/example_rounds.png'
import example_board from '@/assets/img/example_board.png'

interface HowToProps {
   isOpen: boolean
   handleToggleHowTo: () => void
}
const HowTo: React.FC<HowToProps> = ({ isOpen, handleToggleHowTo }) => {
   return (
      <Dialog
         open={isOpen}
         onClose={handleToggleHowTo}
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
                  width: '340px',
                  minWidth: '340px',
                  height: '400px',
                  minHeight: '400px',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  margin: '60px 0 0',
                  borderRadius: '20px',
                  boxShadow: '0px -5px 50px rgba(0, 0, 0, 0)'
               },
            },
         }}
      >
         <>
            <div className='flex justify-end pt-3 pb-1 px-4'>
               <XIcon className='text-gray-300 cursor-pointer' onClick={handleToggleHowTo} />
            </div>
            <div className='flex justify-center place-content-center'>
               <div className='grid grid-col gap-5 p-4 pt-0'>
                  <div className='font-custom text-center outlined-text-reverse text-[1.5em]'>HOW TO PLAY</div>
                  <ul className='list-disc text-sm tracking-wide whitespace-nowrap pl-4 space-y-2'>
                     <li>
                        Guess the <strong>daily festivity</strong> around the world.
                     </li>
                     <li>
                        You have <strong>5 rounds</strong> to play.
                     </li>
                     <li>
                        The <strong>rounds count</strong> is represented at the top.
                     </li>
                     <img src={example_rounds} width={'120px'} className='ml-[80px]' />
                     <li>
                        <strong>After a play</strong> you'll see the round results.
                     </li>
                     <img src={example_board} width={'140px'} className='ml-[70px]' />
                  </ul>
               </div>
            </div>
         </>
      </Dialog>
   )
}

export default HowTo