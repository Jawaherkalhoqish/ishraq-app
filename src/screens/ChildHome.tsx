import { useState } from 'react'
import type { ScreenProps } from '../components/ScreenProps'
import Character from '../components/Character'
import { IcHome, IcGamepad, IcStore, IcHanger, IcChart, IcBell, IcStar, IcTrophy, IcBreath, IcCart, IcBallon, IcNumbers, IcSparkle } from '../components/Icons'

export default function ChildHome({ state, navigate }: ScreenProps) {
  const [charAnim, setCharAnim] = useState(false)
  const character = state.character ?? 'mushriq'
  const charName = character === 'mushriq' ? 'مشرق' : 'مشرقة'
  const childName = state.parentProfile?.childName || 'صديقي'
  const unread = state.notifications.filter(n => !n.read).length

  const games = [
    {
      id: 'game-store',
      nameAr: 'متجر مشرق',
      descAr: 'تعلّم الجمع بالتسوق',
      Icon: IcCart,
      accent: '#FF9E6D',
      bg: 'linear-gradient(145deg, #FFF3E8 0%, #FFE6CC 100%)',
      border: 'rgba(255,158,109,0.4)',
      glow: 'rgba(255,120,60,0.15)',
      level: state.gameStats.store.level,
    },
    {
      id: 'game-balloons',
      nameAr: 'بالونات مشرق',
      descAr: 'تعلّم الطرح باللعب',
      Icon: IcBallon,
      accent: '#7BB8F0',
      bg: 'linear-gradient(145deg, #EBF5FF 0%, #D5E8FF 100%)',
      border: 'rgba(123,184,240,0.4)',
      glow: 'rgba(70,140,220,0.12)',
      level: state.gameStats.balloons.level,
    },
    {
      id: 'game-numberline',
      nameAr: 'خط الأعداد',
      descAr: 'تعلّم العد بالقفز',
      Icon: IcNumbers,
      accent: '#A98FE0',
      bg: 'linear-gradient(145deg, #EEE6FF 0%, #E0D8FF 100%)',
      border: 'rgba(169,143,224,0.4)',
      glow: 'rgba(124,92,191,0.12)',
      level: state.gameStats.numberline.level,
    },
  ] as const

  const navItems = [
    { id: 'child-home', label: 'الرئيسية', Icon: IcHome },
    { id: 'game-select', label: 'الألعاب', Icon: IcGamepad },
    { id: 'reward-store', label: 'المتجر', Icon: IcStore },
    { id: 'wardrobe', label: 'شخصيتي', Icon: IcHanger },
    { id: 'progress', label: 'تقدمي', Icon: IcChart },
  ] as const

  const starProgress = Math.min((state.stars / 50) * 100, 100)

  return (
    <div className="w-full h-full flex flex-col ishraq-bg-main overflow-hidden" style={{ direction: 'rtl' }}>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-8 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-end justify-center overflow-visible">
            <Character character={character} state="idle" width={48} shadow={false}/>
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: '#A898D0' }}>مرحباً</p>
            <p className="text-xl font-black" style={{ color: '#2D1F5E' }}>{childName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Stars badge */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
            style={{ background: 'rgba(245,200,66,0.14)', border: '1.5px solid rgba(245,200,66,0.4)' }}>
            <IcStar size={20}/>
            <span className="text-lg font-black" style={{ color: '#B87800' }}>{state.stars}</span>
          </div>

          {/* Notifications */}
          <button onClick={() => navigate('notifications')}
            className="relative btn-press w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'white', boxShadow: '0 4px 14px rgba(124,92,191,0.12)' }}>
            <IcBell size={20} color="#7C5CBF"/>
            {unread > 0 && (
              <div className="absolute -top-1 -right-1 notif-badge">{unread}</div>
            )}
          </button>

          {/* Parent dashboard */}
          <button onClick={() => navigate(state.parentPin ? 'parent-pin-entry' : 'parent-dashboard')}
            className="btn-press px-4 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: 'rgba(124,92,191,0.1)', color: '#7C5CBF', border: '1.5px solid rgba(124,92,191,0.2)' }}>
            لوحة الأهل
          </button>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="flex-1 flex gap-6 px-8 pb-4 min-h-0">

        {/* Character panel */}
        <div className="w-68 flex-shrink-0 flex flex-col" style={{ width: 268 }}>
          <div className="flex-1 rounded-3xl relative card-shadow flex flex-col items-center justify-between py-5"
            style={{
              background: 'linear-gradient(155deg, rgba(210,195,255,0.45) 0%, rgba(169,143,224,0.18) 100%)',
              border: '1.5px solid rgba(169,143,224,0.28)',
            }}>
            {/* Ambient sparkles */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute pointer-events-none"
                style={{ left: `${12+i*14}%`, top: `${10+i*7}%`, animation: `sparkle ${1.8+i*0.35}s ease-in-out ${i*0.28}s infinite` }}>
                <IcSparkle size={i%2===0?10:7} color={['#F5C842','#A98FE0','#7BB8F0'][i%3]}/>
              </div>
            ))}

            {/* Speech bubble */}
            <div className="w-full px-4 z-10">
              <div className="px-4 py-3 rounded-2xl text-center"
                style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(169,143,224,0.25)' }}>
                <p className="text-sm font-bold leading-relaxed" style={{ color: '#2D1F5E' }}>
                  أهلاً {childName}! جاهز نبدأ؟
                </p>
              </div>
            </div>

            {/* Character — transparent, no container */}
            <div className="relative z-10 cursor-pointer flex justify-center"
              onClick={() => { setCharAnim(true); setTimeout(() => setCharAnim(false), 800) }}>
              <Character character={character} state={charAnim ? 'celebrating' : 'idle'} width={196} shadow={true}/>
            </div>

            {/* Name label */}
            <p className="text-sm font-bold z-10" style={{ color: '#7C5CBF' }}>{charName}</p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Stars progress */}
          <div className="rounded-3xl p-5 card-shadow flex items-center gap-5"
            style={{ background: 'linear-gradient(135deg, rgba(245,200,66,0.1), rgba(255,190,40,0.06))', border: '1.5px solid rgba(245,200,66,0.28)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(245,200,66,0.18)' }}>
              <IcStar size={30}/>
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold" style={{ color: '#2D1F5E' }}>نجومك المجموعة</span>
                <span className="font-black text-base" style={{ color: '#B87800' }}>{state.stars} نجمة</span>
              </div>
              <div className="progress-track h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(245,200,66,0.2)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${starProgress}%`, background: 'linear-gradient(90deg, #F5C842, #E5A800)' }}/>
              </div>
              <p className="text-xs mt-1.5" style={{ color: '#A898D0' }}>
                {state.stars < 50 ? `${50 - state.stars} نجمة للمستوى التالي` : 'وصلت للقمة!'}
              </p>
            </div>
          </div>

          {/* Game cards */}
          <div className="grid grid-cols-3 gap-4" style={{ flex: 1 }}>
            {games.map((game) => (
              <button key={game.id} onClick={() => navigate(game.id as any)}
                className="rounded-3xl p-5 text-right btn-press flex flex-col justify-between card-shadow"
                style={{ background: game.bg, border: `1.5px solid ${game.border}`, boxShadow: `0 8px 28px ${game.glow}` }}>
                <div>
                  {/* Icon in a soft pill */}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background: `rgba(${game.accent.replace('#','').match(/../g)!.map(h=>parseInt(h,16)).join(',')},0.18)` }}>
                    <game.Icon size={24} color={game.accent}/>
                  </div>
                  <p className="text-lg font-black mb-1" style={{ color: '#2D1F5E' }}>{game.nameAr}</p>
                  <p className="text-xs font-medium" style={{ color: '#8878B0' }}>{game.descAr}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.75)' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: game.accent }}/>
                    <span className="text-xs font-bold" style={{ color: game.accent }}>المستوى {game.level}</span>
                  </div>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: game.accent }}>
                    <svg width="14" height="14" viewBox="0 0 14 14"><path d="M4 2 L10 7 L4 12" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Quick action row */}
          <div className="flex gap-4">
            {[
              { id: 'achievements', label: 'الإنجازات', Icon: IcTrophy, color: '#F5C842' },
              { id: 'wardrobe', label: 'شخصيتي', Icon: IcHanger, color: '#A98FE0' },
              { id: 'smart-break', label: 'استراحة', Icon: IcBreath, color: '#7BB8F0' },
            ].map(item => (
              <button key={item.id} onClick={() => navigate(item.id as any)}
                className="flex-1 btn-press rounded-2xl py-4 flex flex-col items-center gap-2 card-shadow"
                style={{ background: 'white', border: '1.5px solid rgba(169,143,224,0.2)' }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${item.color}1a` }}>
                  <item.Icon size={18} color={item.color}/>
                </div>
                <span className="text-xs font-bold" style={{ color: '#5A3FA0' }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom nav ───────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-6 pb-4">
        <div className="flex rounded-3xl overflow-hidden card-shadow"
          style={{ background: 'white', border: '1.5px solid rgba(169,143,224,0.18)' }}>
          {navItems.map(item => {
            const active = item.id === 'child-home'
            return (
              <button key={item.id} onClick={() => navigate(item.id as any)}
                className="flex-1 flex flex-col items-center py-3 gap-1 btn-press transition-all duration-200"
                style={{ background: active ? 'rgba(124,92,191,0.09)' : 'transparent' }}>
                <item.Icon size={20} color={active ? '#7C5CBF' : '#B0A8CC'}/>
                <span className="text-xs font-bold" style={{ color: active ? '#7C5CBF' : '#B0A8CC' }}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
