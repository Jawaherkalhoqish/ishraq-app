import type { ScreenProps } from '../components/ScreenProps'
import { IcArrowLeft, IcBell, IcTrophy, IcStar, IcBreath, IcCheck } from '../components/Icons'
import { useEffect } from 'react'
import { sounds, playSound } from '../sounds/sound'

const TYPE_ICON = {
  achievement: IcTrophy,
  progress: IcStar,
  break: IcBreath,
  general: IcBell,
}
const TYPE_COLOR = {
  achievement: '#F5C842',
  progress: '#7BB8F0',
  break: '#A98FE0',
  general: '#7C5CBF',
}

export default function Notifications({ state, navigate, markNotificationRead }: ScreenProps) {
  const unread = state.notifications.filter(n => !n.read).length
  useEffect(() => {
  if (unread > 0) {
    playSound(sounds.notification)
  }
}, [unread])

  return (
    <div className="w-full h-full flex flex-col ishraq-bg-main overflow-hidden" style={{ direction: 'rtl' }}>
      <div className="flex items-center gap-4 px-8 pt-7 pb-5 flex-shrink-0">
        <button onClick={() => navigate('child-home')} className="btn-press w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(124,92,191,0.1)', border: '1.5px solid rgba(124,92,191,0.2)' }}>
          <IcArrowLeft size={18} color="#7C5CBF"/>
        </button>
        <div>
          <h1 className="text-3xl font-black" style={{ color: '#2D1F5E' }}>الإشعارات</h1>
          {unread > 0 && <p className="text-sm font-medium" style={{ color: '#A898D0' }}>{unread} غير مقروء</p>}
        </div>
      </div>

      <div className="flex-1 px-8 pb-8 overflow-auto space-y-3">
        {state.notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: 'rgba(169,143,224,0.1)' }}>
              <IcBell size={36} color="#A98FE0"/>
            </div>
            <p className="font-bold text-lg" style={{ color: '#A898D0' }}>لا توجد إشعارات</p>
          </div>
        ) : state.notifications.map(n => {
          const Icon = TYPE_ICON[n.type]
          const color = TYPE_COLOR[n.type]
          return (
            <button key={n.id} onClick={() => markNotificationRead(n.id)}
              className="w-full rounded-2xl p-5 flex items-start gap-4 btn-press card-shadow text-right transition-all"
              style={{ background: n.read ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.95)', border: n.read ? '1.5px solid rgba(169,143,224,0.12)' : '1.5px solid rgba(124,92,191,0.25)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}1a` }}>
                <Icon size={20} color={color}/>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold leading-relaxed" style={{ color: '#2D1F5E' }}>{n.message}</p>
                <p className="text-xs mt-1 font-medium" style={{ color: '#A898D0' }}>{n.time}</p>
              </div>
              {!n.read && (
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#7C5CBF' }}/>
              )}
              {n.read && <IcCheck size={16} color="#A898D0"/>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
