import useStore from '../store'
import Letter from './Letter'

const Board = () => {
   const { day, answer, checkAnswer } = useStore()
   const letters_answer = answer.split('')
   const letters = day.split('')
   let column: number = 0

   return (
      <div className='place-content-center text-center font-light'>
         <div className={'grid grid-cols-7 gap-1 justify-items-center'}>
            {['T', 'O', 'D', 'A', 'Y'].map((day, index) => <div key={'key-today-' + index} className='font-bold h-[2.8rem]'>{day}</div>)}
            {['i', 's'].map((day, index) => <div key={'key-is-' + index} className='font-bold text-red-500 h-[2.8rem]'>{day}</div>)}

            {
               letters.map((letter, index) => {
                  // column = letter === ''
                  const isEmptySpace = /^\s*$/.test(letter)
                  const isChar = /^[A-Za-z]+$/.test(letter)


                  // console.log("isChar", isChar)
                  // console.log("column", column)
                  // console.log("letter", letter)
                  // console.log("letters_answer", letters_answer[index])

                  return <Letter letter={isChar ? letter : null} answer={letters_answer[index]} checkAnswer={checkAnswer} key={'letter-' + index} />
               })

               // letters.map((letter, index) => <Letter letter={letter} key={'letter-' + index} />)
            }
         </div>
      </div>
   )
}

export default Board