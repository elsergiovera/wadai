import { useEffect, useRef } from 'react'
import Topbar from '@/components/Topbar'
import Game from '@/components/Game'
import bumpSound from '@/assets/audio/bump.mp3'
import clickSound from '@/assets/audio/click.mp3'
import messageSound from '@/assets/audio/message.mp3'
import rightSound from '@/assets/audio/right.mp3'
import wrongSound from '@/assets/audio/wrong.mp3'
import winSound from '@/assets/audio/win.mp3'
import loseSound from '@/assets/audio/lose.mp3'
import { Sound } from '@/store'

const App = () => {
   const audioContextRef = useRef<AudioContext | null>(null)
   const audioBuffersRef = useRef<Map<string, AudioBuffer>>(new Map())

   useEffect(() => {
      // Optimized playback audio functions.
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
            loadAudio(bumpSound),
            loadAudio(clickSound),
            loadAudio(messageSound),
            loadAudio(rightSound),
            loadAudio(wrongSound),
            loadAudio(winSound),
            loadAudio(loseSound)
         ])
      }
      initializeAudio()

      // Keep the AudioContext Active (important for mobile).
      // Mobile browsers pause the AudioContext when inactive, which adds delays.
      const unlockAudio = () => {
         if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume()
         }
      }

      // Add Event Listeners and their respectives cleanup function.
      window.addEventListener('touchstart', unlockAudio)
      window.addEventListener('click', unlockAudio)

      return () => {
         window.removeEventListener('touchstart', unlockAudio)
         window.removeEventListener('click', unlockAudio)
      }
   }, [])

   const playSound = (sound: Sound) => {
      if (!audioContextRef.current) return
      
      const source = audioContextRef.current!.createBufferSource()
      const url = (() => {
         switch (sound) {
            case 'bump': return bumpSound
            case 'click': return clickSound
            case 'message': return messageSound
            case 'right': return rightSound
            case 'wrong': return wrongSound
            case 'win': return winSound
            case 'lose': return loseSound
            default: return ''
         }
      })()

      if (!url || !audioBuffersRef.current.has(url)) return
      if (!audioBuffersRef.current.has(url)) return

      source.buffer = audioBuffersRef.current.get(url)!
      source.connect(audioContextRef.current!.destination)
      source.start(0)
   }

   return (
      <div className='w-screen h-full space-y-6'>
         <Topbar playSound={playSound} />
         <Game playSound={playSound} />
      </div>
   )
}

export default App