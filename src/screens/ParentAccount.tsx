import { useState } from 'react'
import type { ScreenProps } from '../components/ScreenProps'
import IshraqLogo from '../components/IshraqLogo'

interface Field {
  label: string
  key: string
  type: string
  placeholder: string
}

const FIELDS: Field[] = [
  {
    label: 'الاسم الكامل',
    key: 'name',
    type: 'text',
    placeholder: 'أدخل اسمك الكامل',
  },
  {
    label: 'البريد الإلكتروني',
    key: 'email',
    type: 'email',
    placeholder: 'example@email.com',
  },
  {
    label: 'كلمة المرور',
    key: 'password',
    type: 'password',
    placeholder: '٨ أحرف على الأقل',
  },
  {
    label: 'تأكيد كلمة المرور',
    key: 'confirm',
    type: 'password',
    placeholder: 'أعد إدخال كلمة المرور',
  },
]

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export default function ParentAccount({
  navigate,
  setParentAccount,
}: ScreenProps) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [guestLoading, setGuestLoading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}

    if (!values.name.trim()) {
      e.name = 'الاسم مطلوب'
    }

    if (!values.email.includes('@')) {
      e.email = 'البريد الإلكتروني غير صحيح'
    }

    if (values.password.length < 8) {
      e.password = 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل'
    }

    if (values.password !== values.confirm) {
      e.confirm = 'كلمتا المرور غير متطابقتين'
    }

    setErrors(e)

    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    setSubmitting(true)

    setTimeout(() => {
      setParentAccount({
        name: values.name.trim(),
        email: values.email.trim(),
      })

      navigate('child-profile')
    }, 600)
  }

  // تجربة التطبيق كزائر بدون إنشاء حساب
  const handleGuest = () => {
    if (guestLoading) return

    setGuestLoading(true)

    setTimeout(() => {
      navigate('child-profile')
    }, 300)
  }

  const isReady =
    values.name &&
    values.email &&
    values.password &&
    values.confirm

  return (
    <div
      className="w-full h-full flex overflow-hidden"
      style={{ direction: 'rtl' }}
    >
      {/* Left decorative panel */}
      <div
        className="w-96 flex-shrink-0 relative overflow-hidden flex flex-col items-center justify-center"
        style={{
          background:
            'linear-gradient(160deg, #2D1F5E 0%, #4A2F8A 60%, #5A3FA0 100%)',
        }}
      >
        {/* Stars */}
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${(i * 5.7) % 90}%`,
              top: `${(i * 7.3) % 85}%`,
              animation: `sparkle ${
                2 + (i % 3) * 0.6
              }s ease-in-out infinite ${i * 0.22}s`,
            }}
          >
            <svg
              width={i % 4 === 0 ? 10 : 6}
              height={i % 4 === 0 ? 10 : 6}
              viewBox="0 0 10 10"
            >
              <path
                d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z"
                fill="white"
                opacity={0.25 + (i % 4) * 0.1}
              />
            </svg>
          </div>
        ))}

        <IshraqLogo
          size={96}
          className="animate-float"
          style={{
            filter:
              'drop-shadow(0 0 24px rgba(200,180,255,0.6))',
          }}
        />

        <h1 className="text-4xl font-black text-white mb-2">
          إشراق
        </h1>

        <p
          className="text-base font-medium text-center px-8"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          تجربة تعليمية مخصصة ومتكيّفة لطفلك
        </p>

        <div
          className="mt-10 mx-6 p-5 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: 'rgba(169,143,224,0.3)',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C9BDED"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            <div>
              <p className="text-sm font-bold text-white mb-1">
                حساب الوالدين
              </p>

              <p
                className="text-xs"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                بياناتك محمية ولن تُشارك مع أي طرف ثالث
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: 'rgba(169,143,224,0.3)',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C9BDED"
                strokeWidth="2"
              >
                <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>

            <div>
              <p className="text-sm font-bold text-white mb-1">
                رمز الوالدين
              </p>

              <p
                className="text-xs"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                ستنشئ رمز PIN خاص لحماية لوحة الوالدين
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center px-14 ishraq-bg-main ishraq-scroll">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <p
              className="text-sm font-bold mb-1"
              style={{ color: '#A98FE0' }}
            >
              الخطوة ١ من ٤
            </p>

            <h2
              className="text-3xl font-black mb-2"
              style={{ color: '#2D1F5E' }}
            >
              إنشاء حساب الوالدين
            </h2>

            <p
              className="text-base font-medium"
              style={{ color: '#8878B0' }}
            >
              سجّل معلوماتك لمتابعة تقدم طفلك
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {FIELDS.map(f => {
              const isPassword = f.type === 'password'
              const showToggle = isPassword

              const inputType = isPassword
                ? f.key === 'password'
                  ? showPw
                    ? 'text'
                    : 'password'
                  : showConfirm
                  ? 'text'
                  : 'password'
                : f.type

              const err = errors[f.key]

              return (
                <div key={f.key}>
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: '#5A3FA0' }}
                  >
                    {f.label}
                  </label>

                  <div className="relative">
                    <input
                      type={inputType}
                      value={
                        values[
                          f.key as keyof typeof values
                        ]
                      }
                      onChange={e =>
                        setValues(v => ({
                          ...v,
                          [f.key]: e.target.value,
                        }))
                      }
                      placeholder={f.placeholder}
                      className="w-full px-5 py-4 rounded-2xl text-base font-medium outline-none transition-all duration-200"
                      style={{
                        background: 'white',
                        border: `2px solid ${
                          err
                            ? '#FF6B6B'
                            : values[
                                f.key as keyof typeof values
                              ]
                            ? '#A98FE0'
                            : '#E8E2F5'
                        }`,
                        color: '#2D1F5E',
                        direction:
                          f.type === 'email' ? 'ltr' : 'rtl',
                        boxShadow: err
                          ? '0 0 0 4px rgba(255,107,107,0.1)'
                          : values[
                              f.key as keyof typeof values
                            ]
                          ? '0 0 0 4px rgba(169,143,224,0.12)'
                          : 'none',
                      }}
                    />

                    {showToggle && (
                      <button
                        type="button"
                        onClick={() =>
                          f.key === 'password'
                            ? setShowPw(v => !v)
                            : setShowConfirm(v => !v)
                        }
                        className="absolute top-1/2 left-4 -translate-y-1/2"
                        style={{ color: '#A98FE0' }}
                      >
                        <EyeIcon
                          open={
                            f.key === 'password'
                              ? showPw
                              : showConfirm
                          }
                        />
                      </button>
                    )}
                  </div>

                  {err && (
                    <p
                      className="text-xs mt-1.5 font-medium"
                      style={{ color: '#FF6B6B' }}
                    >
                      {err}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Create account */}
          <button
            onClick={handleSubmit}
            disabled={!isReady || submitting || guestLoading}
            className="w-full mt-8 py-5 rounded-2xl text-xl font-black text-white transition-all duration-200"
            style={{
              background:
                isReady &&
                !submitting &&
                !guestLoading
                  ? 'linear-gradient(135deg, #A98FE0, #7C5CBF)'
                  : 'rgba(169,143,224,0.3)',
              boxShadow:
                isReady &&
                !submitting &&
                !guestLoading
                  ? '0 8px 28px rgba(124,92,191,0.35)'
                  : 'none',
              cursor:
                isReady &&
                !submitting &&
                !guestLoading
                  ? 'pointer'
                  : 'not-allowed',
            }}
          >
            {submitting
              ? 'جاري الإنشاء...'
              : 'إنشاء الحساب'}
          </button>

          {/* Guest / Skip */}
          <button
            onClick={handleGuest}
            disabled={submitting || guestLoading}
            className="w-full mt-4 py-4 rounded-2xl text-base font-bold transition-all duration-200"
            style={{
              background: 'white',
              color: '#7C5CBF',
              border: '2px solid rgba(169,143,224,0.35)',
              boxShadow:
                '0 4px 14px rgba(124,92,191,0.08)',
              cursor:
                submitting || guestLoading
                  ? 'not-allowed'
                  : 'pointer',
              opacity:
                submitting || guestLoading ? 0.6 : 1,
            }}
          >
            {guestLoading
              ? 'جاري الدخول...'
              : 'تخطي وتجربة التطبيق كزائر'}
          </button>

          <p
            className="text-center text-xs font-medium mt-3"
            style={{ color: '#A098B8' }}
          >
            يمكنك إنشاء حساب لاحقًا لمتابعة تقدم الطفل وحفظ البيانات
          </p>
        </div>
      </div>
    </div>
  )
}