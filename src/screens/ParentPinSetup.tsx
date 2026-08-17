import { useState } from 'react'
import type { ScreenProps } from '../components/ScreenProps'

export default function ParentPinSetup({ navigate, setParentPin }: ScreenProps) {
  const [step, setStep] = useState<'create' | 'confirm'>('create')
  const [firstPin, setFirstPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const currentPin = step === 'create' ? firstPin : confirmPin
  const setCurrentPin = step === 'create' ? setFirstPin : setConfirmPin

  const handleDigit = (d: string) => {
    if (currentPin.length >= 6) return
    const next = currentPin + d
    setCurrentPin(next)
    setError('')
    if (next.length === 6) {
      if (step === 'create') {
        setTimeout(() => setStep('confirm'), 300)
      } else {
        if (next === firstPin) {
          setSuccess(true)
          setParentPin(firstPin)
          setTimeout(() => navigate('parent-onboarding'), 1200)
        } else {
          setError('الرمز غير متطابق، حاول مرة أخرى')
          setConfirmPin('')
        }
      }
    }
  }

  const handleDelete = () => {
    setCurrentPin(p => p.slice(0, -1))
    setError('')
  }

  const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫']

  return (
    <div className="w-full h-full flex flex-col items-center justify-center ishraq-bg-main" style={{ direction: 'rtl' }}>
      {/* Progress */}
      <div className="flex gap-2 mb-10">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="transition-all duration-300"
            style={{ width: i <= 3 ? 32 : 12, height: 8, borderRadius: 4, background: i <= 3 ? '#A98FE0' : 'rgba(169,143,224,0.25)' }} />
        ))}
      </div>

      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center"
          style={{ background: success ? 'linear-gradient(135deg, #A8E6CF, #5CB85C)' : 'linear-gradient(135deg, #A98FE0, #7C5CBF)', boxShadow: '0 8px 28px rgba(124,92,191,0.35)' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            {success
              ? <path d="M20 6 L9 17 L4 12"/>
              : <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>
            }
          </svg>
        </div>

        <p className="text-sm font-bold mb-1" style={{ color: '#A98FE0' }}>الخطوة ٣ من ٤</p>
        <h2 className="text-3xl font-black mb-2" style={{ color: '#2D1F5E' }}>
          {success ? 'تم إنشاء الرمز!' : step === 'create' ? 'إنشاء رمز الوالدين' : 'تأكيد الرمز'}
        </h2>
        <p className="text-base font-medium" style={{ color: '#8878B0' }}>
          {success ? 'ستستخدم هذا الرمز للدخول إلى لوحة الوالدين'
            : step === 'create'
              ? 'أنشئ رمز PIN مكون من ٦ أرقام لحماية لوحة الوالدين'
              : 'أعد إدخال الرمز للتأكيد'}
        </p>
      </div>

      {/* PIN dots */}
      <div className="flex gap-4 mb-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-5 h-5 rounded-full transition-all duration-200"
            style={{
              background: i < currentPin.length
                ? 'linear-gradient(135deg, #A98FE0, #7C5CBF)'
                : 'rgba(169,143,224,0.2)',
              transform: i === currentPin.length - 1 && currentPin.length > 0 ? 'scale(1.2)' : 'scale(1)',
              boxShadow: i < currentPin.length ? '0 2px 8px rgba(124,92,191,0.4)' : 'none',
            }} />
        ))}
      </div>

      {error && (
        <p className="text-sm font-bold mb-4 animate-slide-up" style={{ color: '#FF6B6B' }}>{error}</p>
      )}

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3 mt-4" style={{ maxWidth: 300 }}>
        {KEYS.map((k, i) => (
          <button
            key={i}
            onClick={() => k === '⌫' ? handleDelete() : k ? handleDigit(k) : undefined}
            disabled={!k}
            className="w-24 h-16 rounded-2xl text-2xl font-black flex items-center justify-center transition-all duration-150 btn-press"
            style={{
              background: k === '⌫' ? 'rgba(255,107,107,0.1)' : k ? 'white' : 'transparent',
              color: k === '⌫' ? '#FF6B6B' : '#2D1F5E',
              border: k ? `1.5px solid ${k === '⌫' ? 'rgba(255,107,107,0.2)' : 'rgba(169,143,224,0.2)'}` : 'none',
              boxShadow: k && k !== '⌫' ? '0 2px 8px rgba(124,92,191,0.08)' : 'none',
              cursor: k ? 'pointer' : 'default',
            }}
          >
            {k === '⌫' ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/>
              </svg>
            ) : k}
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm font-medium" style={{ color: '#B0A0CC' }}>
        تذكّر هذا الرمز — ستحتاجه للدخول إلى لوحة الوالدين
      </p>
    </div>
  )
}
