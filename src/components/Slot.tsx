import React from 'react'

interface LetterProps {
   letter: string | null
   color: string
}
const Slot: React.FC<LetterProps> = ({ letter, color }) => {
   return (
      <div className={`${color} w-[3.5rem] h-[3.5rem] place-content-center text-[1.8rem] font-bold border border-2 border-neutral-400`}>
         {letter}
      </div>
   )
}

export default Slot