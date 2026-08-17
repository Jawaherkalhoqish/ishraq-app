import { useState } from 'react'
import type { ScreenProps } from '../components/ScreenProps'
import Character from '../components/Character'
import IshraqLogo from '../components/IshraqLogo'

export default function CharacterSelect({ state, navigate, setCharacter }: ScreenProps) {
  const [hovered, setHovered] = useState<'mushriq' | 'mushriqa' | null>(null)
  const [chosen, setChosen] = useState<'mushriq' | 'mushriqa' | null>(null)

  const handleConfirm = () => {
    if (!chosen) return
    setCharacter(chosen)
    navigate('child-home')
  }

  const charName = state.parentProfile?.childName || 'صديقي'

  return (
    <div className="w-full h-full flex flex-col items-center justify-between overflow-hidden relative"
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, #F0EBFF 0%, #DDD5FF 35%, #CCC0F5 65%, #B8AEE8 100%)',
        direction: 'rtl',
      }}>

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <div key={i} className="absolute"
            style={{
              left: `${(i * 5.7) % 95}%`, top: `${(i * 9.3) % 75}%`,
              animation: `sparkle ${2 + (i % 4) * 0.5}s ease-in-out infinite ${i * 0.22}s`, opacity: 0.55,
            }}>
            <svg width={i % 3 === 0 ? 12 : 7} height={i % 3 === 0 ? 12 : 7} viewBox="0 0 12 12">
              <path d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5 Z"
                fill={['#F5C842', '#A98FE0', '#7BB8F0', '#FFB8A0'][i % 4]}/>
            </svg>
          </div>
        ))}
      </div>

      {/* Ground plane — gives depth under characters */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(124,92,191,0.12) 0%, transparent 70%)' }}/>

      {/* Header */}
      <div className="pt-10 text-center z-10 animate-slide-up">
        <IshraqLogo size={64} style={{ filter: 'drop-shadow(0 0 16px rgba(169,143,224,0.6))' }}/>
        <h1 className="text-4xl font-black mb-2" style={{ color: '#2D1F5E' }}>
          من سيكون رفيقك في المغامرة؟
        </h1>
        <p className="text-xl font-medium" style={{ color: '#6A5A9A' }}>
          مرحبًا {charName}! اختر رفيقك الذي سيرافقك في رحلة إشراق
        </p>
      </div>

      {/* Characters — no frames, standing directly on the scene */}
      <div className="flex gap-20 items-end z-10 px-12">
        {/* مشرق */}
        <button onClick={() => setChosen('mushriq')}
          onMouseEnter={() => setHovered('mushriq')}
          onMouseLeave={() => setHovered(null)}
          className="flex flex-col items-center btn-press" style={{ outline: 'none' }}>

          {/* Selection ring — glow only, no rectangle */}
          <div className="relative" style={{
            transform: hovered === 'mushriq' || chosen === 'mushriq' ? 'translateY(-12px) scale(1.04)' : 'translateY(0) scale(1)',
            transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {chosen === 'mushriq' && (
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ boxShadow: '0 0 60px 20px rgba(124,92,191,0.35)', transform: 'scale(0.7) translateY(40%)' }}/>
            )}
            <Character character="mushriq" state={chosen === 'mushriq' ? 'welcome' : hovered === 'mushriq' ? 'idle' : 'idle'}
              width={230} shadow={true}/>
            {chosen === 'mushriq' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-9 h-9 rounded-full flex items-center justify-center animate-star-pop"
                style={{ background: '#7C5CBF', boxShadow: '0 4px 16px rgba(124,92,191,0.5)' }}>
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path d="M2 7 L5.5 10.5 L12 3" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>

          <div className="mt-2 text-center">
            <div className="text-3xl font-black mb-1.5" style={{ color: '#2D1F5E' }}>مشرق</div>
            <div className="text-base font-medium px-5 py-2 rounded-full transition-all"
              style={{ background: chosen === 'mushriq' ? 'rgba(124,92,191,0.18)' : 'rgba(255,255,255,0.55)', color: '#7C5CBF' }}>
              المغامر المشرق
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="flex flex-col items-center gap-3 pb-20">
          <div className="w-px h-20" style={{ background: 'linear-gradient(to bottom, transparent, rgba(124,92,191,0.3), transparent)' }}/>
          <div className="text-2xl font-black" style={{ color: '#A98FE0' }}>أو</div>
          <div className="w-px h-20" style={{ background: 'linear-gradient(to bottom, transparent, rgba(124,92,191,0.3), transparent)' }}/>
        </div>

        {/* مشرقة */}
        <button onClick={() => setChosen('mushriqa')}
          onMouseEnter={() => setHovered('mushriqa')}
          onMouseLeave={() => setHovered(null)}
          className="flex flex-col items-center btn-press" style={{ outline: 'none' }}>

          <div className="relative" style={{
            transform: hovered === 'mushriqa' || chosen === 'mushriqa' ? 'translateY(-12px) scale(1.04)' : 'translateY(0) scale(1)',
            transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {chosen === 'mushriqa' && (
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ boxShadow: '0 0 60px 20px rgba(124,92,191,0.35)', transform: 'scale(0.7) translateY(40%)' }}/>
            )}
            <Character character="mushriqa" state={chosen === 'mushriqa' ? 'welcome' : hovered === 'mushriqa' ? 'idle' : 'idle'}
              width={230} shadow={true}/>
            {chosen === 'mushriqa' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-9 h-9 rounded-full flex items-center justify-center animate-star-pop"
                style={{ background: '#7C5CBF', boxShadow: '0 4px 16px rgba(124,92,191,0.5)' }}>
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path d="M2 7 L5.5 10.5 L12 3" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>

          <div className="mt-2 text-center">
            <div className="text-3xl font-black mb-1.5" style={{ color: '#2D1F5E' }}>مشرقة</div>
            <div className="text-base font-medium px-5 py-2 rounded-full transition-all"
              style={{ background: chosen === 'mushriqa' ? 'rgba(124,92,191,0.18)' : 'rgba(255,255,255,0.55)', color: '#7C5CBF' }}>
              المستكشفة الذكية
            </div>
          </div>
        </button>
      </div>

      {/* CTA */}
      <div className="pb-10 z-10">
        {chosen ? (
          <button onClick={handleConfirm}
            className="btn-press px-16 py-5 rounded-2xl text-2xl font-black text-white animate-slide-up"
            style={{ background: 'linear-gradient(135deg, #A98FE0, #7C5CBF)', boxShadow: '0 12px 36px rgba(124,92,191,0.45)' }}>
            هيا نبدأ مع {chosen === 'mushriq' ? 'مشرق' : 'مشرقة'}
          </button>
        ) : (
          <p className="text-lg font-medium text-center" style={{ color: '#8878B0' }}>اختر رفيقك لتبدأ المغامرة</p>
        )}
      </div>
    </div>
  )
}
