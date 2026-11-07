export type Category =
   | 'celebration' | 'religion' | 'food' | 'history' | 'science' | 'space' | 'nature'
   | 'arts' | 'music' | 'film' | 'literature' | 'sports' | 'people' | 'society' | 'tech'

export type Day = {
   date: string
   phrase: string
   given: string[]
   category: Category
   region: string | null
   level: 1 | 2 | 3
   clue: string
   description: string
   fact: string
   source?: string
}

// 'letter' is guessed by the player, 'given' is a revealed filler word, 'fixed' is a digit or punctuation mark.
export type SlotKind = 'letter' | 'given' | 'fixed'
export type Slot = { char: string, kind: SlotKind, index: number }
export type Word = Slot[]

export type ClueKey = 'origin' | 'category' | 'clue' | 'letters' | 'ends'

// The origin is shown from the first round; each miss unlocks the next clue. The last round's clue ('ends') has no
// chip of its own: it adds to the LETTERS chip (see endsIndexes).
export const CLUE_ORDER: ClueKey[] = ['origin', 'category', 'clue', 'letters', 'ends']

export const MAX_ROUNDS = 5

export const toDateKey = (date: Date = new Date()): string => {
   const y = date.getFullYear()
   const m = String(date.getMonth() + 1).padStart(2, '0')
   const d = String(date.getDate()).padStart(2, '0')
   return `${y}-${m}-${d}`
}

export const findDay = (calendar: Day[], dateKey: string): Day | undefined =>
   calendar.find(day => day.date === dateKey)

// Puzzle #1 is the first date in the calendar, so numbers stay stable as new years are appended.
export const puzzleNumber = (calendar: Day[], dateKey: string): number => {
   const first = calendar.reduce((min, day) => day.date < min ? day.date : min, calendar[0].date)
   const ms = Date.UTC(...splitKey(dateKey)) - Date.UTC(...splitKey(first))
   return Math.round(ms / 86_400_000) + 1
}

const splitKey = (key: string): [number, number, number] => {
   const [y, m, d] = key.split('-').map(Number)
   return [y, m - 1, d]
}

export const isLetter = (char: string) => /^[A-Z]$/i.test(char)

// Splits the phrase into words of slots. Slot indexes count letters only, so answers and matches
// can be stored as flat arrays that ignore spaces.
export const buildWords = (day: Pick<Day, 'phrase' | 'given'>): Word[] => {
   const given = new Set(day.given.map(word => word.toUpperCase()))
   let index = 0

   return day.phrase.toUpperCase().split(/\s+/).filter(Boolean).map(word => {
      const isGiven = given.has(word)
      return word.split('').map(char => {
         const kind: SlotKind = !isLetter(char) ? 'fixed' : isGiven ? 'given' : 'letter'
         return { char, kind, index: index++ }
      })
   })
}

export const allSlots = (words: Word[]): Slot[] => words.flat()

// The slots the player has to fill: letters that are not given and not already revealed.
export const playableIndexes = (words: Word[], revealed: Set<number> = new Set()): number[] =>
   allSlots(words).filter(slot => slot.kind === 'letter' && !revealed.has(slot.index)).map(slot => slot.index)

// The 'letters' clue reveals the first guessable letter of every word that still has one to guess.
export const firstLetterIndexes = (words: Word[]): number[] =>
   words.map(word => word.find(slot => slot.kind === 'letter')?.index).filter((i): i is number => i !== undefined)

// The last-round clue ('ends'). With two or more words still to guess it reveals one whole word: the least obvious
// one, meaning the one with the most letters still unguessed (ties: the longer word, then the earlier one).
// With only one word left to guess (or a one-word answer) it reveals that word's last open letter instead, so it never
// gives the whole answer away. `locked` holds letters already confirmed in earlier rounds.
export const endsIndexes = (words: Word[], locked: Set<number>): number[] => {
   const open = words
      .map(word => word.filter(slot => slot.kind === 'letter'))
      .map(letters => ({ letters, open: letters.filter(slot => !locked.has(slot.index)) }))
      .filter(word => word.open.length > 0)
   if (open.length === 0) return []
   if (open.length === 1) {
      const { letters, open: left } = open[0]
      // Keep the first letter for the LETTERS clue: a word with only that left gets nothing more.
      const last = left[left.length - 1]
      return letters.length > 1 && last !== letters[0] ? [last.index] : []
   }
   const best = open.reduce((a, b) => b.open.length > a.open.length || (b.open.length === a.open.length && b.letters.length > a.letters.length) ? b : a)
   return best.letters.map(slot => slot.index)
}

export const unlockedClues = (round: number): ClueKey[] => CLUE_ORDER.slice(0, Math.max(0, round))

// Compares a guess (indexed like the slots) with the answer. Non-letter and given slots always match.
export const scoreGuess = (words: Word[], guess: (string | null)[]): boolean[] =>
   allSlots(words).map(slot => slot.kind !== 'letter' || guess[slot.index]?.toUpperCase() === slot.char)

export const isSolved = (matches: boolean[]) => matches.length > 0 && matches.every(Boolean)
