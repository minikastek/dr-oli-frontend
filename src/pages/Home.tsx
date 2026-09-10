import { useEffect, useMemo, useState, type FormEvent } from 'react'
import BookingCalendar from '../components/BookingCalendar'
import '../components/BookingCalendar.css'
import InstagramEmbed from '../components/InstagramEmbed'
import Logo from '../components/Logo'
import '../components/Logo.css'
import { fetchPublicLawyers, submitAppointment } from '../lib/api'
import type { PublicLawyer } from '../lib/availability'
import { IG_HANDLE, IG_POSTS, IG_PROFILE } from '../instagram'
import './Home.css'

const lawyerDisplay = [
  {
    id: 'mariela',
    role: 'Socia',
    bio: 'Lidera el estudio con un enfoque cercano y resolutivo en asesoramiento legal integral.',
    photo:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'laura',
    role: 'Abogada',
    bio: 'Acompaña a particulares y empresas en contratos, conflictos y gestión jurídica cotidiana.',
    photo:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ana',
    role: 'Abogada',
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
  const [apiLawyers, setApiLawyers] = useState<PublicLawyer[]>([])
  const [loadError, setLoadError] = useState('')
  const [loadingLawyers, setLoadingLawyers] = useState(true)

  const [lawyerId, setLawyerId] = useState('')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState<'turno' | 'consulta'>('turno')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [confirmMsg, setConfirmMsg] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    fetchPublicLawyers()
      .then((list) => {
        setApiLawyers(list)
        if (list[0]) setLawyerId(list[0].id)
      })
      .catch((err) => {
        const msg =
          err instanceof TypeError
            ? 'No se pudo conectar con la API. ¿Está corriendo el backend en el puerto 3000?'
            : 'No se pudo cargar la disponibilidad. Intentá más tarde.'
        setLoadError(msg)
      })
      .finally(() => setLoadingLawyers(false))
  }, [])

  const selectedLawyer = useMemo(
    () => apiLawyers.find((l) => l.id === lawyerId) ?? null,
    [apiLawyers, lawyerId],
  )

  const teamLawyers = useMemo(
    () =>
      lawyerDisplay.map((d) => {
        const api = apiLawyers.find((l) => l.id === d.id)
        return {
          ...d,
          name: api?.name ?? d.id,
          specialty: api?.specialty ?? '',
        }
      }),
    [apiLawyers],
  )

  function pickLawyer(id: string) {
    setLawyerId(id)
    setSelectedDate(null)
    setSelectedTime(null)
    setSubmitError('')
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!lawyerId || !selectedDate || !selectedTime) {
      setSubmitError('Elegí abogada, día y horario antes de enviar.')
      return
    }
    setSubmitting(true)
    setSubmitError('')
    try {
      const result = await submitAppointment({
        lawyerId,
        type,
        date: selectedDate,
        time: selectedTime,
        name,
        email,
        phone,
        message,
      })
      setConfirmMsg(result.notification?.message ?? 'Turno confirmado.')
      setEmailSent(Boolean(result.notification?.sent))
      setSent(true)
      const updated = await fetchPublicLawyers()
      setApiLawyers(updated)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al enviar')
    } finally {
      setSubmitting(false)
    }
  }

  const slotReady = Boolean(selectedDate && selectedTime)

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
          {teamLawyers.map((lawyer) => (
            <article key={lawyer.id} className="lawyer">
              <img className="lawyer__photo" src={lawyer.photo} alt={lawyer.name} />
              <h3>{lawyer.name}</h3>
              <p className="lawyer__role">{lawyer.role}</p>
              <p className="lawyer__specialty">{lawyer.specialty}</p>
              <p className="lawyer__bio">{lawyer.bio}</p>
              <a
                className="btn btn--small"
                href="#turnos"
                onClick={() => pickLawyer(lawyer.id)}
              >
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
        <h2>Reservá tu consulta</h2>
        <div className="rule" />
        <p className="lead">
          Elegí una abogada, seleccioná día y horario según su disponibilidad, y completá tus datos.
        </p>

        {sent ? (
          <div className="booking__ok" role="status">
            <p>
              <strong>Turno asignado.</strong> {confirmMsg}
            </p>
            <p>
              {emailSent
                ? `Te enviamos una notificación a ${email} con la fecha y el horario citado.`
                : `Registramos tu turno. Te contactaremos a ${email} si hace falta confirmar algún detalle.`}
            </p>
          </div>
        ) : loadingLawyers ? (
          <p className="booking-loading">Cargando abogadas y disponibilidad…</p>
        ) : loadError ? (
          <p className="booking-error">{loadError}</p>
        ) : (
          <>
            <div className="booking-lawyer-pick">
              <label htmlFor="lawyer-select">1. Elegí una abogada</label>
              <select
                id="lawyer-select"
                value={lawyerId}
                onChange={(e) => pickLawyer(e.target.value)}
                required
              >
                {apiLawyers.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} — {l.specialty}
                  </option>
                ))}
              </select>
            </div>

            {selectedLawyer ? (
              <div className="booking-layout">
                <div>
                  <p className="booking-step-title">2. Elegí día y horario</p>
                  <BookingCalendar
                    lawyer={selectedLawyer}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onSelectDate={setSelectedDate}
                    onSelectTime={setSelectedTime}
                  />
                </div>

                <form className="booking__form" onSubmit={onSubmit}>
                  <p className="booking-step-title booking__full">3. Tus datos</p>
                  {!slotReady ? (
                    <p className="booking__full booking-cal__hint">
                      Completá el calendario para habilitar el envío.
                    </p>
                  ) : null}
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
                    Fecha elegida
                    <input
                      readOnly
                      value={
                        selectedDate && selectedTime
                          ? `${selectedDate} · ${selectedTime}`
                          : ''
                      }
                      placeholder="Seleccioná en el calendario"
                      required
                    />
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
                  {submitError ? (
                    <p className="booking__full booking-error">{submitError}</p>
                  ) : null}
                  <button
                    className="btn btn--solid booking__full"
                    type="submit"
                    disabled={!slotReady || submitting}
                  >
                    {submitting ? 'Enviando…' : 'Confirmar solicitud'}
                  </button>
                </form>
              </div>
            ) : null}
          </>
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
