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
         ${animation ?? ''} 
         ${active ? 'border-neutral-900' : 'border-neutral-400'} 
         w-[3.5rem] h-[3.5rem] place-content-center text-[1.8rem] font-bold border border-2
      `}>
         <a className={txtColor} >{letter}</a>
      </div>
   )
}

export default Slot