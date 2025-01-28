import Letter from '@/components/Letter'
import useStore from '@/store'

const Board = () => {
   const { day, answer } = useStore()
   const lettersAnswer = answer.split('')
   const lettersDay = day.split('')
   let lettersCounter = -1

   return (
      <div className='place-content-center p-2 text-center font-light shadow-md'>
         <div className={'grid grid-cols-7 gap-1 justify-items-center'}>
            {['t', 'o', 'd', 'a', 'y'].map((item, index) => <div key={'key-today-' + index} className='font-bold h-[2.8rem]'>{item.toUpperCase()}</div>)}
            {['i', 's'].map((item, index) => <div key={'key-is-' + index} className='font-bold text-red-500 h-[2.8rem]'>{item.toUpperCase()}</div>)}
            {
               lettersDay.map((letter, index) => {
                  const isSpace = /^\s*$/.test(letter)
                  const isChar = /^[A-Za-z]+$/.test(letter)
                  const isDisabled = !isChar || isSpace
                  if (!isDisabled) lettersCounter++

                  return <Letter
                     letter={!isDisabled ? letter : null}
                     answer={!isDisabled ? lettersAnswer[lettersCounter] : null}
                     isDisabled={isDisabled}
                     key={'letter-' + index}
                  />
               })
            }
         </div>
      </div>
   )
}

export default Board