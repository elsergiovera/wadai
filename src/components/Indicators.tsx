import { useState } from 'react'
import useStore, { Sound } from '@/store'
import countryCodes from '@/assets/other/country-codes.json'

const SHOW_INDICATORS = import.meta.env.VITE_ENV_FLAG_SHOW_INDICATORS === 'true'
export const EMOJI_URL = 'https://flagcdn.com/w20'
const LEVEL_EASY = { code: 'EA', label: 'Easy', color: '#4ade80' }
const LEVEL_MEDIUM = { code: 'MD', label: 'Medium', color: '#facc15' }
const LEVEL_HARD = { code: 'HD', label: 'Hard', color: '#f87171' }

export const levelIndicatorStyle: React.CSSProperties = {
   height: 11,
   width: 16,
   borderRadius: 0,
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   fontSize: 8,
   fontWeight: 'bold',
   color: '#fff',
   opacity: 0.6,
   flexShrink: 0,
   paddingTop: 1,
}

export const getLevelInfo = (level: number) => {
   if (level <= 1) return LEVEL_EASY
   if (level <= 3) return LEVEL_MEDIUM
   return LEVEL_HARD
}

export const getCountryCode = (region: string | null): string | null => {
   if (!region) return null
   return (region.split('-')[1] || region).toLowerCase()
}

const LevelIndicator = ({ levelInfo }: { levelInfo: { label: string, color: string } }) => (
   <div
      className="font-text"
      title={`Difficulty level: ${levelInfo.label}`}
      style={{ ...levelIndicatorStyle, background: levelInfo.color }}
   >{levelInfo.label[0]}</div>
)

interface IndicatorsProps {
   playSound: (sound: Sound) => void
}
const Indicators: React.FC<IndicatorsProps> = ({ playSound }) => {
   const { appStatus: { region, level } } = useStore()
   const countryCode = getCountryCode(region)
   const levelInfo = getLevelInfo(level)
   const [showPopover, setShowPopover] = useState(false)

   if (!SHOW_INDICATORS) return null

   const countryName = countryCode ? (countryCodes as Record<string, string>)[countryCode] ?? '' : 'Worldwide'

   return (
      <div className="col-span-6 flex items-center justify-center gap-2 mt-1 relative">
         <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => { setShowPopover(!showPopover); if (!showPopover) playSound('message') }}
         >
            <LevelIndicator levelInfo={levelInfo} />
            <img
               src={`${EMOJI_URL}/${countryCode ?? 'un'}.png`}
               alt={countryName}
               style={{ height: 11, width: 'auto', opacity: 0.6 }}
            />
         </div>
         {showPopover && (
            <>
               <div className="fixed inset-0 z-10" onClick={() => setShowPopover(false)} />
               <div
                  className="absolute z-20 font-title text-[9px]"
                  style={{
                     bottom: '100%',
                     marginBottom: 4,
                     background: '#fff',
                     color: '#aaa',
                     border: '1px solid #ddd',
                     padding: '4px 8px',
                     whiteSpace: 'nowrap',
                     boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                  }}
               >
                  <div className="flex items-center gap-1">
                     <LevelIndicator levelInfo={levelInfo} />
                     <span>Difficulty: {levelInfo.label}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                     <img src={`${EMOJI_URL}/${countryCode ?? 'un'}.png`} style={{ height: 11, width: 'auto', opacity: 0.6 }} />
                     <span>Origin: {countryName}</span>
                  </div>
               </div>
            </>
         )}
      </div>
   )
}

export default Indicators
