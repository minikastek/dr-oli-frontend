export type BookedSlot = { date: string; time: string }

export type Weekday = 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom'

export type WeeklySlot = {
  day: Weekday
  enabled: boolean
  from: string
  to: string
}

export type UnavailableRange = {
  from: string
  to: string
  note?: string
}

export type PublicLawyer = {
  id: string
  name: string
  specialty: string
  weeklySchedule: WeeklySlot[]
  unavailableRanges: UnavailableRange[]
  bookedSlots?: BookedSlot[]
}

const JS_DAY_TO_WEEKDAY: Weekday[] = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab']

export function toDateStr(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseDateStr(s: string) {
  return new Date(`${s}T12:00:00`)
}

export function isPastDate(dateStr: string) {
  return dateStr < toDateStr(new Date())
}

export function isInUnavailableRange(dateStr: string, ranges: UnavailableRange[]) {
  return ranges.some((r) => dateStr >= r.from && dateStr <= r.to)
}

export function slotForDate(dateStr: string, schedule: WeeklySlot[]) {
  const wd = JS_DAY_TO_WEEKDAY[parseDateStr(dateStr).getDay()]
  return schedule.find((s) => s.day === wd)
}

export function isSlotBooked(dateStr: string, time: string, booked: BookedSlot[]) {
  return booked.some((b) => b.date === dateStr && b.time === time)
}

export function timeSlots(from: string, to: string, stepMin = 30) {
  const [fh, fm] = from.split(':').map(Number)
  const [th, tm] = to.split(':').map(Number)
  let cur = fh * 60 + fm
  const end = th * 60 + tm
  const out: string[] = []
  while (cur + stepMin <= end) {
    const h = Math.floor(cur / 60)
    const m = cur % 60
    out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    cur += stepMin
  }
  return out
}

export function slotsForDate(dateStr: string, lawyer: PublicLawyer) {
  if (isPastDate(dateStr)) return []
  if (isInUnavailableRange(dateStr, lawyer.unavailableRanges)) return []
  const slot = slotForDate(dateStr, lawyer.weeklySchedule)
  if (!slot?.enabled) return []
  const booked = lawyer.bookedSlots ?? []
  return timeSlots(slot.from, slot.to).filter((t) => !isSlotBooked(dateStr, t, booked))
}

export function isDateBookable(dateStr: string, lawyer: PublicLawyer) {
  return slotsForDate(dateStr, lawyer).length > 0
}

export function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const offset = first.getDay() === 0 ? 6 : first.getDay() - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = Array.from({ length: offset + daysInMonth }, (_, i) =>
    i < offset ? null : i - offset + 1,
  )
  return cells
}

export const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

export const WEEKDAY_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
