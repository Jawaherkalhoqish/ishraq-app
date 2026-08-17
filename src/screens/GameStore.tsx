import React, { useState, useCallback, useMemo } from 'react'
import type { ScreenProps } from '../components/ScreenProps'
import type { CharState } from '../types'
import CharacterComponent from '../components/Character'
import { sounds, playSound } from '../sounds/sound'

type Phase =
  | 'intro'
  | 'shopping'
  | 'question'
  | 'correct'
  | 'incorrect'
  | 'round-end'

interface Product {
  id: string
  name: string
  category: 'fruit' | 'vegetable' | 'sweet' | 'toy' | 'grocery'
  emoji: string
}

const PRODUCTS: Product[] = [
  { id: 'apple', name: 'تفاح', category: 'fruit', emoji: '🍎' },
  { id: 'banana', name: 'موز', category: 'fruit', emoji: '🍌' },
  { id: 'orange', name: 'برتقال', category: 'fruit', emoji: '🍊' },
  { id: 'grapes', name: 'عنب', category: 'fruit', emoji: '🍇' },
  { id: 'watermelon', name: 'بطيخ', category: 'fruit', emoji: '🍉' },

  { id: 'carrot', name: 'جزر', category: 'vegetable', emoji: '🥕' },
  { id: 'potato', name: 'بطاطس', category: 'vegetable', emoji: '🥔' },
  { id: 'broccoli', name: 'بروكلي', category: 'vegetable', emoji: '🥦' },
  { id: 'tomato', name: 'طماطم', category: 'vegetable', emoji: '🍅' },
  { id: 'corn', name: 'ذرة', category: 'vegetable', emoji: '🌽' },

  { id: 'cookie', name: 'بسكويت', category: 'sweet', emoji: '🍪' },
  { id: 'candy', name: 'حلوى', category: 'sweet', emoji: '🍬' },
  { id: 'cake', name: 'كيك', category: 'sweet', emoji: '🍰' },
  { id: 'donut', name: 'دونات', category: 'sweet', emoji: '🍩' },
  { id: 'bread', name: 'خبز', category: 'sweet', emoji: '🍞' },

  { id: 'teddy', name: 'دمية', category: 'toy', emoji: '🧸' },
  { id: 'ball', name: 'كرة', category: 'toy', emoji: '⚽' },
  { id: 'puzzle', name: 'لغز', category: 'toy', emoji: '🧩' },
  { id: 'car', name: 'سيارة', category: 'toy', emoji: '🚗' },
  { id: 'kite', name: 'طائرة ورقية', category: 'toy', emoji: '🪁' },

  { id: 'milk', name: 'حليب', category: 'grocery', emoji: '🥛' },
  { id: 'juice', name: 'عصير', category: 'grocery', emoji: '🧃' },
  { id: 'egg', name: 'بيض', category: 'grocery', emoji: '🥚' },
  { id: 'cheese', name: 'جبن', category: 'grocery', emoji: '🧀' },
  { id: 'honey', name: 'عسل', category: 'grocery', emoji: '🍯' },
]

const SHELF_THEME = {
  fruit: { icon: '🍎', pill: '#FFE1DE', text: '#C4432E', rail: '#F2B7AC' },
  vegetable: { icon: '🥦', pill: '#E1F5D8', text: '#3E8A3F', rail: '#B9DFAA' },
  sweet: { icon: '🧁', pill: '#FFE1F0', text: '#C23E82', rail: '#F2B4D3' },
  toy: { icon: '🧸', pill: '#DCEAFF', text: '#3868C4', rail: '#AEC9F2' },
  grocery: { icon: '🛒', pill: '#EAE0FF', text: '#7C5CBF', rail: '#CDBBF0' },
} as const

const SHELVES: { title: string; category: keyof typeof SHELF_THEME }[] = [
  { title: 'الفواكه', category: 'fruit' },
  { title: 'الخضروات', category: 'vegetable' },
  { title: 'حلويات ومخبوزات', category: 'sweet' },
  { title: 'ألعاب ودمى', category: 'toy' },
  { title: 'منتجات البقالة', category: 'grocery' },
]

