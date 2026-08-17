import React, { useState } from 'react'
import type { ScreenProps } from '../components/ScreenProps'
import IshraqLogo from '../components/IshraqLogo'

const questions = [
  {
    id: 'attention',
    text: 'كيف يكون تركيز طفلك عادةً أثناء الأنشطة التعليمية؟',
    options: [
      { value: 'high', label: 'مركّز جداً ويكمل الأنشطة بسهولة', icon: 'target' },
      { value: 'medium', label: 'مركّز أحياناً ويحتاج تشجيعاً', icon: 'sparkle' },
      { value: 'low', label: 'يحتاج دعماً إضافياً للتركيز', icon: 'leaf' },
    ],
  },
  {
    id: 'mathLevel',
    text: 'ما مستوى راحة طفلك مع العمليات الحسابية الأساسية؟',
    options: [
      { value: 'strong', label: 'يتقن الجمع والطرح بشكل جيد', icon: 'shine' },
      { value: 'developing', label: 'في طور التعلم ويحتاج مراجعة', icon: 'book' },
      { value: 'beginner', label: 'مبتدئ ويحتاج أسس قوية', icon: 'star' },
    ],
  },
  {
    id: 'learningStyle',
    text: 'ما أسلوب التعلم المفضّل لطفلك؟',
    options: [
      { value: 'visual', label: 'يتعلم بالصور والألوان', icon: 'palette' },
      { value: 'interactive', label: 'يتعلم بالتجربة والتفاعل', icon: 'sparkle' },
      { value: 'guided', label: 'يتعلم بالتوجيه والخطوات', icon: 'map' },
    ],
  },
]

