import Letter from '@/components/Letter'
import useStore from '@/store'

interface BoardProps {
   phrase: string
}
const Board: React.FC<BoardProps> = ({ phrase }) => {
   const { answer } = useStore()
   const lettersAnswer = answer.split('')
   const lettersPhrase = phrase.split('')
   const reminingSlot = 30 - lettersPhrase.length
   let lettersCounter = -1

   return (
      <div className='flex justify-center'>
         <div className={'grid grid-cols-5 gap-1 text-center'}>
            {
               lettersPhrase.map((letter, index) => {
                  const isSpace = /^\s*$/.test(letter)
                  const isChar = /^[A-Za-z]+$/.test(letter)
                  const isDisabled = !isChar || isSpace
                  if (!isDisabled) lettersCounter++

                  return <Letter
                     letter={letter}
                     answer={lettersAnswer[lettersCounter]}
                     isDisabled={isDisabled}
                     key={'letter-' + index}
                  />
               })
            }
            {Array.from({ length: reminingSlot }).map((_, index) => <Letter letter={null} answer={null} isDisabled={true} key={'empty-' + index} /> )}
         </div>
      </div>
   )
}

export default Board