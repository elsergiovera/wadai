import { FIRST_DATE } from '@/data/calendar'
import { dateParts } from '@/lib/dates'
import { useCountdown } from '@/hooks/useClock'

type NoPuzzleProps = {
   todayKey: string
   onArchive: () => void
   onHelp: () => void
}

// Shown on dates the calendar doesn't cover, before the first puzzle or after the last one.
const NoPuzzle = ({ todayKey, onArchive, onHelp }: NoPuzzleProps) => {
   const countdown = useCountdown()
   const early = todayKey < FIRST_DATE
   const first = dateParts(FIRST_DATE)

   return (
      <div className='nopuzzle'>
         <div className='n'>NO PUZZLE<br />TODAY</div>
         {early
            ? <p>The first WADAI is on {first.weekday.toLowerCase()}, {first.month.toLowerCase()} {first.day}, {first.year}. See you then!</p>
            : <p>The calendar has run out for now. New days are on the way. Meanwhile, replay any past day.</p>}
         <div>
            <div className='lbl'>NEXT DAY IN</div>
            <div className='cd'>{countdown}</div>
         </div>
         {early
            ? <button type='button' className='btn2' onClick={onHelp}>HOW TO PLAY</button>
            : <button type='button' className='btn2' onClick={onArchive}><span className='calic' aria-hidden='true' />PLAY PAST DAYS</button>}
      </div>
   )
}

export default NoPuzzle
