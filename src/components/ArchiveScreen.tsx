import { useState } from 'react'
import useStore from '@/store'
import { FIRST_DATE, LAST_DATE } from '@/data/calendar'
import { MONTHS, parseKey } from '@/lib/dates'
import { toDateKey } from '@/lib/puzzle'
import InfoNote from '@/components/InfoNote'

type ArchiveProps = {
   todayKey: string
   current: string
   onPick: (date: string) => void
}

const WEEK = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']
const monthIndex = (key: string) => {
   const date = parseKey(key)
   return date.getFullYear() * 12 + date.getMonth()
}

// Month calendar of every puzzle: solved days are green, missed red, today outlined, future disabled.
const ArchiveScreen = ({ todayKey, current, onPick }: ArchiveProps) => {
   const results = useStore(state => state.results)
   const games = useStore(state => state.games)

   const first = monthIndex(FIRST_DATE)
   const last = Math.min(monthIndex(LAST_DATE), Math.max(first, monthIndex(todayKey)))
   const [month, setMonth] = useState(() => Math.min(last, Math.max(first, monthIndex(current))))

   const year = Math.floor(month / 12)
   const offset = (new Date(year, month % 12, 1).getDay() + 6) % 7
   const length = new Date(year, month % 12 + 1, 0).getDate()

   return (
      <>
         <div className='month'>
            <button type='button' aria-label='Previous month' disabled={month <= first} onClick={() => setMonth(month - 1)}>◀</button>
            <span aria-live='polite'>{MONTHS[month % 12]} {year}</span>
            <button type='button' aria-label='Next month' disabled={month >= last} onClick={() => setMonth(month + 1)}>▶</button>
         </div>
         <div className='grid7'>
            {WEEK.map(day => <div key={day} className='dn' aria-hidden='true'>{day}</div>)}
            {Array.from({ length: offset }, (_, i) => <div key={`o${i}`} />)}
            {Array.from({ length }, (_, i) => {
               const key = toDateKey(new Date(year, month % 12, i + 1))
               const exists = key >= FIRST_DATE && key <= LAST_DATE
               const future = key > todayKey
               const result = results.find(r => r.date === key)
               const started = !result && (games[key]?.guesses.length ?? 0) > 0
               const isToday = key === todayKey

               const classes = ['dc']
               let small = ''
               let status = 'not played'
               if (result?.solvedIn) {
                  classes.push('w')
                  small = `${result.solvedIn}/5`
                  status = `solved in ${result.solvedIn} of 5`
               }
               else if (result) {
                  classes.push('l')
                  small = '✕'
                  status = 'missed'
               }
               else if (started) {
                  small = '···'
                  status = 'in progress'
               }
               if (isToday) {
                  classes.push('today')
                  small = small || 'TODAY'
               }
               if (future) classes.push('fut')
               else if (!exists) classes.push('none')
               if (key === current && !isToday) classes.push('cur')

               const playable = exists && !future
               return (
                  <button
                     key={key}
                     type='button'
                     className={classes.join(' ')}
                     disabled={!playable}
                     aria-label={`${MONTHS[month % 12].toLowerCase()} ${i + 1}${isToday ? ', today' : ''}: ${playable ? status : future ? 'not yet' : 'no puzzle'}`}
                     onClick={() => onPick(key)}
                  >
                     {i + 1}{small && <small>{small}</small>}
                  </button>
               )
            })}
         </div>
         <div className='legend' aria-hidden='true'>
            <span><i style={{ background: 'var(--ok)' }} />solved</span>
            <span><i style={{ background: 'var(--bad)' }} />missed</span>
            <span><i style={{ border: '2px solid var(--tileb)' }} />not played</span>
         </div>
         <InfoNote>Missed a day? Play any past puzzle. Archive games count in your stats but <b>never break or extend your streak</b> — only today&apos;s puzzle does.</InfoNote>
      </>
   )
}

export default ArchiveScreen
