import { useId } from 'react'
import Dialog from '@mui/material/Dialog'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ScreenBar } from '@/components/Topbar'

type ScreenProps = {
   open: boolean
   title: string
   onClose: () => void
   children: React.ReactNode
   // A framed window over the dimmed game instead of a full page (used for the first-visit how-to).
   popup?: boolean
}

// A full-screen panel (result, stats, archive, settings) or a popup window (how to play) over the game.
const Screen = ({ open, title, onClose, children, popup = false }: ScreenProps) => {
   const id = useId()
   const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

   return (
      <Dialog
         fullScreen={!popup}
         className={popup ? 'popup' : undefined}
         open={open}
         onClose={onClose}
         disableRestoreFocus
         aria-labelledby={id}
         transitionDuration={reduced ? 0 : 220}
         PaperProps={{ sx: { background: 'var(--bg)', color: 'var(--ink)', backgroundImage: 'none', ...(popup && { m: 2, width: 'calc(100% - 32px)', maxWidth: 440, maxHeight: 'calc(100% - 32px)', borderRadius: 0, border: '3px solid var(--ink)', boxShadow: '8px 8px 0 rgba(0, 0, 0, .35)' }) } }}
      >
         <div className='screen'>
            <ScreenBar title={title} id={id} onClose={onClose} />
            <div className='scr'>{children}</div>
         </div>
      </Dialog>
   )
}

export default Screen
