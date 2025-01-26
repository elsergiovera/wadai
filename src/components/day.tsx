import Letter from './letter'
import current from '../data/current.json'

const Day = () => {
   const day = current.federal
   const letters = day.split('')

   return (
      <div className='grid grid-cols-6 gap-2'>
         {
            letters.map((letter, index) => {
               return <Letter letter={letter} key={'letter-' + index} />
            })
         }
      </div>
   )
}

export default Day