import React, { useState, useRef } from 'react'
import { Input, InputRef } from 'antd'

interface LetterProps {
   letter: string
}
const Letter: React.FC<LetterProps> = ({ letter }) => {
   letter = letter.toUpperCase()
   const letterRef = useRef<InputRef>(null)
   const isAlphabetic = /^[A-Za-z]+$/.test(letter)
   const [pressedLetter, setPressedLetter] = useState('')

   const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!letterRef.current?.input) return
      const _pressedLetter = e.target.value.toUpperCase()
      const backgroundColor = _pressedLetter === letter ? 'palegreen' : 'tomato'
      
      letterRef.current.input.style.backgroundColor = backgroundColor
      setPressedLetter(_pressedLetter)
   }
   const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!letterRef.current?.input) return
      let _nextLetter = letterRef.current.nativeElement?.nextElementSibling as HTMLInputElement
      let _prevLetter = letterRef.current.nativeElement?.previousElementSibling as HTMLInputElement


      if (e.key === 'Backspace') {
         while (_prevLetter?.disabled) _prevLetter = _prevLetter.previousElementSibling as HTMLInputElement
         _prevLetter && _prevLetter.focus()

         letterRef.current.input.style.backgroundColor = 'whitesmoke'
      }
      else {
         while (_nextLetter?.disabled) _nextLetter = _nextLetter.nextElementSibling as HTMLInputElement
         _nextLetter && _nextLetter.focus()
      }
   }
   const handleOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!letterRef.current?.input) return
      letterRef.current.input.select()
   }

   return (
      <>
         <Input
            ref={letterRef}
            size='large'
            variant='outlined'
            maxLength={1}
            value={isAlphabetic ? pressedLetter : letter}
            disabled={isAlphabetic ? false : true}
            style={{
               height: '40px',
               width: '40px',
               fontSize: '1.3rem',
               fontWeight: 'bold',
               textAlign: 'center',
               backgroundColor: isAlphabetic ? 'white' : 'silver'
            }}
            onChange={handleOnChange}
            onKeyUp={handleOnKeyUp}
            onFocus={handleOnFocus}
         />
      </>
   )
}

export default Letter