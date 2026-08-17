import { useState } from 'react'
import type { ScreenProps } from '../components/ScreenProps'
import CharacterComponent from '../components/Character'
import { IcCart, IcBallon, IcNumbers } from '../components/Icons'
import IshraqLogo from '../components/IshraqLogo'

function GameIcon({ icon, size = 22, color }: { icon: string; size?: number; color?: string }) {
  if (icon === 'cart') return <IcCart size={size} color={color}/>
  if (icon === 'balloon') return <IcBallon size={size} color={color}/>
  if (icon === 'numbers') return <IcNumbers size={size} color={color}/>
  return null
}

type ParentTab = 'overview' | 'activity' | 'recommendations'

function StarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <path d="M10 1 L12.4 7.6 L19.5 7.6 L13.9 11.8 L16.2 18.5 L10 14.3 L3.8 18.5 L6.1 11.8 L0.5 7.6 L7.6 7.6 Z"
        fill="#F5C842" stroke="#E5A800" strokeWidth="0.5" />
    </svg>
  )
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium w-20 text-right" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
      <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
        <div className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <span className="text-sm font-bold w-8 text-center" style={{ color }}>{value}</span>
    </div>
  )
}

export default function ParentDashboard({ state, navigate }: ScreenProps) {
  const [tab, setTab] = useState<ParentTab>('overview')
  const character = state.character ?? 'mushriq'
  const charName = state.character === 'mushriq' ? 'مشرق' : 'مشرقة'
  const childName = state.parentProfile?.childName || 'الطفل'
  const { store, balloons, numberline } = state.gameStats

  const navItems = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'activity', label: 'النشاط' },
    { id: 'recommendations', label: 'التوصيات' },
  ] as const

  const parentNav = [
    { id: 'parent-dashboard', label: 'الرئيسية', icon: 'home' },
    { id: 'notifications', label: 'الإشعارات', icon: 'bell', badge: state.notifications.filter(n => !n.read).length },
    { id: 'specialist', label: 'المختصون', icon: 'specialist' },
    { id: 'settings', label: 'الإعدادات', icon: 'settings' },
  ] as const

  function ParentNavIcon({ icon, color }: { icon: string; color: string }) {
    const s = 20
    if (icon === 'home') return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M3 12L12 3l9 9"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>
    if (icon === 'bell') return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
    if (icon === 'specialist') return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/><path d="M10 14h4M12 12v4"/></svg>
    if (icon === 'settings') return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    return null
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden ishraq-bg-parent" style={{ direction: 'rtl' }}>
      {/* Top header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IshraqLogo size={40} style={{ filter: 'drop-shadow(0 0 8px rgba(200,180,255,0.5))' }}/>
          <div>
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>لوحة الأهل</p>
            <h1 className="text-2xl font-black text-white">إشراق</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('notifications')} className="relative btn-press w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {state.notifications.some(n => !n.read) && (
              <div className="absolute -top-1 -right-1 notif-badge">
                {state.notifications.filter(n => !n.read).length}
              </div>
            )}
          </button>
          <button onClick={() => navigate('child-home')}
            className="btn-press px-4 py-2 rounded-xl text-sm font-bold"
            style={{ background: 'rgba(169,143,224,0.3)', color: '#D0C0FF', border: '1px solid rgba(169,143,224,0.4)' }}>
            وضع الطفل
          </button>
        </div>
      </div>

      {/* Child profile card */}
      <div className="flex-shrink-0 mx-6 mb-4 rounded-3xl p-5 flex items-center gap-5"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-purple-300/30">
          <CharacterComponent character={character} state="idle" width={56} shadow={false} className="w-full h-full" style={{ objectFit: "contain" }}/>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-black text-white">{childName}</h2>
          <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>رفيقه: {charName}</p>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-center">
            <div className="flex items-center gap-1.5 justify-center">
              <StarIcon size={18} />
              <span className="text-2xl font-black text-white">{state.stars}</span>
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>نجمة</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-white">{state.achievements.filter(a => a.unlocked).length}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>إنجاز</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-white">
              {store.attempts + balloons.attempts + numberline.attempts}
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>جولة</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 flex gap-2 px-6 mb-4">
        {navItems.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)}
            className="btn-press px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
            style={{
              background: tab === n.id ? 'rgba(169,143,224,0.35)' : 'rgba(255,255,255,0.07)',
              color: tab === n.id ? '#D0C0FF' : 'rgba(255,255,255,0.5)',
              border: `1px solid ${tab === n.id ? 'rgba(169,143,224,0.5)' : 'rgba(255,255,255,0.1)'}`,
            }}>
            {n.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-4 ishraq-scroll">
        {tab === 'overview' && (
          <div className="space-y-4">
            {/* Skill bars */}
            <div className="rounded-3xl p-5"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <h3 className="text-base font-bold text-white mb-4">مستوى المهارات</h3>
              <div className="space-y-4">
                <MiniBar label="الجمع" value={store.correct} max={Math.max(store.attempts, 1)} color="#FF9E6D" />
                <MiniBar label="الطرح" value={balloons.correct} max={Math.max(balloons.attempts, 1)} color="#7BB8F0" />
                <MiniBar label="العد" value={numberline.correct} max={Math.max(numberline.attempts, 1)} color="#A98FE0" />
              </div>
            </div>

            {/* Game stats grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'متجر مشرق', icon: 'cart', stats: store, color: '#FF9E6D' },
                { name: 'بالونات مشرق', icon: 'balloon', stats: balloons, color: '#7BB8F0' },
                { name: 'خط الأعداد', icon: 'numbers', stats: numberline, color: '#A98FE0' },
              ].map(g => (
                <div key={g.name} className="rounded-2xl p-4"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div className="mb-3"><GameIcon icon={g.icon} size={30} color={g.color}/></div>
                  <p className="text-sm font-bold text-white mb-3">{g.name}</p>
                  <div className="space-y-2">
                    {[
                      { label: 'صحيحة', val: g.stats.correct },
                      { label: 'خطأ', val: g.stats.incorrect },
                      { label: 'المستوى', val: g.stats.level },
                    ].map(s => (
                      <div key={s.label} className="flex justify-between">
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</span>
                        <span className="text-xs font-black" style={{ color: g.color }}>{s.val}</span>
                      </div>
                    ))}
                    <div className="flex justify-between">
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>الدقة</span>
                      <span className="text-xs font-black" style={{ color: g.color }}>
                        {g.stats.attempts > 0 ? Math.round((g.stats.correct / g.stats.attempts) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Smart break usage */}
            <div className="rounded-2xl p-4 flex items-center gap-4"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <span className="text-3xl"></span>
              <div>
                <p className="text-sm font-bold text-white">استراحات إشراق الذكية</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {store.smartBreaks + balloons.smartBreaks + numberline.smartBreaks} استراحة استُخدمت هذا الأسبوع
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === 'activity' && (
          <div className="space-y-3">
            {[
              { game: 'متجر مشرق', icon: 'cart', date: 'اليوم ١٠:٣٠', correct: store.correct, total: store.attempts, stars: 5, level: store.level, dur: '٨ دقائق' },
              { game: 'خط الأعداد', icon: 'numbers', date: 'اليوم ٩:٤٥', correct: numberline.correct, total: numberline.attempts, stars: 5, level: numberline.level, dur: '٧ دقائق' },
              { game: 'بالونات مشرق', icon: 'balloon', date: 'أمس ١٦:٢٠', correct: balloons.correct, total: balloons.attempts, stars: 4, level: balloons.level, dur: '٦ دقائق' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <GameIcon icon={s.icon} size={28}/>
                  <div className="flex-1">
                    <p className="font-bold text-white">{s.game}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.date} • {s.dur}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarIcon size={14} />
                    <span className="text-sm font-black text-white">{s.stars}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'الإجابات الصحيحة', val: `${s.correct}/${s.total}`, color: '#A8E6CF' },
                    { label: 'الدقة', val: `${s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0}%`, color: '#FFD93D' },
                    { label: 'المستوى', val: `م${s.level}`, color: '#A98FE0' },
                  ].map(m => (
                    <div key={m.label} className="rounded-xl p-3 text-center"
                      style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <p className="text-lg font-black" style={{ color: m.color }}>{m.val}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'recommendations' && (
          <div className="space-y-4">
            {[
              {
                icon: 'check',
                title: 'تقدم جيد في الجمع',
                body: 'يظهر الطفل تقدمًا ملحوظًا في مهارة الجمع. يُنصح بالاستمرار في متجر مشرق للانتقال للمستوى الثاني.',
                color: '#A8E6CF',
                bg: 'rgba(168,230,168,0.1)',
                border: 'rgba(168,230,168,0.3)',
              },
              {
                icon: 'bulb',
                title: 'دعم بصري في الطرح',
                body: 'يحتاج الطفل إلى مزيد من الدعم البصري في الطرح. يُنصح بالتمرين مع بالونات مشرق يومياً لمدة ١٠ دقائق.',
                color: '#FFD93D',
                bg: 'rgba(255,217,61,0.1)',
                border: 'rgba(255,217,61,0.3)',
              },
              {
                icon: 'target',
                title: 'تطوير مهارة العد',
                body: 'أداء ممتاز في خط الأعداد! يُنصح بمواصلة هذا النشاط لتعزيز الأساس العددي قبل الانتقال للضرب.',
                color: '#A98FE0',
                bg: 'rgba(169,143,224,0.1)',
                border: 'rgba(169,143,224,0.3)',
              },
              {
                icon: 'specialist',
                title: 'استشارة متخصص',
                body: 'إذا لاحظتم صعوبة مستمرة في مهارة معينة، يمكن حجز جلسة مع أحد المتخصصين للحصول على دعم إضافي.',
                color: '#7BB8F0',
                bg: 'rgba(123,184,240,0.1)',
                border: 'rgba(123,184,240,0.3)',
                action: true,
              },
            ].map((r, i) => (
              <div key={i} className="rounded-2xl p-5"
                style={{ background: r.bg, border: `1.5px solid ${r.border}` }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {r.icon === 'check' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/></svg>}
                    {r.icon === 'bulb' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="1.8"><path d="M9 18h6M10 21h4M12 2a7 7 0 0 1 7 7c0 3-2 5-3 6H8c-1-1-3-3-3-6a7 7 0 0 1 7-7z"/></svg>}
                    {r.icon === 'target' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill={r.color}/></svg>}
                    {r.icon === 'specialist' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/><path d="M10 14h4M12 12v4"/></svg>}
                  </div>
                  <div className="flex-1">
                    <p className="font-black mb-2" style={{ color: r.color }}>{r.title}</p>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{r.body}</p>
                    {r.action && (
                      <button onClick={() => navigate('specialist')}
                        className="mt-3 btn-press px-4 py-2 rounded-xl text-sm font-bold"
                        style={{ background: r.color, color: '#1A2A4A' }}>
                        حجز موعد مع مختص
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Parent nav */}
      <div className="flex-shrink-0 px-6 pb-4">
        <div className="flex rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
          {parentNav.map(item => (
            <button key={item.id}
              onClick={() => navigate(item.id as any)}
              className="flex-1 flex flex-col items-center py-3 gap-1 btn-press relative"
              style={{ background: item.id === 'parent-dashboard' ? 'rgba(169,143,224,0.2)' : 'transparent' }}>
              <ParentNavIcon icon={item.icon} color={item.id === 'parent-dashboard' ? '#D0C0FF' : 'rgba(255,255,255,0.4)'}/>
              <span className="text-xs font-bold"
                style={{ color: item.id === 'parent-dashboard' ? '#D0C0FF' : 'rgba(255,255,255,0.4)' }}>
                {item.label}
              </span>
              {'badge' in item && (item as any).badge > 0 && (
                <div className="absolute top-1 right-[calc(50%-8px)] notif-badge" style={{ fontSize: 9, minWidth: 16, height: 16 }}>
                  {(item as any).badge}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
