import { create } from 'zustand'
import { persist, devtools, createJSONStorage } from 'zustand/middleware'
import current from '../data/current.json'

interface StoreProps {
   day: string
   answer: string
   setAnswer: (answer: string) => void
   resetAnswer: () => void
   backspaceAnswer: () => void
   checkAnswer: boolean
   setCheckAnswer: (check: boolean) => void
   _hasHydrated: boolean
   setHasHydrated: (status: boolean) => void
}
const useStore = create(
   devtools(
      persist<StoreProps>(
         (set, get) => ({
            day: current.federal,
            answer: '',
            setAnswer: (answer: string) => {
               const isChar = /^[A-Za-z]$/.test(answer)
               const day = get().day
               const prevAnswer = get().answer
               const newAnswer = prevAnswer + answer.toLocaleUpperCase()

               if (isChar) set({ answer: newAnswer })
               if (newAnswer.length === day.replace(/ /g, '').length) get().setCheckAnswer(true)
            },
            resetAnswer: () => set({ answer: '' }),
            backspaceAnswer: () => {
               const dayNoSpaces = get().day.replace(/ /g, '')
               const newAnswer = get().answer.slice(0, -1)

               console.log("newAnswer", newAnswer.length )
               console.log("dayNoSpaces", dayNoSpaces.length )

               set({ answer: newAnswer })
               if (newAnswer.length <= dayNoSpaces.length) get().setCheckAnswer(false)
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