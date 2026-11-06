import { Theme } from '@/store'
import { dateParts, shortDate } from '@/lib/dates'

type DateHeaderProps = {
   theme: Theme
   date: string
   number: number
   archive: boolean
   onToday: () => void
}

// The puzzle's date: a single line, or a tear-off calendar page in the Calendar theme.
const DateHeader = ({ theme, date, number, archive, onToday }: DateHeaderProps) => {
   const back = archive && <button type='button' className='pill red' onClick={onToday}>◀ TODAY</button>

   if (theme === 'calendar') {
      const { day, weekday, month, year } = dateParts(date)
      return (
         <div className='tear'>
            <div className='d' aria-hidden='true'>{String(day).padStart(2, '0')}</div>
            <div>
               <div className='m'>{month}</div>
               <div className='s'>{weekday} · {year}</div>
            </div>
            <div className='num'>{back || <>PUZZLE<b>#{number}</b></>}</div>
         </div>
      )
   }

   const { weekday, rest } = shortDate(date)
   return (
      <div className='dateline'>
         <span><b>{weekday}</b> · {rest}</span>
         <span>#{number}</span>
         {back}
      </div>
   )
}

export default DateHeader
