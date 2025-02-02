import Topbar from '@/components/Topbar'
import Game from '@/components/Game'

const App = () => {
   return (
      <div className='w-screen h-full space-y-6'>
         <Topbar />
         <Game />
      </div>
   )
}

export default App