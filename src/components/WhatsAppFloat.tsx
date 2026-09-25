import { useState } from 'react'
import './WhatsAppFloat.css'

const PHONE = '543804859460'
const MESSAGE =
  'Hola, me quise comunicar con usted porque tengo una consulta legal y quiero asesoramiento'

const waUrl = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M16.04 3C9.35 3 3.93 8.41 3.93 15.08c0 2.12.56 4.18 1.62 6.01L3 29l8.14-2.5a12.1 12.1 0 0 0 4.9 1.02h.01c6.69 0 12.11-5.41 12.11-12.08C28.16 8.41 22.73 3 16.04 3zm0 21.92h-.01a10.05 10.05 0 0 1-5.12-1.4l-.37-.22-4.83 1.48 1.5-4.7-.24-.38a10.03 10.03 0 0 1-1.54-5.36c0-5.55 4.53-10.06 10.1-10.06 5.56 0 10.09 4.51 10.09 10.06 0 5.55-4.53 10.06-10.08 10.06zm5.54-7.54c-.3-.15-1.79-.88-2.07-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.79-.73 2.04-1.44.25-.71.25-1.32.18-1.44-.08-.12-.28-.2-.58-.35z"
      />
    </svg>
  )
}

export default function WhatsAppFloat() {
  const [open, setOpen] = useState(false)

  return (
    <div className="wa-float">
      {open ? (
        <div className="wa-float__bubble" role="dialog" aria-label="Contacto por WhatsApp">
          <p>Comunicate con nosotros por WhatsApp</p>
          <div className="wa-float__actions">
            <button type="button" className="wa-float__btn wa-float__btn--ghost" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <a
              className="wa-float__btn wa-float__btn--solid"
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
            >
              Aceptar
            </a>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="wa-float__fab"
        aria-label="Abrir WhatsApp"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <WhatsAppIcon />
      </button>
    </div>
  )
}
