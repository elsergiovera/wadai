import Day from './components/day'
import './style/App.css'

const App = () => {
  return (
    <div className='grid place-content-center min-h-screen bg-gray-50 py-5 overflow-hidden'>
      <div className='min-w-[300px] shadow-lg rounded-xl overflow-hidden'>
        <div className='min-h-[50px] place-content-center bg-red-500 text-center text-white py-1 px-2 text-3xl font-semibold'>
          THE DAY OF
        </div>
        <div className='min-h-[200px] place-content-center bg-white text-center py-2 px-2 text-9xl font-light'>
          <Day />
        </div>
      </div>
    </div>
  )
}

export default App