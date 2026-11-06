import { Category } from '@/lib/puzzle'
import countryCodes from '@/assets/other/country-codes.json'

const NAMES = countryCodes as Record<string, string>

// Short names that fit in a clue chip.
const SHORT: Record<string, string> = {
   GB: 'UK', US: 'USA', AE: 'UAE', ZA: 'S.AFRICA', KR: 'S.KOREA', NZ: 'N.ZEALAND', DO: 'DOMINICAN',
   MK: 'MACEDONIA', CI: 'IVORY C.', VA: 'VATICAN', BA: 'BOSNIA', CD: 'DR CONGO', SM: 'S.MARINO',
}

export const countryName = (region: string | null): string => {
   if (!region) return 'Worldwide'
   const name = NAMES[region.toLowerCase()] ?? region
   return name.replace(/\s*\(.*\)\s*/, '').trim()
}

export const countryShort = (region: string | null): string => {
   if (!region) return 'WORLD'
   const code = region.toUpperCase()
   if (SHORT[code]) return SHORT[code]
   const name = countryName(region).toUpperCase()
   return name.length <= 9 ? name : code
}

export const flagUrl = (region: string) => `https://flagcdn.com/w40/${region.toLowerCase()}.png`

export const CATEGORY: Record<Category, { label: string, emoji: string }> = {
   celebration: { label: 'PARTY', emoji: '🎉' },
   religion: { label: 'FAITH', emoji: '🕯️' },
   food: { label: 'FOOD', emoji: '🍲' },
   history: { label: 'HISTORY', emoji: '📜' },
   science: { label: 'SCIENCE', emoji: '🔬' },
   space: { label: 'SPACE', emoji: '🚀' },
   nature: { label: 'NATURE', emoji: '🌿' },
   arts: { label: 'ARTS', emoji: '🎨' },
   music: { label: 'MUSIC', emoji: '🎵' },
   film: { label: 'FILM', emoji: '🎬' },
   literature: { label: 'BOOKS', emoji: '📚' },
   sports: { label: 'SPORTS', emoji: '🏅' },
   people: { label: 'PEOPLE', emoji: '👤' },
   society: { label: 'SOCIETY', emoji: '🤝' },
   tech: { label: 'TECH', emoji: '💻' },
}

export const categoryInfo = (category: string) =>
   CATEGORY[category as Category] ?? { label: category.toUpperCase(), emoji: '📅' }
