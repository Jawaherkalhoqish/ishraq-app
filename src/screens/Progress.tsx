import type { ScreenProps } from '../components/ScreenProps'
import { IcCart, IcBallon, IcNumbers } from '../components/Icons'

function GameIcon({ icon, size = 22, color }: { icon: string; size?: number; color?: string }) {
  if (icon === 'cart') return <IcCart size={size} color={color}/>
  if (icon === 'balloon') return <IcBallon size={size} color={color}/>
  if (icon === 'numbers') return <IcNumbers size={size} color={color}/>
  return null
}

function StarIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <path d="M10 1 L12.4 7.6 L19.5 7.6 L13.9 11.8 L16.2 18.5 L10 14.3 L3.8 18.5 L6.1 11.8 L0.5 7.6 L7.6 7.6 Z"
        fill="#F5C842" stroke="#E5A800" strokeWidth="0.5" />
    </svg>
  )
}

function RadialProgress({ value, color, label }: { value: number; color: string; label: string }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(169,143,224,0.15)" strokeWidth="8" />
          <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-black" style={{ color }}>{value}%</span>
        </div>
      </div>
      <p className="text-sm font-bold" style={{ color: '#2D1F5E' }}>{label}</p>
    </div>
  )
}

export default function Progress({ state, navigate }: ScreenProps) {
  const { store, balloons, numberline } = state.gameStats
  const childName = state.parentProfile?.childName || 'الطفل'

  const sessions = [
    { game: 'متجر مشرق', icon: 'cart', date: 'اليوم', correct: store.correct, total: store.attempts, stars: 5, level: store.level, duration: '٨ دقائق' },
    { game: 'بالونات مشرق', icon: 'balloon', date: 'أمس', correct: balloons.correct, total: balloons.attempts, stars: 4, level: balloons.level, duration: '٦ دقائق' },
    { game: 'خط الأعداد', icon: 'numbers', date: 'اليوم', correct: numberline.correct, total: numberline.attempts, stars: 5, level: numberline.level, duration: '٧ دقائق' },
  ]

  return (
    <div className="w-full h-full flex flex-col ishraq-bg-main overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-5 pb-4 flex-shrink-0">
        <button onClick={() => navigate('child-home')} className="btn-press w-10 h-10 rounded-xl flex items-center justify-center bg-white card-shadow">
          <svg width="18" height="18" viewBox="0 0 18 18"><path d="M12 3 L6 9 L12 15" stroke="#7C5CBF" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#2D1F5E' }}>تقدمي </h1>
          <p className="text-sm font-medium" style={{ color: '#8878B0' }}>رحلة {childName} التعليمية</p>
        </div>
      </div>

      <div className="flex-1 px-6 pb-5 ishraq-scroll">
        {/* Stars summary */}
        <div className="rounded-3xl p-5 mb-5 card-shadow flex items-center gap-5"
          style={{ background: 'linear-gradient(135deg, rgba(245,200,66,0.15), rgba(255,215,80,0.08))', border: '2px solid rgba(245,200,66,0.35)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(245,200,66,0.2)' }}>
            <StarIcon size={32} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: '#8878B0' }}>مجموع النجوم</p>
            <p className="text-4xl font-black" style={{ color: '#C8900A' }}>{state.stars} </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium" style={{ color: '#8878B0' }}>الإنجازات</p>
            <p className="text-2xl font-black" style={{ color: '#7C5CBF' }}>
              {state.achievements.filter(a => a.unlocked).length} 
            </p>
          </div>
        </div>

        {/* Skill progress circles */}
        <div className="rounded-3xl p-5 mb-5 card-shadow bg-white">
          <h3 className="text-lg font-black mb-5" style={{ color: '#2D1F5E' }}>مستوى المهارات</h3>
          <div className="flex justify-around">
            <RadialProgress
              value={store.attempts > 0 ? Math.round((store.correct / store.attempts) * 100) : 0}
              color="#FF9E6D"
              label="الجمع"
            />
            <RadialProgress
              value={balloons.attempts > 0 ? Math.round((balloons.correct / balloons.attempts) * 100) : 0}
              color="#7BB8F0"
              label="الطرح"
            />
            <RadialProgress
              value={numberline.attempts > 0 ? Math.round((numberline.correct / numberline.attempts) * 100) : 0}
              color="#A98FE0"
              label="العد"
            />
          </div>
        </div>

        {/* Game levels */}
        <div className="rounded-3xl p-5 mb-5 card-shadow bg-white">
          <h3 className="text-lg font-black mb-4" style={{ color: '#2D1F5E' }}>المستويات الحالية</h3>
          {[
            { name: 'متجر مشرق', icon: 'cart', level: store.level, color: '#FF9E6D', maxLevel: 3 },
            { name: 'بالونات مشرق', icon: 'balloon', level: balloons.level, color: '#7BB8F0', maxLevel: 3 },
            { name: 'خط الأعداد', icon: 'numbers', level: numberline.level, color: '#A98FE0', maxLevel: 3 },
          ].map(g => (
            <div key={g.name} className="flex items-center gap-4 mb-4">
              <GameIcon icon={g.icon} size={22} color={g.color}/>
              <div className="flex-1">
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-bold" style={{ color: '#2D1F5E' }}>{g.name}</span>
                  <span className="text-sm font-black" style={{ color: g.color }}>المستوى {g.level}/{g.maxLevel}</span>
                </div>
                <div className="progress-track h-2.5">
                  <div className="h-2.5 rounded-full transition-all"
                    style={{ width: `${(g.level / g.maxLevel) * 100}%`, background: g.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Session history */}
        <div className="rounded-3xl p-5 card-shadow bg-white">
          <h3 className="text-lg font-black mb-4" style={{ color: '#2D1F5E' }}>آخر الجلسات</h3>
          <div className="space-y-3">
            {sessions.map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: '#F8F5FF', border: '1px solid rgba(169,143,224,0.2)' }}>
                <GameIcon icon={s.icon} size={28}/>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-black" style={{ color: '#2D1F5E' }}>{s.game}</span>
                    <span className="text-sm font-medium" style={{ color: '#8878B0' }}>{s.date}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm" style={{ color: '#5A3FA0' }}>
                      {s.correct}/{s.total} صحيحة
                    </span>
                    <span className="text-xs" style={{ color: '#8878B0' }}>•</span>
                    <div className="flex items-center gap-1">
                      <StarIcon size={12} />
                      <span className="text-sm font-bold" style={{ color: '#C8900A' }}>{s.stars}</span>
                    </div>
                    <span className="text-xs" style={{ color: '#8878B0' }}>•</span>
                    <span className="text-xs" style={{ color: '#8878B0' }}>{s.duration}</span>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-xl text-sm font-bold"
                  style={{ background: 'rgba(169,143,224,0.15)', color: '#7C5CBF' }}>
                  م{s.level}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
