import { useEffect, useState } from 'react'
import type { ScreenProps } from '../components/ScreenProps'
import IshraqLogo from '../components/IshraqLogo'

export default function SplashScreen({ navigate }: ScreenProps) {
  const [phase, setPhase] = useState<'logo' | 'welcome' | 'done'>('logo')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('welcome'), 2000)
    const t2 = setTimeout(() => setPhase('done'), 3800)
    const t3 = setTimeout(() => navigate('parent-account'), 4200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [navigate])

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #EDE0FF 0%, #D8CCFF 30%, #C4B8F5 60%, #B8AAEA 100%)',
      }}
    >
      {/* Ambient glow circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full opacity-30 animate-float-slow"
          style={{ background: 'radial-gradient(circle, #FFE8A0 0%, transparent 70%)' }} />
        <div className="absolute bottom-[15%] right-[10%] w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #B8D9F8 0%, transparent 70%)', animation: 'float 3s ease-in-out 1s infinite' }} />
        <div className="absolute top-[30%] right-[20%] w-48 h-48 rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #FFB8D0 0%, transparent 70%)', animation: 'float-slow 4s ease-in-out 0.5s infinite' }} />
      </div>

      {/* Floating sparkles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${10 + (i * 8) % 80}%`,
            top: `${5 + (i * 13) % 85}%`,
            animation: `sparkle ${2 + (i % 3) * 0.7}s ease-in-out infinite ${i * 0.3}s`,
          }}
        >
          <svg width={i % 3 === 0 ? 14 : 8} height={i % 3 === 0 ? 14 : 8} viewBox="0 0 14 14">
            <path d="M7 0 L8 6 L14 7 L8 8 L7 14 L6 8 L0 7 L6 6 Z"
              fill={i % 4 === 0 ? '#F5C842' : i % 4 === 1 ? '#A98FE0' : i % 4 === 2 ? '#7BB8F0' : '#FFB8A0'}
              opacity={0.7} />
          </svg>
        </div>
      ))}

      {/* Logo */}
      <div
        className="relative z-10 flex flex-col items-center"
        style={{
          animation: phase === 'logo' ? 'logo-appear 0.8s cubic-bezier(0.175,0.885,0.32,1.275) forwards' : undefined,
          opacity: phase === 'done' ? 0 : 1,
          transition: phase === 'done' ? 'opacity 0.4s ease' : undefined,
        }}
      >
        {/* Logo image */}
        <div className="relative mb-6 animate-pulse-glow" style={{ borderRadius: '50%' }}>
          <div className="w-48 h-48 flex items-center justify-center">
            <IshraqLogo size={176} style={{ filter: 'drop-shadow(0 0 30px rgba(169,143,224,0.6))' }}/>
          </div>
        </div>

        {/* App name */}
        <div
          className="text-center"
          style={{
            opacity: phase !== 'logo' ? 1 : 0,
            transform: phase !== 'logo' ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <h1
            className="text-7xl font-black mb-3 text-shadow"
            style={{
              color: '#FFFFFF',
              letterSpacing: '0.05em',
              textShadow: '0 4px 20px rgba(100,60,180,0.5)',
            }}
          >
            إشراق
          </h1>
          <p
            className="text-2xl font-semibold tracking-widest"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            ISHRAQ
          </p>
          <p
            className="text-lg mt-3 font-medium"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            مرحبًا بك في إشراق
          </p>
        </div>
      </div>

      {/* Loading dots */}
      {phase === 'welcome' && (
        <div className="absolute bottom-16 flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.7)',
                animation: `bounce-gentle 1s ease-in-out infinite ${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
