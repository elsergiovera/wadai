import { BulbIcon } from '@/components/Icons'

// A small dashed info box with a bulb, for side notes that shouldn't compete with the content.
const InfoNote = ({ children }: { children: React.ReactNode }) => (
   <div className='info' role='note'>
      <span className='bulb'><BulbIcon size={14} /></span>
      <span>{children}</span>
   </div>
)

export default InfoNote
