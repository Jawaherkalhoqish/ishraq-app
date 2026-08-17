import React, { useState } from 'react'
import type { ScreenProps } from '../components/ScreenProps'
import CharacterComponent from '../components/Character'

const CATEGORIES = ['الملابس', 'الإكسسوارات', 'الألوان'] as const
type Category = typeof CATEGORIES[number]

const ITEMS: Record<Category, Array<{ id: string; name: string; icon: string; cost: number; desc: string }>> = {
  'الملابس': [
    { id: 'cape-purple', name: 'عباءة بنفسجية', icon: 'cape', cost: 5, desc: 'عباءة ساحرة بنفسجية' },
    { id: 'hat-star', name: 'قبعة النجوم', icon: 'hat', cost: 8, desc: 'قبعة مزينة بالنجوم' },
    { id: 'cape-golden', name: 'عباءة ذهبية', icon: 'star', cost: 12, desc: 'عباءة ذهبية لامعة' },
    { id: 'suit-rainbow', name: 'بدلة قوس قزح', icon: 'rainbow', cost: 15, desc: 'بدلة ملونة مبهجة' },
  ],
  'الإكسسوارات': [
    { id: 'wand', name: 'عصا سحرية', icon: 'wand', cost: 6, desc: 'عصا سحرية لامعة' },
    { id: 'badge-gold', name: 'شارة ذهبية', icon: 'badge', cost: 4, desc: 'شارة ذهبية للبطل' },
    { id: 'wings', name: 'أجنحة ملاك', icon: 'wings', cost: 10, desc: 'أجنحة خيالية جميلة' },
    { id: 'crown', name: 'تاج ملكي', icon: 'crown', cost: 20, desc: 'تاج ملكي فاخر' },
  ],
  'الألوان': [
    { id: 'color-sky', name: 'لون سماوي', icon: 'sky', cost: 3, desc: 'تدرج أزرق سماوي' },
    { id: 'color-sunset', name: 'لون غروب', icon: 'sunset', cost: 3, desc: 'تدرج برتقالي دافئ' },
    { id: 'color-galaxy', name: 'لون مجرة', icon: 'galaxy', cost: 5, desc: 'تدرج أرجواني كوني' },
    { id: 'color-rainbow', name: 'قوس قزح', icon: 'rainbow', cost: 8, desc: 'ألوان قوس قزح كاملة' },
  ],
}

