import React, { useState, useEffect } from 'react'
import useStore from '@/store'

interface LetterProps {
   letter: string | null
   answer: string | null
   isDisabled: boolean
}
const Letter: React.FC<LetterProps> = ({ letter, answer, isDisabled }) => {
   const { checkAnswer } = useStore()
   const bg_success: string = 'bg-green-400'
   const bg_disabled: string = 'bg-neutral-400'
   const bg_no_entry: string = 'bg-white-400'
   const bg_error: string = 'bg-red-400'
   const [currentColor, setCurrentColor] = useState(bg_no_entry)
   letter = letter ? letter.toUpperCase() : null

   useEffect(() => {
      if (checkAnswer) {
         const _bgColor = (() => {
            if (!letter) return bg_disabled
            if (letter === answer) return bg_success
            if (answer === undefined) return bg_no_entry
            return bg_error
         })()
         setCurrentColor(_bgColor)
      }
      if (letter === null) setCurrentColor(bg_disabled)
   }, [checkAnswer])

   return (
      isDisabled
         ? <div className={`${bg_disabled} w-[3.2rem] h-[3.2rem] border border-1 border-neutral-400`}></div>
         : <div className={`${currentColor} w-[3.2rem] h-[3.2rem] place-content-center text-[1.8rem] font-bold border border-1 border-neutral-400`}>
            {answer}
         </div>
   )
}

export default Letter