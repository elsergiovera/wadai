import { useEffect, useRef } from 'react'
import useStore, { Sound } from '@/store'
import Slot from '@/components/Slot'
import Indicators from '@/components/Indicators'
const slot_bgCcolor_disabled = 'bg-neutral-400'
const slot_bgCcolor_default = 'bg-white-400'
const slot_bgCcolor_success = 'bg-green-500'
const slot_bgCcolor_error = 'bg-red-500'
const slot_txtColor_default = 'text-neutral-500'
const slot_txtColor_played = 'text-white'
const slot_animation_success = 'animate__bounce animate__faster'
const slot_animation_error = 'animate__headShake animate__faster'

const getSlotProps = (isLetterMatch: boolean | null, isLetterSpace: boolean, hasRoundChanged: boolean, hasSuccesSlots: boolean) => {
   let slot_bgColor = slot_bgCcolor_disabled
   let slot_txtColor = slot_txtColor_played
   let slot_animation: string | null = null
   
   // Determine the slot's letter, background color and animation based on whether it matches the answer and round count.
   if (!isLetterSpace) {
      if (isLetterMatch) {
         slot_bgColor = slot_bgCcolor_success
         slot_animation = hasRoundChanged ? slot_animation_success : null
      }
      else if (isLetterMatch === undefined) {
         slot_bgColor = slot_bgCcolor_default
         slot_txtColor = slot_txtColor_default
      }
      else {
         slot_bgColor = slot_bgCcolor_error
         slot_animation = hasRoundChanged ? (slot_animation_error + (hasSuccesSlots ? ' animate__delay-1s' : '')) : null
      }
   }

   return { slot_bgColor, slot_txtColor, slot_animation }
}

interface BoardProps {
   playSound: (sound: Sound) => void
}
const Board: React.FC<BoardProps> = ({ playSound }) => {
   const { appStatus: { phrase, activeSlot, answerByChar, matchsByChar, round, paused, gameOver } } = useStore()
   const previousRoundRef = useRef<number>(0)
   const hasRoundChanged = previousRoundRef.current < round
   const hasSuccesSlots = matchsByChar.includes(true)
   const hasErrorSlots = matchsByChar.includes(false)
   const unusedSlots = 30 - phrase.length

   useEffect(() => {
      previousRoundRef.current = round
      if (!paused || !gameOver) playBoardSounds(hasSuccesSlots, hasErrorSlots)
   }, [round])

   const playBoardSounds = (hasSuccesSlots: boolean, hasErrorSlots: boolean) => {
      hasSuccesSlots && playSound('right')
      hasErrorSlots && setTimeout(() => {
         playSound('wrong')
      }, hasSuccesSlots ? 1000 : 0)
   }

   return (
      <div className='flex justify-center'>
         <div className={'grid grid-cols-6 gap-1 text-center w-[90%]'}>
            {
               phrase.split('').map((letter, index) => {
                  letter = letter.toUpperCase()
                  const isLetterMatch = matchsByChar[index]
                  const isLetterSpace = /^\s*$/.test(letter)
                  const slot_letter = answerByChar[index]
                  const slot_active = gameOver ? false : activeSlot === index + 1
                  const { slot_bgColor, slot_txtColor, slot_animation } = getSlotProps(isLetterMatch, isLetterSpace, hasRoundChanged, hasSuccesSlots)

                  return (
                     <Slot
                        letter={slot_letter}
                        bgColor={slot_bgColor}
                        txtColor={slot_txtColor}
                        animation={slot_animation}
                        active={slot_active}
                        key={`slot-${index}`}
                     />
                  )
               })
            }
            {Array.from({ length: unusedSlots }).map((_, index) => (
               <Slot
                  letter={null}
                  bgColor={slot_bgCcolor_disabled}
                  txtColor={slot_txtColor_default}
                  animation={null}
                  active={false}
                  key={`inactive-slot-${index}`}
               />
            ))}
            <Indicators />
         </div>
      </div>
   )
}

export default Board