function getProduct(id: string) {
  return PRODUCTS.find(p => p.id === id)!
}

/* تحويل الأرقام الإنجليزية إلى أرقام عربية عند العرض فقط */
function toArabicNumbers(value: number | string) {
  return String(value).replace(
    /\d/g,
    digit => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]
  )
}

function generateOrder() {
  const fruits = PRODUCTS.filter(p => p.category === 'fruit')
  const vegetables = PRODUCTS.filter(p => p.category === 'vegetable')

  const first = fruits[Math.floor(Math.random() * fruits.length)]
  const second =
    vegetables[Math.floor(Math.random() * vegetables.length)]

  const qa = 1 + Math.floor(Math.random() * 3)
  const qb = 1 + Math.floor(Math.random() * 3)

  return {
    a: first,
    b: second,
    qa,
    qb,
    answer: qa + qb,
  }
}

function generateChoices(answer: number) {
  const values = new Set<number>([answer])

  while (values.size < 3) {
    const offset = Math.random() > 0.5 ? 1 : -1
    const value = Math.max(
      1,
      answer + offset * (1 + Math.floor(Math.random() * 2))
    )

    values.add(value)
  }

  return [...values].sort(() => Math.random() - 0.5)
}

/* ─────────────────────────────────────────────
   Product Card
───────────────────────────────────────────── */

function ProductCard({
  product,
  enabled,
  selected,
  fulfilled,
  onClick,
}: {
  product: Product
  enabled: boolean
  selected: boolean
  fulfilled: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      aria-label={product.name}
      className="group relative flex flex-col items-center justify-end"
      style={{
        width: 78,
        height: 78,
        cursor: enabled ? 'pointer' : 'default',
        transition: 'transform .16s ease',
      }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          width: 74,
          height: 74,
          borderRadius: 22,
          background:
            'radial-gradient(circle at 30% 24%, #FFFFFF 0%, #FCFAFF 45%, #EFE7FC 100%)',
          border: selected
            ? '3px solid #F5C842'
            : '2px solid rgba(124,92,191,.18)',
          boxShadow: selected
            ? '0 12px 22px rgba(245,200,66,.35), inset 0 -4px 8px rgba(124,92,191,.10), inset 0 2px 3px rgba(255,255,255,.9)'
            : '0 10px 18px rgba(92,72,145,.20), inset 0 -4px 8px rgba(124,92,191,.08), inset 0 2px 3px rgba(255,255,255,.9)',
          transition: 'all .16s ease',
        }}
      >
        <span
          style={{
            fontSize: 42,
            lineHeight: 1,
            filter: 'drop-shadow(0 4px 5px rgba(0,0,0,.14))',
            opacity: fulfilled ? 0.55 : 1,
          }}
        >
          {product.emoji}
        </span>

        {enabled && !fulfilled && (
          <span
            className="absolute"
            style={{
              top: -7,
              right: -7,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background:
                'linear-gradient(135deg,#B7A0EE,#7C5CBF)',
              color: '#fff',
              fontSize: 16,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 8px rgba(124,92,191,.35)',
            }}
          >
            +
          </span>
        )}

        {fulfilled && (
          <span
            className="absolute"
            style={{
              top: -7,
              right: -7,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: '#3EAE5C',
              color: '#fff',
              fontSize: 13,
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 8px rgba(62,174,92,.35)',
            }}
          >
            ✓
          </span>
        )}
      </div>
    </button>
  )
}

/* ─────────────────────────────────────────────
   Shelf
───────────────────────────────────────────── */

