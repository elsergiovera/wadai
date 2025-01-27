import KeyboardReact from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import '../styles/keyboard.css'

interface KeyboardProps {
    handleKeyDown: (event: KeyboardEvent | string) => void
}
const Keyboard: React.FC<KeyboardProps> = ({ handleKeyDown }) => {
    const handleKeyPress = (button: string) => {
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