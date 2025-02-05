import { useEffect } from 'react'
import useStore, { Sound } from '@/store'
import Dialog from '@mui/material/Dialog'
import Rating from '@mui/material/Rating'
import Board from '@/components/Board'

interface FinalScreenProps {
   playSound: (sound: Sound) => void
}
const FinalScreen: React.FC<FinalScreenProps> = ({ playSound }) => {
   const { appStatus: { matchsByChar, gameOver } } = useStore()
   const isBoardComplete = matchsByChar.includes(false)

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
               <div className='text-3xl font-title'>
                  <Rating name='score' max={3} value={isBoardComplete ? 0 : 3} size='large' />
               </div>
               <div className={`text-2xl font-title animate__animated animate__infinite animate__delay-1s ${isBoardComplete ? 'animate__headShake' : 'animate__bounce'}`}>
                  YOU {isBoardComplete ? 'LOSE' : 'WIN'}
               </div>
               <div className='w-[80%]'>
                  <Board playSound={() => { }} />
               </div>
            </div>
         </div>
      </Dialog>
   )
}

export default FinalScreen