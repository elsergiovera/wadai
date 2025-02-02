import { useEffect } from 'react'
import useStore, { Sound } from '@/store'
import Dialog from '@mui/material/Dialog'
import Board from '@/components/Board'

interface FinalScreenProps {
   playSound: (sound: Sound) => void
}
const FinalScreen: React.FC<FinalScreenProps> = ({ playSound }) => {
   const { appStatus: { matchsByChar } } = useStore()
   const isBoardComplete = matchsByChar.includes(false)

   useEffect(() => {
      playSound(isBoardComplete ? 'lose' : 'win')
   }, [])

   return (
      <Dialog
         fullScreen
         open={true}
         onClose={() => { }}
      >
         <div className='flex place-content-center h-full'>
            <div className='flex flex-col justify-center w-[450px]'>
               <div className='place-content-center h-[300px]'>
                  <span className='flex justify-center text-5xl font-custom pb-5'>YOU {isBoardComplete ? 'LOSE' : 'WIN'}</span>

                  {/* <div className='w-[250px]'> */}
                  <Board playSound={() => {}} />
                  {/* </div> */}
               </div>
            </div>
         </div>
      </Dialog>
   )
}

export default FinalScreen