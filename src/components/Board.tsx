import { useEffect } from 'react'
import useStore, { Sound } from '@/store'
import Slot from '@/components/Slot'
const slot_bgCcolor_disabled = 'bg-neutral-400'
const slot_bgCcolor_default = 'bg-white-400'
const slot_bgCcolor_success = 'bg-green-500'
const slot_bgCcolor_error = 'bg-red-500'
const slot_txtColor_default = 'text-neutral-500'
const slot_txtColor_played = 'text-white'
const slot_animation_succces = 'animate__animated animate__bounce animate__faster'
const slot_animation_error = 'animate__animated animate__headShake animate__faster'

interface BoardProps {
   playSound: (sound: Sound) => void
}
const Board: React.FC<BoardProps> = ({ playSound }) => {
   const { appStatus: { phrase, activeSlot, answerByChar, matchsByChar, round, paused, gameOver } } = useStore()
   const _hasSuccesSlots = matchsByChar.includes(true)
   const _hasErrorSlots = matchsByChar.includes(false)
   const remainingSlots = 30 - phrase.length
   
   useEffect(() => {
      if (round > 1 && (!paused || !gameOver)) {
         _hasSuccesSlots && playSound('right')
         _hasErrorSlots && setTimeout(() => {
            playSound('wrong')
         }, _hasSuccesSlots ? 1000 : 0)
      }
   }, [matchsByChar])

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
                  let slot_animation = null
                  let slot_active = gameOver ? false : activeSlot === index + 1
                  
                  if (!_isSpace) {
                     // Determine the slot's letter and background color based on whether it matches the answer.
                     const isMatch = matchsByChar[index]
                     slot_letter = answerByChar[index]

                     if (isMatch) {
                        slot_bgCcolor = slot_bgCcolor_success
                        slot_animation = slot_animation_succces
                     }
                     else if (isMatch === undefined) {
                        slot_bgCcolor = !_isSpace ? slot_bgCcolor_default : slot_bgCcolor_disabled
                        slot_txtColor = slot_txtColor_default
                     }
                     else {
                        slot_bgCcolor = slot_bgCcolor_error
                        slot_animation = slot_animation_error + (_hasSuccesSlots ? ' animate__delay-1s' : '')
                     }
                  }

                  return (
                     <Slot
                        letter={slot_letter}
                        bgColor={slot_bgCcolor}
                        txtColor={slot_txtColor}
                        animation={slot_animation}
                        active={slot_active}
                        // key={`slot-${index}`}
                        key={`slot-${index}-${performance.now()}`}
                     />
                  )
               })
            }
            {Array.from({ length: remainingSlots }).map((_, index) => (
               <Slot
                  letter={null}
                  bgColor={slot_bgCcolor_disabled}
                  txtColor={slot_txtColor_default}
                  animation={null}
                  active={false}
                  key={'empty-slot-' + index}
               />
            ))}
         </div>
      </div>
   )
}

export default Board