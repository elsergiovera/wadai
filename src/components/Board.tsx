import { useEffect, useRef } from 'react'
import useStore, { Sound } from '@/store'
import Slot from '@/components/Slot'
const slot_bgCcolor_disabled = 'bg-neutral-400'
const slot_bgCcolor_default = 'bg-white-400'
const slot_bgCcolor_success = 'bg-green-500'
const slot_bgCcolor_error = 'bg-red-500'
const slot_txtColor_default = 'text-neutral-500'
const slot_txtColor_played = 'text-white'
const slot_animation_succces = 'animate__bounce animate__faster'
const slot_animation_error = 'animate__headShake animate__faster'

interface BoardProps {
   playSound: (sound: Sound) => void
}
const Board: React.FC<BoardProps> = ({ playSound }) => {
   const { appStatus: { phrase, activeSlot, answerByChar, matchsByChar, round, paused, gameOver } } = useStore()
   const fillingSlots = 30 - phrase.length
   const previousRoundRef = useRef<number>(0)
   const _hasRoundIncreased = previousRoundRef.current < round
   const _hasSuccesSlots = matchsByChar.includes(true)
   const _hasErrorSlots = matchsByChar.includes(false)

   useEffect(() => {
      previousRoundRef.current = round
      if (!paused || !gameOver) playBoardSounds()
   }, [round])

   const playBoardSounds = () => {
      _hasSuccesSlots && playSound('right')
      _hasErrorSlots && setTimeout(() => {
         playSound('wrong')
      }, _hasSuccesSlots ? 1000 : 0)
   }

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
                  let slot_animation: string | null = null
                  let slot_active = gameOver ? false : activeSlot === index + 1

                  if (!_isSpace) {
                     // Determine the slot's letter, background color and animation based on whether it matches the answer and round increasement.
                     const isMatch = matchsByChar[index]
                     slot_letter = answerByChar[index]

                     if (isMatch) {
                        slot_bgCcolor = slot_bgCcolor_success
                        slot_animation = _hasRoundIncreased ? slot_animation_succces : null
                     }
                     else if (isMatch === undefined) {
                        slot_bgCcolor = !_isSpace ? slot_bgCcolor_default : slot_bgCcolor_disabled
                        slot_txtColor = slot_txtColor_default
                     }
                     else {
                        slot_bgCcolor = slot_bgCcolor_error
                        slot_animation = _hasRoundIncreased ? (slot_animation_error + (_hasSuccesSlots ? ' animate__delay-1s' : '')) : null
                     }
                  }

                  return (
                     <Slot
                        letter={slot_letter}
                        bgColor={slot_bgCcolor}
                        txtColor={slot_txtColor}
                        animation={slot_animation}
                        active={slot_active}
                        key={`slot-${index}`}
                     />
                  )
               })
            }
            {Array.from({ length: fillingSlots }).map((_, index) => (
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