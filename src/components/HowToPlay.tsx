import Dialog from '@mui/material/Dialog'
import example_rounds from '@/assets/img/example_rounds.png'
import example_board from '@/assets/img/example_board.png'
import { XIcon } from 'lucide-react'
import { levelIndicatorStyle, getLevelInfo, getCountryCode, EMOJI_URL } from '@/components/Indicators'
import useStore from '@/store'

const SHOW_INDICATORS = import.meta.env.VITE_ENV_FLAG_SHOW_INDICATORS === 'true'

interface HowToProps {
   isOpen: boolean
   handleToggle: () => void
}
const HowToPlay: React.FC<HowToProps> = ({ isOpen, handleToggle }) => {
   const { appStatus: { level, region } } = useStore()
   const levelInfo = getLevelInfo(level)
   const countryCode = getCountryCode(region)

   return (
      <Dialog
         open={isOpen}
         onClose={handleToggle}
         fullWidth={false}
         maxWidth={false}
         slotProps={{
            transition: { timeout: 400 },
            backdrop: {
               sx: {
                  backgroundColor: 'rgba(0, 0, 0, 0.3)'
               }
            },
            container: {
               sx: {
                  alignItems: 'flex-start'
               }
            },
            paper: {
               sx: {
                  width: '380px',
                  minWidth: '380px',
                  height: 'fit-content',
                  minHeight: 'unset',
                  maxWidth: 'none',
                  maxHeight: 'none !important',
                  overflow: 'visible',
                  margin: '60px 0 0',
                  borderRadius: '0',
                  background: '#fff',
                  border: '1px solid #ddd'
               },
            },
         }}
      >
         <div className='flex justify-end pt-2 px-2'>
            <XIcon className='w-5 h-5 text-gray-300 cursor-pointer' onClick={handleToggle} />
         </div>
         <div className='flex justify-center place-content-center pb-8'>
            <div className='grid grid-col gap-3'>
               <div className='font-title text-center text-white bg-red-500 text-[20px]'>HOW TO PLAY</div>
               <div className='font-text tracking-wider text-center text-[9px]'>
                  Everyday is a festivity.<br />
                  Do you know <span className='font-text bg-red-500 text-white px-0.5 text-[8px]'>WHAT DAY</span> is today?
               </div>
               <ul className='list-disc list-inside font-text text-[12px] tracking-tighter whitespace-nowrap space-y-2 pt-2'>
                  <li>
                     Guess the <strong>Daily Festivity</strong> around the world.
                  </li>
                  <li>
                     <strong>You can only play one time per day</strong>.
                  </li>
                  <li>
                     You have <strong>5 rounds</strong> to play.
                  </li>
                  <li>
                     The <strong>rounds count</strong> is represented at the top:
                  </li>
                  <img src={example_rounds} width={'120px'} className='ml-[90px]' />
                  {SHOW_INDICATORS && (<>
                     <li>
                        Below the board, <strong>the indicators</strong> show:
                     </li>
                     <ul className='list-none ml-4 space-y-1 whitespace-normal'>
                        <li className='flex items-center gap-1'>
                           <span style={{ ...levelIndicatorStyle, background: levelInfo.color }}>{levelInfo.label[0]}</span>
                           <span><strong>Difficulty</strong>: Easy, Medium or Hard.</span>
                        </li>
                        <li className='flex items-center gap-1'>
                           <img src={`${EMOJI_URL}/${countryCode ?? 'un'}.png`} alt='flag' style={{ height: 11, width: 'auto', flexShrink: 0 }} />
                           <span><strong>Origin</strong>: where the festivity comes from.</span>
                        </li>
                     </ul>
                  </>)}
                  <li>
                     The results are displayed <strong>after every round</strong>:
                  </li>
                  <img src={example_board} width={'140px'} className='ml-[80px]' />
               </ul>
            </div>
         </div>
      </Dialog>
   )
}

export default HowToPlay