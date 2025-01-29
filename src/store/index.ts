import { create } from 'zustand'
import { persist, devtools, createJSONStorage } from 'zustand/middleware'

export type Status = {
   date: string
   phrase: string
   phraseByChar: string[]
   answerByChar: string[]
   plays: number
   score: number
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
   setAnswer: (answer: string) => void
   resetAnswer: () => void
   deleteAnswer: () => void
   checkAnswer: boolean
   setCheckAnswer: (check: boolean) => void
   _hasHydrated: boolean
   setHasHydrated: (status: boolean) => void
}
const useStore = create(
   devtools(
      persist<StoreProps>(
         (set, get) => ({
            appStatus: { date: '', phrase: '', phraseByChar: [], answerByChar: [], plays: 0, score: 100 } as Status,
            setAppStatus: (status: Status) => {
               set({ appStatus: status })
            },
            setAnswer: (answer: string) => {
               const prevStatus = get().appStatus
               const prevAnswer = prevStatus.answerByChar
               prevAnswer.push(answer.toUpperCase())

               get().setAppStatus({
                  ...prevStatus,
                  answerByChar: prevAnswer
               } as Status)
            },
            deleteAnswer: () => {
               const prevStatus = get().appStatus
               const prevAnswer = prevStatus.answerByChar
               prevAnswer.pop()

               get().setAppStatus({
                  ...prevStatus,
                  answerByChar: prevAnswer
               } as Status)

            },
            resetAnswer: () => {
               const prevStatus = get().appStatus

               get().setAppStatus({
                  ...prevStatus,
                  answerByChar: []
               } as Status)
            },

            checkAnswer: false,
            setCheckAnswer: (check: boolean) => set({ checkAnswer: check }),
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