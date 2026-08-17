/* ─────────────────────────────────────────────────────────────────────────────
   Ishraq Icon Library — custom SVG line-icons, no emoji
   Palette: lavender #A98FE0, purple #7C5CBF, cream #FFF5E8, gold #F5C842
───────────────────────────────────────────────────────────────────────────── */

interface P { size?: number; color?: string; strokeWidth?: number }
const d = (size=22,color='currentColor',sw=2) => ({width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:color,strokeWidth:sw,strokeLinecap:'round' as const,strokeLinejoin:'round' as const})

export function IcHome({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><path d="M3 9.5 L12 3 L21 9.5 V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5Z"/><path d="M9 21V12h6v9"/></svg>
}
export function IcGamepad({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><rect x="2" y="7" width="20" height="12" rx="4"/><path d="M8 11v4M6 13h4"/><circle cx="16" cy="12" r="1" fill={color}/><circle cx="18" cy="14" r="1" fill={color}/></svg>
}
export function IcStore({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><path d="M3 6h18l-2 8H5L3 6Z"/><path d="M3 6 L1 2"/><circle cx="9" cy="20" r="1" fill={color}/><circle cx="17" cy="20" r="1" fill={color}/><path d="M5 14h14"/></svg>
}
export function IcHanger({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><path d="M12 4a2 2 0 0 1 2 2c0 1-1 1.5-1 2L22 17H2l9-9c0-.5-1-1-1-2a2 2 0 0 1 2-2z"/></svg>
}
export function IcChart({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><path d="M3 3v18h18"/><path d="M7 16 L11 10 L15 13 L19 7"/></svg>
}
export function IcBell({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><path d="M6 10a6 6 0 0 1 12 0c0 4 2 6 2 6H4s2-2 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>
}
export function IcStar({ size=22, color='#F5C842', filled=true }: P & { filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <path d="M10 1 L12.4 7.6 L19.5 7.6 L13.9 11.8 L16.2 18.5 L10 14.3 L3.8 18.5 L6.1 11.8 L0.5 7.6 L7.6 7.6 Z"
        fill={filled ? color : 'none'} stroke={color} strokeWidth="1"/>
    </svg>
  )
}
export function IcTrophy({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><path d="M6 2h12v6a6 6 0 0 1-12 0V2Z"/><path d="M6 4H3a1 1 0 0 0-1 1v2a4 4 0 0 0 4 4"/><path d="M18 4h3a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4"/><path d="M12 14v4"/><path d="M9 20h6"/></svg>
}
export function IcBallon({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><ellipse cx="12" cy="9" rx="6" ry="8"/><path d="M12 17 Q11 19 12 21"/><path d="M12 17 Q13 19 12 21"/></svg>
}
export function IcCart({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><path d="M6 2 L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
}
export function IcNumbers({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
}
export function IcBreath({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><path d="M17 8C8 10 5.9 16 3.8 19a1 1 0 0 0 1.4 1.4C6.4 19.5 8.9 19 10 19c5 0 6-3 6-3"/><path d="M22 10a5 5 0 0 1-5 5"/></svg>
}
export function IcGem({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><path d="M6 3h12l4 6-10 12L2 9Z"/><path d="M2 9h20"/><path d="M12 3 L6 9 L12 21 L18 9Z"/></svg>
}
export function IcMap({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
}
export function IcRocket({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
}
export function IcSettings({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
}
export function IcLogout({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
}
export function IcUser({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
export function IcLock({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
}
export function IcMail({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
}
export function IcCheck({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><polyline points="20 6 9 17 4 12"/></svg>
}
export function IcArrowLeft({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><path d="M15 18 L9 12 L15 6"/></svg>
}
export function IcArrowRight({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><path d="M9 18 L15 12 L9 6"/></svg>
}
export function IcPlus({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
}
export function IcBookOpen({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
}
export function IcSmile({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
}
export function IcCalendar({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
}
export function IcClock({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}
export function IcLightbulb({ size=22, color='currentColor' }: P) {
  return <svg {...d(size,color)}><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
}
export function IcSparkle({ size=16, color='#F5C842' }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" fill={color}/>
    </svg>
  )
}
