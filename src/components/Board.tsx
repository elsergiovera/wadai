import Slot from '@/components/Slot'
import useStore from '@/store'

const Board = () => {
   const { appStatus: { phrase, answerByChar, matchsByChar } } = useStore()
   const slot_color_disabled = 'bg-neutral-400'
   const slot_color_default = 'bg-white-400'
   const slot_color_success = 'bg-green-400'
   const slot_color_error = 'bg-red-400'
   const remainingSlots = 30 - phrase.length
   let lettersCounter = -1

   return (
      <div className='flex justify-center'>
         <div className={'grid grid-cols-6 gap-1 text-center'}>
            {
               phrase.split('').map((letter, index) => {
                  letter = letter.toUpperCase()
                  const isSpace = /^\s*$/.test(letter)
                  let slot_letter: string | null = null
                  let slot_color = slot_color_disabled
                  let slot_active = false

                  if (!isSpace) {
                     // The variable `lettersCounter` keeps track of the current letter index in the phrase.
                     // It only increments when the current character is not a space.
                     lettersCounter++
                     slot_letter = answerByChar[lettersCounter]

                     // Check if there's a match and set the Slot colors accordingly.
                     const isMatch = matchsByChar[lettersCounter]
                     if (isMatch) {
                        slot_color = slot_color_success
                     }
                     else if (isMatch === undefined) {
                        slot_color = !isSpace ? slot_color_default : slot_color_disabled
                        slot_active = true
                     }
                     else slot_color = slot_color_error
                  }

                  return <Slot letter={slot_letter} color={slot_color} active={slot_active} key={'slot-' + index} />
               })
            }
            {Array.from({ length: remainingSlots }).map((_, index) => <Slot letter={null} color={slot_color_disabled} active={false} key={'empty-slot-' + index} />)}
         </div>
      </div>
   )
}

export default Board