import { create } from 'zustand'
import { persist, devtools, createJSONStorage } from 'zustand/middleware'

export type Sound = 'bump' | 'click' | 'right' | 'wrong' | 'win' | 'lose'
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
}
export type Day = {
   date: string
   festivity: string
   festivity_int: string | null
   region: string
}
interface StoreProps {
   appStatus: Status
   setAppStatus: (status: Status) => void
   _hasHydrated: boolean
   setHasHydrated: (status: boolean) => void
}

const useStore = create(
   devtools(
      persist<StoreProps>(
         (set) => ({
            appStatus: {
               date: '',
               phrase: '',
               answerByChar: [],
               matchsByChar: [],
               activeSlot: 0,
               round: 0,
               score: 0,
               paused: false,
               gameOver: false,
            } as Status,
            setAppStatus: (status: Status) => {
               set({ appStatus: status })
            },
            _hasHydrated: false,
            setHasHydrated: (status: boolean) => set({ _hasHydrated: status })
         }),
         {
            name: "appStore",
            storage: createJSONStorage(() => sessionStorage),
            onRehydrateStorage: (state) => {
               return () => state.setHasHydrated(true)
            }
         }
      )
   )
)

export default useStore