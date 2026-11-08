import { useEffect, useMemo, useRef } from 'react'
import useStore from '@/store'
import { Day, buildWords, puzzleNumber, scoreGuess } from '@/lib/puzzle'
import { GameState } from '@/lib/game'
import { computeStats } from '@/lib/stats'
import { SHARE_URL } from '@/lib/share'
import { downloadFile, renderCard } from '@/lib/shareImage'
import { countryName } from '@/lib/labels'
import { shortDate } from '@/lib/dates'
import { CALENDAR } from '@/data/calendar'
import Flag from '@/components/Flag'
import TitleText from '@/components/TitleText'
import ShareCard from '@/components/ShareCard'
import RunPanel from '@/components/RunPanel'

type ResultProps = {
   day: Day
   game: GameState
   todayKey: string
   onArchive: () => void
   onToast: (message: string) => void
   onToday: () => void
}

const copyText = async (text: string) => {
   try {
      await navigator.clipboard.writeText(text)
      return true
   }
   catch {
      // Older browsers or insecure contexts: fall back to a hidden textarea.
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand('copy')
      area.remove()
      return ok
   }
}

const ResultScreen = ({ day, game, todayKey, onArchive, onToast, onToday }: ResultProps) => {
   const results = useStore(state => state.results)
   const colors = useStore(state => state.settings.colors)
   const theme = useStore(state => state.settings.theme)
   const words = useMemo(() => buildWords(day), [day])
   const scores = useMemo(() => game.guesses.map(guess => scoreGuess(words, guess)), [words, game.guesses])

   const solved = game.solvedIn !== null
   const result = results.find(r => r.date === day.date)
   const archive = result ? result.archive : day.date !== todayKey
   const { streak } = computeStats(results, todayKey)
   const todayDone = useStore(state => !!state.games[todayKey]?.finished)
   const number = puzzleNumber(CALENDAR, day.date)

   // The share picture is drawn as soon as the screen opens, so tapping SHARE can open the share
   // sheet straight away (Safari only allows it right after the tap).
   const cardRef = useRef<HTMLDivElement>(null)
   const image = useRef<Promise<File | null> | null>(null)
   useEffect(() => {
      const node = cardRef.current
      if (!node) return
      image.current = renderCard(node, `wadai-${number}.png`).catch(() => null)
   }, [number, theme, colors, scores, streak])

   // Shares the picture with the game's link. Phones get the share sheet; elsewhere the picture is
   // downloaded and the link copied. If the picture fails, the link is shared on its own.
   const share = async () => {
      const text = SHARE_URL
      const file = await (image.current ?? Promise.resolve(null))
      const touch = window.matchMedia?.('(pointer: coarse)').matches
      if (touch && navigator.share) {
         try {
            if (file && navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text })
            else await navigator.share({ text })
            return
         }
         catch (error) {
            if ((error as Error)?.name === 'AbortError') return
         }
      }
      if (file) downloadFile(file)
      const copied = await copyText(text)
      onToast(file ? (copied ? 'IMAGE SAVED · LINK COPIED' : 'IMAGE SAVED') : (copied ? 'LINK COPIED' : 'COULD NOT COPY'))
   }

   const when = day.date === todayKey ? 'TODAY' : shortDate(day.date).rest.replace(/ · \d+$/, '')

   return (
      <>
         <div className='sc-holder' aria-hidden='true'>
            <ShareCard
               ref={cardRef}
               theme={theme}
               day={day}
               words={words}
               rounds={scores}
               solved={solved}
               streak={streak}
               archive={archive}
               today={day.date === todayKey}
               number={number}
            />
         </div>
         <div className='ans'>
            <div className='lbl' style={{ color: solved ? 'var(--ok)' : 'var(--bad)' }}>{solved ? `${when} WAS` : 'THE ANSWER WAS'}</div>
            <div className='n'><TitleText text={day.phrase.toUpperCase()} /></div>
            <div className='meta'><Flag region={day.region} />{countryName(day.region)} · {day.category}</div>
            <div className='dlg'>
               <p>{day.description}</p>
               <div className='tip'><span className='tag'>! DID YOU KNOW</span>{day.fact}</div>
            </div>
         </div>

         <RunPanel size='xs' words={words} rounds={scores} solved={solved} streak={streak} archive={archive} />
         <div className='spacer' />
         <div className='res-actions'>
            <button type='button' className='btn' onClick={share}>SHARE <span style={{ fontFamily: 'Text, monospace' }}>▸</span></button>
            <button type='button' className='btn2' onClick={onArchive} aria-label='Play past days'><span className='calic' aria-hidden='true' />PAST DAYS</button>
         </div>
         {day.date !== todayKey && (
            // A past day's result: point back to today.
            <button type='button' className='nextline go' onClick={onToday}>
               <span className='lbl'>TODAY&apos;S WADAI</span>
               <span className='nx'>{todayDone ? 'SEE RESULT' : 'PLAY'} ▸</span>
            </button>
         )}
      </>
   )
}

export default ResultScreen
