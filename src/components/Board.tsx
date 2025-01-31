import Slot from '@/components/Slot'
import useStore from '@/store'

const Board = () => {
   const { appStatus: { phrase, activeSlot, answerByChar, matchsByChar } } = useStore()
   const slot_bgCcolor_disabled = 'bg-neutral-400'
   const slot_bgCcolor_default = 'bg-white-400'
   const slot_bgCcolor_success = 'bg-green-500'
   const slot_bgCcolor_error = 'bg-red-500'
   const slot_txtColor_default = 'text-neutral-500'
   const slot_txtColor_played = 'text-white'
   const remainingSlots = 30 - phrase.length

   return (
      <div className='flex justify-center'>
         <div className={'grid grid-cols-6 gap-1 text-center'}>
            {
               phrase.split('').map((letter, index) => {
                  letter = letter.toUpperCase()
                  const _isSpace = /^\s*$/.test(letter)
                  let slot_letter: string | null = null
                  let slot_bgCcolor = slot_bgCcolor_disabled
                  let slot_txtColor = slot_txtColor_played
                  let slot_active = activeSlot === index + 1

                  if (!_isSpace) {
                     // Determine the slot's letter and background color based on whether it matches the answer.
                     const isMatch = matchsByChar[index]
                     slot_letter = answerByChar[index]

                     if (isMatch) {
                        slot_bgCcolor = slot_bgCcolor_success
                     }
                     else if (isMatch === undefined) {
                        slot_bgCcolor = !_isSpace ? slot_bgCcolor_default : slot_bgCcolor_disabled
                        slot_txtColor = slot_txtColor_default
                     }
                     else slot_bgCcolor = slot_bgCcolor_error
                  }

                  return <Slot letter={slot_letter} bgColor={slot_bgCcolor} txtColor={slot_txtColor} active={slot_active} key={'slot-' + index} />
               })
            }
            {Array.from({ length: remainingSlots }).map((_, index) => <Slot letter={null} bgColor={slot_bgCcolor_disabled} txtColor={slot_txtColor_default} active={false} key={'empty-slot-' + index} />)}
         </div>
      </div>
   )
}

export default Board