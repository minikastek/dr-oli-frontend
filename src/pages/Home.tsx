import { useState, type FormEvent } from 'react'
import InstagramEmbed from '../components/InstagramEmbed'
import Logo from '../components/Logo'
import '../components/Logo.css'
import { IG_HANDLE, IG_POSTS, IG_PROFILE } from '../instagram'
import './Home.css'

const lawyers = [
  {
    id: 'mariela',
    name: 'Mariela Olivera Villafañe',
    role: 'Socia',
    specialty: 'Derecho Laboral y Previsional',
    bio: 'Lidera el estudio con un enfoque cercano y resolutivo en asesoramiento legal integral.',
    photo:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'laura',
    name: 'Laura Chumbita',
    role: 'Abogada',
    specialty: 'Derecho Civil y Comercial',
    bio: 'Acompaña a particulares y empresas en contratos, conflictos y gestión jurídica cotidiana.',
    photo:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ana',
    name: 'Ana Belén Gómez',
    role: 'Abogada',
    specialty: 'Derecho de Familia',
    bio: 'Brinda asesoramiento claro y humano en procesos familiares y consultas personalizadas.',
    photo:
      'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80',
  },
]

const areas = [
  { title: 'Asesoramiento laboral', desc: 'Despidos, liquidaciones y negociaciones.' },
  { title: 'Derecho societario', desc: 'Constitución, contratos y conflictos societarios.' },
  { title: 'Divorcios', desc: 'Procesos consensuados y contenciosos.' },
  { title: 'Sucesiones', desc: 'Trámites hereditarios con acompañamiento integral.' },
]

export default function Home() {
  const [lawyerId, setLawyerId] = useState(lawyers[0].id)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState<'turno' | 'consulta'>('turno')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    // ponytail: sin API de turnos aún; solo feedback local hasta conectar backend
    setSent(true)
  }

  return (
    <main>
      <section id="inicio" className="hero">
        <div className="hero__inner">
          <Logo className="hero__logo" height={120} color="#c5a059" />
          <h1>Trayectoria y experiencia en asesoría legal</h1>
          <div className="hero__cta">
            <a className="btn btn--solid" href="#turnos">
              Consultas
            </a>
            <a className="btn btn--outline" href="#estudio">
              Más información
            </a>
          </div>
        </div>
      </section>

      <section id="estudio" className="section">
        <p className="eyebrow">Sobre el estudio</p>
        <h2>Somos un estudio jurídico con amplia experiencia y respuesta ágil</h2>
        <div className="rule" />
        <p className="lead">
          Asumimos con cada cliente un <strong>compromiso</strong> respaldado por un{' '}
          <strong>equipo altamente capacitado</strong> para dar pronta respuesta a todas sus
          consultas y turnos.
        </p>
        <a className="btn btn--solid estudio__cta" href="#abogados">
          Ver el equipo
        </a>
      </section>

      <section id="abogados" className="section section--tint">
        <p className="eyebrow">Profesionalismo &amp; experiencia</p>
        <h2>Nuestro equipo</h2>
        <div className="rule" />
        <div className="lawyers__grid">
          {lawyers.map((lawyer) => (
            <article key={lawyer.id} className="lawyer">
              <img className="lawyer__photo" src={lawyer.photo} alt={lawyer.name} />
              <h3>{lawyer.name}</h3>
              <p className="lawyer__role">{lawyer.role}</p>
              <p className="lawyer__specialty">{lawyer.specialty}</p>
              <p className="lawyer__bio">{lawyer.bio}</p>
              <a className="btn btn--small" href="#turnos" onClick={() => setLawyerId(lawyer.id)}>
                Solicitar turno
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="areas" className="section section--tint">
        <p className="eyebrow">Conocimiento &amp; experiencia</p>
        <h2>Nuestras áreas de especialización</h2>
        <div className="rule" />
        <div className="ig-head">
          <p>
            Seguinos en Instagram{' '}
            <a href={IG_PROFILE} target="_blank" rel="noreferrer">
              {IG_HANDLE}
            </a>
          </p>
          <a className="btn btn--solid" href={IG_PROFILE} target="_blank" rel="noreferrer">
            Ver perfil
          </a>
        </div>
        {IG_POSTS.length > 0 ? (
          <div className="ig-grid">
            {IG_POSTS.map((url) => (
              <InstagramEmbed key={url} url={url} />
            ))}
          </div>
        ) : (
          <div className="ig-empty">
            <p>
              Acá van a aparecer hasta 3 publicaciones embebidas. Pegá los links de cada post o
              reel en <code>Frontend/src/instagram.ts</code>.
            </p>
          </div>
        )}
        <div className="areas">
          {areas.map((a) => (
            <article key={a.title} className="area">
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="banner">
        <h2>¿Necesita asesoramiento de confianza?</h2>
        <a className="btn btn--solid" href="#turnos">
          Consúltenos
        </a>
      </section>

      <section id="turnos" className="section section--tint">
        <p className="eyebrow">Turnos</p>
        <h2>Turnos y consultas</h2>
        <div className="rule" />
        <p className="lead">Completá el formulario y te contactamos para confirmar el horario.</p>
        {sent ? (
          <p className="booking__ok" role="status">
            Gracias, {name || 'consulta'}. Recibimos tu solicitud de {type} con{' '}
            {lawyers.find((l) => l.id === lawyerId)?.name}. Te escribiremos a {email}.
          </p>
        ) : (
          <form className="booking__form" onSubmit={onSubmit}>
            <label>
              Abogado
              <select value={lawyerId} onChange={(e) => setLawyerId(e.target.value)} required>
                {lawyers.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} — {l.specialty}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tipo
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'turno' | 'consulta')}
              >
                <option value="turno">Turno presencial</option>
                <option value="consulta">Consulta online</option>
              </select>
            </label>
            <label>
              Nombre
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Teléfono
              <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </label>
            <label className="booking__full">
              Motivo
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Contanos brevemente tu consulta"
                required
              />
            </label>
            <button className="btn btn--solid booking__full" type="submit">
              Enviar solicitud
            </button>
          </form>
        )}
      </section>

      <section id="contacto" className="section">
        <p className="eyebrow">Contacto</p>
        <h2>Estamos para ayudarte</h2>
        <div className="rule" />
        <div className="contact__row">
          <p>
            <strong>Email</strong>
            <br />
            consultas@olilawyer.com
          </p>
          <p>
            <strong>Teléfono</strong>
            <br />
            +54 11 5555-0101
          </p>
          <p>
            <strong>Horarios</strong>
            <br />
            Lun a Vie 9 a 18 hs
          </p>
          <p>
            <strong>Dirección</strong>
            <br />
            Av. Corrientes 1234, CABA
          </p>
        </div>
      </section>

      <footer className="footer">
        <Logo height={56} color="#123b6b" />
        <span>© {new Date().getFullYear()} Estudio Jurídico</span>
      </footer>
    </main>
  )
}
