import { useCallback, useEffect, useRef, useState } from 'react'
import useStore from '@/store'
import { findDay } from '@/lib/puzzle'
import { CALENDAR } from '@/data/calendar'
import useSounds from '@/hooks/useSounds'
import { useTodayKey } from '@/hooks/useClock'
import { GameBar } from '@/components/Topbar'
import Game from '@/components/Game'
import Screen from '@/components/Screen'
import ResultScreen from '@/components/ResultScreen'
import StatsScreen from '@/components/StatsScreen'
import ArchiveScreen from '@/components/ArchiveScreen'
import SettingsScreen from '@/components/SettingsScreen'
import HowToPlay from '@/components/HowToPlay'
import NoPuzzle from '@/components/NoPuzzle'
import Toast from '@/components/Toast'

type Panel = 'none' | 'result' | 'stats' | 'archive' | 'settings' | 'howto'

const THEME_COLOR = { classic: '#ef4444', arcade: '#121212', calendar: '#b8322b' }

const App = () => {
   const todayKey = useTodayKey()
   const settings = useStore(state => state.settings)
   const seenHowTo = useStore(state => state.seenHowTo)
   const markHowToSeen = useStore(state => state.markHowToSeen)
   const playSound = useSounds()

   const [playDate, setPlayDate] = useState(todayKey)
   const game = useStore(state => state.games[playDate])
   const day = findDay(CALENDAR, playDate)

   // First visit shows how to play; coming back to a finished day shows its result.
   const [panel, setPanel] = useState<Panel>(() => !seenHowTo ? 'howto' : game?.finished ? 'result' : 'none')
   const [toast, setToast] = useState<string | null>(null)

   // Follow the date when the app stays open past midnight, unless an archive day is being played.
   const previousToday = useRef(todayKey)
   useEffect(() => {
      if (previousToday.current === todayKey) return
      setPlayDate(date => date === previousToday.current ? todayKey : date)
      previousToday.current = todayKey
   }, [todayKey])

   // Theme, colours and text size live on <html> so the full-screen panels (portals) get them too.
   useEffect(() => {
      const root = document.documentElement
      root.dataset.theme = settings.theme
      root.dataset.colors = settings.colors
      root.dataset.size = settings.textSize
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[settings.theme])
   }, [settings])

   useEffect(() => {
      if (!toast) return
      const timer = window.setTimeout(() => setToast(null), 2000)
      return () => window.clearTimeout(timer)
   }, [toast])

   const open = useCallback((next: Panel) => {
      if (next !== 'none') playSound('message')
      setPanel(next)
   }, [playSound])

   const close = () => {
      if (panel === 'howto') markHowToSeen()
      setPanel('none')
   }

   const pickDay = (date: string) => {
      setPlayDate(date)
      setPanel(useStore.getState().games[date]?.finished ? 'result' : 'none')
   }

   const used = game ? game.guesses.length : 0

   return (
      <div className='app'>
         <GameBar
            used={day ? used : 0}
            onStats={() => open('stats')}
            onArchive={() => open('archive')}
            onSettings={() => open('settings')}
            onHelp={() => open('howto')}
         />
         <main className='column'>
            {day
               ? <Game
                  key={day.date}
                  day={day}
                  todayKey={todayKey}
                  blocked={panel !== 'none'}
                  playSound={playSound}
                  onFinished={() => setPanel('result')}
                  onShowResult={() => open('result')}
                  onToday={() => pickDay(todayKey)}
               />
               : <NoPuzzle todayKey={todayKey} onArchive={() => open('archive')} onHelp={() => open('howto')} />}
         </main>

         <Screen open={panel === 'result' && !!day && !!game?.finished} title='WADAI' onClose={close}>
            {day && game?.finished && <ResultScreen day={day} game={game} todayKey={todayKey} onArchive={() => open('archive')} onToast={setToast} onToday={() => pickDay(todayKey)} />}
         </Screen>
         <Screen open={panel === 'stats'} title='STATS' onClose={close}>
            <StatsScreen todayKey={todayKey} />
         </Screen>
         <Screen open={panel === 'archive'} title='ARCHIVE' onClose={close}>
            <ArchiveScreen todayKey={todayKey} current={playDate} onPick={pickDay} />
         </Screen>
         <Screen open={panel === 'settings'} title='SETTINGS' onClose={close}>
            <SettingsScreen />
         </Screen>
         <Screen open={panel === 'howto'} title='HOW TO' onClose={close} popup>
            <HowToPlay onPlay={close} />
         </Screen>
         <Toast message={toast} />
      </div>
   )
}

export default App
