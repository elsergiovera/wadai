
const VITE_ENV_APP_NAME = import.meta.env.VITE_ENV_APP_NAME
import { useState } from 'react'
import useStore, { AppSound } from '@/store'
import HowToScreen from '@/components/HowToScreen'
import { MenuIcon } from 'lucide-react'

const Topbar: React.FC<AppSound> = ({ playSound }) => {
   const round = useStore((state) => state.appStatus.round)
   const [howToScreen, setHowToScreen] = useState(false)

   const toggleHowToScreen = () => {
      playSound('message')
      setHowToScreen((prev: boolean) => !prev)
   }

   return (
      <>
         <div className='w-full min-h-[50px] grid grid-cols-3 bg-red-500 text-white'>
            <div className='place-content-center pl-2'><MenuIcon onClick={toggleHowToScreen} /></div>
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
            <div></div>
         </div>

         <HowToScreen isOpen={howToScreen} handleToggleScreen={toggleHowToScreen} />
      </>
   )
}

export default Topbar