function Shelf({
  title,
  category,
  products,
  order,
  basket,
  phase,
  onProduct,
}: {
  title: string
  category: keyof typeof SHELF_THEME
  products: Product[]
  order: any
  basket: string[]
  phase: Phase
  onProduct: (id: string) => void
}) {
  const theme = SHELF_THEME[category]

  return (
    <section
      style={{
        position: 'relative',
        background:
          'linear-gradient(180deg,#FFFFFF 0%,#FFF7E8 100%)',
        borderRadius: 24,
        border: '2px solid rgba(201,138,75,.22)',
        boxShadow:
          '0 20px 40px rgba(120,84,40,.16), 0 2px 0 rgba(255,255,255,.9) inset',
        padding: '32px 16px 16px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '8px 16px',
          borderRadius: 999,
          background: theme.pill,
          border: '2px solid rgba(255,255,255,.8)',
          boxShadow: '0 8px 16px rgba(120,84,40,.22)',
        }}
      >
        <span style={{ fontSize: 17 }}>{theme.icon}</span>

        <span
          style={{
            color: theme.text,
            fontSize: 14,
            fontWeight: 950,
          }}
        >
          {title}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 6,
          alignItems: 'end',
        }}
      >
        {products.map(product => {
          const needed =
            product.id === order.a.id
              ? order.qa
              : product.id === order.b.id
                ? order.qb
                : 0

          const collected = basket.filter(
            x => x === product.id
          ).length

          return (
            <ProductCard
              key={product.id}
              product={product}
              selected={collected > 0}
              fulfilled={
                needed > 0 && collected >= needed
              }
              enabled={phase === 'shopping'}
              onClick={() => onProduct(product.id)}
            />
          )
        })}
      </div>

      <div
        style={{
          height: 20,
          borderRadius: '4px 4px 10px 10px',
          marginTop: 10,
          background:
            'repeating-linear-gradient(90deg,#E7B778 0 3px,#DCA968 3px 6px), linear-gradient(180deg,#E7B778 0%,#C98A4B 55%,#A6702F 100%)',
          backgroundBlendMode: 'overlay, normal',
          boxShadow:
            '0 8px 14px rgba(120,84,40,.28), inset 0 2px 3px rgba(255,255,255,.4), inset 0 -4px 6px rgba(90,58,20,.25)',
          borderBottom: `4px solid ${theme.rail}`,
        }}
      />
    </section>
  )
}

/* ─────────────────────────────────────────────
   Order Card
───────────────────────────────────────────── */

function OrderCard({
  order,
  basket,
}: {
  order: any
  basket: string[]
}) {
  const aCollected = basket.filter(
    x => x === order.a.id
  ).length

  const bCollected = basket.filter(
    x => x === order.b.id
  ).length

  return (
    <div
      style={{
        background: 'rgba(255,255,255,.97)',
        border: '2px solid rgba(169,143,224,.24)',
        borderRadius: 22,
        padding: '10px 20px',
        boxShadow: '0 10px 28px rgba(70,55,110,.13)',
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 900,
          color: '#8878B0',
          marginBottom: 5,
          textAlign: 'center',
        }}
      >
        طلبية اليوم
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <OrderItem
          product={order.a}
          count={order.qa}
          collected={aCollected}
        />

        <div
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: '#B7A7DE',
          }}
        >
          +
        </div>

        <OrderItem
          product={order.b}
          count={order.qb}
          collected={bCollected}
        />
      </div>
    </div>
  )
}

function OrderItem({
  product,
  count,
  collected,
}: {
  product: Product
  count: number
  collected: number
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <span style={{ fontSize: 23 }}>
        {product.emoji}
      </span>

      <div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 950,
            color: '#3E3265',
          }}
        >
          {toArabicNumbers(count)} × {product.name}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 4,
            marginTop: 3,
          }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <span
              key={i}
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background:
                  i < collected
                    ? '#F5C842'
                    : '#E6DFF5',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Shopping Basket
───────────────────────────────────────────── */

