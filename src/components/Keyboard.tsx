import KeyboardReact from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import '../styles/keyboard.css'

const Keyboard = () => {
    return (
        <KeyboardReact
            layoutName={'default'}
            onChange={() => { }}
            onKeyPress={() => { }}
            layout={{
                default: [
                    "q w e r t y u i o p",
                    "a s d f g h j k l",
                    "{ent} z x c v b n m {backspace}",
                ]
            }}
            display={{
                "{ent}": "↩",
                "{backspace}": "⌫",
            }}
        />
    )
}

export default Keyboard