import { useEffect, useRef, useState } from 'react'
import { CalendarIcon, CloseIcon, GearIcon, HelpIcon, StatsIcon } from '@/components/Icons'
import TitleText from '@/components/TitleText'

const APP_NAME = 'WADAI'

const Rings = () => (
   <div className='rings' aria-hidden='true'>{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</div>
)

const IconButton = ({ label, onClick, children }: { label: string, onClick: () => void, children: React.ReactNode }) => (
   <button type='button' className='iconbtn' aria-label={label} title={label} onClick={onClick}>
      <span className='ic'>{children}</span>
   </button>
)

type GameBarProps = {
   used: number
   onStats: () => void
   onArchive: () => void
   onSettings: () => void
   onHelp: () => void
}

// The game's top bar. Each letter of WADAI is a round; used rounds are drawn outlined.
export const GameBar = ({ used, onStats, onArchive, onSettings, onHelp }: GameBarProps) => {
   const previous = useRef(used)
   const [flash, setFlash] = useState<number | null>(null)

   useEffect(() => {
      if (used > previous.current) {
         setFlash(used - 1)
         const timer = window.setTimeout(() => setFlash(null), 1000)
         previous.current = used
         return () => window.clearTimeout(timer)
      }
      previous.current = used
   }, [used])

   return (
      <header className='bar'>
         <Rings />
         <div className='bar-in'>
            <div className='icons'>
               <IconButton label='Statistics' onClick={onStats}><StatsIcon /></IconButton>
               <IconButton label='Play past days' onClick={onArchive}><CalendarIcon /></IconButton>
            </div>
            <h1 className='logo' aria-label={`${APP_NAME}, ${used} of 5 rounds used`}>
               {APP_NAME.split('').map((letter, i) => (
                  <span key={i} aria-hidden='true' className={`${i < used ? 'used' : ''} ${flash === i ? 'flash' : ''}`}>{letter}</span>
               ))}
            </h1>
            <div className='icons r'>
               <IconButton label='Settings' onClick={onSettings}><GearIcon /></IconButton>
               <IconButton label='How to play' onClick={onHelp}><HelpIcon /></IconButton>
            </div>
         </div>
      </header>
   )
}

// The bar on top of every full-screen panel: a title and a close button.
export const ScreenBar = ({ title, id, onClose }: { title: string, id: string, onClose: () => void }) => (
   <header className='bar'>
      <Rings />
      <div className='bar-in'>
         <div />
         <h2 id={id} className={`logo ${title.length > 6 ? 'sm' : ''}`}><TitleText text={title} /></h2>
         <div className='icons r'>
            <IconButton label='Close' onClick={onClose}><CloseIcon /></IconButton>
         </div>
      </div>
   </header>
)
