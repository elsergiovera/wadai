import { useEffect, useId, useState } from 'react'
import { CLUE_ORDER, ClueKey, Day, Word } from '@/lib/puzzle'
import { categoryInfo, countryName, countryShort } from '@/lib/labels'
import Flag from '@/components/Flag'
import { LockIcon } from '@/components/Icons'

const TITLES: Record<ClueKey, string> = { origin: 'ORIGIN', category: 'TYPE', clue: 'HINT', letters: 'LETTERS', ends: 'LETTERS' }

// 'ends' has no chip of its own: in the last round the LETTERS chip also shows the word it reveals.
const CHIPS = CLUE_ORDER.filter(key => key !== 'ends')

type ClueChipsProps = {
   day: Day
   words: Word[]
   clues: ClueKey[]
   fresh?: ClueKey | null
   // Letters revealed by the last round's clue (see endsIndexes).
   ends: Set<number>
}

// Four clue chips above the board, each with its own colour. ORIGIN is open from the start, the rest unlock one per missed round
// (locked chips show the round). Tapping an unlocked chip opens its drawer with more detail; one drawer at a time.
const ClueChips = ({ day, words, clues, fresh, ends: endsSet }: ClueChipsProps) => {
   const id = useId()
   const [open, setOpen] = useState<ClueKey | null>(() => clues.includes('clue') ? 'clue' : null)
   // A clue that was just unlocked opens its own drawer.
   useEffect(() => { if (fresh) setOpen(fresh === 'ends' ? 'letters' : fresh) }, [fresh])
   const ends = clues.includes('ends')

   const category = categoryInfo(day.category)
   const guessable = words.map(word => word.filter(slot => slot.kind === 'letter')).filter(letters => letters.length > 0)
   // Last round: the whole word it revealed, or for a one-word answer its first and last letter.
   const bonus = ends ? guessable.find(letters => letters.length > 1 && letters.every(slot => endsSet.has(slot.index))) : undefined
   const single = ends && guessable.length === 1 && guessable[0].length > 1 ? guessable[0] : undefined
   const initials = guessable.map(letters => `${letters[0].char}…`)
   const max = 3
   const letters = bonus ? `+ ${bonus.map(slot => slot.char).join('')}`
      : single ? `${single[0].char}…${single[single.length - 1].char}`
      : initials.length > max ? `${initials.slice(0, max).join(' · ')} …` : initials.join(' · ')

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
                           : slot === first || endsSet.has(slot.index) ? <i key={slot.index} className='first'>{slot.char}</i> : <i key={slot.index}>&nbsp;</i>)}
                     </span>
                  )
               })}
            </span>
         )
      }
   }

   const shown = open && clues.includes(open) ? open : null

   return (
      <div className='clues'>
         <ul className='ladder' aria-label='Clues'>
            {CHIPS.map((key, i) => {
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
                           <div aria-label={`${TITLES[key]}: unlocks in round ${i + 1}`}>
                              <span className='t' aria-hidden='true'>{TITLES[key]}</span>
                              <span className='v lk' aria-hidden='true'><LockIcon />{i + 1}</span>
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
      </div>
   )
}

export default ClueChips
