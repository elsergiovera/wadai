const VITE_ENV_APP_NAME = import.meta.env.VITE_ENV_APP_NAME
import { useEffect } from 'react'
import useStore, { AppSound } from '@/store'
import HowToPlay from '@/components/HowToPlay'
import { MessageSquareWarningIcon } from 'lucide-react'

const Topbar: React.FC<AppSound> = ({ playSound }) => {
   const howToPlay = useStore((state) => state.howToPlay)
   const round = useStore((state) => state.appStatus.round)
   const toggleHowToPlay = useStore((state) => state.toggleHowToPlay)
   
   useEffect(() => {
      if (howToPlay) playSound('message')
   }, [howToPlay])
   
   return (
      <>
         <div className='w-full min-w-app min-h-[50px] grid grid-cols-3 bg-red-500 text-white'>
            <div></div>
            <div className='place-content-center text-center text-3xl font-title'>
               {
                  VITE_ENV_APP_NAME.split('').map((letter: string, index: number) => {
                     return (
                        <span
                           key={`key-${index}`}
                           className={`text-white animate__animated ${index + 1 >= round ? '' : 'animate__flash outlined-text'}`}>
                           {letter}
                        </span>
                     )
                  })
               }
            </div>
            <div className='flex justify-end items-center pr-2'><MessageSquareWarningIcon className='cursor-pointer scale-x-[-1]' onClick={toggleHowToPlay} /></div>
         </div>

         <HowToPlay isOpen={howToPlay} handleToggle={toggleHowToPlay} />
      </>
   )
}

export default Topbar