function ShoppingCart({
  basket,
}: {
  basket: string[]
}) {
  return (
    <div
      style={{
        width: 280,
        minHeight: 118,
        background:
          'repeating-linear-gradient(115deg,#E7C08A 0 8px,#D9A66C 8px 16px)',
        borderRadius: '20px 20px 30px 30px',
        border: '4px solid #7C5CBF',
        boxShadow: '0 15px 32px rgba(72,56,120,.22)',
        position: 'relative',
        padding: '14px 16px 18px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 118,
          height: 26,
          border: '8px solid #7C5CBF',
          borderBottom: 0,
          borderRadius: '18px 18px 0 0',
        }}
      />

      <div
        style={{
          color: '#FFFFFF',
          fontSize: 13,
          fontWeight: 950,
          marginBottom: 8,
          textShadow: '0 2px 4px rgba(80,60,30,.35)',
        }}
      >
        🧺 سلة التسوق
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          flexWrap: 'wrap',
          minHeight: 48,
          background: 'rgba(255,255,255,.55)',
          borderRadius: 14,
          padding: 8,
        }}
      >
        {basket.length === 0 ? (
          <span
            style={{
              color: '#6B5A3F',
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            اسحب المنتجات وضعها هنا
          </span>
        ) : (
          basket.map((id, i) => (
            <div
              key={`${id}-${i}`}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow:
                  '0 4px 10px rgba(80,65,120,.14)',
                fontSize: 26,
              }}
            >
              {getProduct(id).emoji}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main Game
───────────────────────────────────────────── */

export default function GameStore({
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

  const [order, setOrder] =
    useState(generateOrder)

  const [basket, setBasket] =
    useState<string[]>([])

  const [roundNum, setRoundNum] =
    useState(1)

  const [roundStars, setRoundStars] =
    useState(0)

  const [errors, setErrors] =
    useState(0)

  const [showHint, setShowHint] =
    useState(false)

  const [charState, setCharState] =
    useState<CharState>('welcome')

  const choices = useMemo(
    () => generateChoices(order.answer),
    [order]
  )

  const dialogue: Record<Phase, string> = {
    intro: `أهلًا! أنا ${charName}. هيا نتسوق معًا!`,
    shopping:
      'اجمع كل المنتجات الموجودة في طلبية اليوم.',
    question:
      'كم عدد المنتجات التي جمعتها؟',
    correct:
      'ممتاز! أحسنت، إجابة صحيحة.',
    incorrect:
      'لا بأس، جرّب هذا المنتج بدل هذا.',
    'round-end':
      'رائع! أكملت الجولة بنجاح.',
  }

  const startRound = useCallback(() => {
    const newOrder = generateOrder()

    setOrder(newOrder)
    setBasket([])
    setShowHint(false)
    setPhase('shopping')
    setCharState('shopping')

    unlockAchievement('first_adventure')
  }, [unlockAchievement])

  const handleProduct = (id: string) => {
    if (phase !== 'shopping') return

    const needed =
      id === order.a.id
        ? order.qa
        : id === order.b.id
          ? order.qb
          : 0

    const current = basket.filter(
      x => x === id
    ).length

    if (needed === 0) {
      setErrors(e => e + 1)
      setShowHint(true)
      setCharState('hint')
      setPhase('incorrect')

      setTimeout(() => {
        setPhase('shopping')
        setCharState('shopping')
      }, 1500)

      return
    }

    if (current >= needed) {
      setCharState('hint')

      setTimeout(
        () => setCharState('shopping'),
        450
      )

      return
    }

    const next = [...basket, id]

    setBasket(next)
    playSound(sounds.purchaseItem)
    setCharState('shopping')

    const complete =
      next.filter(
        x => x === order.a.id
      ).length >= order.qa &&
      next.filter(
        x => x === order.b.id
      ).length >= order.qb

    if (complete) {
      setTimeout(() => {
        setPhase('question')
        setCharState('thinking')
      }, 550)
    }
  }

  const handleAnswer = (answer: number) => {
    if (answer === order.answer) {
      addStars(1)
      setRoundStars(s => s + 1)
      setErrors(0)
      setShowHint(false)
      setCharState('celebrating')
      setPhase('correct')

      setTimeout(() => {
        if (roundNum >= 5) {
          playSound(sounds.roundComplete)
          setPhase('round-end')
        } else {
          setRoundNum(n => n + 1)
          startRound()
        }
      }, 1900)
    } else {
      const nextErrors = errors + 1

      setErrors(nextErrors)
      setShowHint(true)
      setCharState('hint')
      setPhase('incorrect')

      if (nextErrors >= 3) {
        triggerSmartBreak('game-store')
      }

      setTimeout(() => {
        setPhase('question')
        setCharState('thinking')
      }, 1900)
    }
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      dir="rtl"
      style={{
        background:
          'linear-gradient(180deg,#FFF8ED 0%,#FFF1DC 38%,#FDEAE2 100%)',
      }}
    >
      {/* STORE ENVIRONMENT */}

      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: 280,
            background:
              'radial-gradient(70% 100% at 50% 0%, rgba(255,214,150,.75) 0%, rgba(255,214,150,.25) 45%, rgba(255,214,150,0) 75%)',
          }}
        />

        <div
          className="absolute"
          style={{
            top: -60,
            left: -60,
            width: 260,
            height: 260,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(169,143,224,.28) 0%, rgba(169,143,224,0) 70%)',
            filter: 'blur(4px)',
          }}
        />

        <div
          className="absolute"
          style={{
            top: -40,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,180,150,.25) 0%, rgba(255,180,150,0) 70%)',
            filter: 'blur(4px)',
          }}
        />

        <div className="absolute top-0 left-0 right-0 flex justify-center gap-40">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                position: 'relative',
                top: 4,
              }}
            >
              <div
                style={{
                  width: 2,
                  height: 26,
                  margin: '0 auto',
                  background: '#E3CFA3',
                }}
              />

              <div
                style={{
                  width: 46,
                  height: 22,
                  borderRadius:
                    '4px 4px 20px 20px',
                  background:
                    'linear-gradient(180deg,#FFF6E0,#FFE3A8)',
                  boxShadow:
                    '0 0 34px rgba(255,214,140,1), 0 4px 10px rgba(150,110,60,.22)',
                }}
              />
            </div>
          ))}
        </div>

        <div
          className="absolute left-0 right-0 bottom-0"
          style={{
            height: 108,
            background:
              'linear-gradient(180deg,#F7DEC3 0%,#E8C299 100%)',
            borderTop: '3px solid #D9AC77',
            boxShadow:
              'inset 0 6px 18px rgba(120,84,40,.10)',
          }}
        />

        <div
          className="absolute left-0 right-0 bottom-0"
          style={{
            height: 108,
            opacity: 0.4,
            backgroundImage:
              'linear-gradient(90deg,rgba(130,85,40,.20) 1px,transparent 1px),linear-gradient(rgba(130,85,40,.20) 1px,transparent 1px)',
            backgroundSize: '80px 42px',
          }}
        />
      </div>

      {/* TOP BAR */}

      <div className="absolute z-40 top-4 left-5 right-5 flex items-start justify-between">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <button
            onClick={() =>
              navigate('child-home')
            }
            style={{
              width: 46,
              height: 46,
              borderRadius: 15,
              background: '#FFFFFF',
              border: '1px solid #E8E0F5',
              boxShadow:
                '0 6px 18px rgba(75,60,120,.12)',
              color: '#7C5CBF',
              fontSize: 23,
              fontWeight: 900,
            }}
          >
            ‹
          </button>

          <div
            style={{
              padding: '7px 14px',
              borderRadius: 999,
              background:
                'linear-gradient(135deg,#A98FE0,#7C5CBF)',
              boxShadow:
                '0 6px 14px rgba(124,92,191,.30)',
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 900,
              whiteSpace: 'nowrap',
            }}
          >
            متجر مشرق
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              padding: '9px 15px',
              borderRadius: 17,
              background: '#FFFFFF',
              boxShadow:
                '0 6px 18px rgba(75,60,120,.12)',
              color: '#3F3265',
              fontSize: 17,
              fontWeight: 950,
            }}
          >
            ⭐ {toArabicNumbers(state.stars)}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 5,
              padding: '11px 12px',
              borderRadius: 17,
              background: '#FFFFFF',
              boxShadow:
                '0 6px 18px rgba(75,60,120,.12)',
            }}
          >
            {[1, 2, 3, 4, 5].map(i => (
              <span
                key={i}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background:
                    i <= roundNum
                      ? '#F5C842'
                      : '#DDD5EC',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ORDER CARD */}

      {phase !== 'intro' && (
        <div
          className="absolute z-30"
          style={{
            top: 68,
            left: '50%',
            transform:
              'translateX(-50%)',
          }}
        >
          <OrderCard
            order={order}
            basket={basket}
          />
        </div>
      )}

      {/* STORE SHELVES */}

      <div
        className="absolute z-10"
        style={{
          top: 168,
          left: 24,
          right: 24,
          bottom: 200,
          display: 'grid',
          gridTemplateColumns:
            '1fr 1fr',
          gridAutoRows:
            'minmax(0, 1fr)',
          gap: 14,
          overflow: 'auto',
        }}
      >
        {SHELVES.map(
          ({ title, category }, i) => (
            <div
              key={category}
              style={
                i ===
                SHELVES.length - 1
                  ? {
                      gridColumn:
                        '1 / -1',
                    }
                  : undefined
              }
            >
              <Shelf
                title={title}
                category={category}
                products={PRODUCTS.filter(
                  p =>
                    p.category ===
                    category
                )}
                order={order}
                basket={basket}
                phase={phase}
                onProduct={
                  handleProduct
                }
              />
            </div>
          )
        )}
      </div>

      {/* CHECKOUT COUNTER + CHARACTER */}

      <div
        className="absolute z-30"
        style={{
          bottom: 16,
          left: '50%',
          transform:
            'translateX(-50%)',
          width: 250,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: -60,
            right: -60,
            height: 52,
            borderRadius:
              '20px 20px 10px 10px',
            background:
              'linear-gradient(180deg,#F0C88A 0%,#D9A05C 55%,#B87A3D 100%)',
            border:
              '2px solid rgba(255,255,255,.5)',
            borderBottom: 'none',
            boxShadow:
              '0 14px 28px rgba(120,84,40,.32), inset 0 2px 3px rgba(255,255,255,.5)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            marginBottom: -5,
          }}
        >
          <CharacterComponent
            character={character}
            state={charState}
            width={150}
            shadow={false}
          />
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 3,
            margin: '0 auto',
            width: 220,
            minHeight: 48,
            padding: '11px 15px',
            borderRadius: 18,
            background: '#FFFFFF',
            border:
              '2px solid #E7DDF7',
            boxShadow:
              '0 8px 20px rgba(72,55,115,.14)',
          }}
        >
          <span
            style={{
              color: '#44376C',
              fontSize: 13,
              fontWeight: 850,
            }}
          >
            {dialogue[phase]}
          </span>
        </div>
      </div>

      {/* BASKET */}

      {phase !== 'intro' && (
        <div
          className="absolute z-40"
          style={{
            left: 26,
            bottom: 22,
          }}
        >
          <ShoppingCart
            basket={basket}
          />
        </div>
      )}

      {/* HINT BUTTON */}

      {phase === 'shopping' && (
        <button
          onClick={() => {
            setShowHint(true)
            setCharState('hint')
          }}
          style={{
            position: 'absolute',
            zIndex: 50,
            bottom: 22,
            right: 25,
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '12px 18px',
            borderRadius: 17,
            background:
              'linear-gradient(135deg,#A98FE0,#7C5CBF)',
            color: '#FFFFFF',
            border: 'none',
            boxShadow:
              '0 8px 20px rgba(124,92,191,.28)',
            fontSize: 14,
            fontWeight: 900,
          }}
        >
          <span
            style={{
              fontSize: 21,
            }}
          >
            💡
          </span>
          تلميح
        </button>
      )}

      {showHint &&
        phase === 'shopping' && (
          <div
            className="absolute z-50"
            style={{
              right: 25,
              bottom: 81,
              width: 260,
              padding: 15,
              borderRadius: 20,
              background: '#FFFFFF',
              border:
                '2px solid #D9CDF0',
              boxShadow:
                '0 12px 28px rgba(70,55,110,.18)',
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 950,
                color: '#7C5CBF',
                marginBottom: 7,
              }}
            >
              تلميح
            </div>

            <div
              style={{
                color: '#51476A',
                fontSize: 12,
                fontWeight: 750,
                lineHeight: 1.7,
              }}
            >
              ابحث عن:
              <br />
              {toArabicNumbers(
                order.qa
              )}{' '}
              × {order.a.name}
              <br />
              {toArabicNumbers(
                order.qb
              )}{' '}
              × {order.b.name}
            </div>
          </div>
        )}

      {/* QUESTION */}

      {phase === 'question' && (
        <div
          className="absolute z-50"
          style={{
            inset: 0,
            background:
              'rgba(245,241,255,.55)',
            backdropFilter:
              'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'center',
          }}
        >
          <div
            style={{
              width: 390,
              padding: 28,
              borderRadius: 28,
              background: '#FFFFFF',
              border:
                '2px solid #E4DAF4',
              boxShadow:
                '0 24px 55px rgba(68,50,110,.20)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                color: '#8878B0',
                fontSize: 13,
                fontWeight: 900,
                marginBottom: 6,
              }}
            >
              أحسنت! جمعت كل المنتجات
            </div>

            <h2
              style={{
                color: '#392C60',
                fontSize: 25,
                fontWeight: 950,
                margin:
                  '0 0 15px',
              }}
            >
              كم عدد المنتجات؟
            </h2>

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'center',
                alignItems: 'center',
                gap: 12,
                marginBottom: 20,
                fontSize: 20,
                fontWeight: 950,
                color: '#56467E',
              }}
            >
              {toArabicNumbers(
                order.qa
              )}{' '}
              +{' '}
              {toArabicNumbers(
                order.qb
              )}{' '}
              = ؟
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(3,1fr)',
                gap: 10,
              }}
            >
              {choices.map(choice => (
                <button
                  key={choice}
                  onClick={() =>
                    handleAnswer(
                      choice
                    )
                  }
                  style={{
                    height: 64,
                    borderRadius: 18,
                    border:
                      '2px solid #DDD3F1',
                    background:
                      '#FAF8FF',
                    color: '#45366E',
                    fontSize: 25,
                    fontWeight: 950,
                    boxShadow:
                      '0 5px 12px rgba(80,65,120,.08)',
                  }}
                >
                  {toArabicNumbers(
                    choice
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* INTRO */}

      {phase === 'intro' && (
        <div
          className="absolute z-[60] inset-0"
          style={{
            background:
              'rgba(255,244,225,.55)',
            backdropFilter:
              'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'center',
          }}
        >
          <div
            style={{
              width: 420,
              padding: 30,
              borderRadius: 30,
              background: '#FFFFFF',
              border:
                '2px solid #E6DCF5',
              boxShadow:
                '0 25px 65px rgba(65,50,105,.20)',
              textAlign: 'center',
            }}
          >
            <CharacterComponent
              character={character}
              state="welcome"
              width={115}
              shadow={false}
            />

            <h1
              style={{
                margin:
                  '10px 0 5px',
                color: '#3D2E66',
                fontSize: 28,
                fontWeight: 950,
              }}
            >
              متجر مشرق
            </h1>

            <p
              style={{
                margin:
                  '0 0 22px',
                color: '#8878B0',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              ساعد {charName} في جمع
              طلبية اليوم وتعلّم الجمع
              بطريقة ممتعة.
            </p>

            <button
              onClick={startRound}
              style={{
                width: '100%',
                height: 58,
                borderRadius: 18,
                border: 'none',
                background:
                  'linear-gradient(135deg,#A98FE0,#7C5CBF)',
                color: '#FFFFFF',
                fontSize: 17,
                fontWeight: 950,
                boxShadow:
                  '0 10px 25px rgba(124,92,191,.28)',
              }}
            >
              ابدأ التسوق
            </button>
          </div>
        </div>
      )}

      {/* CORRECT */}

      {phase === 'correct' && (
        <div
          className="absolute z-[70] inset-0 pointer-events-none"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'center',
          }}
        >
          <div
            style={{
              padding:
                '20px 35px',
              borderRadius: 25,
              background:
                'rgba(255,255,255,.96)',
              border:
                '2px solid #F5C842',
              boxShadow:
                '0 15px 35px rgba(80,65,110,.16)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 44,
              }}
            >
              ⭐
            </div>

            <div
              style={{
                color: '#4E3C7A',
                fontSize: 27,
                fontWeight: 950,
              }}
            >
              ممتاز!
            </div>

            <div
              style={{
                color: '#9A8AB7',
                fontSize: 13,
                fontWeight: 750,
                marginTop: 3,
              }}
            >
              الإجابة الصحيحة:{' '}
              {toArabicNumbers(
                order.answer
              )}
            </div>
          </div>
        </div>
      )}

      {/* INCORRECT */}

      {phase === 'incorrect' && (
        <div
          className="absolute z-[70]"
          style={{
            left: '50%',
            bottom: 170,
            transform:
              'translateX(-50%)',
            padding:
              '13px 22px',
            borderRadius: 18,
            background: '#FFFFFF',
            border:
              '2px solid #D9D0EE',
            boxShadow:
              '0 10px 25px rgba(70,55,110,.15)',
            color: '#594B78',
            fontSize: 14,
            fontWeight: 900,
          }}
        >
          {dialogue.incorrect}
        </div>
      )}

      {/* ROUND END */}

      {phase === 'round-end' && (
        <div
          className="absolute z-[80] inset-0"
          style={{
            background:
              'rgba(255,244,225,.70)',
            backdropFilter:
              'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'center',
          }}
        >
          <div
            style={{
              width: 400,
              padding: 32,
              borderRadius: 30,
              background: '#FFFFFF',
              border:
                '2px solid #E4D9F5',
              boxShadow:
                '0 25px 60px rgba(65,50,105,.20)',
              textAlign: 'center',
            }}
          >
            <CharacterComponent
              character={character}
              state="celebrating"
              width={105}
              shadow={false}
            />

            <h2
              style={{
                color: '#3D2E66',
                fontSize: 27,
                fontWeight: 950,
                margin:
                  '8px 0',
              }}
            >
              رائع!
            </h2>

            <p
              style={{
                color: '#8878B0',
                fontSize: 14,
                fontWeight: 750,
                marginBottom: 20,
              }}
            >
              أكملت الجولة بنجاح
            </p>

            <div
              style={{
                fontSize: 25,
                fontWeight: 950,
                color: '#C49008',
                marginBottom: 20,
              }}
            >
              ⭐{' '}
              {toArabicNumbers(
                roundStars
              )}{' '}
              نجوم
            </div>

            <div
              style={{
                display: 'flex',
                gap: 10,
              }}
            >
              <button
                onClick={() => {
                  setRoundNum(1)
                  setRoundStars(0)
                  setPhase('intro')
                  setCharState(
                    'welcome'
                  )
                }}
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 17,
                  border: 'none',
                  background:
                    'linear-gradient(135deg,#A98FE0,#7C5CBF)',
                  color: '#FFFFFF',
                  fontWeight: 900,
                }}
              >
                جولة ثانية
              </button>

              <button
                onClick={() =>
                  navigate(
                    'child-home'
                  )
                }
                style={{
                  flex: 1,
                  height: 52,
                  borderRadius: 17,
                  border:
                    '2px solid #E1D7F2',
                  background:
                    '#FAF8FF',
                  color: '#7C5CBF',
                  fontWeight: 900,
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