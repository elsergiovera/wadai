import Slot from '@/components/Slot'
import useStore from '@/store'

const Board = () => {
   const { appStatus: { answerByChar, phrase } } = useStore()
   const slot_color_disabled: string = 'bg-neutral-400'
   const slot_color_default: string = 'bg-white-400'
   const slot_color_success: string = 'bg-green-400'
   const slot_color_error: string = 'bg-red-400'
   const remainingSlots = 30 - phrase.length
   let lettersCounter = -1

   const getBackgroundColor = (letter: string, letterAnswer: string | null): string => {
      if (letterAnswer === letter) return slot_color_success
      else if (letterAnswer === undefined) return slot_color_default
      else return slot_color_error
   }

   return (
      <div className='flex justify-center'>
         <div className={'grid grid-cols-6 gap-1 text-center'}>
            {
               phrase.split('').map((letter, index) => {
                  letter = letter.toUpperCase()
                  const isSpace = /^\s*$/.test(letter)
                  let letterAnswer: string | null = null
                  let slot_color_current: string = slot_color_disabled

                  if (!isSpace) {
                     lettersCounter++
                     letterAnswer = answerByChar[lettersCounter]
                     slot_color_current = getBackgroundColor(letter, letterAnswer)
                  }

                  return <Slot letter={letterAnswer} color={slot_color_current} key={'letter-' + index}
                  />
               })
            }
            { Array.from({ length: remainingSlots }).map((_, index) => <Slot letter={null} color={slot_color_disabled} key={'empty-' + index} />) }
         </div>
      </div>
   )
}

export default Board