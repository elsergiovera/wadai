import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'
import { GameState } from '@/lib/game'
import { GameResult } from '@/lib/stats'
import { MAX_ROUNDS } from '@/lib/puzzle'
import { isDateKey } from '@/lib/dates'

export type Sound = 'bump' | 'click' | 'message' | 'right' | 'wrong' | 'win' | 'lose'
export type Theme = 'classic' | 'arcade' | 'calendar'
export type Colors = 'standard' | 'colourblind'
export type TextSize = 's' | 'm' | 'l'

export type Settings = {
   theme: Theme
   colors: Colors
   textSize: TextSize
}

type Persisted = {
   games: Record<string, GameState>
   results: GameResult[]
   settings: Settings
   seenHowTo: boolean
}

interface Store extends Persisted {
   saveGame: (date: string, game: GameState) => void
   addResult: (result: GameResult) => void
   setSettings: (settings: Partial<Settings>) => void
   markHowToSeen: () => void
}

export const DEFAULT_SETTINGS: Settings = { theme: 'classic', colors: 'standard', textSize: 'm' }
export const STORAGE_KEY = 'wadai-v2'

// localStorage can be missing, blocked or full; never let that crash the game.
const safeStorage: StateStorage = {
   getItem: name => { try { return localStorage.getItem(name) } catch { return null } },
   setItem: (name, value) => { try { localStorage.setItem(name, value) } catch { /* progress just isn't saved */ } },
   removeItem: name => { try { localStorage.removeItem(name) } catch { /* ignore */ } },
}

const isObject = (value: unknown): value is Record<string, unknown> =>
   typeof value === 'object' && value !== null && !Array.isArray(value)

const isCharArray = (value: unknown): value is (string | null)[] =>
   Array.isArray(value) && value.every(c => c === null || (typeof c === 'string' && c.length <= 1))

const cleanGame = (value: unknown): GameState | null => {
   if (!isObject(value)) return null
   const { guesses, draft, finished, solvedIn } = value
   if (!Array.isArray(guesses) || !guesses.every(isCharArray) || guesses.length > MAX_ROUNDS) return null
   if (!isCharArray(draft) || typeof finished !== 'boolean') return null
   const solved = typeof solvedIn === 'number' && solvedIn >= 1 && solvedIn <= MAX_ROUNDS ? solvedIn : null
   return { guesses, draft, finished, solvedIn: solved }
}

const cleanResult = (value: unknown): GameResult | null => {
   if (!isObject(value) || !isDateKey(value.date)) return null
   const solvedIn = typeof value.solvedIn === 'number' && value.solvedIn >= 1 && value.solvedIn <= MAX_ROUNDS ? value.solvedIn : null
   const region = typeof value.region === 'string' && value.region ? value.region : null
   return { date: value.date, solvedIn, archive: value.archive === true, region }
}

const pick = <T extends string>(value: unknown, options: readonly T[], fallback: T): T =>
   options.includes(value as T) ? value as T : fallback

// Validates whatever was in storage, keeping the good parts of a partly corrupt save.
export const cleanPersisted = (value: unknown): Persisted => {
   const raw = isObject(value) ? value : {}

   const games: Record<string, GameState> = {}
   if (isObject(raw.games)) {
      for (const [date, game] of Object.entries(raw.games)) {
         const clean = isDateKey(date) ? cleanGame(game) : null
         if (clean) games[date] = clean
      }
   }

   const seen = new Set<string>()
   const results = (Array.isArray(raw.results) ? raw.results : [])
      .map(cleanResult)
      .filter((r): r is GameResult => !!r && !seen.has(r.date) && !!seen.add(r.date))

   const settings = isObject(raw.settings) ? raw.settings : {}

   return {
      games,
      results,
      settings: {
         theme: pick(settings.theme, ['classic', 'arcade', 'calendar'], DEFAULT_SETTINGS.theme),
         colors: pick(settings.colors, ['standard', 'colourblind'], DEFAULT_SETTINGS.colors),
         textSize: pick(settings.textSize, ['s', 'm', 'l'], DEFAULT_SETTINGS.textSize),
      },
      seenHowTo: raw.seenHowTo === true,
   }
}

// The v1 store used another key and shape; drop it.
safeStorage.removeItem('appStore')

const useStore = create<Store>()(
   persist(
      set => ({
         games: {},
         results: [],
         settings: DEFAULT_SETTINGS,
         seenHowTo: false,
         saveGame: (date, game) => set(state => ({ games: { ...state.games, [date]: game } })),
         // One result per date: replaying a finished day isn't possible, so the first result stands.
         addResult: result => set(state => state.results.some(r => r.date === result.date)
            ? state
            : { results: [...state.results, result] }),
         setSettings: settings => set(state => ({ settings: { ...state.settings, ...settings } })),
         markHowToSeen: () => set({ seenHowTo: true }),
      }),
      {
         name: STORAGE_KEY,
         version: 1,
         storage: createJSONStorage(() => safeStorage),
         partialize: ({ games, results, settings, seenHowTo }) => ({ games, results, settings, seenHowTo }) as Store,
         merge: (persisted, current) => ({ ...current, ...cleanPersisted(persisted) }),
      }
   )
)

export default useStore
