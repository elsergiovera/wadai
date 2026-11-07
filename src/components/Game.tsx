import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useStore from '@/store'
import { ClueKey, Day, allSlots, buildWords, puzzleNumber } from '@/lib/puzzle'
import { GameState, GameView, fitsPuzzle, isComplete, newGame, submitGuess, viewGame } from '@/lib/game'
import { HOUSING_CHROME, fitBoard } from '@/lib/board'
import { CALENDAR } from '@/data/calendar'
import { PlaySound } from '@/hooks/useSounds'
import useElementSize from '@/hooks/useElementSize'
import Board, { TileView } from '@/components/Board'
import ClueChips from '@/components/ClueChips'
import DateHeader from '@/components/DateHeader'
import Keyboard from '@/components/Keyboard'

type GameProps = {
   day: Day
   todayKey: string
   // A panel is open on top, so physical keys must not reach the board.
   blocked: boolean
   playSound: PlaySound
   onFinished: () => void
   onShowResult: () => void
   onToday: () => void
}

// Last scored round, kept for a moment so the new colours can animate.
type Scored = { round: number, fresh: ClueKey | null }

// Keyboard colouring (letters hit / tried) is switched off for now: Sergio found it more noise than help.
// To bring it back, pass view.hits and view.misses to <Keyboard> again.
const NO_LETTERS = new Set<string>()

