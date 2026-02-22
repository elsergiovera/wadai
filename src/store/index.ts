import { create } from 'zustand'
import { persist, devtools, createJSONStorage } from 'zustand/middleware'
import lodash from 'lodash'
import data from '@/data/full_data.json'

export type Sound = 'bump' | 'click' | 'message' | 'right' | 'wrong' | 'win' | 'lose'
export type Status = {
   date: string
   phrase: string
   region: string | null
   level: number
   description: string
   answerByChar: (string | null)[]
   matchsByChar: (boolean | null)[]
   activeSlot: number
   round: number
   score: number
   paused: boolean
   gameOver: boolean
   startedAt: Date
}
export type Day = {
   date: string
   phrase: string
   region: string
   level: number
   description: string
}
export interface AppSound {
   playSound: (sound: Sound) => void
}
interface StoreProps {
   appStatus: Status
   setAppStatus: (status: Status) => void
   setTogglePause: () => void
   resetDailyState: () => void
   howToPlay: boolean
   toggleHowToPlay: () => void
   _hasHydrated: boolean
   setHasHydrated: (status: boolean) => void
}

const getFormattedDate = (): string => {
   const now = new Date()
   const month = String(now.getMonth() + 1).padStart(2, '0')
   const day = String(now.getDate()).padStart(2, '0')
   return `${month}${day}`
}
const getInitialStatus = (): Status => {
   const formattedDate = getFormattedDate()
   // const formattedDate: string = '0329'
   const day: Day | undefined = lodash.find((data as Day[]), { date: formattedDate })
   const _phrase = day?.phrase ?? ''
   const _region = day?.region ?? null
   const _level = day?.level ?? 0
   const _description = day?.description ?? ''

   return {
      date: formattedDate,
      phrase: _phrase,
      region: _region,
      level: _level,
      description: _description,
      answerByChar: _phrase.split('').map(char => (char === ' ' ? char : null)),
      matchsByChar: [],
      activeSlot: 1,
      round: 1,
      score: 100,
      paused: true,
      gameOver: false,
      startedAt: new Date()
   }
}

const useStore = create(
   devtools(
      persist<StoreProps>(
         (set, get) => ({
            appStatus: getInitialStatus(),
            setAppStatus: (status: Status) => set({ appStatus: status }),
            setTogglePause: () => {
               const prev = get().appStatus

               get().setAppStatus({
                  ...prev,
                  paused: !prev.paused
               })
            },
            resetDailyState: () => {
               const startedAt = new Date(get().appStatus.startedAt).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' })
               const today = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' })

               if (startedAt !== today) {
                  set({ appStatus: getInitialStatus() })
                  set({ howToPlay: true })
               }
               // set({ appStatus: getInitialStatus() })
            },
            howToPlay: true,
            toggleHowToPlay: () => {
               set({ howToPlay: !get().howToPlay })
               get().setTogglePause()
            },
            _hasHydrated: false,
            setHasHydrated: (status: boolean) => set({ _hasHydrated: status })
         }),
         {
            name: "appStore",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: (state) => {
               return () => {
                  // state.resetDailyState()
                  state.setHasHydrated(true)
               }
            }
         }
      )
   )
)

export default useStore