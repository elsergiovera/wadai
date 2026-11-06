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

type KeyboardProps = {
   hits: Set<string>
   misses: Set<string>
   disabled?: boolean
   onKey: (key: string) => void
}

// On-screen keyboard. Confirmed letters turn green, letters tried in a wrong place are dimmed.
const Keyboard = ({ hits, misses, disabled, onKey }: KeyboardProps) => {
   const buttonTheme = [{ class: 'k-wide', buttons: '{enter} {bksp}' }]
   if (hits.size) buttonTheme.push({ class: 'k-hit', buttons: [...hits].join(' ') })
   if (misses.size) buttonTheme.push({ class: 'k-used', buttons: [...misses].join(' ') })

   return (
      <div className={`kbd ${disabled ? 'off' : ''}`} aria-hidden={disabled}>
         <KeyboardReact
            layout={LAYOUT}
            layoutName='default'
            display={{ '{enter}': 'ENTER', '{bksp}': '⌫' }}
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
