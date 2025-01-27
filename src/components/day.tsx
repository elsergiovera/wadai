// import dayjs from 'dayjs'
import Letter from './Letter'
import current from '../data/current.json'

const Day = () => {
   // const date = dayjs()
   const day = current.federal
   const letters = day.split('')

   return (
      <div className='place-content-center text-center font-light'>
         <div className='grid grid-cols-7 gap-1 justify-items-center font-bold'>
            {/* {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => <div key={'day-' + index}>{day}</div>)} */}
            {letters.map((letter, index) => <Letter letter={letter} key={'letter-' + index} />)}
         </div>
      </div>
   )
}

export default Day