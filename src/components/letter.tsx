import React from 'react'

interface LetterProps {
   letter: string | null
   answer: string
   checkAnswer: boolean
}
const Letter: React.FC<LetterProps> = ({ letter, answer, checkAnswer }) => {
   letter = letter ? letter.toUpperCase() : null
   // const isAlphabetic = /^[A-Za-z]+$/.test(letter)

   const bgColor = (() => {
      if (!letter) return 'bg-neutral-400' // disabled
      if (letter === answer) return 'bg-green-400' // success
      if (answer === undefined) return 'bg-white' // no entry
      return 'bg-red-400' // error
   })()

   // useEffect(() => {
   //    if (letterRef.current?.input) letterRef.current.input.style.backgroundColor = bgColor
   // }, [checkAnswer])

   return (
      <div className={`${bgColor} w-[3.2rem] h-[3.2rem] place-content-center text-[1.8rem] text-white font-bold border border-1 border-neutral-400`}>
         {answer}
      </div>
   )
}

export default Letter