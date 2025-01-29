// import Slot from '@/components/Slot'
import useStore from '@/store'

const Board = () => {
   const { appStatus: { phrase, answerByChar, matchsByChar } } = useStore()
   const slot_color_disabled: string = 'bg-neutral-400'
   const slot_color_default: string = 'bg-white-400'
   const slot_color_success: string = 'bg-green-400'
   const slot_color_error: string = 'bg-red-400'
   const remainingSlots = 30 - phrase.length
   let lettersCounter = -1

   const Slot = ({ letter, color }: { letter: string | null, color: string }) => (
      <div className={`${color} w-[3.5rem] h-[3.5rem] place-content-center text-[1.8rem] font-bold border border-2 border-neutral-400`}>
         {letter}
      </div>
   )

   const getBackgroundColor = (index: number): string => {
      const match = matchsByChar[index]

      if (match) return slot_color_success
      else if (match === undefined) return slot_color_default
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
                     // The variable `lettersCounter` keeps track of the current letter index in the phrase.
                     // It only increments when the current character is not a space.
                     lettersCounter++

                     letterAnswer = answerByChar[lettersCounter]
                     slot_color_current = getBackgroundColor(lettersCounter)
                  }

                  return <Slot letter={letterAnswer} color={slot_color_current} key={'slot-' + index} />
               })
            }
            {Array.from({ length: remainingSlots }).map((_, index) => <Slot letter={null} color={slot_color_disabled} key={'empty-slot-' + index} />)}
         </div>
      </div>
   )
}

export default Board