import TopMenu from './components/topMenu'
import Day from './components/day'
import './style/App.css'

const App = () => {
  return (
    <div className='w-screen h-screen bg-gray-50 space-y-5'>
      <div className='bg-white justify-items-center'>
        <TopMenu />
      </div>
      <div className='bg-gray-50 justify-items-center'>
        <Day />
      </div>
    </div>
  )
}

export default App