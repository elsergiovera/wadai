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

        handleKeyDown(button)
    }

    return (
        <KeyboardReact
            layoutName={'default'}
            onKeyPress={handleKeyPress}
            layout={{
                default: [
                    "Q W E R T Y U I O P",
                    "A S D F G H J K L",
                    "Z X C V B N M {backspace}",
                ]
            }}
            display={{
                "{ent}": "↵",
                "{backspace}": "Delete ⌫",
            }}
        />
    )
}

export default Keyboard