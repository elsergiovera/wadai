import { Day } from '@/lib/puzzle'
import part1 from '@/data/calendar/part1.json'
import part2 from '@/data/calendar/part2.json'

// Every daily puzzle, sorted by date. New years are appended as extra part files.
export const CALENDAR: Day[] = ([...part1, ...part2] as Day[])
   .map(day => ({ ...day, region: day.region || null }))
   .sort((a, b) => a.date.localeCompare(b.date))

export const FIRST_DATE = CALENDAR[0].date
export const LAST_DATE = CALENDAR[CALENDAR.length - 1].date

// Countries that appear at least once, for the passport total.
export const CALENDAR_COUNTRIES = new Set(CALENDAR.map(day => day.region).filter((r): r is string => !!r)).size
