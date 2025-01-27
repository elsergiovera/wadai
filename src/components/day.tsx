import dayjs from 'dayjs'
import Letter from './letter'
import current from '../data/current.json'

const Day = () => {
   const date = dayjs()
   const day = current.federal
   const letters = day.split('')

   return (
      <div className='min-w-[400px] shadow-lg rounded-xl overflow-hidden'>
         <div className='min-h-[60px] place-content-center bg-red-500 text-center text-white text-5xl font-bold tracking-[0.2em]'>
            {date.format('MMM DD').toUpperCase()}
         </div>
         <div className='min-h-[280px] place-content-center bg-white text-center px-2 font-light'>
            <div className='grid grid-cols-7 gap-2 font-bold'>
               <span>T</span> <span>H</span> <span>E</span> <span>D</span> <span>A</span> <span>Y</span> <span>of</span>
               {letters.map((letter, index) => <Letter letter={letter} key={'letter-' + index} />)}
            </div>
         </div>
      </div>
   )
}

export default Day