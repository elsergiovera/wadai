import useStore from '@/store'
import { computeStats } from '@/lib/stats'
import { countryName } from '@/lib/labels'
import { CALENDAR_COUNTRIES } from '@/data/calendar'
import Flag from '@/components/Flag'
import InfoNote from '@/components/InfoNote'

const COLUMNS = ['W', 'A', 'D', 'A', 'I']

const StatsScreen = ({ todayKey }: { todayKey: string }) => {
   const results = useStore(state => state.results)
   const stats = computeStats(results, todayKey)
   const today = results.find(r => r.date === todayKey && !r.archive)

   const solvedRounds = results.filter(r => r.solvedIn !== null).map(r => r.solvedIn as number)
   const average = solvedRounds.length ? (solvedRounds.reduce((a, b) => a + b, 0) / solvedRounds.length).toFixed(1) : '0'
   const counts = [...stats.distribution, stats.lost]
   const max = Math.max(1, ...counts)

   const passportCells = Math.max(8, Math.ceil(stats.countries.length / 8) * 8)

   return (
      <>
         <div className='hero'>
            <div className='big'><b>{stats.streak}</b><span>DAY<br />STREAK <span aria-hidden='true'>🔥</span></span></div>
            <div className='best'><span className='lbl'>BEST</span><b>{stats.bestStreak}</b></div>
         </div>
         <div className='trio'>
            <div><b>{stats.played}</b><span className='lbl'>PLAYED</span></div>
            <div><b>{stats.winRate}%</b><span className='lbl'>SOLVED</span></div>
            <div><b>{average}</b><span className='lbl'>AVG ROUND</span></div>
         </div>

         <div className='sect'>
            <span className='lbl'>SOLVED IN ROUND</span>
            <span className='lbl'>TODAY <i className='sw' style={{ background: 'var(--ok)', width: 8, height: 8 }} /></span>
         </div>
         <div className='chart' role='img' aria-label={counts.map((count, i) => i < 5 ? `Round ${i + 1}: ${count}` : `Not solved: ${count}`).join(', ')}>
            {counts.map((count, i) => {
               const lost = i === 5
               const me = !lost && today?.solvedIn === i + 1
               return (
                  <div className='col' key={i}>
                     <div className={`bar2 ${me ? 'me' : ''} ${lost ? 'x' : ''} ${count === 0 ? 'zero' : ''}`} style={{ height: `${(count / max) * 100}%` }}>{count}</div>
                     <div className={`base ${lost ? 'x' : ''}`}>{lost ? '✕' : COLUMNS[i]}</div>
                  </div>
               )
            })}
         </div>

         <div className='sect'>
            <span className='lbl'>PASSPORT</span>
            <span className='lbl'><b style={{ color: 'var(--ink)' }}>{stats.countries.length}</b> / {CALENDAR_COUNTRIES} COUNTRIES</span>
         </div>
         <div className='pass' role='list' aria-label='Countries solved'>
            {Array.from({ length: passportCells }, (_, i) => {
               const region = stats.countries[i]
               return region
                  ? <span key={i} role='listitem' title={countryName(region)}><Flag region={region} className='' decorative={false} /></span>
                  : <span key={i} className='e' aria-hidden='true' />
            })}
         </div>
         {stats.countries.length === 0 && <InfoNote>Solve puzzles to collect a flag for every country.</InfoNote>}
      </>
   )
}

export default StatsScreen
