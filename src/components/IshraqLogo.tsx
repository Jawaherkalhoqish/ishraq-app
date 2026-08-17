import logoSrc from '../imports/Logo_2.PNG'

interface Props {
  size?: number
  className?: string
  style?: React.CSSProperties
}

export default function IshraqLogo({ size = 80, className = '', style }: Props) {
  return (
    <img
      src={logoSrc}
      alt="إشراق"
      width={size}
      height={size}
      className={className}
      draggable={false}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        mixBlendMode: 'screen',
        ...style,
      }}
    />
  )
}
