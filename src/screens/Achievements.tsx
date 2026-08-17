import type { ScreenProps } from '../components/ScreenProps'
import { IcArrowLeft, IcTrophy, IcStar, IcBallon, IcNumbers, IcRocket, IcGem, IcMap } from '../components/Icons'

const ICON_MAP: Record<string, (s:number,c:string) => React.ReactElement> = {
  star:    (s,c) => <IcStar size={s} color={c} filled/>,
  trophy:  (s,c) => <IcTrophy size={s} color={c}/>,
  balloon: (s,c) => <IcBallon size={s} color={c}/>,
  number:  (s,c) => <IcNumbers size={s} color={c}/>,
  rocket:  (s,c) => <IcRocket size={s} color={c}/>,
  gem:     (s,c) => <IcGem size={s} color={c}/>,
  map:     (s,c) => <IcMap size={s} color={c}/>,
}
import React from 'react'

export default function Achievements({ state, navigate }: ScreenProps) {
  const unlocked = state.achievements.filter(a => a.unlocked).length

  return (
    <div className="w-full h-full flex flex-col ishraq-bg-main overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex items-center gap-4 px-8 pt-7 pb-5 flex-shrink-0">
        <button onClick={() => navigate('child-home')} className="btn-press w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(124,92,191,0.1)', border: '1.5px solid rgba(124,92,191,0.2)' }}>
          <IcArrowLeft size={18} color="#7C5CBF"/>
        </button>
        <div>
          <h1 className="text-3xl font-black" style={{ color: '#2D1F5E' }}>الإنجازات</h1>
          <p className="text-sm font-medium" style={{ color: '#A898D0' }}>{unlocked} من {state.achievements.length} إنجازات</p>
        </div>
        <div className="mr-auto px-4 py-2 rounded-2xl flex items-center gap-2"
          style={{ background: 'rgba(124,92,191,0.1)', border: '1.5px solid rgba(124,92,191,0.2)' }}>
          <IcTrophy size={18} color="#7C5CBF"/>
          <span className="font-black" style={{ color: '#7C5CBF' }}>{unlocked}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-8 mb-4 flex-shrink-0">
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(169,143,224,0.2)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${(unlocked/state.achievements.length)*100}%`, background: 'linear-gradient(90deg, #A98FE0, #7C5CBF)' }}/>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 px-8 pb-8 overflow-auto">
        <div className="grid grid-cols-2 gap-4">
          {state.achievements.map(a => {
            const IconFn = ICON_MAP[a.icon]
            const color = a.unlocked ? '#7C5CBF' : '#C0B8D8'
            return (
              <div key={a.id} className="rounded-3xl p-5 card-shadow flex items-start gap-4 transition-all"
                style={{
                  background: a.unlocked ? 'linear-gradient(135deg, rgba(169,143,224,0.18), rgba(124,92,191,0.08))' : 'rgba(255,255,255,0.6)',
                  border: `1.5px solid ${a.unlocked ? 'rgba(124,92,191,0.3)' : 'rgba(169,143,224,0.15)'}`,
                  opacity: a.unlocked ? 1 : 0.65,
                }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: a.unlocked ? 'rgba(124,92,191,0.15)' : 'rgba(169,143,224,0.08)' }}>
                  {IconFn ? IconFn(28, color) : <IcStar size={28} color={color}/>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-base mb-0.5" style={{ color: a.unlocked ? '#2D1F5E' : '#8878B0' }}>{a.nameAr}</p>
                  <p className="text-xs font-medium leading-relaxed" style={{ color: '#A898D0' }}>{a.descAr}</p>
                  {a.progress !== undefined && a.total && (
                    <div className="mt-2">
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(169,143,224,0.2)' }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${(a.progress/a.total)*100}%`, background: '#A98FE0' }}/>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: '#A898D0' }}>{a.progress}/{a.total}</p>
                    </div>
                  )}
                  {a.unlocked && (
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(124,92,191,0.15)' }}>
                      <IcStar size={10} color="#F5C842"/>
                      <span className="text-xs font-bold" style={{ color: '#7C5CBF' }}>مكتمل</span>
                    </div>
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
