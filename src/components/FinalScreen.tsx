import { useEffect } from 'react'
import useStore, { Sound } from '@/store'
import Dialog from '@mui/material/Dialog'
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
         onClose={() => {}}
      >
         <div className='flex place-content-center h-full'>
            <div className='flex flex-col justify-center items-center space-y-5 w-[450px]'>
                  <div className='text-4xl font-custom'>
                     YOU <span className={isBoardComplete ? 'lose-text' : 'win-text'}>{isBoardComplete ? 'LOSE' : 'WIN'}</span>
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