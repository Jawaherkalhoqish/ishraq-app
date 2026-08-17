import { useState, useCallback } from 'react'
import type { ScreenProps } from '../components/ScreenProps'
import type { CharState } from '../types'
import CharacterComponent from '../components/Character'
import { sounds, playSound } from '../sounds/sound'
type Phase =
  | 'intro'
  | 'playing'
  | 'question'
  | 'correct'
  | 'incorrect'
  | 'round-end'

interface Balloon {
  id: number
  x: number
  y: number
  colorIdx: number
  popped: boolean
  flying: boolean
  size: number
  delay: number
}

const COLORS = [
  {
    fill: '#FF6B8A',
    shine: '#FFB3C1',
    knot: '#CC3355',
    string: '#CC3355',
  },
  {
    fill: '#7BB8F0',
    shine: '#B8D9F8',
    knot: '#4488CC',
    string: '#4488CC',
  },
  {
    fill: '#A98FE0',
    shine: '#D0BEFF',
    knot: '#7C5CBF',
    string: '#7C5CBF',
  },
  {
    fill: '#FFD166',
    shine: '#FFE9A0',
    knot: '#CC9900',
    string: '#CC9900',
  },
  {
    fill: '#6BDDC8',
    shine: '#A8F0E4',
    knot: '#2AA890',
    string: '#2AA890',
  },
]

/* تحويل الأرقام الإنجليزية إلى أرقام عربية */
const toArabicNumbers = (value: number | string) => {
  return String(value).replace(
    /[0-9]/g,
    digit => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]
  )
}

function BalloonSVG({
  colorIdx,
  flying,
  size = 70,
}: {
  colorIdx: number
  flying: boolean
  size?: number
}) {
  const c = COLORS[colorIdx % COLORS.length]

  return (
    <svg
      width={size}
      height={Math.round(size * 1.45)}
      viewBox="0 0 70 102"
      style={{
        display: 'block',
        transform: flying
          ? 'translateY(-280px) rotate(15deg)'
          : 'none',
        opacity: flying ? 0 : 1,
        transition: flying
          ? 'transform 0.85s ease-in, opacity 0.7s ease-in 0.15s'
          : 'none',
      }}
    >
      <defs>
        <radialGradient id={`bg${colorIdx}`} cx="38%" cy="32%">
          <stop
            offset="0%"
            stopColor="rgba(255,255,255,0.28)"
          />
          <stop
            offset="100%"
            stopColor="rgba(0,0,0,0.12)"
          />
        </radialGradient>
      </defs>

      <ellipse
        cx="35"
        cy="37"
        rx="28"
        ry="33"
        fill={c.fill}
      />

      <ellipse
        cx="35"
        cy="37"
        rx="28"
        ry="33"
        fill={`url(#bg${colorIdx})`}
      />

      <ellipse
        cx="23"
        cy="21"
        rx="8"
        ry="12"
        fill={c.shine}
        opacity="0.55"
        transform="rotate(-22 23 21)"
      />

      <ellipse
        cx="45"
        cy="30"
        rx="3"
        ry="5"
        fill={c.shine}
        opacity="0.38"
      />

      <ellipse
        cx="35"
        cy="70"
        rx="4"
        ry="3"
        fill={c.knot}
      />

      <path
        d="M31 70 Q35 76 39 70"
        fill={c.knot}
      />

      <path
        d="M35 73 Q32 85 36 100"
        stroke={c.string}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Cloud({
  x,
  y,
  s = 1,
  op = 0.9,
}: {
  x: number
  y: number
  s?: number
  op?: number
}) {
  return (
    <g
      transform={`translate(${x},${y}) scale(${s})`}
      opacity={op}
    >
      <ellipse
        cx="0"
        cy="0"
        rx="45"
        ry="28"
        fill="white"
      />
      <ellipse
        cx="30"
        cy="-8"
        rx="32"
        ry="24"
        fill="white"
      />
      <ellipse
        cx="-28"
        cy="-5"
        rx="28"
        ry="20"
        fill="white"
      />
      <ellipse
        cx="8"
        cy="-20"
        rx="22"
        ry="18"
        fill="white"
      />
    </g>
  )
}

/*
  قوس قزح جديد:
  - خلفية ناعمة
  - متناسق مع الأرض
  - نهايات القوس تدخل خلف الأرض
  - لا يظهر وكأنه طاير
*/
function Rainbow() {
  return (
    <g
      opacity="0.72"
      style={{
        filter: 'drop-shadow(0 5px 8px rgba(80,120,150,0.08))',
      }}
    >
      {/* الأحمر */}
      <path
        d="M 90 690 A 360 360 0 0 1 810 690"
        fill="none"
        stroke="#F59AB4"
        strokeWidth="32"
        strokeLinecap="round"
      />

      {/* الأصفر */}
      <path
        d="M 122 690 A 328 328 0 0 1 778 690"
        fill="none"
        stroke="#F8E6A1"
        strokeWidth="28"
        strokeLinecap="round"
      />

      {/* الأخضر */}
      <path
        d="M 152 690 A 298 298 0 0 1 748 690"
        fill="none"
        stroke="#A8E4D3"
        strokeWidth="27"
        strokeLinecap="round"
      />

      {/* الأزرق */}
      <path
        d="M 181 690 A 269 269 0 0 1 719 690"
        fill="none"
        stroke="#9CC9F0"
        strokeWidth="26"
        strokeLinecap="round"
      />

      {/* البنفسجي */}
      <path
        d="M 210 690 A 240 240 0 0 1 690 690"
        fill="none"
        stroke="#B7A5E8"
        strokeWidth="25"
        strokeLinecap="round"
      />
    </g>
  )
}

function makeBalloons(count: number): Balloon[] {
  const slots = [
    [12, 42],
    [20, 18],
    [30, 55],
    [42, 22],
    [53, 46],
    [62, 18],
    [72, 40],
    [17, 65],
    [57, 62],
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: slots[i % slots.length][0],
    y: slots[i % slots.length][1],
    colorIdx: i,
    popped: false,
    flying: false,
    size: 60 + (i % 3) * 8,
    delay: i * 0.4,
  }))
}

