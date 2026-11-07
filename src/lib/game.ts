import {
   ClueKey, MAX_ROUNDS, Word, allSlots, firstLetterIndexes, endsIndexes, isSolved, playableIndexes, scoreGuess, unlockedClues,
} from '@/lib/puzzle'

// What gets saved per date, so a reload resumes the game where it was left.
export type GameState = {
   // Submitted guesses, indexed like the slots (non-letter slots are null).
   guesses: (string | null)[][]
   // Letters typed for the round in progress.
   draft: (string | null)[]
   finished: boolean
   solvedIn: number | null
}

export const newGame = (words: Word[]): GameState => ({
   guesses: [],
   draft: allSlots(words).map(() => null),
   finished: false,
   solvedIn: null,
})

export type GameView = {
   round: number
   clues: ClueKey[]
   // Letter slots confirmed in an earlier round.
   locked: Set<number>
   // Letters shown by the LETTERS clue: first letters, plus in the last round one whole word (see endsIndexes).
   revealed: Set<number>
   // Letters revealed by the last round's clue (also the ones already locked).
   ends: Set<number>
   // Slots the player can type in this round, in order.
   editable: number[]
   // The guess as it stands: locked and revealed letters plus the draft.
   current: (string | null)[]
   // Scores of each submitted guess.
   scores: boolean[][]
   // Keyboard colouring: letters confirmed somewhere, and letters tried in a wrong place.
   hits: Set<string>
   misses: Set<string>
}

export const viewGame = (words: Word[], game: GameState): GameView => {
   const slots = allSlots(words)
   const scores = game.guesses.map(guess => scoreGuess(words, guess))
   const round = game.finished ? game.guesses.length : game.guesses.length + 1
   const clues = unlockedClues(round)

   const locked = new Set<number>()
   scores.forEach(score => score.forEach((ok, i) => { if (ok && slots[i].kind === 'letter') locked.add(i) }))

   const ends = new Set(clues.includes('ends') ? endsIndexes(words, locked) : [])
   const revealed = new Set([
      ...(clues.includes('letters') ? firstLetterIndexes(words) : []),
      ...ends,
   ].filter(i => !locked.has(i)))
   const editable = game.finished ? [] : playableIndexes(words, new Set([...locked, ...revealed]))

   const current = slots.map(slot => {
      if (slot.kind !== 'letter') return null
      if (locked.has(slot.index) || revealed.has(slot.index)) return slot.char
      return game.draft[slot.index] ?? null
   })

   const hits = new Set<string>()
   const misses = new Set<string>()
   game.guesses.forEach((guess, r) => guess.forEach((char, i) => {
      if (!char || slots[i].kind !== 'letter') return
      if (scores[r][i]) hits.add(char)
      else misses.add(char)
   }))
   hits.forEach(char => misses.delete(char))

   return { round, clues, locked, revealed, ends, editable, current, scores, hits, misses }
}

export const isComplete = (view: GameView) => view.editable.every(i => !!view.current[i])

// Scores the current guess and moves the game on to the next round, or ends it.
export const submitGuess = (words: Word[], game: GameState, view: GameView): GameState => {
   const guess = view.current
   const score = scoreGuess(words, guess)
   const guesses = [...game.guesses, guess]
   const solved = isSolved(score)
   const finished = solved || guesses.length >= MAX_ROUNDS

   return {
      guesses,
      draft: allSlots(words).map(() => null),
      finished,
      solvedIn: solved ? guesses.length : null,
   }
}

// A saved game only fits the puzzle if its arrays match the slots.
export const fitsPuzzle = (words: Word[], game: GameState) => {
   const length = allSlots(words).length
   return game.draft.length === length && game.guesses.every(guess => guess.length === length)
}
