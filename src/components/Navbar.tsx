import { useState } from 'react'
import LogoMark from './LogoMark'
import './Navbar.css'

const links = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#estudio', label: 'Sobre el estudio' },
  { href: '#areas', label: 'Qué ofrecemos' },
  { href: '#abogados', label: 'Equipo' },
  { href: '#turnos', label: 'Turnos' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="#inicio" className="nav__brand" onClick={() => setOpen(false)}>
          <LogoMark height={34} color="#c5a059" />
        </a>
        <button
          className="nav__toggle"
          type="button"
          aria-label="Menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`nav__links ${open ? 'is-open' : ''}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