function ItemIcon({ icon, size = 32 }: { icon: string; size?: number }) {
  const s = size
  const icons: Record<string, React.ReactElement> = {
    cape: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#A98FE0" strokeWidth="1.5"><path d="M12 3C9 3 6 5 5 8L3 20h18L19 8c-1-3-4-5-7-5z"/><path d="M9 3v6M15 3v6"/></svg>,
    hat: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#7C5CBF" strokeWidth="1.5"><ellipse cx="12" cy="17" rx="9" ry="3"/><path d="M7 17V10a5 5 0 0 1 10 0v7"/><path d="M5 15h14"/></svg>,
    star: <svg width={s} height={s} viewBox="0 0 24 24"><path d="M12 2l2.9 8.9H23l-7.5 5.4 2.9 8.9L12 20.1l-7.4 5.1 2.9-8.9L0 10.9h8.1z" fill="#F5C842"/></svg>,
    rainbow: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 17a9 9 0 0 1 18 0" stroke="#FF6B8A" strokeWidth="2"/><path d="M5 17a7 7 0 0 1 14 0" stroke="#F5C842" strokeWidth="2"/><path d="M7 17a5 5 0 0 1 10 0" stroke="#7BB8F0" strokeWidth="2"/><path d="M9 17a3 3 0 0 1 6 0" stroke="#A98FE0" strokeWidth="2"/></svg>,
    wand: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#F5C842" strokeWidth="1.5"><line x1="4" y1="20" x2="20" y2="4"/><path d="M20 4l-3 1 2 2 1-3z" fill="#F5C842"/><circle cx="5" cy="5" r="1.5" fill="#F5C842"/><circle cx="19" cy="19" r="1" fill="#F5C842"/></svg>,
    badge: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="7" fill="rgba(245,200,66,0.2)" stroke="#F5C842" strokeWidth="1.5"/><path d="M12 7l1 3h3l-2.5 2 1 3L12 13.5 9.5 15l1-3L8 10h3z" fill="#F5C842"/><path d="M9 17l-1 4 4-2 4 2-1-4" fill="none" stroke="#C8900A" strokeWidth="1.5"/></svg>,
    wings: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 12C10 8 5 6 3 9s2 7 9 9" fill="rgba(169,143,224,0.3)" stroke="#A98FE0" strokeWidth="1.2"/><path d="M12 12C14 8 19 6 21 9s-2 7-9 9" fill="rgba(123,184,240,0.3)" stroke="#7BB8F0" strokeWidth="1.2"/></svg>,
    crown: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 18h18l-3-10-4 6-2-8-2 8-4-6z" fill="rgba(245,200,66,0.3)" stroke="#F5C842" strokeWidth="1.5"/><rect x="3" y="18" width="18" height="3" rx="1" fill="#F5C842"/></svg>,
    sky: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="rgba(123,184,240,0.25)" stroke="#7BB8F0" strokeWidth="1.5"/><path d="M6 16c2-4 10-4 12 0" stroke="#7BB8F0" strokeWidth="1.2" fill="none"/><circle cx="9" cy="9" r="2" fill="#7BB8F0" opacity="0.6"/></svg>,
    sunset: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="rgba(255,158,109,0.2)" stroke="#FF9E6D" strokeWidth="1.5"/><path d="M4 15h16M8 15a4 4 0 0 1 8 0" fill="rgba(255,158,109,0.3)" stroke="#FF9E6D" strokeWidth="1.2"/></svg>,
    galaxy: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="rgba(124,92,191,0.2)" stroke="#7C5CBF" strokeWidth="1.5"/><ellipse cx="12" cy="12" rx="5" ry="2" fill="rgba(169,143,224,0.4)" stroke="#A98FE0" strokeWidth="1"/><circle cx="12" cy="12" r="2" fill="#7C5CBF"/></svg>,
    shine: <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" fill="rgba(245,200,66,0.4)" stroke="#F5C842" strokeWidth="1.5"/>{[0,45,90,135].map(a=><line key={a} x1="12" y1="12" x2={12+Math.cos(a*Math.PI/180)*10} y2={12+Math.sin(a*Math.PI/180)*10} stroke="#F5C842" strokeWidth="1.5" transform={`rotate(${a} 12 12)`}/>)}</svg>,
  }
  return icons[icon] ?? <svg width={s} height={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="rgba(169,143,224,0.3)" stroke="#A98FE0" strokeWidth="1.5"/></svg>
}

function StarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <path d="M10 1 L12.4 7.6 L19.5 7.6 L13.9 11.8 L16.2 18.5 L10 14.3 L3.8 18.5 L6.1 11.8 L0.5 7.6 L7.6 7.6 Z"
        fill="#F5C842" stroke="#E5A800" strokeWidth="0.5" />
    </svg>
  )
}

