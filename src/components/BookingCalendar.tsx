import { useMemo, useState } from 'react'
import type { PublicLawyer } from '../lib/availability'
import {
  MONTH_NAMES,
  WEEKDAY_SHORT,
  isDateBookable,
  monthGrid,
  slotsForDate,
  toDateStr,
} from '../lib/availability'
import './BookingCalendar.css'

type Props = {
  lawyer: PublicLawyer
  selectedDate: string | null
  selectedTime: string | null
  onSelectDate: (date: string | null) => void
  onSelectTime: (time: string | null) => void
}

export default function BookingCalendar({
  lawyer,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: Props) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const cells = useMemo(() => monthGrid(viewYear, viewMonth), [viewYear, viewMonth])

  const timeOptions = selectedDate ? slotsForDate(selectedDate, lawyer) : []

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else setViewMonth((m) => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else setViewMonth((m) => m + 1)
  }

  function pickDay(day: number) {
    const dateStr = toDateStr(new Date(viewYear, viewMonth, day))
    if (!isDateBookable(dateStr, lawyer)) return
    onSelectDate(dateStr)
    onSelectTime(null)
  }

  return (
    <div className="booking-cal">
      <div className="booking-cal__head">
        <button type="button" className="booking-cal__nav" onClick={prevMonth} aria-label="Mes anterior">
          ‹
        </button>
        <span>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button type="button" className="booking-cal__nav" onClick={nextMonth} aria-label="Mes siguiente">
          ›
        </button>
      </div>

      <div className="booking-cal__weekdays">
        {WEEKDAY_SHORT.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="booking-cal__grid">
        {cells.map((day, i) => {
          if (day === null) {
            return <span key={`e-${i}`} className="booking-cal__day is-empty" />
          }
          const dateStr = toDateStr(new Date(viewYear, viewMonth, day))
          const bookable = isDateBookable(dateStr, lawyer)
          const isSelected = selectedDate === dateStr
          const isToday = dateStr === toDateStr(today)
          return (
            <button
              key={dateStr}
              type="button"
              disabled={!bookable}
              className={[
                'booking-cal__day',
                bookable ? 'is-available' : 'is-disabled',
                isSelected ? 'is-selected' : '',
                isToday ? 'is-today' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => pickDay(day)}
            >
              {day}
            </button>
          )
        })}
      </div>

      {selectedDate ? (
        <div className="booking-cal__slots">
          <p className="booking-cal__slots-label">
            Horarios disponibles —{' '}
            {new Date(`${selectedDate}T12:00:00`).toLocaleDateString('es-AR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
          {timeOptions.length === 0 ? (
            <p className="booking-cal__empty">Sin horarios para este día.</p>
          ) : (
            <div className="booking-cal__times">
              {timeOptions.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={selectedTime === t ? 'is-selected' : ''}
                  onClick={() => onSelectTime(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="booking-cal__hint">Elegí un día disponible en el calendario.</p>
      )}
    </div>
  )
}
