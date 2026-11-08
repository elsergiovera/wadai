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

         <div className='step'>
            <div className='no' aria-hidden='true'>1</div>
            <div>
               <p>Type your guess and press <b>ENTER</b>. Dashed words are given.</p>
               <Mini tiles='E A R T H _:sp D:giv A:giv Y:giv' />            </div>
         </div>
         <div className='step'>
            <div className='no' aria-hidden='true'>2</div>
            <div>
               <p><b style={{ color: 'var(--ok)' }}>Green</b> is right, <b style={{ color: 'var(--bad)' }}>red</b> is wrong. Right letters stay locked.</p>
               <Mini tiles='E:g A:g R:g L:r Y:r' />
            </div>
         </div>
         <div className='step'>
            <div className='no' aria-hidden='true'>3</div>
            <div><p>You get 5 tries, one per letter.</p></div>
         </div>
         <div className='ladder5'>
            <div><div className='lt on'>W</div><small><b aria-hidden='true'>🌍</b>where</small></div>
            <div><div className='lt'>A</div><small><b aria-hidden='true'>🎉</b>what kind</small></div>
            <div><div className='lt'>D</div><small><b aria-hidden='true'>💬</b>a hint</small></div>
            <div><div className='lt'>A</div><small><b>B…</b>first letters</small></div>
            <div><div className='lt'>I</div><small><b>+ 1</b>whole word</small></div>
         </div>

         <div className='spacer' />
         <button type='button' className='btn' onClick={onPlay}>PLAY <span style={{ fontFamily: 'Text, monospace' }}>▸</span></button>
      </>
   )
}

export default HowToPlay
