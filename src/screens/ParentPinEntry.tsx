import { useState } from 'react'
import type { ScreenProps } from '../components/ScreenProps'
import IshraqLogo from '../components/IshraqLogo'
import { sounds, playSound } from '../sounds/sound'

export default function ParentPinEntry({ state, navigate, goBack }: ScreenProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [showRecovery, setShowRecovery] = useState(false)
  const [recoveryDone, setRecoveryDone] = useState(false)

  const handleDigit = (d: string) => {
    if (pin.length >= 6) return
    const next = pin + d
    setPin(next)
    setError('')
    if (next.length === 6) {
      setTimeout(() => {
        if (next === state.parentPin) {
  playSound(sounds.pinCorrect)
  navigate('parent-dashboard')
} else {
  playSound(sounds.pinError)
  setShake(true)
  setError('رمز غير صحيح، حاول مرة أخرى')
  setTimeout(() => { setPin(''); setShake(false) }, 800)
}
      }, 200)
    }
  }

  const handleDelete = () => { setPin(p => p.slice(0, -1)); setError('') }

  const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  if (showRecovery) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center ishraq-bg-parent px-8" style={{ direction: 'rtl' }}>
        <div className="w-full max-w-sm text-center animate-slide-up">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
          </div>
          {!recoveryDone ? (
            <>
              <h2 className="text-2xl font-black text-white mb-3">استرداد الرمز</h2>
              <p className="text-base font-medium mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
                سيتم إرسال رابط إعادة تعيين الرمز إلى بريدك الإلكتروني المسجّل.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setShowRecovery(false)}
                  className="flex-1 btn-press py-4 rounded-2xl font-bold"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  إلغاء
                </button>
                <button onClick={() => setRecoveryDone(true)}
                  className="flex-1 btn-press py-4 rounded-2xl font-black text-white"
                  style={{ background: 'linear-gradient(135deg, #A98FE0, #7C5CBF)' }}>
                  إرسال الرابط
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black text-white mb-3">تم الإرسال!</h2>
              <p className="text-base font-medium mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
                تحقق من بريدك الإلكتروني لإعادة تعيين رمز الوالدين.
              </p>
              <button onClick={() => { setShowRecovery(false); setRecoveryDone(false) }}
                className="w-full btn-press py-4 rounded-2xl font-black text-white"
                style={{ background: 'linear-gradient(135deg, #A98FE0, #7C5CBF)' }}>
                حسناً
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center ishraq-bg-parent" style={{ direction: 'rtl' }}>
      {/* Back */}
      <button onClick={goBack}
        className="absolute top-6 right-6 btn-press w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
        <svg width="18" height="18" viewBox="0 0 18 18"><path d="M12 3 L6 9 L12 15" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
      </button>

      <IshraqLogo size={64} style={{ filter: 'drop-shadow(0 0 16px rgba(200,180,255,0.5))' }}/>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-white mb-2">لوحة الوالدين</h2>
        <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>أدخل رمز PIN للدخول</p>
      </div>

      {/* PIN dots */}
      <div className={`flex gap-4 mb-4 ${shake ? 'animate-wiggle' : ''}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-5 h-5 rounded-full transition-all duration-200"
            style={{
              background: i < pin.length ? '#A98FE0' : 'rgba(255,255,255,0.2)',
              transform: i === pin.length - 1 && pin.length > 0 ? 'scale(1.25)' : 'scale(1)',
            }} />
        ))}
      </div>

      {error && (
        <p className="text-sm font-bold mb-4" style={{ color: '#FF9090' }}>{error}</p>
      )}

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3 mt-4" style={{ maxWidth: 280 }}>
        {KEYS.map((k, i) => (
          <button
            key={i}
            onClick={() => k === '⌫' ? handleDelete() : k ? handleDigit(k) : undefined}
            disabled={!k}
            className="w-20 h-14 rounded-2xl text-2xl font-black flex items-center justify-center transition-all duration-150 btn-press"
            style={{
              background: k === '⌫' ? 'rgba(255,100,100,0.15)' : k ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: k === '⌫' ? '#FF9090' : 'white',
              border: k ? `1px solid ${k === '⌫' ? 'rgba(255,100,100,0.25)' : 'rgba(255,255,255,0.15)'}` : 'none',
              cursor: k ? 'pointer' : 'default',
            }}
          >
            {k === '⌫' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/>
              </svg>
            ) : k}
          </button>
        ))}
      </div>

      <button onClick={() => setShowRecovery(true)}
        className="mt-8 text-sm font-bold btn-press"
        style={{ color: 'rgba(255,255,255,0.4)' }}>
        نسيت الرمز؟
      </button>
    </div>
  )
}