function OnboardIcon({ icon }: { icon: string }) {
  const s = 28
  const icons: Record<string, React.ReactElement> = {
    target: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#A98FE0" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="#A98FE0"/></svg>,
    sparkle: <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" fill="#F5C842"/><circle cx="5" cy="5" r="1.5" fill="#A98FE0"/><circle cx="19" cy="19" r="1.5" fill="#7BB8F0"/></svg>,
    leaf: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#7BB8F0" strokeWidth="1.8"><path d="M17 8C8 10 5.9 16.17 3.82 19.11a1 1 0 0 0 1.35 1.37C6.49 19.59 8.9 19 10 19c5 0 6-3 6-3M5 21c2-4 5.5-6 7-8"/></svg>,
    shine: <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 2l1.5 8.5H22l-7 5 2.5 8.5L12 19l-5.5 5 2.5-8.5-7-5h8.5z" fill="#F5C842"/></svg>,
    book: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#A98FE0" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    star: <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 2l2.9 8.9H23l-7.5 5.4 2.9 8.9L12 20.1l-7.4 5.1 2.9-8.9L0 10.9h8.1z" fill="#F5C842"/></svg>,
    palette: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#FF9E6D" strokeWidth="1.8"><path d="M12 21a9 9 0 1 0-4.5-16.8C4.5 6 3 9 3 12a9 9 0 0 0 9 9z"/><circle cx="9" cy="9" r="1.5" fill="#FF9E6D"/><circle cx="15" cy="9" r="1.5" fill="#7BB8F0"/><circle cx="9" cy="15" r="1.5" fill="#A98FE0"/><circle cx="15" cy="15" r="1.5" fill="#F5C842"/></svg>,
    map: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#A98FE0" strokeWidth="1.8"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  }
  return icons[icon] ?? <svg width={s} height={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="rgba(169,143,224,0.3)" stroke="#A98FE0" strokeWidth="1.5"/></svg>
}

export default function ParentOnboarding({ navigate, setParentProfile }: ScreenProps) {
  const [step, setStep] = useState<'name' | 'q1' | 'q2' | 'q3' | 'done'>('name')
  const [childName, setChildName] = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [animating, setAnimating] = useState(false)

  const stepIndex = step === 'name' ? 0 : step === 'q1' ? 1 : step === 'q2' ? 2 : step === 'q3' ? 3 : 4
  const totalSteps = 4

  const handleSelect = (value: string) => setSelected(value)

  const handleNext = () => {
    if (step === 'name') {
      if (!childName.trim()) return
      setAnimating(true)
      setTimeout(() => { setStep('q1'); setSelected(null); setAnimating(false) }, 300)
      return
    }
    if (!selected) return
    const qId = step === 'q1' ? 'attention' : step === 'q2' ? 'mathLevel' : 'learningStyle'
    const newAnswers = { ...answers, [qId]: selected }
    setAnswers(newAnswers)
    setAnimating(true)
    setTimeout(() => {
      if (step === 'q1') { setStep('q2'); setSelected(null) }
      else if (step === 'q2') { setStep('q3'); setSelected(null) }
      else {
        setStep('done')
        setParentProfile({ ...newAnswers, childName: childName.trim() } as any)
      }
      setAnimating(false)
    }, 300)
  }

  const currentQuestion = step === 'q1' ? questions[0] : step === 'q2' ? questions[1] : step === 'q3' ? questions[2] : null

  if (step === 'done') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center ishraq-bg-main" style={{ direction: 'rtl' }}>
        <div className="animate-slide-up text-center px-8">
          <div className="w-28 h-28 mx-auto mb-6 flex items-center justify-center rounded-full"
            style={{ background: 'linear-gradient(135deg, #A98FE0, #7C5CBF)', boxShadow: '0 8px 32px rgba(124,92,191,0.4)' }}>
            <span className="text-5xl"></span>
          </div>
          <h2 className="text-4xl font-black mb-3" style={{ color: '#2D1F5E' }}>تم إعداد تجربة الطفل</h2>
          <p className="text-xl font-medium mb-10" style={{ color: '#8878B0' }}>
            سيتكيف إشراق مع احتياجات {childName} تلقائياً
          </p>
          <button
            onClick={() => navigate('character-select')}
            className="btn-press px-12 py-5 rounded-2xl text-2xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #A98FE0, #7C5CBF)', boxShadow: '0 8px 24px rgba(124,92,191,0.4)' }}
          >
            نبدأ الآن →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex ishraq-bg-main" style={{ direction: 'rtl' }}>
      {/* Left panel */}
      <div className="w-80 flex-shrink-0 flex flex-col items-center justify-center p-10"
        style={{ background: 'linear-gradient(160deg, #2D1F5E 0%, #4A2F8A 100%)' }}>
        <IshraqLogo size={96} style={{ filter: 'drop-shadow(0 0 20px rgba(200,180,255,0.5))' }}/>
        <h1 className="text-3xl font-black text-white text-center mb-2">إشراق</h1>
        <p className="text-lg text-center mb-10" style={{ color: 'rgba(255,255,255,0.7)' }}>تجربة تعليمية مخصصة</p>

        {/* Progress dots */}
        <div className="flex gap-3">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="transition-all duration-300"
              style={{
                width: stepIndex === i ? 28 : 10,
                height: 10,
                borderRadius: 5,
                background: stepIndex >= i ? '#A98FE0' : 'rgba(255,255,255,0.2)',
              }} />
          ))}
        </div>
        <p className="text-sm mt-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{stepIndex} / {totalSteps}</p>

        <div className="mt-10 p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>
            هذه الأسئلة تساعدنا على تخصيص تجربة التعلم لطفلك بشكل مثالي
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-12">
        <div
          className="w-full max-w-xl"
          style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateX(-20px)' : 'translateX(0)', transition: 'opacity 0.3s, transform 0.3s' }}
        >
          {step === 'name' ? (
            <>
              <div className="mb-8">
                <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
                  style={{ background: 'rgba(124,92,191,0.12)', color: '#7C5CBF' }}>
                  البداية
                </span>
                <h2 className="text-3xl font-black mb-2" style={{ color: '#2D1F5E' }}>ما اسم طفلك؟</h2>
                <p className="text-lg" style={{ color: '#8878B0' }}>سيستخدم إشراق هذا الاسم لمخاطبة طفلك</p>
              </div>
              <input
                type="text"
                value={childName}
                onChange={e => setChildName(e.target.value)}
                placeholder="اسم الطفل"
                className="w-full px-6 py-4 rounded-2xl text-xl font-semibold outline-none mb-8"
                style={{
                  background: 'white',
                  border: '2px solid',
                  borderColor: childName ? '#A98FE0' : '#E8E2F5',
                  color: '#2D1F5E',
                  boxShadow: childName ? '0 0 0 4px rgba(169,143,224,0.15)' : 'none',
                  transition: 'all 0.2s',
                  direction: 'rtl',
                }}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
              />
            </>
          ) : (
            <>
              <div className="mb-8">
                <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
                  style={{ background: 'rgba(124,92,191,0.12)', color: '#7C5CBF' }}>
                  سؤال {stepIndex} من {totalSteps}
                </span>
                <h2 className="text-2xl font-black mb-2" style={{ color: '#2D1F5E' }}>{currentQuestion?.text}</h2>
              </div>
              <div className="space-y-4 mb-8">
                {currentQuestion?.options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className="w-full p-5 rounded-2xl text-right flex items-center gap-4 btn-press transition-all duration-200"
                    style={{
                      background: selected === opt.value ? 'linear-gradient(135deg, rgba(169,143,224,0.15), rgba(124,92,191,0.1))' : 'white',
                      border: `2px solid ${selected === opt.value ? '#A98FE0' : '#E8E2F5'}`,
                      boxShadow: selected === opt.value ? '0 4px 16px rgba(124,92,191,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    <OnboardIcon icon={opt.icon}/>
                    <span className="text-lg font-semibold" style={{ color: '#2D1F5E' }}>{opt.label}</span>
                    {selected === opt.value && (
                      <div className="mr-auto w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: '#A98FE0' }}>
                        <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6 L5 9 L10 3" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          <button
            onClick={handleNext}
            disabled={step === 'name' ? !childName.trim() : !selected}
            className="w-full py-5 rounded-2xl text-xl font-bold text-white transition-all duration-200"
            style={{
              background: (step === 'name' ? !childName.trim() : !selected)
                ? '#C9BDED'
                : 'linear-gradient(135deg, #A98FE0, #7C5CBF)',
              boxShadow: (step === 'name' ? !childName.trim() : !selected)
                ? 'none'
                : '0 8px 24px rgba(124,92,191,0.35)',
              cursor: (step === 'name' ? !childName.trim() : !selected) ? 'not-allowed' : 'pointer',
            }}
          >
            {step === 'q3' ? 'إنهاء الإعداد' : 'التالي →'}
          </button>
        </div>
      </div>
    </div>
  )
}
