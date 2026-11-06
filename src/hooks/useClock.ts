import { useEffect, useState } from 'react'
import { todayKey, untilMidnight } from '@/lib/dates'

// Today's date key, kept fresh when the app stays open past midnight or comes back from the background.
export const useTodayKey = () => {
   const [key, setKey] = useState(todayKey)

   useEffect(() => {
      const check = () => setKey(todayKey())
      const timer = window.setInterval(check, 15_000)
      document.addEventListener('visibilitychange', check)
      return () => {
         window.clearInterval(timer)
         document.removeEventListener('visibilitychange', check)
      }
   }, [])

   return key
}

export const useCountdown = () => {
   const [left, setLeft] = useState(() => untilMidnight())

   useEffect(() => {
      const timer = window.setInterval(() => setLeft(untilMidnight()), 1000)
      return () => window.clearInterval(timer)
   }, [])

   return left
}
