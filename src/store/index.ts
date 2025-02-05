import { create } from 'zustand'
import { persist, devtools, createJSONStorage } from 'zustand/middleware'
import lodash from 'lodash'
import data from '@/data/2025/en-US.json'

export type Sound = 'bump' | 'click' | 'message' | 'right' | 'wrong' | 'win' | 'lose'
export type Status = {
   date: string
   phrase: string
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
   festivity: string
   festivity_int: string | null
   region: string
}
export interface AppSound {
   playSound: (sound: Sound) => void
}
interface StoreProps {
   appStatus: Status
   setAppStatus: (status: Status) => void
   setTogglePause: () => void
   resetDailyState: () => void
   _hasHydrated: boolean
   setHasHydrated: (status: boolean) => void
}

const getFormattedDate = (): string => {
   return new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' })
}
const getInitialStatus = (): Status => {
   // const formattedDate = getFormattedDate()
   const formattedDate: string = '01/16'
   const day: Day | undefined = lodash.find((data as Day[]), { date: formattedDate })
   const _festivity = day?.festivity ?? ''

   return {
      date: formattedDate,
      phrase: _festivity,
      answerByChar: _festivity.split('').map(char => (char === ' ' ? char : null)),
      matchsByChar: [],
      activeSlot: 1,
      round: 1,
      score: 100,
      paused: false,
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
               // const startedAt = new Date(get().appStatus.startedAt).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' })
               // const today = new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' })

               // if (startedAt !== today) set({ appStatus: getInitialStatus() })
               set({ appStatus: getInitialStatus() })
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