import { useState } from 'react'
import type { ScreenProps } from '../components/ScreenProps'
import { IcArrowLeft, IcSettings, IcLock, IcUser, IcBell, IcLogout, IcMail, IcCheck, IcArrowRight } from '../components/Icons'
import IshraqLogo from '../components/IshraqLogo'

export default function Settings({ state, navigate }: ScreenProps) {
  const [logoutConfirm, setLogoutConfirm] = useState(false)

  const Row = ({ Icon, label, sub, onPress, danger = false }: { Icon: any; label: string; sub?: string; onPress: () => void; danger?: boolean }) => (
    <button onClick={onPress} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl btn-press transition-all"
      style={{ background: danger ? 'rgba(255,80,80,0.06)' : 'rgba(255,255,255,0.7)', border: `1.5px solid ${danger ? 'rgba(255,80,80,0.15)' : 'rgba(169,143,224,0.15)'}` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: danger ? 'rgba(255,80,80,0.1)' : 'rgba(124,92,191,0.1)' }}>
        <Icon size={18} color={danger ? '#E84040' : '#7C5CBF'}/>
      </div>
      <div className="flex-1 text-right">
        <p className="font-bold text-sm" style={{ color: danger ? '#E84040' : '#2D1F5E' }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: '#A898D0' }}>{sub}</p>}
      </div>
      <IcArrowLeft size={16} color={danger ? '#E84040' : '#C0B8D8'}/>
    </button>
  )

  return (
    <div className="w-full h-full flex flex-col ishraq-bg-main overflow-hidden" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="flex items-center gap-4 px-8 pt-7 pb-5 flex-shrink-0">
        <button onClick={() => navigate('child-home')} className="btn-press w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(124,92,191,0.1)', border: '1.5px solid rgba(124,92,191,0.2)' }}>
          <IcArrowLeft size={18} color="#7C5CBF"/>
        </button>
        <h1 className="text-3xl font-black" style={{ color: '#2D1F5E' }}>الإعدادات</h1>
      </div>

      <div className="flex-1 px-8 pb-8 overflow-auto space-y-3">
        {/* Account info card */}
        {state.parentAccount && (
          <div className="rounded-3xl p-5 card-shadow flex items-center gap-4"
            style={{ background: 'linear-gradient(135deg, rgba(169,143,224,0.14), rgba(124,92,191,0.07))', border: '1.5px solid rgba(124,92,191,0.2)' }}>
            <IshraqLogo size={56} style={{ filter: 'drop-shadow(0 0 12px rgba(169,143,224,0.5))' }}/>
            <div>
              <p className="font-black text-lg" style={{ color: '#2D1F5E' }}>{state.parentAccount.name}</p>
              <p className="text-sm font-medium" style={{ color: '#A898D0' }}>{state.parentAccount.email}</p>
            </div>
          </div>
        )}

        {/* Account group */}
        <p className="text-xs font-bold px-2 pt-2" style={{ color: '#A898D0' }}>الحساب</p>
        <div className="space-y-2">
          <Row Icon={IcUser} label="معلومات الحساب" sub="الاسم والبريد الإلكتروني" onPress={() => {}}/>
          <Row Icon={IcLock} label="تغيير رمز PIN" sub="رمز الوصول للوحة الأهل" onPress={() => navigate('parent-pin-setup')}/>
          <Row Icon={IcMail} label="إعدادات الإشعارات" sub="التحكم في التنبيهات" onPress={() => navigate('notifications')}/>
        </div>

        <p className="text-xs font-bold px-2 pt-2" style={{ color: '#A898D0' }}>الأهل</p>
        <div className="space-y-2">
          <Row Icon={IcSettings} label="لوحة الأهل" sub="التقارير والمتابعة" onPress={() => navigate(state.parentPin ? 'parent-pin-entry' : 'parent-dashboard')}/>
          <Row Icon={IcBell} label="الإشعارات" sub="آخر التحديثات" onPress={() => navigate('notifications')}/>
        </div>

        <p className="text-xs font-bold px-2 pt-2" style={{ color: '#A898D0' }}>الحساب</p>
        <Row Icon={IcLogout} label="تسجيل الخروج" onPress={() => setLogoutConfirm(true)} danger/>
      </div>

      {/* Logout confirm modal */}
      {logoutConfirm && (
        <div className="absolute inset-0 z-30 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-3xl p-8 mx-8 text-center animate-slide-up"
            style={{ background: 'white', maxWidth: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(255,80,80,0.1)' }}>
              <IcLogout size={28} color="#E84040"/>
            </div>
            <h3 className="text-xl font-black mb-2" style={{ color: '#2D1F5E' }}>تسجيل الخروج؟</h3>
            <p className="text-sm font-medium mb-6" style={{ color: '#8878B0' }}>سيتم تسجيل خروجك من حساب إشراق</p>
            <div className="flex gap-3">
              <button onClick={() => setLogoutConfirm(false)} className="flex-1 btn-press py-3 rounded-2xl font-bold text-sm"
                style={{ background: 'rgba(169,143,224,0.1)', color: '#7C5CBF', border: '1.5px solid rgba(124,92,191,0.2)' }}>
                إلغاء
              </button>
              <button onClick={() => navigate('splash')} className="flex-1 btn-press py-3 rounded-2xl font-bold text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#E84040,#C02020)' }}>
                خروج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
