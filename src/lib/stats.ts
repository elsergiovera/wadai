import { MAX_ROUNDS } from '@/lib/puzzle'

export type GameResult = {
   date: string
   // Round the puzzle was solved in (1-5), or null if all rounds were used without solving it.
   solvedIn: number | null
   // Played from the archive on a later day: counts in stats, never in streaks.
   archive: boolean
   region: string | null
}

export type Stats = {
   played: number
   won: number
   winRate: number
   streak: number
   bestStreak: number
   // distribution[0] is "solved in round 1" ... distribution[4] is round 5.
   distribution: number[]
   lost: number
   countries: string[]
}

const dayIndex = (key: string) => {
   const [y, m, d] = key.split('-').map(Number)
   return Math.round(Date.UTC(y, m - 1, d) / 86_400_000)
}

export const computeStats = (results: GameResult[], todayKey: string): Stats => {
   const won = results.filter(r => r.solvedIn !== null)
   const distribution = Array.from({ length: MAX_ROUNDS }, (_, i) => won.filter(r => r.solvedIn === i + 1).length)
   const countries = [...new Set(won.map(r => r.region).filter((r): r is string => !!r))]

   // Streaks only count puzzles solved on their own day.
   const solvedDays = new Set(results.filter(r => !r.archive && r.solvedIn !== null).map(r => dayIndex(r.date)))
   const today = dayIndex(todayKey)

   // An unplayed today doesn't break the streak yet; it only breaks once the day is over.
   // Losing today's puzzle breaks it straight away.
   const lostToday = results.some(r => !r.archive && r.date === todayKey && r.solvedIn === null)
   let cursor = solvedDays.has(today) ? today : today - 1
   let streak = 0
   while (!lostToday && solvedDays.has(cursor)) { streak++; cursor-- }

   let bestStreak = 0
   let run = 0
   let previous: number | null = null
   for (const day of [...solvedDays].sort((a, b) => a - b)) {
      run = previous !== null && day === previous + 1 ? run + 1 : 1
      bestStreak = Math.max(bestStreak, run)
      previous = day
   }

   return {
      played: results.length,
      won: won.length,
      winRate: results.length ? Math.round((won.length / results.length) * 100) : 0,
      streak,
      bestStreak,
      distribution,
      lost: results.length - won.length,
      countries,
   }
}
