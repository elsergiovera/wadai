import { Slot, Word } from '@/lib/puzzle'

export const MIN_COLS = 6
export const MAX_COLS = 12

export type BoardLayout = {
   cols: number
   rows: number
   // Row-major cells; null is a filler tile that keeps the board a solid block.
   cells: (Slot | null)[]
}

// Splits a word that doesn't fit in a row into balanced chunks, preferring to break after a hyphen.
const splitWord = (word: Word, max: number): Word[] => {
   if (word.length <= max) return [word]

   const hyphens = word.map((slot, i) => slot.char === '-' ? i + 1 : -1).filter(i => i > 0 && i < word.length)
   const fits = (parts: Word[]) => parts.every(part => part.length <= max)

   // Try the hyphen split that gives the most even parts.
   const byHyphen = hyphens
      .map(cut => [word.slice(0, cut), word.slice(cut)])
      .filter(fits)
      .sort((a, b) => Math.abs(a[0].length - a[1].length) - Math.abs(b[0].length - b[1].length))[0]
   if (byHyphen) return byHyphen

   const chunks = Math.ceil(word.length / max)
   const size = Math.ceil(word.length / chunks)
   return Array.from({ length: chunks }, (_, i) => word.slice(i * size, (i + 1) * size))
}

// Every word starts on its own row. Columns follow the longest word (at least 6), and words longer
// than the widest allowed row wrap onto the next row.
export const layoutBoard = (words: Word[], minRows = 3, maxCols = MAX_COLS): BoardLayout => {
   const lines = words.flatMap(word => splitWord(word, maxCols))
   const cols = Math.max(MIN_COLS, ...lines.map(line => line.length))
   const rows: (Slot | null)[][] = lines.map(line => [...line, ...Array<null>(cols - line.length).fill(null)])

   while (rows.length < minRows) rows.push(Array<null>(cols).fill(null))

   return { cols, rows: rows.length, cells: rows.flat() }
}

export type Chrome = { x: number, y: number }

// Space each theme's housing adds around the grid, used to size the tiles.
export const HOUSING_CHROME: Record<'classic' | 'arcade' | 'calendar', Chrome> = {
   classic: { x: 30, y: 30 },
   arcade: { x: 38, y: 42 },
   calendar: { x: 16, y: 40 },
}

// Picks the biggest tile that fits the available space, capped so short phrases don't get huge tiles.
export const tileSize = (layout: Pick<BoardLayout, 'cols' | 'rows'>, width: number, height: number, chrome: Chrome, max = 46) => {
   const gap = layout.cols <= 8 ? 5 : 4
   const byWidth = (width - chrome.x - gap * (layout.cols - 1)) / layout.cols
   const byHeight = (height - chrome.y - gap * (layout.rows - 1)) / layout.rows
   const size = Math.floor(Math.min(max, byWidth, byHeight))
   return { size: Math.max(20, size), gap }
}

// Lays out the board for the space available. Long words only wrap when keeping them whole would
// make the tiles too small to read and tap.
export const fitBoard = (words: Word[], minRows: number, width: number, height: number, chrome: Chrome, readable = 34) => {
   const fit = (maxCols: number) => {
      const layout = layoutBoard(words, minRows, maxCols)
      return { layout, ...tileSize(layout, width, height, chrome) }
   }
   const whole = fit(MAX_COLS)
   if (whole.size >= readable) return whole

   let best = whole
   for (let maxCols = whole.layout.cols - 1; maxCols >= MIN_COLS; maxCols--) {
      const option = fit(maxCols)
      if (option.size >= readable) return option
      if (option.size > best.size) best = option
   }
   return best
}
