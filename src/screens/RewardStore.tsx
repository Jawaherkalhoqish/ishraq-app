import React, { useState, useEffect } from 'react'
import type { ScreenProps } from '../components/ScreenProps'
import { sounds, playSound } from '../sounds/sound'

const STORE_ITEMS = [
  { id: 'frame-gold', cat: 'ملابس', name: 'إطار ذهبي', icon: 'badge', cost: 8, desc: 'إطار ذهبي مميز للشخصية' },
  { id: 'cape-hero', cat: 'ملابس', name: 'عباءة البطل', icon: 'cape', cost: 12, desc: 'عباءة البطل الأسطورية' },
  { id: 'hat-wizard', cat: 'ملابس', name: 'قبعة الساحر', icon: 'hat', cost: 10, desc: 'قبعة السحر والخيال' },
  { id: 'crown-star', cat: 'إكسسوارات', name: 'تاج النجوم', icon: 'crown', cost: 20, desc: 'تاج مرصّع بالنجوم' },
  { id: 'wings-fairy', cat: 'إكسسوارات', name: 'أجنحة الجنية', icon: 'wings', cost: 15, desc: 'أجنحة خيالية ملونة' },
  { id: 'wand-magic', cat: 'إكسسوارات', name: 'العصا السحرية', icon: 'wand', cost: 7, desc: 'عصا سحرية لامعة' },
  { id: 'theme-ocean', cat: 'ألوان', name: 'ثيم المحيط', icon: 'sky', cost: 6, desc: 'تدرجات المحيط الهادئ' },
  { id: 'theme-galaxy', cat: 'ألوان', name: 'ثيم المجرة', icon: 'galaxy', cost: 10, desc: 'ألوان الكون اللامتناهي' },
  { id: 'pet-star', cat: 'خاصة', name: 'نجيم الحيوان الأليف', icon: 'star', cost: 25, desc: 'نجيم أليف خاص نادر' },
  { id: 'effect-glow', cat: 'خاصة', name: 'تأثير التوهج', icon: 'shine', cost: 18, desc: 'هالة توهج إشراق خاصة' },
]

function ItemIcon({ icon, size = 40 }: { icon: string; size?: number }) {
  const s = size
  const icons: Record<string, React.ReactElement> = {
    cape: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#A98FE0" strokeWidth="1.5"><path d="M12 3C9 3 6 5 5 8L3 20h18L19 8c-1-3-4-5-7-5z"/><path d="M9 3v6M15 3v6"/></svg>,
    hat: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#7C5CBF" strokeWidth="1.5"><ellipse cx="12" cy="17" rx="9" ry="3"/><path d="M7 17V10a5 5 0 0 1 10 0v7"/><path d="M5 15h14"/></svg>,
    badge: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="7" fill="rgba(245,200,66,0.2)" stroke="#F5C842" strokeWidth="1.5"/><path d="M12 7l1 3h3l-2.5 2 1 3L12 13.5 9.5 15l1-3L8 10h3z" fill="#F5C842"/><path d="M9 17l-1 4 4-2 4 2-1-4" fill="none" stroke="#C8900A" strokeWidth="1.5"/></svg>,
    crown: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 18h18l-3-10-4 6-2-8-2 8-4-6z" fill="rgba(245,200,66,0.3)" stroke="#F5C842" strokeWidth="1.5"/><rect x="3" y="18" width="18" height="3" rx="1" fill="#F5C842"/></svg>,
    wings: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 12C10 8 5 6 3 9s2 7 9 9" fill="rgba(169,143,224,0.3)" stroke="#A98FE0" strokeWidth="1.2"/><path d="M12 12C14 8 19 6 21 9s-2 7-9 9" fill="rgba(123,184,240,0.3)" stroke="#7BB8F0" strokeWidth="1.2"/></svg>,
    wand: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#F5C842" strokeWidth="1.5"><line x1="4" y1="20" x2="20" y2="4"/><path d="M20 4l-3 1 2 2 1-3z" fill="#F5C842"/><circle cx="5" cy="5" r="1.5" fill="#F5C842"/></svg>,
    sky: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="rgba(123,184,240,0.25)" stroke="#7BB8F0" strokeWidth="1.5"/><path d="M6 16c2-4 10-4 12 0" stroke="#7BB8F0" strokeWidth="1.2" fill="none"/></svg>,
    galaxy: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="rgba(124,92,191,0.2)" stroke="#7C5CBF" strokeWidth="1.5"/><ellipse cx="12" cy="12" rx="5" ry="2" fill="rgba(169,143,224,0.4)" stroke="#A98FE0" strokeWidth="1"/><circle cx="12" cy="12" r="2" fill="#7C5CBF"/></svg>,
    star: <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 2l2.9 8.9H23l-7.5 5.4 2.9 8.9L12 20.1l-7.4 5.1 2.9-8.9L0 10.9h8.1z" fill="#F5C842"/></svg>,
    shine: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" fill="rgba(245,200,66,0.4)" stroke="#F5C842" strokeWidth="1.5"/><line x1="12" y1="2" x2="12" y2="5" stroke="#F5C842" strokeWidth="1.5"/><line x1="12" y1="19" x2="12" y2="22" stroke="#F5C842" strokeWidth="1.5"/><line x1="2" y1="12" x2="5" y2="12" stroke="#F5C842" strokeWidth="1.5"/><line x1="19" y1="12" x2="22" y2="12" stroke="#F5C842" strokeWidth="1.5"/></svg>,
  }
  return icons[icon] ?? <svg width={s} height={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="rgba(169,143,224,0.3)" stroke="#A98FE0" strokeWidth="1.5"/></svg>
}

const CATS = ['الكل', 'ملابس', 'إكسسوارات', 'ألوان', 'خاصة'] as const

function StarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <path d="M10 1 L12.4 7.6 L19.5 7.6 L13.9 11.8 L16.2 18.5 L10 14.3 L3.8 18.5 L6.1 11.8 L0.5 7.6 L7.6 7.6 Z"
        fill="#F5C842" stroke="#E5A800" strokeWidth="0.5" />
    </svg>
  )
}

