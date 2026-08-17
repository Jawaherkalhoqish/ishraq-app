import { useState } from 'react'
import type { ScreenProps } from '../components/ScreenProps'

const SPECIALISTS = [
  { id: 1, name: 'د. سارة المنصور', spec: 'اضطرابات التعلم', exp: '١٢ سنة', rating: 4.9, available: true, times: ['٩:٠٠ ص', '١١:٠٠ ص', '٣:٠٠ م'], dates: ['الثلاثاء ١٤ يناير', 'الأربعاء ١٥ يناير'] },
  { id: 2, name: 'د. خالد العمري', spec: 'تعليم الرياضيات', exp: '٨ سنوات', rating: 4.8, available: true, times: ['١٠:٠٠ ص', '٢:٠٠ م', '٤:٠٠ م'], dates: ['الاثنين ١٣ يناير', 'الخميس ١٦ يناير'] },
  { id: 3, name: 'د. نورة الشهري', spec: 'صعوبات التركيز', exp: '١٠ سنوات', rating: 4.7, available: false, times: ['١١:٠٠ ص', '٤:٠٠ م'], dates: ['الأحد ١٩ يناير'] },
]

export default function Specialist({ state, navigate }: ScreenProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [bookingStep, setBookingStep] = useState<'list' | 'date' | 'time' | 'confirm' | 'done'>('list')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  const specialist = SPECIALISTS.find(s => s.id === selected)

  const handleBook = () => {
    if (!selected) return
    setBookingStep('date')
  }

  if (bookingStep === 'done') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center ishraq-bg-parent" style={{ direction: 'rtl' }}>
        <div className="animate-slide-up text-center p-10">
          <div className="w-28 h-28 mx-auto mb-6 rounded-full flex items-center justify-center text-5xl"
            style={{ background: 'rgba(168,230,168,0.2)', border: '2px solid rgba(168,230,168,0.4)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A8E6A8" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/></svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-3">تم تأكيد الحجز!</h2>
          <p className="text-lg font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            مع {specialist?.name}
          </p>
          <p className="text-base font-medium mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {selectedDate} • {selectedTime}
          </p>
          <button onClick={() => { setBookingStep('list'); setSelected(null) }}
            className="btn-press px-10 py-4 rounded-2xl text-lg font-black"
            style={{ background: 'rgba(169,143,224,0.3)', color: '#D0C0FF', border: '1.5px solid rgba(169,143,224,0.5)' }}>
            عودة
          </button>
        </div>
      </div>
    )
  }

  if (bookingStep === 'date' && specialist) {
    return (
      <div className="w-full h-full flex flex-col ishraq-bg-parent" style={{ direction: 'rtl' }}>
        <div className="flex items-center gap-3 px-6 pt-5 pb-4 flex-shrink-0">
          <button onClick={() => setBookingStep('list')} className="btn-press w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M12 3 L6 9 L12 15" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
          </button>
          <div>
            <h1 className="text-xl font-black text-white">اختر التاريخ</h1>
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{specialist.name}</p>
          </div>
        </div>
        <div className="flex-1 px-6 pb-6 flex flex-col gap-4">
          {specialist.dates.map(d => (
            <button key={d} onClick={() => { setSelectedDate(d); setBookingStep('time') }}
              className="btn-press p-5 rounded-2xl flex items-center gap-4"
              style={{
                background: selectedDate === d ? 'rgba(169,143,224,0.3)' : 'rgba(255,255,255,0.07)',
                border: `1.5px solid ${selectedDate === d ? 'rgba(169,143,224,0.6)' : 'rgba(255,255,255,0.12)'}`,
              }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.6"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span className="text-lg font-bold text-white">{d}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (bookingStep === 'time' && specialist) {
    return (
      <div className="w-full h-full flex flex-col ishraq-bg-parent" style={{ direction: 'rtl' }}>
        <div className="flex items-center gap-3 px-6 pt-5 pb-4 flex-shrink-0">
          <button onClick={() => setBookingStep('date')} className="btn-press w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M12 3 L6 9 L12 15" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
          </button>
          <div>
            <h1 className="text-xl font-black text-white">اختر الوقت</h1>
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{selectedDate}</p>
          </div>
        </div>
        <div className="flex-1 px-6 pb-6 grid grid-cols-3 gap-4 content-start">
          {specialist.times.map(t => (
            <button key={t} onClick={() => { setSelectedTime(t); setBookingStep('confirm') }}
              className="btn-press p-5 rounded-2xl text-center"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1.5px solid rgba(255,255,255,0.12)',
              }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.6" style={{ display: 'block', marginBottom: 8 }}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
              <span className="text-lg font-bold text-white">{t}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (bookingStep === 'confirm' && specialist) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center ishraq-bg-parent px-8" style={{ direction: 'rtl' }}>
        <div className="w-full max-w-md rounded-3xl p-8 animate-slide-up"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <h2 className="text-2xl font-black text-white mb-6 text-center">تأكيد الحجز</h2>
          {[
            { label: 'المختص', val: specialist.name },
            { label: 'التخصص', val: specialist.spec },
            { label: 'التاريخ', val: selectedDate },
            { label: 'الوقت', val: selectedTime },
          ].map(r => (
            <div key={r.label} className="flex justify-between py-3 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <span className="font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{r.label}</span>
              <span className="font-bold text-white">{r.val}</span>
            </div>
          ))}
          <div className="flex gap-4 mt-6">
            <button onClick={() => setBookingStep('list')}
              className="flex-1 btn-press py-4 rounded-2xl font-bold"
              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
              إلغاء
            </button>
            <button onClick={() => setBookingStep('done')}
              className="flex-1 btn-press py-4 rounded-2xl font-black"
              style={{ background: 'linear-gradient(135deg, #A98FE0, #7C5CBF)', color: 'white' }}>
              تأكيد الحجز
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col ishraq-bg-parent overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-5 pb-4 flex-shrink-0">
        <button onClick={() => navigate('parent-dashboard')} className="btn-press w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M12 3 L6 9 L12 15" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-black text-white">المختصون</h1>
          <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>تواصل مع مختص</p>
        </div>
      </div>

      <div className="flex-1 px-6 pb-5 ishraq-scroll space-y-4">
        {SPECIALISTS.map(s => (
          <div key={s.id}
            onClick={() => setSelected(selected === s.id ? null : s.id)}
            className="rounded-3xl p-5 cursor-pointer btn-press"
            style={{
              background: selected === s.id ? 'rgba(169,143,224,0.2)' : 'rgba(255,255,255,0.07)',
              border: `1.5px solid ${selected === s.id ? 'rgba(169,143,224,0.5)' : 'rgba(255,255,255,0.12)'}`,
            }}>
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: 'rgba(169,143,224,0.2)' }}>
                👨‍⚕️
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-black text-white text-lg">{s.name}</p>
                  {s.available ? (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: 'rgba(168,230,168,0.2)', color: '#A8E6A8' }}>متاح</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: 'rgba(255,180,180,0.2)', color: '#FFB0B0' }}>مشغول</span>
                  )}
                </div>
                <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.spec}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <svg width="12" height="12" viewBox="0 0 20 20"><path d="M10 1 L12.4 7.6 L19.5 7.6 L13.9 11.8 L16.2 18.5 L10 14.3 L3.8 18.5 L6.1 11.8 L0.5 7.6 L7.6 7.6 Z" fill="#F5C842"/></svg>
                    {s.rating}
                  </span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>خبرة: {s.exp}</span>
                </div>
              </div>
            </div>

            {selected === s.id && (
              <div className="mt-4 pt-4 animate-slide-up" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                  onClick={e => { e.stopPropagation(); s.available && handleBook() }}
                  disabled={!s.available}
                  className="w-full btn-press py-4 rounded-2xl text-base font-black"
                  style={{
                    background: s.available
                      ? 'linear-gradient(135deg, #A98FE0, #7C5CBF)'
                      : 'rgba(255,255,255,0.1)',
                    color: s.available ? 'white' : 'rgba(255,255,255,0.4)',
                    cursor: s.available ? 'pointer' : 'not-allowed',
                  }}>
                  {s.available ? 'حجز موعد' : 'غير متاح حالياً'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