function genQ() {
  const start = 3 + Math.floor(Math.random() * 7)
  const pop =
    1 + Math.floor(Math.random() * (start - 1))

  return {
    start,
    pop,
    answer: start - pop,
  }
}

function wrongOpts(answer: number) {
  const s = new Set([answer])

  while (s.size < 3) {
    s.add(
      Math.max(
        0,
        answer +
          (Math.random() < 0.5 ? -1 : 1) *
            (1 + Math.floor(Math.random() * 2))
      )
    )
  }

  return [...s].sort(() => Math.random() - 0.5)
}

export default function GameBalloons({
  state,
  navigate,
  addStars,
  triggerSmartBreak,
  unlockAchievement,
}: ScreenProps) {
  const character = state.character ?? 'mushriq'
  const charName =
    character === 'mushriq' ? 'مشرق' : 'مشرقة'

  const [phase, setPhase] =
    useState<Phase>('intro')

  const [q, setQ] = useState(genQ)

  const [balloons, setBalloons] =
    useState<Balloon[]>([])

  const [choices, setChoices] =
    useState<number[]>([])

  const [roundNum, setRoundNum] = useState(1)

  const [roundStars, setRoundStars] =
    useState(0)

  const [errCount, setErrCount] =
    useState(0)

  const [cs, setCs] =
    useState<CharState>('welcome')

  /* حالة التلميح */
  const [showHint, setShowHint] =
    useState(false)

  const dialogue: Record<Phase, string> = {
    intro: `أهلاً! أنا ${charName} — خلنا نتعلم الطرح بالبالونات!`,
    playing:
      'اضغط على البالونات لتطير... ثم احسب كم تبقّى',
    question:
      'خذ وقتك وفكّر في عدد البالونات المتبقية',
    correct:
      'ممتاز! جواب صحيح!',
    incorrect:
      'قريب! استخدم التلميح وحاول مرة ثانية',
    'round-end':
      'أكملت الجولة! رائع جداً!',
  }

  const startRound = useCallback(() => {
    const nq = genQ()

    setQ(nq)
    setBalloons(makeBalloons(nq.start))
    setChoices(wrongOpts(nq.answer))
    setPhase('playing')
    setCs('idle')
    setErrCount(0)
    setShowHint(false)

    unlockAchievement('first_adventure')
  }, [unlockAchievement])

  const popBalloon = (id: number) => {
    if (phase !== 'playing') return

    setBalloons(bs => {
      const remaining = bs.filter(
        b => !b.popped && b.id !== id
      ).length

      const updated = bs.map(b =>
        b.id === id
          ? { ...b, flying: true }
          : b
      )

      setTimeout(() => {
        setBalloons(prev =>
          prev.map(b =>
            b.id === id
              ? {
                  ...b,
                  popped: true,
                  flying: false,
                }
              : b
          )
        )

        if (remaining === q.start - q.pop) {
          setTimeout(() => {
            setPhase('question')
            setCs('thinking')
            setShowHint(false)
          }, 700)
        }
      }, 850)

      return updated
    })
  }

  const handleAnswer = (val: number) => {
    if (val === q.answer) {
      setCs('celebrating')
      setPhase('correct')
      setShowHint(false)

      addStars(1)
      setRoundStars(s => s + 1)
      setErrCount(0)

      setTimeout(() => {
        setCs('idle')

        if (roundNum >= 5) {
          playSound(sounds.roundComplete)
          setPhase('round-end')
        } else {
          setRoundNum(r => r + 1)
          startRound()
        }
      }, 2200)
    } else {
      const e = errCount + 1

      setErrCount(e)
      setCs('hint')
      setPhase('incorrect')
      setShowHint(true)

      if (e >= 3) {
        triggerSmartBreak('game-balloons')
      }

      setTimeout(() => {
        setPhase('question')
        setCs('thinking')
      }, 2000)
    }
  }

  const remaining = balloons.filter(
    b => !b.popped && !b.flying
  ).length

  const popped = balloons.filter(
    b => b.popped || b.flying
  ).length

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ direction: 'rtl' }}
    >

      {/* =========================
          SKY WORLD
      ========================== */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1366 768"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient
            id="sky"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#5BA4D4"
            />

            <stop
              offset="40%"
              stopColor="#87CEEB"
            />

            <stop
              offset="70%"
              stopColor="#C0E8F8"
            />

            <stop
              offset="100%"
              stopColor="#E8F6FF"
            />
          </linearGradient>

          <radialGradient
            id="sunG"
            cx="15%"
            cy="15%"
          >
            <stop
              offset="0%"
              stopColor="rgba(255,240,140,0.9)"
            />

            <stop
              offset="100%"
              stopColor="rgba(255,240,140,0)"
            />
          </radialGradient>

          <linearGradient
            id="grd"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#A8D85A"
            />

            <stop
              offset="100%"
              stopColor="#5E9A18"
            />
          </linearGradient>
        </defs>

        {/* السماء */}
        <rect
          width="1366"
          height="768"
          fill="url(#sky)"
        />

        {/* الشمس */}
        <circle
          cx="190"
          cy="115"
          r="60"
          fill="rgba(255,240,100,0.85)"
        />

        <circle
          cx="190"
          cy="115"
          r="44"
          fill="#FFE040"
        />

        <ellipse
          cx="190"
          cy="115"
          rx="190"
          ry="165"
          fill="url(#sunG)"
        />

        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
          (a, i) => {
            const r = (a * Math.PI) / 180

            return (
              <line
                key={i}
                x1={190 + Math.cos(r) * 56}
                y1={115 + Math.sin(r) * 56}
                x2={190 + Math.cos(r) * 78}
                y2={115 + Math.sin(r) * 78}
                stroke="#FFD800"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.65"
              />
            )
          }
        )}

        {/* السحب الخلفية */}
        <Cloud
          x={580}
          y={75}
          s={0.55}
          op={0.45}
        />

        <Cloud
          x={900}
          y={55}
          s={0.5}
          op={0.4}
        />

        <Cloud
          x={1200}
          y={90}
          s={0.6}
          op={0.45}
        />

        {/* السحب الوسط */}
        <Cloud
          x={350}
          y={135}
          s={0.8}
          op={0.65}
        />

        <Cloud
          x={720}
          y={110}
          s={0.75}
          op={0.6}
        />

        <Cloud
          x={1080}
          y={155}
          s={0.72}
          op={0.62}
        />

        {/* السحب القريبة */}
        <Cloud
          x={260}
          y={230}
          s={1.1}
          op={0.88}
        />

        <Cloud
          x={680}
          y={215}
          s={1.05}
          op={0.82}
        />

        <Cloud
          x={1040}
          y={250}
          s={1.15}
          op={0.86}
        />

        {/* قوس قزح متصل بالأرض */}
        <Rainbow />

        {/* أرضية ناعمة */}
        <ellipse
          cx="683"
          cy="790"
          rx="820"
          ry="140"
          fill="#B8E068"
        />

        <rect
          x="0"
          y="700"
          width="1366"
          height="68"
          fill="url(#grd)"
        />

        {/* خط بسيط أعلى الأرض لدمج القوس مع الأرض */}
        <path
          d="M0 700 Q340 675 683 700 T1366 700"
          fill="none"
          stroke="#B8E068"
          strokeWidth="12"
          opacity="0.95"
        />

        {/* الزهور */}
        {[100, 250, 400, 550, 700, 850, 1000, 1150, 1300].map(
          (x, i) => (
            <g
              key={i}
              transform={`translate(${x},706)`}
            >
              <rect
                x="-1"
                y="-8"
                width="2"
                height="10"
                fill="#4AAA20"
              />

              <circle
                cx="0"
                cy="-10"
                r="4"
                fill={
                  [
                    '#FF9EC8',
                    '#FFE070',
                    '#B8F0A0',
                    '#A0C8FF',
                  ][i % 4]
                }
              />
            </g>
          )
        )}
      </svg>

      {/* =========================
          HUD
      ========================== */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-30">

        <button
          onClick={() =>
            navigate('child-home')
          }
          className="btn-press w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background:
              'rgba(255,255,255,0.9)',
            boxShadow:
              '0 4px 12px rgba(0,0,0,0.12)',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <path
              d="M12 3 L6 9 L12 15"
              stroke="#7C5CBF"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div
          className="flex items-center gap-2 px-4 py-2 rounded-2xl"
          style={{
            background:
              'rgba(255,255,255,0.92)',
            boxShadow:
              '0 4px 16px rgba(0,0,0,0.12)',
            backdropFilter:
              'blur(8px)',
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 1 L12.4 7.6 L19.5 7.6 L13.9 11.8 L16.2 18.5 L10 14.3 L3.8 18.5 L6.1 11.8 L0.5 7.6 L7.6 7.6 Z"
              fill="#F5C842"
              stroke="#E5A800"
              strokeWidth="0.5"
            />
          </svg>

          <span
            className="text-xl font-black"
            style={{
              color: '#2D1F5E',
            }}
          >
            {toArabicNumbers(state.stars)}
          </span>
        </div>

        <div
          className="flex gap-1.5 px-3 py-2 rounded-xl"
          style={{
            background:
              'rgba(255,255,255,0.9)',
            boxShadow:
              '0 4px 12px rgba(0,0,0,0.12)',
          }}
        >
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full transition-all"
              style={{
                background:
                  i < roundNum
                    ? '#F5C842'
                    : i === roundNum
                    ? '#7BB8F0'
                    : 'rgba(0,0,0,0.15)',
              }}
            />
          ))}
        </div>
      </div>

      {/* =========================
          QUESTION CARD
      ========================== */}
      {phase !== 'intro' &&
        phase !== 'round-end' && (
          <div
            className="absolute top-5 left-1/2 -translate-x-1/2 z-20 animate-slide-in-right"
          >
            <div
              className="rounded-2xl px-6 py-3.5 min-w-[210px] text-center"
              style={{
                background:
                  'rgba(255,255,255,0.96)',
                boxShadow:
                  '0 8px 28px rgba(0,0,0,0.12)',
                border:
                  '2px solid rgba(123,184,240,0.35)',
              }}
            >
              <p
                className="text-xs font-bold mb-1"
                style={{
                  color: '#6090C0',
                }}
              >
                المسألة
              </p>

              <div className="flex items-center justify-center gap-3">

                <span
                  className="text-2xl font-black"
                  style={{
                    color: '#2D1F5E',
                  }}
                >
                  {toArabicNumbers(q.start)}
                </span>

                <span
                  className="text-xl font-black"
                  style={{
                    color: '#FF6B8A',
                  }}
                >
                  −
                </span>

                <span
                  className="text-2xl font-black"
                  style={{
                    color: '#2D1F5E',
                  }}
                >
                  {toArabicNumbers(q.pop)}
                </span>

                <span
                  className="text-xl font-black"
                  style={{
                    color: '#7BB8F0',
                  }}
                >
                  =
                </span>

                <span
                  className="text-2xl font-black"
                  style={{
                    color: '#A98FE0',
                  }}
                >
                  ؟
                </span>
              </div>
            </div>
          </div>
        )}

      {/* =========================
          BALLOONS
      ========================== */}
      {phase === 'playing' &&
        balloons.map(b =>
          !b.popped ? (
            <div
              key={b.id}
              className="absolute"
              onClick={() =>
                popBalloon(b.id)
              }
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                transform:
                  'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 10,
                animation: !b.flying
                  ? `float-slow ${
                      2.5 +
                      b.delay * 0.3
                    }s ease-in-out ${
                      b.delay * 0.25
                    }s infinite`
                  : undefined,
              }}
            >
              <BalloonSVG
                colorIdx={b.colorIdx}
                flying={b.flying}
                size={b.size}
              />
            </div>
          ) : null
        )}

      {/* =========================
          COUNT BADGE
      ========================== */}
      {phase === 'playing' && (
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-10">

          <div
            className="px-5 py-3 rounded-2xl flex items-center gap-2"
            style={{
              background:
                'rgba(255,255,255,0.96)',
              boxShadow:
                '0 6px 24px rgba(0,0,0,0.12)',
              border:
                '2px solid rgba(123,184,240,0.35)',
            }}
          >
            <span
              className="text-sm font-bold"
              style={{
                color: '#6090C0',
              }}
            >
              تبقّى:
            </span>

            <span
              className="text-3xl font-black"
              style={{
                color: '#1A3A5E',
              }}
            >
              {toArabicNumbers(
                remaining
              )}
            </span>

            <span
              className="mx-1 text-sm font-bold"
              style={{
                color: '#6090C0',
              }}
            >
              طار:
            </span>

            <span
              className="text-3xl font-black"
              style={{
                color: '#FF6B8A',
              }}
            >
              {toArabicNumbers(popped)}
            </span>
          </div>
        </div>
      )}

      {/* =========================
          CHARACTER
      ========================== */}
      <div
        className="absolute z-10 flex flex-col items-end"
        style={{
          bottom: 40,
          right: 30,
        }}
      >

        <div
          className="relative px-4 py-3 rounded-2xl mb-3 max-w-xs animate-fade-in"
          style={{
            background:
              'rgba(255,255,255,0.96)',
            border:
              '1.5px solid rgba(123,184,240,0.4)',
            boxShadow:
              '0 4px 20px rgba(0,0,0,0.12)',
          }}
        >
          <p
            className="text-sm font-bold"
            style={{
              color: '#1A3A5E',
            }}
          >
            {dialogue[phase]}
          </p>

          <div
            className="absolute -bottom-2.5 right-5 w-5 h-5 rotate-45"
            style={{
              background:
                'rgba(255,255,255,0.96)',
              borderRight:
                '1.5px solid rgba(123,184,240,0.4)',
              borderBottom:
                '1.5px solid rgba(123,184,240,0.4)',
            }}
          />
        </div>

        <CharacterComponent
          character={character}
          state={cs}
          width={200}
          shadow={true}
        />
      </div>

      {/* =========================
          ANSWER + HINT
      ========================== */}
      {phase === 'question' && (
        <div className="absolute z-20 left-1/2 -translate-x-1/2 bottom-28 animate-slide-up text-center">

          {/* السؤال */}
          <div
            className="inline-block px-6 py-3 rounded-2xl mb-3"
            style={{
              background:
                'rgba(255,255,255,0.97)',
              boxShadow:
                '0 6px 24px rgba(0,0,0,0.12)',
            }}
          >
            <p
              className="text-base font-black"
              style={{
                color: '#1A3A5E',
              }}
            >
              كم بالونة تبقّت؟
            </p>
          </div>

          {/* زر التلميح */}
          <div className="mb-3">
            <button
              onClick={() =>
                setShowHint(v => !v)
              }
              className="btn-press px-5 py-2 rounded-xl font-black"
              style={{
                background:
                  'rgba(255,248,215,0.97)',
                color: '#9A7410',
                border:
                  '1.5px solid rgba(245,200,66,0.55)',
                boxShadow:
                  '0 4px 14px rgba(0,0,0,0.08)',
              }}
            >
              {showHint
                ? 'إخفاء التلميح'
                : 'تلميح'}
            </button>
          </div>

          {/* التلميح */}
          {showHint && (
            <div
              className="mx-auto mb-4 px-5 py-3 rounded-2xl max-w-[360px] animate-slide-up"
              style={{
                background:
                  'rgba(255,255,255,0.97)',
                border:
                  '2px solid rgba(245,200,66,0.45)',
                boxShadow:
                  '0 6px 20px rgba(0,0,0,0.1)',
              }}
            >
              <p
                className="text-sm font-bold leading-6"
                style={{
                  color: '#765C15',
                }}
              >
                تذكّر: ابدأ من عدد البالونات
                الكلي، ثم اطرح عدد البالونات
                التي طارت.
              </p>
            </div>
          )}

          {/* الإجابات */}
          <div className="flex gap-4 justify-center">

            {choices.map(c => (
              <button
                key={c}
                onClick={() =>
                  handleAnswer(c)
                }
                className="btn-press px-10 py-5 rounded-2xl text-3xl font-black"
                style={{
                  background:
                    'rgba(255,255,255,0.97)',
                  boxShadow:
                    '0 8px 24px rgba(0,0,0,0.13)',
                  color: '#2D1F5E',
                  border:
                    '2px solid rgba(123,184,240,0.4)',
                  minWidth: 100,
                }}
              >
                {toArabicNumbers(c)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* =========================
          INTRO
      ========================== */}
      {phase === 'intro' && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center"
          style={{
            background:
              'rgba(30,80,140,0.35)',
            backdropFilter:
              'blur(4px)',
          }}
        >
          <div
            className="rounded-3xl p-10 text-center animate-slide-up"
            style={{
              background:
                'rgba(255,255,255,0.97)',
              maxWidth: 440,
              boxShadow:
                '0 24px 64px rgba(0,0,0,0.2)',
            }}
          >
            <div className="w-28 h-28 mx-auto mb-4">
              <CharacterComponent
                character={character}
                state="welcome"
                width={110}
                shadow={false}
              />
            </div>

            <h2
              className="text-3xl font-black mb-2"
              style={{
                color: '#2D1F5E',
              }}
            >
              بالونات مشرق
            </h2>

            <p
              className="text-base font-medium mb-6"
              style={{
                color: '#6090C0',
              }}
            >
              اضغط على البالونات لتطير
              وتعلّم الطرح!
            </p>

            <button
              onClick={startRound}
              className="btn-press px-12 py-5 rounded-2xl text-xl font-black text-white"
              style={{
                background:
                  'linear-gradient(135deg, #7BB8F0, #4488CC)',
                boxShadow:
                  '0 8px 24px rgba(70,140,220,0.4)',
              }}
            >
              نبدأ اللعب
            </button>
          </div>
        </div>
      )}

      {/* =========================
          CORRECT
      ========================== */}
      {phase === 'correct' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">

          <div className="text-center animate-star-pop">

            <svg
              width="80"
              height="80"
              viewBox="0 0 20 20"
              className="mx-auto mb-4"
              style={{
                filter:
                  'drop-shadow(0 0 20px rgba(245,200,66,0.8))',
              }}
            >
              <path
                d="M10 1 L12.4 7.6 L19.5 7.6 L13.9 11.8 L16.2 18.5 L10 14.3 L3.8 18.5 L6.1 11.8 L0.5 7.6 L7.6 7.6 Z"
                fill="#F5C842"
                stroke="#E5A800"
                strokeWidth="0.5"
              />
            </svg>

            <div
              className="px-8 py-4 rounded-2xl"
              style={{
                background:
                  'rgba(168,230,168,0.96)',
                boxShadow:
                  '0 8px 32px rgba(80,180,80,0.3)',
              }}
            >
              <p
                className="text-3xl font-black"
                style={{
                  color: '#1A5A1A',
                }}
              >
                ممتاز! الجواب:{' '}
                {toArabicNumbers(
                  q.answer
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          INCORRECT
      ========================== */}
      {phase === 'incorrect' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">

          <div
            className="px-8 py-4 rounded-2xl animate-slide-up"
            style={{
              background:
                'rgba(200,220,255,0.96)',
              boxShadow:
                '0 8px 32px rgba(70,120,200,0.25)',
            }}
          >
            <p
              className="text-2xl font-black"
              style={{
                color: '#2D4A7E',
              }}
            >
              قريب! استخدم التلميح
              وحاول مرة ثانية
            </p>
          </div>
        </div>
      )}

      {/* =========================
          ROUND END
      ========================== */}
      {phase === 'round-end' && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center"
          style={{
            background:
              'rgba(30,80,140,0.35)',
            backdropFilter:
              'blur(4px)',
          }}
        >
          <div
            className="rounded-3xl p-10 text-center animate-slide-up"
            style={{
              background:
                'rgba(255,255,255,0.97)',
              maxWidth: 400,
              boxShadow:
                '0 24px 64px rgba(0,0,0,0.2)',
            }}
          >
            <div className="w-24 h-24 mx-auto mb-4">
              <CharacterComponent
                character={character}
                state="celebrating"
                width={96}
                shadow={false}
              />
            </div>

            <h2
              className="text-3xl font-black mb-2"
              style={{
                color: '#2D1F5E',
              }}
            >
              رائع! أكملت الجولة
            </h2>

            <div className="flex items-center justify-center gap-2 mb-6">

              <svg
                width="28"
                height="28"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 1 L12.4 7.6 L19.5 7.6 L13.9 11.8 L16.2 18.5 L10 14.3 L3.8 18.5 L6.1 11.8 L0.5 7.6 L7.6 7.6 Z"
                  fill="#F5C842"
                  stroke="#E5A800"
                  strokeWidth="0.5"
                />
              </svg>

              <span
                className="text-3xl font-black"
                style={{
                  color: '#C8900A',
                }}
              >
                {toArabicNumbers(
                  roundStars
                )}{' '}
                نجوم
              </span>
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => {
                  setRoundNum(1)
                  setRoundStars(0)
                  setPhase('intro')
                  setCs('welcome')
                  setShowHint(false)
                }}
                className="flex-1 btn-press py-4 rounded-2xl font-black text-white"
                style={{
                  background:
                    'linear-gradient(135deg, #7BB8F0, #4488CC)',
                }}
              >
                جولة ثانية
              </button>

              <button
                onClick={() =>
                  navigate('child-home')
                }
                className="flex-1 btn-press py-4 rounded-2xl font-black"
                style={{
                  background:
                    'rgba(124,92,191,0.1)',
                  color: '#7C5CBF',
                  border:
                    '1.5px solid rgba(124,92,191,0.2)',
                }}
              >
                الرئيسية
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          SMALL HINT BUTTON
          يظهر دائماً أثناء اللعب
      ========================== */}
      {phase === 'playing' && (
        <button
          onClick={() => {
            setPhase('question')
            setCs('thinking')
            setShowHint(true)
          }}
          className="absolute bottom-6 left-6 z-20 btn-press w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background:
              'rgba(255,255,255,0.94)',
            border:
              '2px solid rgba(245,200,66,0.5)',
            boxShadow:
              '0 5px 16px rgba(0,0,0,0.12)',
            color: '#9A7410',
            fontSize: 20,
            fontWeight: 900,
          }}
          aria-label="تلميح"
        >
          ?
        </button>
      )}
    </div>
  )
}