export default function RewardStore({ state, navigate, addStars }: ScreenProps) {
  const [cat, setCat] = useState<typeof CATS[number]>('الكل')
  const [purchased, setPurchased] = useState<Set<string>>(new Set())
  const [justBought, setJustBought] = useState<string | null>(null)

  useEffect(() => {
  playSound(sounds.storeOpen)
}, [])
  
  const filtered = cat === 'الكل' ? STORE_ITEMS : STORE_ITEMS.filter(i => i.cat === cat)

  const handleBuy = (item: typeof STORE_ITEMS[0]) => {
    if (purchased.has(item.id) || state.stars < item.cost) return
    addStars(-item.cost)
    playSound(sounds.purchaseItem)
    setPurchased(p => new Set([...p, item.id]))
    setJustBought(item.id)
    setTimeout(() => setJustBought(null), 2000)
  }

  return (
    <div className="w-full h-full flex flex-col ishraq-bg-main overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('child-home')} className="btn-press w-10 h-10 rounded-xl flex items-center justify-center bg-white card-shadow">
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M12 3 L6 9 L12 15" stroke="#7C5CBF" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
          </button>
          <div>
            <h1 className="text-2xl font-black" style={{ color: '#2D1F5E' }}>متجر النجوم </h1>
            <p className="text-sm font-medium" style={{ color: '#8878B0' }}>استبدل نجومك بجوائز رائعة</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl"
          style={{ background: 'rgba(245,200,66,0.15)', border: '2px solid rgba(245,200,66,0.4)' }}>
          <StarIcon size={20} />
          <span className="font-black text-xl" style={{ color: '#C8900A' }}>{state.stars} نجمة</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 px-6 pb-4 flex-shrink-0 flex-wrap">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className="btn-press px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200"
            style={{
              background: cat === c ? 'linear-gradient(135deg, #A98FE0, #7C5CBF)' : 'white',
              color: cat === c ? 'white' : '#7C5CBF',
              border: `1.5px solid ${cat === c ? 'transparent' : 'rgba(169,143,224,0.3)'}`,
              boxShadow: cat === c ? '0 4px 16px rgba(124,92,191,0.3)' : '0 2px 8px rgba(124,92,191,0.06)',
            }}>
            {c}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="flex-1 px-6 pb-5 ishraq-scroll">
        <div className="grid grid-cols-4 gap-4">
          {filtered.map(item => {
            const canAfford = state.stars >= item.cost
            const owned = purchased.has(item.id)
            const isNew = justBought === item.id

            return (
              <div key={item.id}
                className={`rounded-2xl p-4 flex flex-col gap-3 card-shadow ${isNew ? 'animate-celebrate' : ''}`}
                style={{
                  background: owned
                    ? 'linear-gradient(135deg, rgba(168,232,168,0.2), rgba(100,200,100,0.1))'
                    : canAfford ? 'white' : 'rgba(240,235,255,0.6)',
                  border: owned
                    ? '2px solid rgba(100,200,100,0.5)'
                    : `1.5px solid ${canAfford ? 'rgba(169,143,224,0.25)' : 'rgba(169,143,224,0.15)'}`,
                }}>
                {/* Icon */}
                <div className="w-full h-20 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(169,143,224,0.08)' }}>
                  <ItemIcon icon={item.icon} size={44}/>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-sm" style={{ color: '#2D1F5E' }}>{item.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(169,143,224,0.15)', color: '#7C5CBF' }}>
                      {item.cat}
                    </span>
                  </div>
                  <p className="text-xs font-medium" style={{ color: '#8878B0' }}>{item.desc}</p>
                </div>

                {/* Price + Buy */}
                <div className="flex items-center justify-between">
                  {!owned && (
                    <div className="flex items-center gap-1">
                      <StarIcon size={14} />
                      <span className="text-sm font-black" style={{ color: canAfford ? '#C8900A' : '#B0A0CC' }}>
                        {item.cost}
                      </span>
                    </div>
                  )}
                  {owned ? (
                    <div className="w-full text-center py-2 rounded-xl text-sm font-bold"
                      style={{ background: 'rgba(100,200,100,0.2)', color: '#2D7A2D' }}>
                      {isNew ? 'تم الشراء!' : 'مملوك'}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className="flex-1 ml-2 btn-press py-2 rounded-xl text-sm font-bold transition-all"
                      style={{
                        background: canAfford
                          ? 'linear-gradient(135deg, #A98FE0, #7C5CBF)'
                          : 'rgba(200,190,220,0.4)',
                        color: canAfford ? 'white' : '#B0A0CC',
                        cursor: canAfford ? 'pointer' : 'not-allowed',
                      }}>
                      {canAfford ? 'شراء' : 'غير كافٍ'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
