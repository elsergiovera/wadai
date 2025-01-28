import useStore from '@/store'
import Letter from '@/components/Letter'

const Board = () => {
   const { day, answer, checkAnswer } = useStore()
   const letters_answer = answer.split('')
   const letters_day = day.split('')
   let letters_counter = -1

   return (
      <div className='place-content-center p-2 text-center font-light shadow-md'>
         <div className={'grid grid-cols-7 gap-1 justify-items-center'}>
            {['t', 'o', 'd', 'a', 'y'].map((item, index) => <div key={'key-today-' + index} className='font-bold h-[2.8rem]'>{item.toUpperCase()}</div>)}
            {['i', 's'].map((item, index) => <div key={'key-is-' + index} className='font-bold text-red-500 h-[2.8rem]'>{item.toUpperCase()}</div>)}

            {
               letters_day.map((letter, index) => {
                  const isSpace = /^\s*$/.test(letter)
                  const isChar = /^[A-Za-z]+$/.test(letter)
                  const isDisabled = !isChar || isSpace
                  letters_counter = !isDisabled ? letters_counter + 1 : letters_counter

                  return (
                     !isDisabled
                        ? <Letter
                           letter={!isDisabled ? letter : null}
                           answer={!isDisabled ? letters_answer[letters_counter] : null}
                           checkAnswer={checkAnswer}
                           key={'letter-' + index}
                        />
                        : <div className={`bg-neutral-400 w-[3.2rem] h-[3.2rem] border border-1 border-neutral-400`}></div>
                  )
               })
            }
         </div>
      </div>
   )
}

export default Board