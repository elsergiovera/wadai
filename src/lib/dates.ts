import { toDateKey } from '@/lib/puzzle'

export const parseKey = (key: string): Date => {
   const [y, m, d] = key.split('-').map(Number)
   return new Date(y, m - 1, d)
}

export const addDays = (key: string, days: number): string => {
   const date = parseKey(key)
   date.setDate(date.getDate() + days)
   return toDateKey(date)
}

export const isDateKey = (value: unknown): value is string =>
   typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parseKey(value).getTime())

// Today's local date. In development `?date=YYYY-MM-DD` fakes it; production builds drop this branch.
export const todayKey = (): string => {
   if (import.meta.env.DEV) {
      const fake = new URLSearchParams(window.location.search).get('date')
      if (isDateKey(fake)) return fake
   }
   return toDateKey(new Date())
}

const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
export const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

export const dateParts = (key: string) => {
   const date = parseKey(key)
   return {
      day: date.getDate(),
      weekday: WEEKDAYS[date.getDay()],
      month: MONTHS[date.getMonth()],
      year: date.getFullYear(),
   }
}

// "THU · NOV 5 · 2026"
export const shortDate = (key: string) => {
   const { day, weekday, month, year } = dateParts(key)
   return { weekday: weekday.slice(0, 3), rest: `${month.slice(0, 3)} ${day} · ${year}` }
}

// Time left until the next local midnight, as HH:MM:SS.
export const untilMidnight = (now: Date = new Date()): string => {
   const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
   const total = Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000))
   const pad = (n: number) => String(n).padStart(2, '0')
   return `${pad(Math.floor(total / 3600))}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}`
}