const Game = ({ day, todayKey, blocked, playSound, onFinished, onShowResult, onToday }: GameProps) => {
   const date = day.date
   const theme = useStore(state => state.settings.theme)
   const saved = useStore(state => state.games[date])
   const saveGame = useStore(state => state.saveGame)
   const addResult = useStore(state => state.addResult)

   const words = useMemo(() => buildWords(day), [day])
   const game: GameState = useMemo(() => saved && fitsPuzzle(words, saved) ? saved : newGame(words), [saved, words])
   const view: GameView = useMemo(() => viewGame(words, game), [words, game])
   const slots = useMemo(() => allSlots(words), [words])

   const [cursor, setCursor] = useState<number | null>(null)
   const [scored, setScored] = useState<Scored | null>(null)
   const [nope, setNope] = useState(false)

   // The active slot: where the player put it, else the first empty one.
   const fallback = view.editable.find(i => !view.current[i]) ?? view.editable[view.editable.length - 1] ?? null
   const active = cursor !== null && view.editable.includes(cursor) ? cursor : fallback

   useEffect(() => { setCursor(null); setScored(null) }, [date])

   useEffect(() => {
      if (!scored) return
      const timer = window.setTimeout(() => setScored(null), 1800)
      return () => window.clearTimeout(timer)
   }, [scored])

   const bump = useCallback(() => {
      playSound('bump')
      setNope(true)
      window.setTimeout(() => setNope(false), 500)
   }, [playSound])

   const setDraft = (index: number, char: string | null) => {
      const draft = [...game.draft]
      draft[index] = char
      saveGame(date, { ...game, draft })
   }

   const submit = () => {
      if (!isComplete(view)) return bump()

      const next = submitGuess(words, game, view)
      const score = next.guesses.length ? viewGame(words, next).scores[next.guesses.length - 1] : []
      saveGame(date, next)
      setCursor(null)

      const newlyRight = slots.some(slot => slot.kind === 'letter' && score[slot.index] && !view.locked.has(slot.index))
      const wrong = slots.some(slot => slot.kind === 'letter' && !score[slot.index])
      const nextView = viewGame(words, next)
      const fresh = next.finished ? null : nextView.clues.find(clue => !view.clues.includes(clue)) ?? null
      setScored({ round: next.guesses.length, fresh })

      if (next.finished) {
         addResult({ date, solvedIn: next.solvedIn, archive: date !== todayKey, region: day.region })
         if (newlyRight) playSound('right')
         window.setTimeout(() => {
            playSound(next.solvedIn ? 'win' : 'lose')
            onFinished()
         }, 1400)
         return
      }
      if (newlyRight) playSound('right')
      if (wrong) window.setTimeout(() => playSound('wrong'), newlyRight ? 900 : 0)
   }

   const handleKey = (key: string) => {
      if (game.finished) return
      if (key === 'Enter') return submit()

      const position = active === null ? -1 : view.editable.indexOf(active)
      if (key === 'Backspace') {
         if (active === null) return bump()
         if (game.draft[active]) return setDraft(active, null)
         if (position <= 0) return bump()
         const previous = view.editable[position - 1]
         setCursor(previous)
         return setDraft(previous, null)
      }

      if (/^[a-z]$/i.test(key)) {
         if (active === null) return bump()
         const isLast = position === view.editable.length - 1
         if (isLast && game.draft[active]) playSound('bump')
         setDraft(active, key.toUpperCase())
         if (!isLast) setCursor(view.editable[position + 1])
      }
   }

   // Physical keyboard. The latest handler is kept in a ref so the listener is attached once.
   const handleKeyRef = useRef(handleKey)
   handleKeyRef.current = handleKey
   const onVirtualKey = useCallback((key: string) => {
      playSound('click')
      handleKeyRef.current(key)
   }, [playSound])
   useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
         if (blocked || event.ctrlKey || event.metaKey || event.altKey) return
         const target = event.target as HTMLElement | null
         if (event.key === 'Enter' && target?.closest('button, a, input, textarea')) return
         if (event.key === 'Enter' || event.key === 'Backspace' || /^[a-z]$/i.test(event.key)) {
            event.preventDefault()
            handleKeyRef.current(event.key)
         }
      }
      window.addEventListener('keydown', onKeyDown)
      return () => window.removeEventListener('keydown', onKeyDown)
   }, [blocked])

   // ----- board -----
   const areaRef = useRef<HTMLDivElement>(null)
   const area = useElementSize(areaRef)
   const { layout, size, gap } = useMemo(
      () => fitBoard(words, theme === 'calendar' ? 3 : 4, area.width - 20, area.height - 16, HOUSING_CHROME[theme]),
      [words, theme, area.width, area.height],
   )

   const lastScore = view.scores[view.scores.length - 1]
   const lastGuess = game.guesses[game.guesses.length - 1]
   const animating = scored !== null && scored.round === game.guesses.length

   const tiles: TileView[] = layout.cells.map((slot, cellIndex) => {
      if (!slot) return { kind: 'f' }
      if (slot.kind === 'given') return { kind: 'giv', char: slot.char }
      if (slot.kind === 'fixed') return { kind: 'fx', char: slot.char }

      const i = slot.index
      const col = cellIndex % layout.cols
      const delay = col * 70

      if (game.finished) {
         const ok = lastScore?.[i]
         const anim = animating ? (ok ? 'bounce' : 'shake') : undefined
         return { kind: ok ? 'g' : 'r', char: lastGuess?.[i] ?? slot.char, anim, delay: anim ? delay : 0 }
      }
      if (view.locked.has(i)) {
         const fresh = animating && !(view.scores.slice(0, -1).some(score => score[i]))
         return { kind: 'g', char: slot.char, anim: fresh ? 'bounce' : undefined, delay: fresh ? delay : 0 }
      }
      if (view.revealed.has(i)) return { kind: 'hint', char: slot.char, index: i }

      const typed = game.draft[i]
      if (typed) return { kind: 'slot', char: typed, active: active === i, anim: 'pop', index: i }

      // Wrong in the last round: stays red with the old letter until the player types over it.
      if (lastScore && !lastScore[i]) {
         const anim = animating ? 'shake' : undefined
         return { kind: 'r', char: lastGuess?.[i], faded: true, active: active === i, anim, delay: anim ? delay + 300 : 0, index: i }
      }
      return { kind: 'slot', char: null, active: active === i, index: i }
   })

   const label = game.finished
      ? `Board: ${day.phrase.toUpperCase()}, ${game.solvedIn ? `solved in round ${game.solvedIn}` : 'not solved'}`
      : `Board, round ${view.round} of 5: ${words.map(word => word.map(slot => {
         if (slot.kind !== 'letter') return slot.char
         return view.current[slot.index] ?? '_'
      }).join('')).join(' ')}`

   return (
      <>
         <DateHeader theme={theme} date={date} number={puzzleNumber(CALENDAR, date)} archive={date !== todayKey} onToday={onToday} />
         <ClueChips day={day} words={words} clues={view.clues} ends={view.ends} fresh={animating ? scored?.fresh : null} />
         <div className='board' ref={areaRef}>
            {area.width > 0 && (
               <Board
                  theme={theme}
                  cols={layout.cols}
                  tiles={tiles}
                  size={size}
                  gap={gap}
                  label={label}
                  nope={nope}
                  onPick={index => setCursor(index)}
               />
            )}
         </div>
         {game.finished && (
            <div className='after'>
               <button type='button' className='pill' onClick={onShowResult}>
                  {game.solvedIn ? `SOLVED IN ${game.solvedIn}/5` : 'NOT SOLVED'} · SEE RESULT ▸
               </button>
            </div>
         )}
         <p className='sr-only' aria-live='polite'>
            {scored ? `Round ${scored.round} scored. ${game.finished ? (game.solvedIn ? 'Solved!' : 'Out of rounds.') : `Round ${view.round} of 5.`}` : ''}
         </p>
         <Keyboard hits={NO_LETTERS} misses={NO_LETTERS} disabled={game.finished} onKey={onVirtualKey} />
      </>
   )
}

export default Game
