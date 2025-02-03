import Dialog from '@mui/material/Dialog'
import example_rounds from '@/assets/img/example_rounds.png'
import example_board from '@/assets/img/example_board.png'
// import board from '@/assets/img'

interface HowToProps {
   isOpen: boolean
   handleToggleHowTo: () => void
}
const HowTo: React.FC<HowToProps> = ({ isOpen, handleToggleHowTo }) => {
   return (
      <Dialog
         open={isOpen}
         onClose={handleToggleHowTo}
         fullWidth={true}
         maxWidth={false}
         slotProps={{
            transition: { timeout: 400 },
            backdrop: {
               sx: {
                  backgroundColor: 'rgba(0, 0, 0, 0)'
               }
            },
            container: {
               sx: {
                  alignItems: 'flex-start'
               }
            },
            paper: {
               sx: {
                  width: '100%',
                  height: '100%',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  margin: '60px 0 0',
                  borderRadius: '20px 20px 0 0',
                  boxShadow: '0px -5px 50px rgba(0, 0, 0, 0.5)'
               },
            },
         }}
      >
         <div className='flex justify-center place-content-center'>
            <div className='w-[450px] p-6 grid grid-col gap-5'>
               <div className='font-custom text-center outlined-text-reverse text-[1.5em]'>HOW TO PLAY</div>
                  <ul className='text-sm tracking-wide list-disc pl-5 space-y-3'>
                     <li>
                        Guess the <strong>daily festivity</strong> around the world.
                     </li>
                     <li>
                        You have <strong>5 rounds</strong> to play.
                     </li>
                     <li>
                        The <strong>rounds count</strong> is represented at the top.
                        <img src={example_rounds} width={'40%'} height={'40%'} className='mx-auto pt-3' />
                     </li>
                     <li>
                        <strong>After a play</strong> you'll see ther round results.
                        <img src={example_board} width={'50%'} height={'50%'} className='mx-auto pt-2' />
                     </li>
                  </ul>
            </div>
         </div>
      </Dialog>
   )
}

export default HowTo