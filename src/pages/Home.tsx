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
    bio: 'Con más de 28 años de trayectoria en el ejercicio de la abogacía, ofrezco un asesoramiento jurídico integral, estratégico y comprometido. Mi práctica profesional abarca el patrocinio y la representación legal en diversas áreas del derecho, brindando soluciones eficaces tanto a clientes particulares como a empresas.',
    focusAreas: [
      {
        title: 'Derecho Civil y Comercial',
        desc: 'Asesoramiento en contratación, procesos sucesorios, ejecuciones comerciales, derechos reales y resolución de controversias patrimoniales.',
      },
      {
        title: 'Daños y Perjuicios',
        desc: 'Representación integral en reclamos por responsabilidad civil, accidentes de tránsito, incumplimientos contractuales y reparación de perjuicios materiales y morales.',
      },
      {
        title: 'Derecho Penal',
        desc: 'Asistencia y representación técnica en causas penales, querellas y asesoramiento preventivo, velando por la estricta tutela de garantías constitucionales.',
      },
      {
        title: 'Gestión y Litigios',
        desc: 'Sólida experiencia en la conducción de litigios complejos y en la mediación extrajudicial para la resolución ágil de conflictos.',
      },
    ],
    photo:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'laura',
    role: 'Abogada',
    bio: 'Abogada especialista en derecho bancario y contractual con doble titulación como Abogada y Escribana Pública Nacional. Con 8 años de experiencia continúa asesorando a entidades financieras, combinó la práctica tradicional en materia Civil, Comercial, Defensa del Consumidor y Salud con una visión moderna de los riesgos digitales (diplomada en Cibercrimen) y las relaciones laborales (cursando diplomatura en Derecho del Trabajo). Mi objetivo es transformar la complejidad legal en seguridad jurídica y eficiencia operativa para mis clientes.',
    photo:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ana',
    role: 'Abogada',
    bio: 'Abogada interviniente en la gestión integral de causas civiles y comerciales, redacción y análisis de contratos, ejecución de pagarés, negociaciones extrajudiciales y representación legal de empresas. Su formación se complementa con una Diplomatura en Derecho Ambiental, y actualización en Derecho Minero, fortaleciendo un perfil profesional orientado a áreas estratégicas de la gestión pública y privada.',
    photo:
      'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80',
  },
]

const areas = [
  {
    title: 'Sucesiones',
    desc: 'Acompañamos a las familias en todos los trámites sucesorios, brindando soluciones ágiles y seguras para la transmisión del patrimonio.',
  },
  {
    title: 'ART y Accidentes de Trabajo',
    desc: 'Reclamamos las indemnizaciones que corresponden a trabajadores afectados por accidentes o enfermedades laborales.',
  },
  {
    title: 'Derecho de Familia',
    desc: 'Intervenimos con sensibilidad y firmeza en conflictos familiares, priorizando soluciones eficaces y duraderas.',
  },
  {
    title: 'Defensa del Consumidor',
    desc: 'Actuamos frente a abusos de empresas, bancos, aseguradoras y prestadores de servicios.',
  },
  {
    title: 'Amparos de Salud',
    desc: 'Protegemos el acceso a tratamientos, medicamentos y prestaciones médicas cuando son negados injustamente.',
  },
  {
    title: 'Sociedades Comerciales',
    desc: 'Asesoramos emprendedores, profesionales y empresas en la constitución y desarrollo de sus proyectos.',
  },
  {
    title: 'Daños y Perjuicios',
    desc: 'Buscamos la reparación integral de los daños sufridos por nuestros clientes.',
  },
  {
    title: 'Derecho Minero',
    desc: 'Brindamos asesoramiento especializado para la actividad minera, con conocimiento de la normativa vigente y de las particularidades del sector.',
  },
  {
    title: 'Derechos Reales',
    desc: 'Brindamos asesoramiento legal integral en la constitución, defensa y gestión de derechos de propiedad como juicios de Usucapión y demás derechos reales, garantizando la seguridad jurídica en sus operaciones e inmuebles. Efectuamos también trámites ante el registro.',
  },
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
          name:
            api?.name ??
            (d.id === 'mariela'
              ? 'Mariela Olivera Villafañe'
              : d.id === 'laura'
                ? 'Laura Elizabeth Chumbita'
                : 'Ana Belén Gómez'),
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
              {lawyer.specialty ? (
                <p className="lawyer__specialty">{lawyer.specialty}</p>
              ) : null}
              <p className="lawyer__bio">{lawyer.bio}</p>
              {'focusAreas' in lawyer && lawyer.focusAreas ? (
                <div className="lawyer__focus">
                  <p className="lawyer__focus-title">Áreas de especialización</p>
                  <ul>
                    {lawyer.focusAreas.map((area) => (
                      <li key={area.title}>
                        <strong>{area.title}:</strong> {area.desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
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
        <p className="eyebrow">Áreas de especialización</p>
        <h2>Nuestros servicios</h2>
        <div className="rule" />
        <p className="lead">Defendemos sus derechos, protegemos sus intereses.</p>
        <div className="areas">
          {areas.map((a) => (
            <article key={a.title} className="area">
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </article>
          ))}
        </div>
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
            <a href="mailto:estudio.oliveracarrion@gmail.com">
              estudio.oliveracarrion@gmail.com
            </a>
          </p>
          <p>
            <strong>Teléfono</strong>
            <br />
            <a href="tel:+543804859460">380-4859460</a>
          </p>
          <p>
            <strong>Horarios</strong>
            <br />
            De lunes a miércoles de 18 a 21 hs.
          </p>
          <p>
            <strong>Dirección</strong>
            <br />
            Remedios de Escalada Nº 1094, Bº Shincal, Ciudad de La Rioja
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
