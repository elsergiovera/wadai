import { countryName, flagUrl } from '@/lib/labels'

// Flag images from flagcdn (emoji flags don't render on Windows). Worldwide entries get a globe.
const Flag = ({ region, className = 'fl', decorative = true }: { region: string | null, className?: string, decorative?: boolean }) => {
   if (!region) return <span className={className} style={{ border: 0, height: 'auto' }} aria-hidden={decorative}>🌍</span>
   return <img className={className} src={flagUrl(region)} alt={decorative ? '' : countryName(region)} loading='lazy' />
}

export default Flag
