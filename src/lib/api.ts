import type { PublicLawyer } from './availability'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

export async function fetchPublicLawyers(): Promise<PublicLawyer[]> {
  const res = await fetch(`${API_URL}/api/public/lawyers`)
  if (!res.ok) throw new Error('No se pudieron cargar las abogadas')
  const data = (await res.json()) as { lawyers: PublicLawyer[] }
  return data.lawyers
}

export type BookingPayload = {
  lawyerId: string
  type: 'turno' | 'consulta'
  date: string
  time: string
  name: string
  email: string
  phone: string
  message: string
}

export type BookingResult = {
  ok: boolean
  notification?: { sent: boolean; message: string }
  appointment?: {
    id: string
    lawyerName: string
    date: string
    time: string
    status: string
  }
}

export async function submitAppointment(payload: BookingPayload): Promise<BookingResult> {
  const res = await fetch(`${API_URL}/api/public/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = (await res.json()) as BookingResult & { error?: string }
  if (!res.ok) throw new Error(data.error || 'No se pudo enviar la solicitud')
  return data
}
