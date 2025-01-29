import KeyboardReact from 'react-simple-keyboard'
import click from '/assets/audio/click.mp3'
import 'react-simple-keyboard/build/css/index.css'
import '@/styles/keyboard.css'

interface KeyboardProps {
   handleKeyDown: (event: KeyboardEvent | string) => void
}
const Keyboard: React.FC<KeyboardProps> = ({ handleKeyDown }) => {
   const clickSound = new Audio(click)

   const handleKeyPress = (button: string) => {
      clickSound.currentTime = 0
      clickSound.play()

      handleKeyDown(button.replace(/[{}]/g, ''))
   }

   return (
      <KeyboardReact
         layoutName={'default'}
         onKeyPress={handleKeyPress}
         layout={{
            default: [
               'Q W E R T Y U I O P',
               'A S D F G H J K L',
               '{Enter} Z X C V B N M {Backspace}',
            ]
         }}
         display={{
            '{Enter}': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-corner-down-left"><polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>',
            '{Backspace}': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="var(--color-tone-1)" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path></svg>',
         }}
      />
   )
}

export default Keyboard