export default function Wardrobe({ state, navigate, toggleEquip }: ScreenProps) {
  const [category, setCategory] = useState<Category>('الملابس')
  const character = state.character ?? 'mushriq'
  const charName = state.character === 'mushriq' ? 'مشرق' : 'مشرقة'

  const equipped = state.equippedItems
  const items = ITEMS[category]

  return (
    <div className="w-full h-full flex flex-col ishraq-bg-main overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('child-home')} className="btn-press w-10 h-10 rounded-xl flex items-center justify-center bg-white card-shadow">
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M12 3 L6 9 L12 15" stroke="#7C5CBF" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
          </button>
          <div>
            <h1 className="text-2xl font-black" style={{ color: '#2D1F5E' }}>شخصيتي </h1>
            <p className="text-sm font-medium" style={{ color: '#8878B0' }}>خصّص مظهر {charName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white card-shadow">
          <StarIcon size={18} />
          <span className="font-black text-lg" style={{ color: '#C8900A' }}>{state.stars}</span>
        </div>
      </div>

      <div className="flex-1 flex gap-5 px-6 pb-5 min-h-0">
        {/* Character preview */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-4">
          <div className="flex-1 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden card-shadow"
            style={{
              background: 'linear-gradient(160deg, rgba(200,185,255,0.4), rgba(169,143,224,0.2))',
              border: '1.5px solid rgba(169,143,224,0.3)',
            }}>
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(169,143,224,0.2) 0%, transparent 70%)' }} />

            {/* Equipped items display */}
            <div className="absolute top-4 right-4 left-4 flex flex-wrap gap-1.5 justify-center">
              {equipped.map(id => {
                const item = Object.values(ITEMS).flat().find(i => i.id === id)
                return item ? (
                  <span key={id} className="px-2 py-1 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.7)' }}>
                    <ItemIcon icon={item.icon} size={20}/>
                  </span>
                ) : null
              })}
            </div>

            {/* Sparkles */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute" style={{ left: `${15 + i * 17}%`, top: `${25 + i * 8}%`, animation: `sparkle ${2 + i * 0.4}s ease-in-out infinite ${i * 0.3}s` }}>
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <path d="M4 0 L4.8 3.2 L8 4 L4.8 4.8 L4 8 L3.2 4.8 L0 4 L3.2 3.2 Z" fill="#F5C842" opacity="0.7" />
                </svg>
              </div>
            ))}

            <CharacterComponent character={character} state="idle" width={200} shadow={true}/>
            <p className="text-xl font-black relative z-10 mt-2" style={{ color: '#7C5CBF' }}>{charName}</p>

            {equipped.length > 0 && (
              <button
                onClick={() => equipped.forEach(id => toggleEquip(id))}
                className="mt-3 px-4 py-2 rounded-xl text-sm font-bold relative z-10"
                style={{ background: 'rgba(255,80,100,0.1)', color: '#FF5064', border: '1px solid rgba(255,80,100,0.3)' }}
              >
                إزالة الكل
              </button>
            )}
          </div>

          {/* Store link */}
          <button onClick={() => navigate('reward-store')}
            className="btn-press py-4 rounded-2xl text-lg font-black text-white"
            style={{ background: 'linear-gradient(135deg, #A98FE0, #7C5CBF)', boxShadow: '0 6px 20px rgba(124,92,191,0.35)' }}>
             اشترِ المزيد
          </button>
        </div>

        {/* Item selection */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Category tabs */}
          <div className="flex gap-3 flex-shrink-0">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className="btn-press px-5 py-3 rounded-2xl text-base font-bold transition-all duration-200"
                style={{
                  background: category === cat ? 'linear-gradient(135deg, #A98FE0, #7C5CBF)' : 'white',
                  color: category === cat ? 'white' : '#7C5CBF',
                  border: `1.5px solid ${category === cat ? 'transparent' : 'rgba(169,143,224,0.3)'}`,
                  boxShadow: category === cat ? '0 6px 20px rgba(124,92,191,0.3)' : '0 2px 8px rgba(124,92,191,0.08)',
                }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="flex-1 grid grid-cols-2 gap-4 ishraq-scroll">
            {items.map(item => {
              const isEquipped = equipped.includes(item.id)
              const canAfford = state.stars >= item.cost
              const isOwned = state.stars >= item.cost || isEquipped

              return (
                <div key={item.id}
                  className="rounded-2xl p-4 flex flex-col gap-3 card-shadow"
                  style={{
                    background: isEquipped
                      ? 'linear-gradient(135deg, rgba(169,143,224,0.2), rgba(124,92,191,0.1))'
                      : 'white',
                    border: isEquipped
                      ? '2px solid #A98FE0'
                      : '1.5px solid rgba(169,143,224,0.2)',
                  }}>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgba(169,143,224,0.1)' }}>
                      <ItemIcon icon={item.icon} size={30}/>
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-base" style={{ color: '#2D1F5E' }}>{item.name}</p>
                      <p className="text-xs font-medium" style={{ color: '#8878B0' }}>{item.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <StarIcon size={14} />
                      <span className="text-sm font-black" style={{ color: '#C8900A' }}>{item.cost}</span>
                    </div>

                    {isEquipped ? (
                      <button onClick={() => toggleEquip(item.id)}
                        className="btn-press px-4 py-2 rounded-xl text-sm font-bold"
                        style={{ background: '#A98FE0', color: 'white' }}>
                        مرتدى
                      </button>
                    ) : (
                      <button
                        onClick={() => canAfford ? toggleEquip(item.id) : undefined}
                        disabled={!canAfford}
                        className="btn-press px-4 py-2 rounded-xl text-sm font-bold transition-all"
                        style={{
                          background: canAfford ? 'linear-gradient(135deg, #A98FE0, #7C5CBF)' : 'rgba(200,190,220,0.4)',
                          color: canAfford ? 'white' : '#B0A0CC',
                          cursor: canAfford ? 'pointer' : 'not-allowed',
                        }}>
                        {canAfford ? 'ارتدِ' : `${item.cost} نجمة`}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
