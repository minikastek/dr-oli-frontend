import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } }
  }
}

type Props = {
  url: string
}

/** Instagram Embed oficial (igual que Álvarez y Asoc.): blockquote + embed.js — sin librería extra */
export default function InstagramEmbed({ url }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const process = () => window.instgrm?.Embeds.process()

    if (window.instgrm) {
      process()
      return
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-ig-embed]')
    if (existing) {
      existing.addEventListener('load', process)
      return () => existing.removeEventListener('load', process)
    }

    const script = document.createElement('script')
    script.src = 'https://www.instagram.com/embed.js'
    script.async = true
    script.dataset.igEmbed = '1'
    script.addEventListener('load', process)
    document.body.appendChild(script)
    return () => script.removeEventListener('load', process)
  }, [url])

  return (
    <div className="ig-embed" ref={ref}>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
      >
        <a href={url} target="_blank" rel="noreferrer">
          Ver en Instagram
        </a>
      </blockquote>
    </div>
  )
}
