import useStore, { Colors, TextSize, Theme } from '@/store'
import InfoNote from '@/components/InfoNote'

type Preview = {
   name: string
   bg: string
   bar: React.CSSProperties
   ok: string
   bad: string
   empty: string
   fill: string
   radius?: number
   glow?: boolean
   frame?: string
}

const PREVIEWS: Record<Theme, Preview> = {
   classic: { name: 'CLASSIC', bg: '#fff', bar: { background: '#ef4444', color: '#fff' }, ok: '#22c55e', bad: '#ef4444', empty: '#a3a3a3', fill: '#a3a3a3', frame: '1px solid #ddd' },
   arcade: { name: 'ARCADE', bg: '#121212', bar: { color: '#ff4d4d', textShadow: '0 0 6px #ff4d4d' }, ok: '#2ee66b', bad: '#ff4d4d', empty: '#3c3c3c', fill: '#232323', glow: true },
   calendar: { name: 'CALENDAR', bg: '#fbf6ec', bar: { background: '#b8322b', color: '#fff', borderBottom: '2px solid #8f2520' }, ok: '#2fa35a', bad: '#e2433a', empty: '#cdbfae', fill: '#e6d9c5', radius: 2 },
}

const SIZES: { value: TextSize, label: string, px: number }[] = [
   { value: 's', label: 'Small text', px: 11 },
   { value: 'm', label: 'Medium text', px: 14 },
   { value: 'l', label: 'Large text', px: 18 },
]

const SettingsScreen = () => {
   const settings = useStore(state => state.settings)
   const setSettings = useStore(state => state.setSettings)
   const blind = settings.colors === 'colourblind'

   const colourOption = (value: Colors, label: string, ok: string, bad: string) => (
      <button type='button' className={settings.colors === value ? 'on' : ''} aria-pressed={settings.colors === value} onClick={() => setSettings({ colors: value })}>
         <i className='sw' style={{ background: ok }} /><i className='sw' style={{ background: bad }} />{label}
      </button>
   )

   return (
      <>
         <div className='opt-h' id='theme-h'>THEME</div>
         <div className='themes' role='group' aria-labelledby='theme-h'>
            {(Object.keys(PREVIEWS) as Theme[]).map(theme => {
               const p = PREVIEWS[theme]
               const ok = blind ? '#2f7cf6' : p.ok
               const bad = blind ? '#f59e0b' : p.bad
               const tile = (background: string, extra: React.CSSProperties = {}) => ({ background, borderRadius: p.radius, ...extra })
               return (
                  <button key={theme} type='button' className={`th ${settings.theme === theme ? 'on' : ''}`} aria-pressed={settings.theme === theme} onClick={() => setSettings({ theme })}>
                     <div className='pv' style={{ background: p.bg, border: p.frame }} aria-hidden='true'>
                        <div className='hb' style={p.bar}>WADAI</div>
                        <div className='pb'>
                           <i style={tile(ok, p.glow ? { boxShadow: `0 0 5px ${ok}` } : {})} />
                           <i style={tile(ok)} />
                           <i style={tile(bad)} />
                           <i style={tile('transparent', { border: `1px solid ${p.empty}` })} />
                           <i style={tile(p.fill)} /><i style={tile(p.fill)} /><i style={tile(p.fill)} /><i style={tile(p.fill)} />
                        </div>
                     </div>
                     {p.name}
                  </button>
               )
            })}
         </div>

         <div className='opt-h' id='colours-h'>COLOURS</div>
         <div className='seg' role='group' aria-labelledby='colours-h'>
            {colourOption('standard', 'STANDARD', '#22c55e', '#ef4444')}
            {colourOption('colourblind', 'COLOURBLIND', '#2f7cf6', '#f59e0b')}
         </div>

         <div className='opt-h' id='size-h'>TEXT SIZE</div>
         <div className='seg' role='group' aria-labelledby='size-h'>
            {SIZES.map(size => (
               <button
                  key={size.value}
                  type='button'
                  className={settings.textSize === size.value ? 'on' : ''}
                  style={{ fontSize: size.px }}
                  aria-label={size.label}
                  aria-pressed={settings.textSize === size.value}
                  onClick={() => setSettings({ textSize: size.value })}
               >A</button>
            ))}
         </div>

         <div className='opt-h'>YOUR PROGRESS</div>
         <InfoNote>Streak, stats and passport are saved in this browser. No account, nothing sent anywhere.</InfoNote>
      </>
   )
}

export default SettingsScreen
