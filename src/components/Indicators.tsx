import useStore from '@/store'
import countryCodes from '@/assets/other/country-codes.json'

const SHOW_INDICATORS = import.meta.env.VITE_ENV_FLAG_SHOW_INDICATORS === 'true'
const emojiUrl = 'https://flagcdn.com/w20'

const LEVEL_EASY = { code: 'EA', label: 'Easy', color: '#4ade80' }
const LEVEL_MEDIUM = { code: 'MD', label: 'Medium', color: '#facc15' }
const LEVEL_HARD = { code: 'HD', label: 'Hard', color: '#f87171' }

const getLevelInfo = (level: number) => {
   if (level <= 1) return LEVEL_EASY
   if (level <= 3) return LEVEL_MEDIUM
   return LEVEL_HARD
}

const getCountryCode = (region: string | null): string | null => {
   if (!region) return null
   return (region.split('-')[1] || region).toLowerCase()
}

const LevelIndicator = ({ color }: { color: string }) => (
   <div
      style={{
         height: 11,
         width: 11,
         borderRadius: 0,
         background: color,
         opacity: 0.6,
      }}
   />
)

const Indicators = () => {
   const { appStatus: { region, level } } = useStore()
   const countryCode = getCountryCode(region)
   const levelInfo = getLevelInfo(level)

   if (!SHOW_INDICATORS) return null

   return (
      <>
         <div className="col-start-3 flex items-center justify-center gap-1 font-title text-[9px] mt-1" style={{ color: '#aaa' }} title={`Difficulty level: ${levelInfo.label}`}>
            <LevelIndicator color={levelInfo.color} />
            <span>{levelInfo.code}</span>
         </div>
         <div className="flex items-center justify-center gap-1 font-title text-[9px] mt-1" style={{ color: '#aaa' }} title={`Origin: ${countryCode ? (countryCodes as Record<string, string>)[countryCode] ?? '' : 'Worldwide'}`}>
            <img src={`${emojiUrl}/${countryCode ?? 'un'}.png`} alt={countryCode ? (countryCodes as Record<string, string>)[countryCode] ?? '' : 'Worldwide'} style={{ height: 9, width: 'auto', opacity: 0.6 }} />
            <span>{countryCode ? countryCode.toUpperCase() : 'WW'}</span>
         </div>
      </>
   )
}

export default Indicators
