type LogoProps = {
  className?: string
  /** Color del logo (CSS). Default: currentColor del padre */
  color?: string
  /** Alto en CSS (ej: 48, '3rem'). El ancho se ajusta solo. */
  height?: number | string
  title?: string
}

/**
 * Logo OC & Asociados.
 * Color: prop `color` o `color` CSS del padre (currentColor).
 * Tamaño: prop `height` o clase CSS.
 * Técnica: mask sobre PNG transparente → se recolorea sin tocar el archivo.
 */
export default function Logo({
  className = '',
  color,
  height = 48,
  title = 'OC & Asociados — Estudio Jurídico',
}: LogoProps) {
  const h = typeof height === 'number' ? `${height}px` : height

  return (
    <span
      className={`logo ${className}`.trim()}
      role="img"
      aria-label={title}
      title={title}
      style={{
        height: h,
        color: color || undefined,
      }}
    />
  )
}
