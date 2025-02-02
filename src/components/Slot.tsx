import React from 'react'

interface LetterProps {
   letter: string | null
   bgColor: string
   txtColor: string
   animation: string | null
   active: boolean
}
const Slot: React.FC<LetterProps> = ({ letter, bgColor, txtColor, animation, active }) => {
   return (
      <div className={`
         ${bgColor} 
         ${txtColor} 
         animate__animated ${animation ?? ''} 
         ${active ? 'border-neutral-900' : 'border-neutral-400'} 
         w-full h-full aspect-square text-[1.8rem] place-content-center font-bold border border-2
      `}>
         {letter}
      </div>
   )
}

export default Slot