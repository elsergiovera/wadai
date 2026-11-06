import { useEffect, useId, useState } from 'react'
import { CLUE_ORDER, ClueKey, Day, Word } from '@/lib/puzzle'
import { categoryInfo, countryName, countryShort } from '@/lib/labels'
import Flag from '@/components/Flag'

const TITLES: Record<ClueKey, string> = { origin: 'ORIGIN', category: 'TYPE', clue: 'HINT', letters: 'STARTS WITH' }

type ClueChipsProps = {
   day: Day
   words: Word[]
   clues: ClueKey[]
   fresh?: ClueKey | null
}

// Four clue chips above the board, each with its own colour. Each one unlocks after a missed round
// (locked chips show the round). Tapping an unlocked chip opens its drawer with more detail; one drawer at a time.
const ClueChips = ({ day, words, clues, fresh }: ClueChipsProps) => {
   const id = useId()
   const [open, setOpen] = useState<ClueKey | null>(() => clues.includes('clue') ? 'clue' : null)
   // A clue that was just unlocked opens its own drawer.
   useEffect(() => { if (fresh) setOpen(fresh) }, [fresh])

   const category = categoryInfo(day.category)
   const initials = words
      .map(word => word.find(slot => slot.kind === 'letter')?.char)
      .filter(Boolean)
   const letters = initials.length > 3 ? `${initials.slice(0, 3).join(' · ')} …` : initials.join(' · ')

   const value = (key: ClueKey) => {
      switch (key) {
         case 'origin': return <><Flag region={day.region} />{countryShort(day.region)}</>
         case 'category': return <><span aria-hidden='true'>{category.emoji} </span>{category.label}</>
         case 'clue': return <><span aria-hidden='true'>💬 </span>READ</>
         case 'letters': return letters
      }
   }

   const detail = (key: ClueKey) => {
      switch (key) {
         case 'origin': return <>It&apos;s celebrated in <b>{countryName(day.region)}</b> <Flag region={day.region} /></>
         case 'category': return <>It&apos;s a <b>{category.label.toLowerCase()}</b> day {category.emoji}</>
         case 'clue': return day.clue
         case 'letters': return (
            <span className='pattern'>
               {words.map((word, w) => {
                  const first = word.find(slot => slot.kind === 'letter')
                  return (
                     <span key={w} className='pw'>
                        {word.map(slot => slot.kind !== 'letter'
                           ? <i key={slot.index} className='given'>{slot.char}</i>
                           : slot === first ? <i key={slot.index} className='first'>{slot.char}</i> : <i key={slot.index}>&nbsp;</i>)}
                     </span>
                  )
               })}
            </span>
         )
      }
   }

   const shown = open && clues.includes(open) ? open : null

   return (
      <>
         <ul className='ladder' aria-label='Clues'>
            {CLUE_ORDER.map((key, i) => {
               const on = clues.includes(key)
               const cls = `chip k-${key} ${on ? 'on' : 'lock'} ${on && fresh === key ? 'new' : ''} ${shown === key ? 'open' : ''}`
               return (
                  <li key={key} className={cls}>
                     {on
                        ? (
                           <button
                              type='button'
                              aria-expanded={shown === key}
                              aria-controls={`${id}-drawer`}
                              aria-label={`${TITLES[key]}: show more`}
                              onClick={() => setOpen(shown === key ? null : key)}
                           >
                              <span className='t'>{TITLES[key]}<span className='chev' aria-hidden='true'>▾</span></span>
                              <span className='v'>{value(key)}</span>
                           </button>
                        )
                        : (
                           <div aria-label={`${TITLES[key]}: unlocks in round ${i + 2}`}>
                              <span className='t' aria-hidden='true'>{TITLES[key]}</span>
                              <span className='v' aria-hidden='true'>{`R${i + 2}`}</span>
                           </div>
                        )}
                  </li>
               )
            })}
         </ul>
         {shown && (
            <div id={`${id}-drawer`} key={shown} className={`cluebox k-${shown}`} role='note' aria-label={TITLES[shown]}>
               <span>{detail(shown)}</span>
            </div>
         )}
      </>
   )
}

export default ClueChips
