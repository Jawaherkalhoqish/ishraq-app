import type { CharState } from "../types"
const mushriqImg = "https://i.postimg.cc/FFW4sV9z/image-(1).png"
const mushriqaImg = "https://i.postimg.cc/YCgKRcQg/image-(2).png"
export { mushriqImg, mushriqaImg }

/* Animation class per state */
const ANIM: Record<CharState, string> = {
  idle: "animate-float-slow",
  welcome: "animate-float",
  correct: "animate-celebrate",
  incorrect: "animate-wiggle",
  hint: "animate-float-slow",
  celebrating: "animate-celebrate",
  breathing: "animate-float-slow",
  shopping: "animate-float-slow",
  thinking: "animate-wiggle",
}

/* Glow filter per state — warm gold for success, cool purple for idle/hint */
const GLOW: Record<CharState, string> = {
  idle: "drop-shadow(0 16px 32px rgba(169,143,224,0.3))",
  welcome: "drop-shadow(0 16px 36px rgba(169,143,224,0.5))",
  correct:
    "drop-shadow(0 0 40px rgba(245,200,66,0.9)) drop-shadow(0 16px 32px rgba(245,200,66,0.5))",
  incorrect: "drop-shadow(0 12px 24px rgba(123,184,240,0.35))",
  hint: "drop-shadow(0 12px 28px rgba(169,143,224,0.45))",
  celebrating:
    "drop-shadow(0 0 56px rgba(245,200,66,1)) drop-shadow(0 0 24px rgba(255,230,80,0.8))",
  breathing: "drop-shadow(0 0 28px rgba(169,143,224,0.55))",
  shopping: "drop-shadow(0 12px 28px rgba(200,140,60,0.3))",
  thinking: "drop-shadow(0 12px 24px rgba(169,143,224,0.35))",
}

interface Props {
  character: "mushriq" | "mushriqa"
  state: CharState
  /** Width in px — height scales automatically (image is portrait ratio ~0.85:1 for mushriq, ~0.75:1 for mushriqa) */
  width?: number
  /** Show a soft ellipse ground-shadow beneath the character */
  shadow?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Renders a character image directly onto any background — no container,
 * no frame, no box. The transparent PNG blends naturally into the scene.
 * A subtle radial ground shadow can be optionally shown beneath the feet.
 */
export default function Character({
  character,
  state,
  width = 180,
  shadow = true,
  className = "",
  style,
}: Props) {
  const img = character === "mushriq" ? mushriqImg : mushriqaImg
  const name = character === "mushriq" ? "مشرق" : "مشرقة"

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      style={style}
    >
      {/* Character image — no background, no border, no overflow:hidden */}
      <img
        src={img}
        alt={name}
        width={width}
        className={`object-contain block ${ANIM[state]}`}
        style={{
          filter: GLOW[state],
          transition: "filter 0.4s ease",
          imageRendering: "crisp-edges",
          maxWidth: "100%",
        }}
        draggable={false}
      />

      {/* Ground shadow — a blurred ellipse beneath the feet */}
      {shadow && (
        <div
          className="absolute bottom-0 left-1/2"
          style={{
            width: width * 0.65,
            height: 14,
            background:
              "radial-gradient(ellipse, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 70%)",
            borderRadius: "50%",
            transform: "translate(-50%, 4px)",
            filter: "blur(4px)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  )
}
