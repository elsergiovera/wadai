import React, { useState, useEffect } from 'react'

interface LetterProps {
   letter: string | null
   answer: string | null
   checkAnswer: boolean
}
const Letter: React.FC<LetterProps> = ({ letter, answer, checkAnswer }) => {
   letter = letter ? letter.toUpperCase() : null
   const [bgColor, setBgColor] = useState('bg-white')

   useEffect(() => {
      if (checkAnswer) {
         const _bgColor = (() => {
            if (!letter) return 'bg-neutral-400' // disabled
            if (letter === answer) return 'bg-green-400' // success
            if (answer === undefined) return 'bg-white' // no entry
            return 'bg-red-400' // error
         })()
         setBgColor(_bgColor)
      }
      else if (letter === null) setBgColor('bg-neutral-400')
   }, [checkAnswer])

   return (
      <div className={`${bgColor} w-[3.2rem] h-[3.2rem] place-content-center text-[1.8rem] font-bold border border-1 border-neutral-400`}>
         {answer}
      </div>
   )
}

export default Letter