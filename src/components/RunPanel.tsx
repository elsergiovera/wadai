import { Word } from '@/lib/puzzle'
import { layoutBoard } from '@/lib/board'

// Panel sizes. m is the full one (result screen, share card); smaller ones go where space is tight.
// xs drops the title tag. Only xs, s and m are styled so far: add a .run-<size> block in main.css to build another.
export type RunSize = 'xs' | 's' | 'm' | 'l'

type RunPanelProps = {
   size?: RunSize
   words: Word[]
   rounds: boolean[][]
   solved: boolean
   streak: number
   archive: boolean
}

// One small colour-only grid per try, laid out like the real board (no letters, so it stays a footnote).
const MiniBoard = ({ words, matches, last }: { words: Word[], matches: boolean[], last: boolean }) => {
   const layout = layoutBoard(words, 3)
   return (
      <div className={`mb ${last ? 'last' : ''}`} style={{ gridTemplateColumns: `repeat(${layout.cols}, 1fr)` }}>
         {layout.cells.map((slot, i) => {
            if (!slot) return <i key={i} />
            if (slot.kind !== 'letter') return <i key={i} className='v' />
            return <i key={i} className={matches[slot.index] ? 'g' : 'b'} />
         })}
      </div>
   )
}

// "PLAYER 1 · YOUR RUN": the score, the streak and a mini grid per try. Used on the result screen
// and on the share picture.
const RunPanel = ({ size = 'm', words, rounds, solved, streak, archive }: RunPanelProps) => (
   <div className={`run run-${size}`}>
      {size !== 'xs' && <span className='tag'>▶ PLAYER 1 · YOUR RUN</span>}
      <div className='run-score'>
         <span>
            {solved ? 'SOLVED IN' : 'NOT SOLVED'}
            <b className={solved ? '' : 'x'}>{solved ? rounds.length : 'X'}<i>/</i>5</b>
         </span>
         {archive
            ? <span>ARCHIVE<b><span className='emo' aria-hidden='true'>📅</span></b></span>
            : <span>DAY STREAK<b><span className='emo' aria-hidden='true'>{streak > 0 ? '🔥' : '💔'}</span>{streak}</b></span>}
      </div>
      <div className='run-tries'>
         {rounds.map((matches, i) => (
            <div key={i}>
               <p>TRY {i + 1}</p>
               <MiniBoard words={words} matches={matches} last={solved && i === rounds.length - 1} />
            </div>
         ))}
      </div>
   </div>
)

export default RunPanel
