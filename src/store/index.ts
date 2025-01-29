import { create } from 'zustand'
import { persist, devtools, createJSONStorage } from 'zustand/middleware'

export type Status = {
   date: string
   phrase: string
   phraseByChar: string[]
   answerByChar: string[]
   matchsByChar: (boolean | null)[]
   plays: number
   score: number
   paused: boolean
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
               phraseByChar: [],
               answerByChar: [],
               matchsByChar: [],
               plays: 0,
               score: 0,
               paused: false
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