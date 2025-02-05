import { useEffect } from 'react'
import useStore, { Sound } from '@/store'
import Dialog from '@mui/material/Dialog'
import Rating from '@mui/material/Rating'
import Board from '@/components/Board'
import { LightbulbIcon } from 'lucide-react'

interface FinalScreenProps {
   playSound: (sound: Sound) => void
}
const FinalScreen: React.FC<FinalScreenProps> = ({ playSound }) => {
   const { appStatus: { description, matchsByChar, gameOver, startedAt } } = useStore()
   const isBoardComplete = matchsByChar.includes(false)
   const formattedDate = new Date(startedAt).toLocaleDateString('en-US', { month: 'long', day: '2-digit' })

   useEffect(() => {
      playSound(isBoardComplete ? 'lose' : 'win')
   }, [])

   return (
      <Dialog
         fullScreen
         open={gameOver}
         onClose={() => { }}
      >
         <div className='flex place-content-center h-full'>
            <div className='flex flex-col justify-center items-center space-y-6 w-app min-w-app'>
               <div className='text-4xl font-title'>
                  <Rating name='score' max={3} value={isBoardComplete ? 0 : 3} size='large' disabled />
               </div>
               <div className={`text-2xl font-title animate__animated animate__infinite animate__delay-1s ${isBoardComplete ? 'animate__headShake' : 'animate__bounce'}`}>
                  YOU {isBoardComplete ? 'LOSE' : 'WIN'}
               </div>
               <div className='w-10/12 space-y-4'>
                  <Board playSound={() => { }} />

                  <div className='flex mx-5'>
                     <div className='grid justify-center items-start bg-slate-100 p-1'>
                        <LightbulbIcon className='w-4' />
                     </div>
                     <div className='font-text bg-slate-50 p-1'>
                        <p className='font-bold text-[14px]'>{formattedDate}</p>
                        <p className='text-[12px]'>{description}</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </Dialog>
   )
}

export default FinalScreen