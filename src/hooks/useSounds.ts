import { useCallback, useEffect, useRef } from 'react'
import { Sound } from '@/store'
import bumpSound from '@/assets/audio/bump.mp3'
import clickSound from '@/assets/audio/click.mp3'
import messageSound from '@/assets/audio/message.mp3'
import rightSound from '@/assets/audio/right.mp3'
import wrongSound from '@/assets/audio/wrong.mp3'
import winSound from '@/assets/audio/win.mp3'
import loseSound from '@/assets/audio/lose.mp3'

const SOUNDS: Record<Sound, string> = {
   bump: bumpSound,
   click: clickSound,
   message: messageSound,
   right: rightSound,
   wrong: wrongSound,
   win: winSound,
   lose: loseSound,
}

export type PlaySound = (sound: Sound) => void

// Decodes every sound once into Web Audio buffers, so playback has no delay on mobile.
const useSounds = (): PlaySound => {
   const contextRef = useRef<AudioContext | null>(null)
   const buffersRef = useRef<Map<Sound, AudioBuffer>>(new Map())

   useEffect(() => {
      const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      const context = new AudioCtx()
      contextRef.current = context

      const load = async (sound: Sound) => {
         try {
            const response = await fetch(SOUNDS[sound])
            const buffer = await context.decodeAudioData(await response.arrayBuffer())
            buffersRef.current.set(sound, buffer)
         }
         catch { /* a missing sound just stays silent */ }
      }
      Object.keys(SOUNDS).forEach(sound => load(sound as Sound))

      // Mobile browsers suspend the context until a user gesture.
      const unlock = () => { if (context.state === 'suspended') context.resume().catch(() => { }) }
      window.addEventListener('touchstart', unlock)
      window.addEventListener('click', unlock)
      window.addEventListener('keydown', unlock)

      return () => {
         window.removeEventListener('touchstart', unlock)
         window.removeEventListener('click', unlock)
         window.removeEventListener('keydown', unlock)
         context.close().catch(() => { })
         contextRef.current = null
      }
   }, [])

   return useCallback((sound: Sound) => {
      const context = contextRef.current
      const buffer = buffersRef.current.get(sound)
      if (!context || !buffer) return
      const source = context.createBufferSource()
      source.buffer = buffer
      source.connect(context.destination)
      source.start(0)
   }, [])
}

export default useSounds
