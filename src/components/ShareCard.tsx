import { forwardRef } from 'react'
import { Theme } from '@/store'
import { Day, Word } from '@/lib/puzzle'
import { countryName } from '@/lib/labels'
import { shortDate } from '@/lib/dates'
import Flag from '@/components/Flag'
import TitleText from '@/components/TitleText'
import RunPanel from '@/components/RunPanel'

type ShareCardProps = {
   theme: Theme
   day: Day
   words: Word[]
   rounds: boolean[][]
   solved: boolean
   streak: number
   archive: boolean
   today: boolean
   number: number
}

// The picture that SHARE sends: the day, its story and fun fact, then the player's run.
// It is drawn off-screen at 540×960 and exported at 2× (1080×1920, phone-story size).
const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ theme, day, words, rounds, solved, streak, archive, today, number }, ref) => {
   const { weekday, rest } = shortDate(day.date)
   const when = today ? 'TODAY IS' : `${rest.replace(/ · \d+$/, '')} WAS`

   return (
      <div className={`sc sc-${theme}`} ref={ref}>
         {theme === 'calendar' && <div className='sc-rings' aria-hidden='true'>{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</div>}
         <div className='sc-hd'>
            <span>WADAI</span>
            <small>{weekday} · {rest}<br /><b>#{number}</b></small>
         </div>

         <div className='sc-body'>
            <div className='sc-main'>
               <p className={`sc-lbl ${solved ? 'ok' : 'bad'}`}>{solved ? 'YOU GOT IT' : 'YOU MISSED IT'} · {when}</p>
               <p className='sc-ph'><TitleText text={day.phrase.toUpperCase()} /></p>
               <p className='sc-meta'><Flag region={day.region} className='sc-fl' />{countryName(day.region)} · {day.category}</p>
               <p className='sc-desc'>{day.description}</p>
               <div className='sc-tip'><span className='tag'>! DID YOU KNOW</span>{day.fact}</div>
            </div>

            <RunPanel size='xs' words={words} rounds={rounds} solved={solved} streak={streak} archive={archive} />
         </div>

         <p className='sc-ft'>wadai.veraserg.io</p>
      </div>
   )
})
ShareCard.displayName = 'ShareCard'

export default ShareCard
