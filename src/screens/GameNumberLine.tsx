import { useState, useCallback } from 'react'
import type { ScreenProps } from '../components/ScreenProps'
import type { CharState } from '../types'
import CharacterComponent from '../components/Character'
import { IcHome, IcStar, IcHanger } from '../components/Icons'
import { sounds, playSound } from '../sounds/sound'

type Phase =
  | 'intro'
  | 'playing'
  | 'question'
  | 'correct'
  | 'incorrect'
  | 'round-end'

/* ─────────────────────────────────────────
   تحويل الأرقام الإنجليزية إلى أرقام عربية
   0 1 2 3 4 5 6 7 8 9
   ↓
   ٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩
───────────────────────────────────────── */

function arabicNumber(value: number | string) {
  return String(value).replace(/\d/g, (digit) => {
    return '٠١٢٣٤٥٦٧٨٩'[Number(digit)]
  })
}

/* ─────────────────────────────────────────
   توليد السؤال

   start = نقطة البداية
   steps = عدد القفزات المطلوبة
   end = الرقم النهائي

   مثال:
   start = ٣
   steps = ٤
   end = ٧

   الإجابة الصحيحة = ٤
───────────────────────────────────────── */

function genQ() {
  const start = Math.floor(Math.random() * 5)
  const steps = 2 + Math.floor(Math.random() * 4)
  const end = start + steps

  return {
    start,
    steps,
    end,
  }
}

/* ─────────────────────────────────────────
   خيارات الإجابة

   نستخدم عدد القفزات وليس الرقم النهائي
───────────────────────────────────────── */

function wrongOpts(answer: number) {
  const s = new Set<number>([answer])

  while (s.size < 3) {
    const variation =
      Math.random() < 0.5 ? -1 : 1

    const amount = 1 + Math.floor(Math.random() * 2)

    const wrong = Math.max(
      1,
      answer + variation * amount
    )

    s.add(wrong)
  }

  return [...s].sort(() => Math.random() - 0.5)
}

const CHOICE_COLORS = [
  '#FFD6E0',
  '#FFF3B0',
  '#C7E9FF',
]

