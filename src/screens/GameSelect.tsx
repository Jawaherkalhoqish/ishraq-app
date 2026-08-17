import type { ScreenProps } from '../components/ScreenProps'
import { IcCart, IcBallon, IcNumbers, IcArrowLeft, IcStar } from '../components/Icons'

const GAMES = [
  {
    id: 'game-store', nameAr: 'متجر مشرق', descAr: 'تعلّم الجمع بالتسوق في متجر مشرق المليء بالمنتجات',
    skill: 'الجمع', Icon: IcCart, accent: '#FF9E6D', bg: 'linear-gradient(145deg,#FFF3E8,#FFE0C0)',
    border: 'rgba(255,158,109,0.4)',
  },
  {
    id: 'game-balloons', nameAr: 'بالونات مشرق', descAr: 'اضغط على البالونات لتطير وتعلّم الطرح',
    skill: 'الطرح', Icon: IcBallon, accent: '#7BB8F0', bg: 'linear-gradient(145deg,#EBF5FF,#D5E8FF)',
    border: 'rgba(123,184,240,0.4)',
  },
  {
    id: 'game-numberline', nameAr: 'خط الأعداد القافز', descAr: 'اقفز على أحجار الأعداد السحرية',
    skill: 'العد', Icon: IcNumbers, accent: '#A98FE0', bg: 'linear-gradient(145deg,#EEE6FF,#E0D8FF)',
    border: 'rgba(169,143,224,0.4)',
  },
] as const

export default function GameSelect({ state, navigate }: ScreenProps) {
  return (
    <div className="w-full h-full flex flex-col ishraq-bg-main overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex items-center gap-4 px-8 pt-7 pb-5 flex-shrink-0">
        <button onClick={() => navigate('child-home')} className="btn-press w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(124,92,191,0.1)', border: '1.5px solid rgba(124,92,191,0.2)' }}>
          <IcArrowLeft size={18} color="#7C5CBF"/>
        </button>
        <div>
          <h1 className="text-3xl font-black" style={{ color: '#2D1F5E' }}>اختر لعبتك</h1>
          <p className="text-sm font-medium" style={{ color: '#A898D0' }}>كل لعبة تعلّمك مهارة رياضية جديدة</p>
        </div>
        <div className="mr-auto flex items-center gap-2 px-4 py-2 rounded-2xl" style={{ background: 'rgba(245,200,66,0.14)', border: '1.5px solid rgba(245,200,66,0.35)' }}>
          <IcStar size={18}/>
          <span className="font-black" style={{ color: '#B87800' }}>{state.stars}</span>
        </div>
      </div>

      {/* Game cards */}
      <div className="flex-1 px-8 pb-8 flex flex-col gap-5 overflow-auto">
        {GAMES.map((g) => (
          <button key={g.id} onClick={() => navigate(g.id as any)}
            className="rounded-3xl p-7 flex items-center gap-6 btn-press card-shadow text-right"
            style={{ background: g.bg, border: `1.5px solid ${g.border}` }}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${g.accent}22` }}>
              <g.Icon size={36} color={g.accent}/>
            </div>
            <div className="flex-1">
              <p className="text-2xl font-black mb-1" style={{ color: '#2D1F5E' }}>{g.nameAr}</p>
              <p className="text-base font-medium mb-3" style={{ color: '#8878B0' }}>{g.descAr}</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold"
                style={{ background: `${g.accent}22`, color: g.accent }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: g.accent }}/>
                مهارة: {g.skill}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: g.accent }}>
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M4 2 L10 7 L4 12" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
