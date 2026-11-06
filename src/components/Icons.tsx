// Small pixel-style icons drawn as SVG, so no "?" glyph is ever needed from the Title font.
type IconProps = { size?: number }

const svg = (size: number, children: React.ReactNode) => (
   <svg width={size} height={size} viewBox='0 0 12 12' fill='currentColor' shapeRendering='crispEdges' aria-hidden='true'>{children}</svg>
)

export const StatsIcon = ({ size = 13 }: IconProps) => svg(size, <>
   <rect x='1' y='6' width='2' height='5' /><rect x='5' y='2' width='2' height='9' /><rect x='9' y='4' width='2' height='7' />
</>)

export const CalendarIcon = ({ size = 13 }: IconProps) => svg(size, <>
   <rect x='1' y='1' width='10' height='2' />
   <rect x='1' y='4' width='2' height='2' /><rect x='4' y='4' width='2' height='2' /><rect x='7' y='4' width='2' height='2' /><rect x='10' y='4' width='1' height='2' />
   <rect x='1' y='7' width='2' height='2' /><rect x='4' y='7' width='2' height='2' /><rect x='7' y='7' width='2' height='2' /><rect x='10' y='7' width='1' height='2' />
   <rect x='1' y='10' width='2' height='1' /><rect x='4' y='10' width='2' height='1' />
</>)

export const GearIcon = ({ size = 14 }: IconProps) => (
   <svg width={size} height={size} viewBox='0 0 12 12' fill='none' stroke='currentColor' aria-hidden='true'>
      <circle cx='6' cy='6' r='2.6' strokeWidth='1.8' />
      {[0, 45, 90, 135].map(angle => <path key={angle} d='M6 .4v2.2M6 9.4v2.2' strokeWidth='2' transform={`rotate(${angle} 6 6)`} />)}
   </svg>
)

export const HelpIcon = ({ size = 13 }: IconProps) => svg(size, <>
   <rect x='3' y='0' width='6' height='2' /><rect x='1' y='2' width='2' height='2' /><rect x='9' y='2' width='2' height='3' />
   <rect x='7' y='5' width='2' height='2' /><rect x='5' y='6' width='2' height='2' /><rect x='5' y='10' width='2' height='2' />
</>)

export const CloseIcon = ({ size = 13 }: IconProps) => (
   <svg width={size} height={size} viewBox='0 0 12 12' fill='none' stroke='currentColor' strokeWidth='1.6' aria-hidden='true'>
      <path d='M2 2l8 8M10 2l-8 8' />
   </svg>
)

export const BulbIcon = ({ size = 14 }: IconProps) => svg(size, <>
   <rect x='4' y='0' width='4' height='1' /><rect x='3' y='1' width='6' height='4' /><rect x='4' y='5' width='4' height='1' />
   <rect x='5' y='6' width='2' height='1' /><rect x='4' y='7' width='4' height='1' /><rect x='4' y='9' width='4' height='1' /><rect x='5' y='10' width='2' height='1' />
</>)
