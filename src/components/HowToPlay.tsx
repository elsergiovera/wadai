// A chunky pixel question mark: the Title font has none, and the number font's one is too thin.
const BoldQ = () => (
   <svg width='13' height='17' viewBox='0 0 10 13' fill='currentColor' shapeRendering='crispEdges' aria-hidden='true'>
      <rect x='0' y='0' width='10' height='3' /><rect x='0' y='3' width='3' height='2' /><rect x='7' y='3' width='3' height='5' />
      <rect x='3' y='6' width='7' height='2' /><rect x='3' y='8' width='3' height='1' /><rect x='3' y='10' width='3' height='3' />
   </svg>
)

const Mini = ({ tiles }: { tiles: string }) => (
   <div className='minirow' aria-hidden='true'>
      {tiles.split(' ').map((tile, i) => {
         const [char, kind = ''] = tile.split(':')
         return <div key={i} className={`mt ${kind}`}>{char === '_' ? '' : char}</div>
      })}
   </div>
)

const HowToPlay = ({ onPlay }: { onPlay: () => void }) => {
   return (
      <>
         <p className='greet'>Every day, something is celebrated somewhere.</p>
         <p className='pun' aria-label='What day is it?'>
            <b>W</b>H<b>A</b>T <b>D</b><b>A</b>Y <b>I</b>S IT<span className='qm'><BoldQ /></span>
         </p>

         <div className='step'>
            <div className='no' aria-hidden='true'>1</div>
            <div>
               <p>Type your guess and press <b>ENTER</b>. Dashed words are given.</p>
               <Mini tiles='B O N F _:sp N:giv I:giv G:giv' />
            </div>
         </div>
         <div className='step'>
            <div className='no' aria-hidden='true'>2</div>
            <div>
               <p><b style={{ color: 'var(--ok)' }}>Green</b> is right, <b style={{ color: 'var(--bad)' }}>red</b> is wrong. Right letters stay locked.</p>
               <Mini tiles='B:g O:g N:r F:g' />
            </div>
         </div>
         <div className='step'>
            <div className='no' aria-hidden='true'>3</div>
            <div><p>You get 5 tries, one per letter. <b>You start with the origin, and every miss unlocks another clue.</b></p></div>
         </div>
         <div className='ladder5'>
            <div><div className='lt on'>W</div><small><b aria-hidden='true'>🌍</b>where</small></div>
            <div><div className='lt'>A</div><small><b aria-hidden='true'>🎉</b>what kind</small></div>
            <div><div className='lt'>D</div><small><b aria-hidden='true'>💬</b>a hint</small></div>
            <div><div className='lt'>A</div><small><b>B…</b>first letters</small></div>
            <div><div className='lt'>I</div><small><b>B…E</b>last letters</small></div>
         </div>

         <div className='spacer' />
         <button type='button' className='btn' onClick={onPlay}>PLAY <span style={{ fontFamily: 'Text, monospace' }}>▸</span></button>
      </>
   )
}

export default HowToPlay
