import { memo } from 'react'
import KeyboardReact from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'

const LAYOUT = {
   default: [
      'Q W E R T Y U I O P',
      'A S D F G H J K L',
      '{enter} Z X C V B N M {bksp}',
   ],
}

// The delete key as an SVG (simple-keyboard renders display labels as HTML). The ⌫ character comes
// from a fallback font on iOS and stays tiny whatever the font size.
const DELETE_ICON = `<svg width='30' height='22' viewBox='0 0 30 22' fill='none' stroke='currentColor' stroke-width='2.6' stroke-linejoin='round' stroke-linecap='round' aria-hidden='true' style='display:block'>
   <path d='M10 2h17v18H10L2 11z' /><path d='M14 7l8 8M22 7l-8 8' />
</svg>`

type KeyboardProps = {
   hits: Set<string>
   misses: Set<string>
   disabled?: boolean
   onKey: (key: string) => void
}

// On-screen keyboard. Confirmed letters turn green, letters tried in a wrong place are dimmed.
const Keyboard = ({ hits, misses, disabled, onKey }: KeyboardProps) => {
   const buttonTheme = [{ class: 'k-wide', buttons: '{enter} {bksp}' }, { class: 'k-del', buttons: '{bksp}' }]
   if (hits.size) buttonTheme.push({ class: 'k-hit', buttons: [...hits].join(' ') })
   if (misses.size) buttonTheme.push({ class: 'k-used', buttons: [...misses].join(' ') })

   return (
      <div className={`kbd ${disabled ? 'off' : ''}`} aria-hidden={disabled}>
         <KeyboardReact
            layout={LAYOUT}
            layoutName='default'
            display={{ '{enter}': 'ENTER', '{bksp}': DELETE_ICON }}
            buttonTheme={buttonTheme}
            buttonAttributes={[
               { attribute: 'aria-label', value: 'Enter', buttons: '{enter}' },
               { attribute: 'aria-label', value: 'Delete', buttons: '{bksp}' },
            ]}
            preventMouseDownDefault
            disableButtonHold
            onKeyPress={(button: string) => {
               if (disabled) return
               onKey(button === '{enter}' ? 'Enter' : button === '{bksp}' ? 'Backspace' : button)
            }}
         />
      </div>
   )
}

export default memo(Keyboard)
