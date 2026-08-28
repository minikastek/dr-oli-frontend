type LogoMarkProps = {
  className?: string
  color?: string
  /** Alto en px o CSS */
  height?: number | string
  title?: string
}

/** Marca O|C para navbar — SVG vectorial (nítido a cualquier tamaño) */
export default function LogoMark({
  className = '',
  color,
  height = 36,
  title = 'OC & Asociados',
}: LogoMarkProps) {
  const h = typeof height === 'number' ? `${height}px` : height

  return (
    <svg
      className={`logo-mark ${className}`.trim()}
      viewBox="0 0 120 56"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      style={{ height: h, width: 'auto', color: color || undefined }}
    >
      <title>{title}</title>
      <text
        x="28"
        y="42"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="'Cinzel', 'Times New Roman', serif"
        fontSize="42"
        fontWeight="500"
        letterSpacing="0.02em"
      >
        O
      </text>
      <line
        x1="60"
        y1="10"
        x2="60"
        y2="46"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <text
        x="92"
        y="42"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="'Cinzel', 'Times New Roman', serif"
        fontSize="42"
        fontWeight="500"
        letterSpacing="0.02em"
      >
        C
      </text>
    </svg>
  )
}
