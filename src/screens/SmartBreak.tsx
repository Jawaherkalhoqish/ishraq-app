import { useState, useEffect } from 'react'
import type { ScreenProps } from '../components/ScreenProps'
import Character from '../components/Character'

type BreathPhase = 'invite' | 'breathe-in' | 'hold' | 'breathe-out' | 'done'

export default function SmartBreak({ state, navigate, goBack }: ScreenProps) {
  const character = state.character ?? 'mushriq'
  const charName = character === 'mushriq' ? 'مشرق' : 'مشرقة'
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('invite')
  const [cycles, setCycles] = useState(0)
  const totalCycles = 3

  useEffect(() => {
    if (breathPhase === 'breathe-in') {
      const t = setTimeout(() => setBreathPhase('hold'), 4000)
      return () => clearTimeout(t)
    }
    if (breathPhase === 'hold') {
      const t = setTimeout(() => setBreathPhase('breathe-out'), 2000)
      return () => clearTimeout(t)
    }
    if (breathPhase === 'breathe-out') {
      const t = setTimeout(() => {
        const next = cycles + 1
        setCycles(next)
        if (next >= totalCycles) setBreathPhase('done')
        else setBreathPhase('breathe-in')
      }, 4000)
      return () => clearTimeout(t)
    }
  }, [breathPhase, cycles])

  const messages: Record<BreathPhase, string> = {
    invite: `وش رايك نأخذ استراحة قصيرة؟`,
    'breathe-in': 'خذ نفسًا معي... استنشق ببطء',
    hold: 'امسك النفس لحظة...',
    'breathe-out': 'وأخرج النفس ببطء...',
    done: `ممتاز! أحسنت يا ${charName}! هل نكمل؟`,
  }

  const circleSize = breathPhase === 'breathe-in' || breathPhase === 'hold' ? 220
    : breathPhase === 'breathe-out' ? 140 : 160

  const charState = breathPhase === 'done' ? 'celebrating' : breathPhase === 'invite' ? 'welcome' : 'breathing'

  return (
    <div className="w-full h-full flex overflow-hidden relative"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #D8CCFF 0%, #C4B8F5 40%, #B0A8EC 100%)',
        direction: 'rtl',
      }}>

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(22)].map((_, i) => (
          <div key={i} className="absolute"
            style={{
              left: `${(i * 4.7) % 95}%`, top: `${(i * 7.3) % 90}%`,
              animation: `sparkle ${2 + (i % 4) * 0.5}s ease-in-out infinite ${i * 0.18}s`,
            }}>
            <svg width={i % 4 === 0 ? 10 : 6} height={i % 4 === 0 ? 10 : 6} viewBox="0 0 10 10">
              <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="white" opacity={0.35 + (i % 4) * 0.15}/>
            </svg>
          </div>
        ))}
      </div>

      {/* Character — left side, standing in scene */}
      <div className="absolute bottom-0 right-12 z-10 flex flex-col items-center">
        <Character character={character} state={charState} width={220} shadow={true}/>
      </div>

      {/* Main content — center */}
      <div className="flex-1 flex flex-col items-center justify-between py-10 z-10">
        {/* Header */}
        <div className="text-center animate-slide-up">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-3"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.4)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 8v4l3 3"/>
            </svg>
            <span className="text-2xl font-black text-white">استراحة مشرق الذكية</span>
          </div>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
            دعينا نأخذ نفسًا معاً ونعود بنشاط
          </p>
        </div>

        {/* Breathing circle */}
        <div className="relative flex items-center justify-center" style={{ height: 300, width: 300 }}>
          {breathPhase === 'breathe-in' && (
            <>
              <div className="absolute rounded-full" style={{ width: 240, height: 240, border: '2px solid rgba(255,255,255,0.25)', animation: 'ripple 2s ease-out infinite' }}/>
              <div className="absolute rounded-full" style={{ width: 240, height: 240, border: '2px solid rgba(255,255,255,0.15)', animation: 'ripple 2s ease-out infinite 0.6s' }}/>
            </>
          )}

          <div className="rounded-full flex items-center justify-center transition-all"
            style={{
              width: circleSize, height: circleSize,
              background: 'radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(200,180,255,0.3) 100%)',
              border: '3px solid rgba(255,255,255,0.55)',
              backdropFilter: 'blur(14px)',
              boxShadow: `0 0 ${breathPhase === 'breathe-in' ? 70 : 35}px rgba(169,143,224,0.5)`,
              transition: 'all 4s cubic-bezier(0.4,0,0.2,1)',
            }}>
            {/* Breath icon in SVG instead of emoji */}
            {breathPhase === 'breathe-in' && (
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M12 22V12M8 16l4-4 4 4"/>
                <path d="M5 8a7 7 0 0 1 14 0c0 5-7 11-7 11S5 13 5 8z"/>
              </svg>
            )}
            {breathPhase === 'hold' && (
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>
              </svg>
            )}
            {breathPhase === 'breathe-out' && (
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M12 2v10M8 8l4 4 4-4"/>
                <path d="M5 16a7 7 0 0 0 14 0c0-5-7-11-7-11S5 11 5 16z"/>
              </svg>
            )}
            {breathPhase === 'done' && (
              <svg width="52" height="52" viewBox="0 0 20 20">
                <path d="M10 1 L12.4 7.6 L19.5 7.6 L13.9 11.8 L16.2 18.5 L10 14.3 L3.8 18.5 L6.1 11.8 L0.5 7.6 L7.6 7.6 Z" fill="#F5C842"/>
              </svg>
            )}
            {breathPhase === 'invite' && (
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M17 8C8 10 5.9 16.17 3.82 19.11a1 1 0 0 0 1.35 1.37C6.49 19.59 8.9 19 10 19c5 0 6-3 6-3"/>
                <path d="M8.5 8.5c.5-1 2-3 5.5-3 4 0 7 3 7 7s-3 7-7 7-7-3-7-7c0-1 .2-2 .5-3"/>
              </svg>
            )}
          </div>

          <div className="absolute -bottom-10 flex gap-3">
            {[...Array(totalCycles)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full transition-all duration-500"
                style={{ background: i < cycles ? 'white' : 'rgba(255,255,255,0.3)' }}/>
            ))}
          </div>
        </div>

        {/* Dialogue + buttons */}
        <div className="flex flex-col items-center gap-5">
          <div className="px-8 py-5 rounded-3xl text-center max-w-md"
            style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.5)' }}>
            <p className="text-xl font-bold text-white">{messages[breathPhase]}</p>
          </div>

          {breathPhase === 'invite' && (
            <button onClick={() => setBreathPhase('breathe-in')}
              className="btn-press px-12 py-4 rounded-2xl text-xl font-black text-white animate-slide-up"
              style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.6)' }}>
              حسناً، نبدأ
            </button>
          )}

          {breathPhase === 'done' && (
            <div className="flex gap-4 animate-slide-up">
              <button onClick={() => goBack()}
                className="btn-press px-8 py-4 rounded-2xl text-lg font-black text-white"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(200,180,255,0.4))', border: '2px solid rgba(255,255,255,0.6)' }}>
                نكمل اللعب
              </button>
              <button onClick={() => navigate('child-home')}
                className="btn-press px-8 py-4 rounded-2xl text-lg font-black"
                style={{ background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.35)', color: 'white' }}>
                الرئيسية
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
