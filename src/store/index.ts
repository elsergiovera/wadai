import { create } from 'zustand'
import { persist, devtools, createJSONStorage } from 'zustand/middleware'

interface StoreProps {
   answer: string
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
            answer: '',
            setAnswer: (answer: string) => {
               const prevAnswer = get().answer
               const newAnswer = prevAnswer + answer.toUpperCase()
               set({ answer: newAnswer })
            },
            resetAnswer: () => set({ answer: '' }),
            deleteAnswer: () => {
               const newAnswer = get().answer.slice(0, -1)
               set({ answer: newAnswer })
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