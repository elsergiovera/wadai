import { CSSProperties, memo } from 'react'
import { Theme } from '@/store'

// How a tile looks: filler, empty letter slot, given word, fixed character, right, wrong or revealed hint.
export type TileKind = 'f' | 'slot' | 'giv' | 'fx' | 'g' | 'r' | 'hint'

export type TileView = {
   kind: TileKind
   char?: string | null
   // Wrong letter from the last round, shown until the player types over it.
   faded?: boolean
   active?: boolean
   anim?: 'bounce' | 'shake' | 'pop'
   delay?: number
   index?: number
}

export const Housing = ({ theme, children }: { theme: Theme, children: React.ReactNode }) => {
   if (theme === 'arcade') return (
      <div className='hous-arcade'>
         <span className='led' aria-hidden='true' />
         <div className='lcd'>{children}</div>
         <div className='brand' aria-hidden='true'>WADAI <i>·</i> POCKET</div>
      </div>
   )
   if (theme === 'calendar') return (
      <div className='hous-calendar'>
         <div className='ch' aria-hidden='true'><span className='holes'><i /><i /></span></div>
         <div className='cb'>{children}</div>
      </div>
   )
   return <div className='hous-classic'>{children}</div>
}

const Tile = memo(({ tile, onPick }: { tile: TileView, onPick?: (index: number) => void }) => {
   const classes = ['tile', tile.kind, tile.active && 'act', tile.anim, tile.kind === 'slot' || tile.faded ? 'slot' : '']
   const style = tile.delay ? { animationDelay: `${tile.delay}ms` } : undefined
   const pick = onPick && tile.index !== undefined && (tile.kind === 'slot' || tile.faded) ? () => onPick(tile.index!) : undefined

   return (
      <div className={classes.filter(Boolean).join(' ')} style={style} onPointerDown={pick} aria-hidden='true'>
         {tile.char && (tile.faded ? <span style={{ opacity: .6 }}>{tile.char}</span> : <span key={tile.char}>{tile.char}</span>)}
      </div>
   )
})

type BoardProps = {
   theme: Theme
   cols: number
   tiles: TileView[]
   size: number
   gap: number
   label: string
   nope?: boolean
   onPick?: (index: number) => void
}

// A fixed grid of tiles inside the theme's housing.
const Board = ({ theme, cols, tiles, size, gap, label, nope, onPick }: BoardProps) => (
   <Housing theme={theme}>
      <div
         className={`grid ${nope ? 'nope' : ''}`}
         role='img'
         aria-label={label}
         style={{ gridTemplateColumns: `repeat(${cols}, var(--t))`, gap, '--t': `${size}px` } as CSSProperties}
      >
         {tiles.map((tile, i) => <Tile key={i} tile={tile} onPick={onPick} />)}
      </div>
   </Housing>
)

export default Board