export default function GameNumberLine({
  state,
  navigate,
  addStars,
  triggerSmartBreak,
  unlockAchievement,
}: ScreenProps) {
  const character = state.character ?? 'mushriq'

  const charName =
    character === 'mushriq'
      ? 'مشرق'
      : 'مشرقة'

  const otherChar: 'mushriq' | 'mushriqa' =
    character === 'mushriq'
      ? 'mushriqa'
      : 'mushriq'

  const [phase, setPhase] =
    useState<Phase>('intro')

  const [q, setQ] = useState(genQ)

  const [pos, setPos] = useState(0)

  const [isJumping, setIsJumping] =
    useState(false)

  const [choices, setChoices] =
    useState<number[]>([])

  const [roundNum, setRoundNum] =
    useState(1)

  const [roundStars, setRoundStars] =
    useState(0)

  const [errCount, setErrCount] =
    useState(0)

  const [cs, setCs] =
    useState<CharState>('welcome')

  const [trail, setTrail] =
    useState<number[]>([])

  const TOTAL = 10

  const numbers = Array.from(
    { length: TOTAL + 1 },
    (_, i) => i
  )

  /* ─────────────────────────────────────────
     بدء جولة جديدة
  ───────────────────────────────────────── */

  const startRound = useCallback(() => {
    const nq = genQ()

    setQ(nq)

    setPos(nq.start)

    setTrail([nq.start])

    /*
      مهم:
      الاختيارات مبنية على nq.steps
      وليس nq.end
    */
    setChoices(
      wrongOpts(nq.steps)
    )

    setPhase('playing')

    setCs('idle')

    unlockAchievement(
      'first_adventure'
    )
  }, [unlockAchievement])

  /* ─────────────────────────────────────────
     القفزة

     الشخصية تتحرك رقم واحد في كل قفزة
  ───────────────────────────────────────── */

  const jump = () => {
    if (
      phase !== 'playing' ||
      isJumping ||
      pos >= q.end
    ) {
      return
    }

    setIsJumping(true)

    setCs('correct')

    setTimeout(() => {
      setPos((p) => {
        const next = p + 1

        setTrail((t) => [
          ...t,
          next,
        ])

        if (next >= q.end) {
          setTimeout(() => {
            setPhase('question')
            setCs('thinking')
          }, 500)
        }

        return next
      })

      setIsJumping(false)

      setCs('idle')
    }, 500)
  }

  /* ─────────────────────────────────────────
     اختيار الإجابة

     val = عدد القفزات
     q.steps = عدد القفزات الصحيح
  ───────────────────────────────────────── */

  const handleAnswer = (val: number) => {
    if (val === q.steps) {
      setCs('celebrating')

      setPhase('correct')

      addStars(1)

      setRoundStars(
        (s) => s + 1
      )

      setErrCount(0)

      setTimeout(() => {
        setCs('idle')

        if (roundNum >= 5) {
          playSound(sounds.roundComplete)
          setPhase('round-end')
        } else {
          setRoundNum(
            (r) => r + 1
          )

          startRound()
        }
      }, 2200)
    } else {
      const e = errCount + 1

      setErrCount(e)

      setCs('hint')

      setPhase('incorrect')

      if (e >= 3) {
        triggerSmartBreak(
          'game-numberline'
        )
      }

      setTimeout(() => {
        setPhase('question')

        setCs('thinking')
      }, 2000)
    }
  }

  /* ─────────────────────────────────────────
     Number line
  ───────────────────────────────────────── */

  const NL_LEFT = 60

  const NL_RIGHT = 60

  const NL_CONTAINER_W = 900

  const NL_Y = 80

  const NL_W =
    NL_CONTAINER_W -
    NL_LEFT -
    NL_RIGHT

  const dotX = (n: number) =>
    NL_LEFT +
    (n / TOTAL) * NL_W

  const dotY = NL_Y

  /* ─────────────────────────────────────────
     Jump arcs
  ───────────────────────────────────────── */

  const arcPaths: string[] = []

  if (phase !== 'intro') {
    for (
      let i = q.start;
      i < q.end;
      i++
    ) {
      const x1 = dotX(i)

      const x2 = dotX(i + 1)

      const arcH = 38

      arcPaths.push(
        `M ${x1} ${dotY}
         C ${x1} ${dotY - arcH}
         ${x2} ${dotY - arcH}
         ${x2} ${dotY}`
      )
    }
  }

  const charDotX = dotX(pos)

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        direction: 'rtl',
        fontFamily:
          "'Cairo', sans-serif",
      }}
    >

      {/* ═══════════════════════════════════════
          BACKGROUND
      ═══════════════════════════════════════ */}

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 620"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>

          <linearGradient
            id="meadowSky"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#87CEEB"
            />

            <stop
              offset="60%"
              stopColor="#B8E4F7"
            />

            <stop
              offset="100%"
              stopColor="#D6F0FF"
            />
          </linearGradient>

          <linearGradient
            id="grassGrad"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#5DBB5D"
            />

            <stop
              offset="100%"
              stopColor="#3A8C3A"
            />
          </linearGradient>

          <linearGradient
            id="castleGrad"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor="#8B5CF6"
            />

            <stop
              offset="100%"
              stopColor="#6D28D9"
            />
          </linearGradient>

          <filter id="dotGlow">
            <feGaussianBlur
              stdDeviation="3"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="starGlow">
            <feGaussianBlur
              stdDeviation="5"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <marker
            id="lineArrow"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#7C5CBF"
            />
          </marker>

        </defs>

        {/* Sky */}

        <rect
          width="1000"
          height="620"
          fill="url(#meadowSky)"
        />

        {/* Rainbow */}

        <g opacity="0.65">

          <path
            d="M 580 -20 A 280 280 0 0 1 1020 200"
            fill="none"
            stroke="#FF6B6B"
            strokeWidth="7"
            strokeLinecap="round"
          />

          <path
            d="M 595 -10 A 270 270 0 0 1 1010 205"
            fill="none"
            stroke="#FF9F43"
            strokeWidth="7"
            strokeLinecap="round"
          />

          <path
            d="M 610 0 A 260 260 0 0 1 1000 210"
            fill="none"
            stroke="#F9CA24"
            strokeWidth="7"
            strokeLinecap="round"
          />

          <path
            d="M 625 10 A 250 250 0 0 1 990 215"
            fill="none"
            stroke="#6AB04C"
            strokeWidth="7"
            strokeLinecap="round"
          />

          <path
            d="M 640 20 A 240 240 0 0 1 980 220"
            fill="none"
            stroke="#4BCFFA"
            strokeWidth="7"
            strokeLinecap="round"
          />

          <path
            d="M 655 30 A 230 230 0 0 1 970 225"
            fill="none"
            stroke="#7C5CBF"
            strokeWidth="7"
            strokeLinecap="round"
          />

        </g>

        {/* Clouds */}

        <g opacity="0.92">

          <ellipse
            cx="180"
            cy="90"
            rx="70"
            ry="32"
            fill="white"
          />

          <ellipse
            cx="140"
            cy="98"
            rx="45"
            ry="26"
            fill="white"
          />

          <ellipse
            cx="220"
            cy="98"
            rx="48"
            ry="24"
            fill="white"
          />

          <ellipse
            cx="180"
            cy="105"
            rx="72"
            ry="22"
            fill="white"
          />

        </g>

        <g opacity="0.85">

          <ellipse
            cx="500"
            cy="60"
            rx="55"
            ry="24"
            fill="white"
          />

          <ellipse
            cx="468"
            cy="68"
            rx="38"
            ry="20"
            fill="white"
          />

          <ellipse
            cx="532"
            cy="68"
            rx="40"
            ry="19"
            fill="white"
          />

          <ellipse
            cx="500"
            cy="74"
            rx="57"
            ry="18"
            fill="white"
          />

        </g>

        <g opacity="0.8">

          <ellipse
            cx="780"
            cy="110"
            rx="62"
            ry="28"
            fill="white"
          />

          <ellipse
            cx="748"
            cy="118"
            rx="42"
            ry="22"
            fill="white"
          />

          <ellipse
            cx="812"
            cy="118"
            rx="44"
            ry="21"
            fill="white"
          />

          <ellipse
            cx="780"
            cy="124"
            rx="64"
            ry="20"
            fill="white"
          />

        </g>

        {/* Grass */}

        <rect
          x="0"
          y="430"
          width="1000"
          height="190"
          fill="url(#grassGrad)"
        />

        <ellipse
          cx="100"
          cy="432"
          rx="120"
          ry="18"
          fill="#6DC96D"
        />

        <ellipse
          cx="300"
          cy="434"
          rx="100"
          ry="16"
          fill="#5DBB5D"
        />

        <ellipse
          cx="500"
          cy="432"
          rx="130"
          ry="17"
          fill="#6DC96D"
        />

        <ellipse
          cx="700"
          cy="433"
          rx="110"
          ry="15"
          fill="#5DBB5D"
        />

        <ellipse
          cx="900"
          cy="432"
          rx="120"
          ry="18"
          fill="#6DC96D"
        />

        {/* Flowers */}

        {[80, 160, 270, 380, 450, 560, 640, 720, 840, 920].map(
          (fx, i) => (
            <g
              key={i}
              transform={`translate(${fx}, 436)`}
            >
              <line
                y1="0"
                y2="-18"
                stroke="#3A8C3A"
                strokeWidth="2"
              />

              <circle
                cy="-20"
                r="5"
                fill={[
                  '#FF6B9D',
                  '#FFD93D',
                  '#FF6B6B',
                  '#A29BFE',
                  '#74B9FF',
                ][i % 5]}
              />
            </g>
          )
        )}

        {/* Left castle */}

        <g transform="translate(30, 200)">

          <rect
            x="20"
            y="60"
            width="70"
            height="180"
            fill="url(#castleGrad)"
            rx="4"
          />

          <rect
            x="18"
            y="48"
            width="16"
            height="20"
            fill="#8B5CF6"
            rx="2"
          />

          <rect
            x="40"
            y="48"
            width="16"
            height="20"
            fill="#8B5CF6"
            rx="2"
          />

          <rect
            x="62"
            y="48"
            width="16"
            height="20"
            fill="#8B5CF6"
            rx="2"
          />

          <rect
            x="74"
            y="48"
            width="16"
            height="20"
            fill="#8B5CF6"
            rx="2"
          />

          <rect
            x="42"
            y="90"
            width="26"
            height="34"
            fill="#C4B5FD"
            rx="13"
          />

          <rect
            x="42"
            y="190"
            width="26"
            height="50"
            fill="#4C1D95"
            rx="13"
          />

          <rect
            x="0"
            y="90"
            width="35"
            height="150"
            fill="#7C3AED"
            rx="3"
          />

          <rect
            x="-2"
            y="78"
            width="12"
            height="18"
            fill="#7C3AED"
            rx="2"
          />

          <rect
            x="12"
            y="78"
            width="12"
            height="18"
            fill="#7C3AED"
            rx="2"
          />

          <rect
            x="25"
            y="78"
            width="12"
            height="18"
            fill="#7C3AED"
            rx="2"
          />

          <line
            x1="55"
            y1="46"
            x2="55"
            y2="16"
            stroke="#4C1D95"
            strokeWidth="3"
          />

          <path
            d="M55 16 L80 24 L55 32 Z"
            fill="#F59E0B"
          />

        </g>

        {/* Right castle */}

        <g transform="translate(880, 200)">

          <rect
            x="10"
            y="60"
            width="70"
            height="180"
            fill="url(#castleGrad)"
            rx="4"
          />

          <rect
            x="8"
            y="48"
            width="16"
            height="20"
            fill="#8B5CF6"
            rx="2"
          />

          <rect
            x="28"
            y="48"
            width="16"
            height="20"
            fill="#8B5CF6"
            rx="2"
          />

          <rect
            x="48"
            y="48"
            width="16"
            height="20"
            fill="#8B5CF6"
            rx="2"
          />

          <rect
            x="66"
            y="48"
            width="16"
            height="20"
            fill="#8B5CF6"
            rx="2"
          />

          <rect
            x="30"
            y="90"
            width="26"
            height="34"
            fill="#C4B5FD"
            rx="13"
          />

          <rect
            x="30"
            y="190"
            width="26"
            height="50"
            fill="#4C1D95"
            rx="13"
          />

          <rect
            x="65"
            y="90"
            width="35"
            height="150"
            fill="#7C3AED"
            rx="3"
          />

          <rect
            x="65"
            y="78"
            width="12"
            height="18"
            fill="#7C3AED"
            rx="2"
          />

          <rect
            x="79"
            y="78"
            width="12"
            height="18"
            fill="#7C3AED"
            rx="2"
          />

          <rect
            x="93"
            y="78"
            width="12"
            height="18"
            fill="#7C3AED"
            rx="2"
          />

          <line
            x1="45"
            y1="46"
            x2="45"
            y2="16"
            stroke="#4C1D95"
            strokeWidth="3"
          />

          <path
            d="M45 16 L20 24 L45 32 Z"
            fill="#F59E0B"
          />

        </g>

      </svg>

      {/* ═══════════════════════════════════════
          NUMBER LINE
      ═══════════════════════════════════════ */}

      <div
        className="absolute left-0 right-0 z-10"
        style={{ top: '38%' }}
      >

        <svg
          width="100%"
          viewBox={`0 0 ${NL_CONTAINER_W} 160`}
          preserveAspectRatio="xMidYMid meet"
          overflow="visible"
        >

          {/* Main line */}

          <line
            x1={NL_LEFT - 10}
            y1={dotY}
            x2={dotX(TOTAL) + 30}
            y2={dotY}
            stroke="#7C5CBF"
            strokeWidth="3"
            markerEnd="url(#lineArrow)"
          />

          {/* Jump arcs */}

          {phase !== 'intro' &&
            arcPaths.map((d, i) => {
              const isTraversed =
                i < pos - q.start

              return (
                <g key={i}>

                  <path
                    d={d}
                    fill="none"
                    stroke={
                      isTraversed
                        ? '#7C5CBF'
                        : 'rgba(124,92,191,0.35)'
                    }
                    strokeWidth="2.5"
                    strokeDasharray="8 5"
                    strokeLinecap="round"
                    markerEnd={
                      isTraversed
                        ? 'url(#lineArrow)'
                        : undefined
                    }
                  />

                </g>
              )
            })}

          {/* Number dots */}

          {numbers.map((n) => {
            const x = dotX(n)

            const isCurrent =
              n === pos &&
              phase !== 'intro'

            const isTarget =
              n === q.end &&
              phase !== 'intro'

            const isVisited =
              trail.includes(n) &&
              phase !== 'intro'

            return (
              <g key={n}>

                {/* Current */}

                {isCurrent &&
                  !isTarget && (
                    <>
                      <circle
                        cx={x}
                        cy={dotY}
                        r={20}
                        fill="rgba(255,105,180,0.25)"
                        filter="url(#dotGlow)"
                      />

                      <circle
                        cx={x}
                        cy={dotY}
                        r={14}
                        fill="#FF69B4"
                        stroke="white"
                        strokeWidth="3"
                      />
                    </>
                  )}

                {/* Target */}

                {isTarget &&
                  !isCurrent && (
                    <g filter="url(#starGlow)">

                      <path
                        d={`
                          M ${x} ${dotY - 18}
                          L ${x + 5} ${dotY - 5}
                          L ${x + 18} ${dotY}
                          L ${x + 5} ${dotY + 5}
                          L ${x} ${dotY + 18}
                          L ${x - 5} ${dotY + 5}
                          L ${x - 18} ${dotY}
                          L ${x - 5} ${dotY - 5}
                          Z
                        `}
                        fill="#7C5CBF"
                        stroke="white"
                        strokeWidth="2"
                      />

                    </g>
                  )}

                {/* Target + current */}

                {isTarget &&
                  isCurrent && (
                    <g filter="url(#starGlow)">

                      <path
                        d={`
                          M ${x} ${dotY - 18}
                          L ${x + 5} ${dotY - 5}
                          L ${x + 18} ${dotY}
                          L ${x + 5} ${dotY + 5}
                          L ${x} ${dotY + 18}
                          L ${x - 5} ${dotY + 5}
                          L ${x - 18} ${dotY}
                          L ${x - 5} ${dotY - 5}
                          Z
                        `}
                        fill="#FF69B4"
                        stroke="white"
                        strokeWidth="2"
                      />

                    </g>
                  )}

                {/* Regular dot */}

                {!isCurrent &&
                  !isTarget && (
                    <circle
                      cx={x}
                      cy={dotY}
                      r={9}
                      fill={
                        isVisited
                          ? '#A98FE0'
                          : '#D8C8F8'
                      }
                      stroke={
                        isVisited
                          ? '#7C5CBF'
                          : '#B8A8E8'
                      }
                      strokeWidth="2"
                    />
                  )}

                {/* IMPORTANT:
                    الأرقام على خط الأعداد عربية */}

                <text
                  x={x}
                  y={dotY + 30}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="800"
                  fontFamily="Cairo, sans-serif"
                  fill={
                    isCurrent ||
                    isTarget
                      ? '#4C1D95'
                      : '#5B21B6'
                  }
                >
                  {arabicNumber(n)}
                </text>

              </g>
            )
          })}

        </svg>

        {/* Character */}

        {phase !== 'intro' && (
          <div
            className="absolute z-20"
            style={{
              left: `${
                (charDotX /
                  NL_CONTAINER_W) *
                100
              }%`,

              top: 0,

              transform: `
                translateX(-50%)
                translateY(
                  calc(
                    -100% +
                    ${
                      isJumping
                        ? '-30px'
                        : '-8px'
                    }
                  )
                )
              `,

              transition:
                'left 0.5s cubic-bezier(0.34,1.56,0.64,1), transform 0.3s ease',
            }}
          >

            <CharacterComponent
              character={character}
              state={cs}
              width={88}
              shadow={true}
            />

          </div>
        )}

      </div>

      {/* ═══════════════════════════════════════
          TOP LEFT
          الرئيسية + شخصيتي
      ═══════════════════════════════════════ */}

      <div className="absolute top-5 right-5 z-30 flex flex-col gap-3">

        <button
          onClick={() =>
            navigate('child-home')
          }
          className="flex flex-col items-center gap-1"
        >

          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background:
                'linear-gradient(135deg, #8B5CF6, #6D28D9)',
              boxShadow:
                '0 4px 16px rgba(109,40,217,0.5)',
            }}
          >

            <IcHome
              size={24}
              color="white"
            />

          </div>

          <span
            className="text-xs font-bold text-white drop-shadow"
            style={{
              textShadow:
                '0 1px 4px rgba(0,0,0,0.5)',
            }}
          >
            الرئيسية
          </span>

        </button>

        <button
          onClick={() =>
            navigate('character-select')
          }
          className="flex flex-col items-center gap-1"
        >

          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background:
                'linear-gradient(135deg, #8B5CF6, #6D28D9)',
              boxShadow:
                '0 4px 16px rgba(109,40,217,0.5)',
            }}
          >

            <IcHanger
              size={24}
              color="white"
            />

          </div>

          <span
            className="text-xs font-bold text-white drop-shadow"
            style={{
              textShadow:
                '0 1px 4px rgba(0,0,0,0.5)',
            }}
          >
            شخصيتي
          </span>

        </button>

      </div>

      {/* ═══════════════════════════════════════
          TOP RIGHT
          النجوم + الصوت
          
          التلميح محذوف بالكامل
      ═══════════════════════════════════════ */}

      <div className="absolute top-5 left-5 z-30 flex flex-col items-center gap-3">

        {/* Stars */}

        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: '#F5C842',
            boxShadow:
              '0 3px 12px rgba(245,200,66,0.6)',
          }}
        >

          <IcStar
            size={20}
            color="#7C5CBF"
          />

          <span
            className="text-base font-black"
            style={{
              color: '#4C1D95',
            }}
          >
            {arabicNumber(state.stars)}
          </span>

        </div>

        {/* Sound only */}

        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background:
              'linear-gradient(135deg, #8B5CF6, #6D28D9)',
            boxShadow:
              '0 4px 14px rgba(109,40,217,0.45)',
          }}
        >

          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
          >

            <path d="M11 5 L6 9 H2 v6 h4 l5 4 V5z" />

            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />

            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />

          </svg>

        </div>

      </div>

      {/* ═══════════════════════════════════════
          QUESTION CARD
      ═══════════════════════════════════════ */}

      {phase !== 'intro' &&
        phase !== 'round-end' && (
          <div
            className="absolute top-4 left-1/2 z-20 w-full max-w-lg"
            style={{
              transform:
                'translateX(-50%)',
            }}
          >

            <div
              className="mx-auto px-6 py-4 rounded-3xl text-center"
              style={{
                background: '#FFF5E8',
                border:
                  '3px solid #E8D5B0',
                boxShadow:
                  '0 8px 32px rgba(0,0,0,0.18)',
              }}
            >

              <p
                className="font-black leading-tight"
                style={{
                  color: '#4C1D95',
                  fontSize: '1rem',
                }}
              >
                ساعد {charName} للوصول إلى الهدف!
              </p>

              <p
                className="font-bold mt-1"
                style={{
                  color: '#7C5CBF',
                  fontSize: '0.82rem',
                }}
              >
                {charName} يبدأ من الرقم{' '}
                <strong>
                  {arabicNumber(q.start)}
                </strong>{' '}
                ويحتاج للوصول إلى الرقم{' '}
                <strong>
                  {arabicNumber(q.end)}
                </strong>
              </p>

              <p
                className="font-black mt-2"
                style={{
                  color: '#4C1D95',
                  fontSize: '0.9rem',
                }}
              >
                كم قفزة يحتاج؟
              </p>

            </div>

          </div>
        )}

      {/* ═══════════════════════════════════════
          OTHER CHARACTER
      ═══════════════════════════════════════ */}

      {phase !== 'intro' &&
        phase !== 'round-end' && (
          <div className="absolute bottom-6 right-6 z-20 flex flex-col items-center gap-2">

            <div
              className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                boxShadow:
                  '0 4px 16px rgba(109,40,217,0.5)',
                padding: 3,
              }}
            >

              <div className="w-full h-full rounded-full overflow-hidden">

                <CharacterComponent
                  character={otherChar}
                  state="idle"
                  width={64}
                  shadow={false}
                />

              </div>

            </div>

          </div>
        )}

      {/* ═══════════════════════════════════════
          ENCOURAGEMENT
      ═══════════════════════════════════════ */}

      {phase !== 'intro' &&
        phase !== 'round-end' && (
          <div className="absolute bottom-6 left-6 z-20">

            <div
              className="px-4 py-3 rounded-2xl text-center"
              style={{
                background: '#FFF5E8',
                border:
                  '2px solid #E8D5B0',
                boxShadow:
                  '0 4px 16px rgba(0,0,0,0.12)',
                minWidth: 130,
              }}
            >

              <p
                className="font-black text-sm"
                style={{
                  color: '#4C1D95',
                }}
              >
                كل قفزة تقربك
              </p>

              <div className="flex justify-center mt-1">

                <IcStar
                  size={18}
                  color="#F5C842"
                />

              </div>

            </div>

          </div>
        )}

      {/* ═══════════════════════════════════════
          BOTTOM CENTER
      ═══════════════════════════════════════ */}

      {(phase === 'playing' ||
        phase === 'question') && (
        <div
          className="absolute bottom-6 left-1/2 z-20 flex flex-col items-center gap-3"
          style={{
            transform:
              'translateX(-50%)',
          }}
        >

          {/* Speech */}

          <div className="relative">

            <div
              className="px-6 py-3 rounded-2xl text-center"
              style={{
                background: 'white',
                border:
                  '2px solid #D8C8F8',
                boxShadow:
                  '0 4px 16px rgba(124,92,191,0.2)',
              }}
            >

              <p
                className="font-black"
                style={{
                  color: '#4C1D95',
                  fontSize: '0.95rem',
                }}
              >
                {phase === 'playing'
                  ? 'اضغط للقفز!'
                  : 'كم قفزة قفزت؟'}
              </p>

            </div>

            <div
              className="absolute left-1/2 bottom-0 w-4 h-4"
              style={{
                transform:
                  'translateX(-50%) translateY(100%) rotate(45deg)',
                background: 'white',
                borderRight:
                  '2px solid #D8C8F8',
                borderBottom:
                  '2px solid #D8C8F8',
              }}
            />

          </div>

          {/* Jump */}

          {phase === 'playing' && (
            <button
              onClick={jump}
              disabled={
                pos >= q.end ||
                isJumping
              }
              className="rounded-full flex items-center justify-center"
              style={{
                width: 72,
                height: 72,

                background:
                  pos >= q.end ||
                  isJumping
                    ? 'rgba(124,92,191,0.35)'
                    : 'linear-gradient(135deg, #A98FE0, #7C5CBF)',

                boxShadow:
                  pos >= q.end ||
                  isJumping
                    ? 'none'
                    : '0 8px 28px rgba(124,92,191,0.55)',

                opacity:
                  pos >= q.end
                    ? 0.5
                    : 1,

                transition:
                  'all 0.2s',
              }}
            >

              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              >

                <path
                  d="M12 20 L12 4 M6 10 L12 4 L18 10"
                />

              </svg>

            </button>
          )}

          {/* Answers */}

          {phase === 'question' && (
            <div className="flex gap-3 justify-center">

              {choices.map(
                (choice, i) => (
                  <button
                    key={choice}
                    onClick={() =>
                      handleAnswer(choice)
                    }
                    className="rounded-2xl flex flex-col items-center justify-center gap-1"
                    style={{
                      width: 84,
                      height: 80,
                      background:
                        CHOICE_COLORS[
                          i %
                            CHOICE_COLORS.length
                        ],
                      border:
                        '3px solid rgba(124,92,191,0.3)',
                      boxShadow:
                        '0 6px 20px rgba(0,0,0,0.15)',
                      transition:
                        'transform 0.12s',
                    }}
                  >

                    {/* الإجابة بالأرقام العربية */}

                    <span
                      className="text-3xl font-black"
                      style={{
                        color: '#4C1D95',
                      }}
                    >
                      {arabicNumber(choice)}
                    </span>

                    <span
                      className="text-xs font-bold"
                      style={{
                        color: '#7C5CBF',
                      }}
                    >
                      قفزات
                    </span>

                  </button>
                )
              )}

            </div>
          )}

        </div>
      )}

      {/* ═══════════════════════════════════════
          INTRO
      ═══════════════════════════════════════ */}

      {phase === 'intro' && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center"
          style={{
            background:
              'rgba(76,29,149,0.45)',
            backdropFilter:
              'blur(4px)',
          }}
        >

          <div
            className="rounded-3xl p-8 text-center"
            style={{
              background: '#FFF5E8',
              border:
                '3px solid #E8D5B0',
              boxShadow:
                '0 24px 64px rgba(0,0,0,0.3)',
              maxWidth: 380,
              width: '90%',
            }}
          >

            <div className="w-28 h-28 mx-auto mb-3">

              <CharacterComponent
                character={character}
                state="welcome"
                width={112}
                shadow={false}
              />

            </div>

            <h2
              className="text-2xl font-black mb-2"
              style={{
                color: '#4C1D95',
              }}
            >
              خط الأعداد
            </h2>

            <p
              className="text-sm font-bold mb-6"
              style={{
                color: '#7C5CBF',
              }}
            >
              اقفز مع {charName} وتعلّم العد!
            </p>

            <button
              onClick={startRound}
              className="w-full py-4 rounded-2xl text-xl font-black text-white"
              style={{
                background:
                  'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                boxShadow:
                  '0 8px 24px rgba(109,40,217,0.5)',
              }}
            >
              نبدأ
            </button>

          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════
          CORRECT
      ═══════════════════════════════════════ */}

      {phase === 'correct' && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
        >

          <div
            className="text-center px-10 py-6 rounded-3xl"
            style={{
              background:
                'rgba(220,252,231,0.96)',
              border:
                '3px solid #86EFAC',
              boxShadow:
                '0 12px 40px rgba(74,222,128,0.35)',
            }}
          >

            <IcStar
              size={52}
              color="#F5C842"
            />

            <p
              className="text-2xl font-black mt-2"
              style={{
                color: '#166534',
              }}
            >
              أحسنت! {arabicNumber(q.steps)} قفزات
            </p>

          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════
          INCORRECT
      ═══════════════════════════════════════ */}

      {phase === 'incorrect' && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
        >

          <div
            className="px-8 py-5 rounded-2xl"
            style={{
              background:
                'rgba(167,139,250,0.95)',
              boxShadow:
                '0 8px 32px rgba(124,92,191,0.4)',
            }}
          >

            <p className="text-xl font-black text-white">
              حاول مرة ثانية!
            </p>

          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════
          ROUND END
      ═══════════════════════════════════════ */}

      {phase === 'round-end' && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center"
          style={{
            background:
              'rgba(76,29,149,0.45)',
            backdropFilter:
              'blur(4px)',
          }}
        >

          <div
            className="rounded-3xl p-8 text-center"
            style={{
              background: '#FFF5E8',
              border:
                '3px solid #E8D5B0',
              boxShadow:
                '0 24px 64px rgba(0,0,0,0.3)',
              maxWidth: 360,
              width: '90%',
            }}
          >

            <div className="w-24 h-24 mx-auto mb-3">

              <CharacterComponent
                character={character}
                state="celebrating"
                width={96}
                shadow={false}
              />

            </div>

            <h2
              className="text-2xl font-black mb-2"
              style={{
                color: '#4C1D95',
              }}
            >
              رائع! أكملت الجولات
            </h2>

            <div className="flex items-center justify-center gap-2 mb-6">

              <IcStar
                size={28}
                color="#F5C842"
              />

              <span
                className="text-2xl font-black"
                style={{
                  color: '#4C1D95',
                }}
              >
                {arabicNumber(
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
                }}
                className="flex-1 py-3 rounded-2xl font-black text-white"
                style={{
                  background:
                    'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                  boxShadow:
                    '0 6px 20px rgba(109,40,217,0.45)',
                }}
              >
                جولة ثانية
              </button>

              <button
                onClick={() =>
                  navigate('child-home')
                }
                className="flex-1 py-3 rounded-2xl font-black"
                style={{
                  background: '#EDE9FE',
                  color: '#4C1D95',
                  border:
                    '2px solid #C4B5FD',
                }}
              >
                الرئيسية
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}