import { Word } from '@/lib/puzzle'

const SITE = 'wadai.veraserg.io'

// Regional-indicator letters make a flag emoji from an ISO country code ("GB" -> 🇬🇧).
export const flagEmoji = (region: string | null): string =>
   region ? String.fromCodePoint(...region.toUpperCase().split('').map(c => 0x1f1a5 + c.charCodeAt(0))) : '🌍'

// One line per round, one square per guessable letter and a gap between words, so the
// result shows how the guess improved without spoiling the answer.
export const buildShareText = (options: {
   number: number
   region: string | null
   words: Word[]
   rounds: boolean[][]
   solved: boolean
}): string => {
   const { number, region, words, rounds, solved } = options
   const score = solved ? `${rounds.length}/5` : 'X/5'

   const lines = rounds.map(matches => words
      .map(word => word.filter(slot => slot.kind === 'letter').map(slot => matches[slot.index] ? '🟩' : '🟥').join(''))
      .filter(Boolean)
      .join(' '))

   return [`WADAI #${number} ${flagEmoji(region)} ${score}`, ...lines, SITE].join('\n')
}
