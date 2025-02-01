import { useEffect, useRef } from 'react'
import useStore from '@/store'
import Slot from '@/components/Slot'
import rightSound from '/assets/audio/right.mp3'
import wrongSound from '/assets/audio/wrong.mp3'
import 'animate.css'

const slot_bgCcolor_disabled = 'bg-neutral-400'
const slot_bgCcolor_default = 'bg-white-400'
const slot_bgCcolor_success = 'bg-green-500'
const slot_bgCcolor_error = 'bg-red-500'
const slot_txtColor_default = 'text-neutral-500'
const slot_txtColor_played = 'text-white'
const slot_animation_succces = 'animate__animated animate__bounce animate__faster'
const slot_animation_error = 'animate__animated animate__headShake animate__faster animate__delay-1s'

const Board = () => {
   const { appStatus: { phrase, activeSlot, answerByChar, matchsByChar, round, paused, gameOver } } = useStore()
   const audioContextRef = useRef<AudioContext | null>(null)
   const audioBuffersRef = useRef<Map<string, AudioBuffer>>(new Map())
   const remainingSlots = 30 - phrase.length

   useEffect(() => {
      const loadAudio = async (url: string) => {
         const response = await fetch(url)
         const arrayBuffer = await response.arrayBuffer()
         const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer)

         audioBuffersRef.current.set(url, audioBuffer)
      }

      const initializeAudio = async () => {
         if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext()
         }
         await Promise.all([
            loadAudio(rightSound),
            loadAudio(wrongSound)
         ])
      }
      initializeAudio()
   }, [])

   useEffect(() => {
      if (matchsByChar.includes(false) && round > 1 && (!paused || !gameOver)) {
         playSound(rightSound)
         setTimeout(() => {
            playSound(wrongSound)
         }, 1000)
      }
   }, [matchsByChar])

   const playSound = (url: string) => {
      if (!audioBuffersRef.current.has(url)) return
      const source = audioContextRef.current!.createBufferSource()

      source.buffer = audioBuffersRef.current.get(url)!
      source.connect(audioContextRef.current!.destination)
      source.start(0)
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
                  let slot_animation = ''
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
                        slot_animation = slot_animation_error
                     }
                  }

                  return (
                     <Slot
                        letter={slot_letter}
                        bgColor={slot_bgCcolor}
                        txtColor={slot_txtColor}
                        animation={slot_animation}
                        active={slot_active}
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
                  animation={''}
                  active={false}
                  key={'empty-slot-' + index}
               />
            ))}
         </div>
      </div>
   )
}

export default Board