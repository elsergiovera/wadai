const VITE_ENV_APP_NAME = import.meta.env.VITE_ENV_APP_NAME
import { useEffect, useState } from 'react'
import useStore, { AppSound } from '@/store'
import HowToPlay from '@/components/HowToPlay'
import { CircleHelpIcon } from 'lucide-react'

const Topbar: React.FC<AppSound> = ({ playSound }) => {
   const [howToPlay, setHowToScreen] = useState(false)
   const round = useStore((state) => state.appStatus.round)
   const setTogglePause = useStore((state) => state.setTogglePause)

   useEffect(() => {
      setTogglePause()
      if (howToPlay) playSound('message')
   }, [howToPlay])

   const toggleHowToScreen = () => {
      setHowToScreen((prev: boolean) => !prev)
   }

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
            <div className='flex justify-end items-center pr-2'><CircleHelpIcon className='cursor-pointer hidden xxs:block' onClick={toggleHowToScreen} /></div>
         </div>

         <HowToPlay isOpen={howToPlay} handleToggleScreen={toggleHowToScreen} />
      </>
   )
}

export default Topbar