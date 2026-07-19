import { useMemo, useState } from "react";
import type { HairdresserWorkPattern } from "../../interface/interface";
import styles from "./styles.module.css";

interface Props {
  workPatterns: HairdresserWorkPattern[];
  occupiedSlots: { startsAt: string; endsAt: string }[];
  serviceDuration: number;
  selectedDate: Date | null;
  selectedSlot: string | null;
  onDateSelect: (date: Date) => void;
  onSlotSelect: (time: string) => void;
  brandColor: string;
}

const DAY_NAMES = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

function toMinutes(s: string): number {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

function generateSlots(
  shiftStart: string,
  shiftEnd: string,
  duration: number,
  occupied: { startsAt: string; endsAt: string }[],
  dateStr: string,
): string[] {
  const start = toMinutes(shiftStart);
  const end = toMinutes(shiftEnd);
  const slots: string[] = [];

  for (let t = start; t + duration <= end; t += 30) {
    const slotStart = fromMinutes(t);
    const isOccupied = occupied.some((o) => {
      if (!o.startsAt) return false;
      const oDate = o.startsAt.slice(0, 10);
      if (oDate !== dateStr) return false;
      const oStart = toMinutes(o.startsAt.slice(11, 16));
      const oEnd = toMinutes(o.endsAt.slice(11, 16));
      return t < oEnd && t + duration > oStart;
    });
    if (!isOccupied) {
      slots.push(slotStart);
    }
  }
  return slots;
}

export function TimeSlotPicker({
  workPatterns,
  occupiedSlots,
  serviceDuration,
  selectedDate,
  selectedSlot,
  onDateSelect,
  onSlotSelect,
  brandColor,
}: Props) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getFullYear());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const calendar = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const startDow = (firstDay.getDay() + 6) % 7;
    const days: (number | null)[] = [];
    for (let i = 0; i < startDow; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
    return days;
  }, [viewMonth, viewYear]);

  const dateStr = selectedDate
    ? selectedDate.toISOString().slice(0, 10)
    : "";

  const weekday = selectedDate ? ((selectedDate.getDay() + 6) % 7) + 1 : 0;

  const shift = useMemo(() => {
    if (!weekday) return null;
    const pattern = workPatterns.find((p) => p.weekday === weekday);
    if (!pattern) return null;
    return { start: pattern.shiftStart, end: pattern.shiftEnd };
  }, [weekday, workPatterns]);

  const slots = useMemo(() => {
    if (!shift || !serviceDuration || !dateStr) return [];
    return generateSlots(shift.start, shift.end, serviceDuration, occupiedSlots, dateStr);
  }, [shift, serviceDuration, occupiedSlots, dateStr]);

  const isPast = (d: number) => {
    const date = new Date(viewYear, viewMonth, d, 23, 59, 59);
    return date.getTime() < today.getTime();
  };

  const isToday = (d: number) => {
    return (
      d === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    );
  };

  const isSelected = (d: number) => {
    if (!selectedDate) return false;
    return (
      d === selectedDate.getDate() &&
      viewMonth === selectedDate.getMonth() &&
      viewYear === selectedDate.getFullYear()
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Выберите дату и время</h2>

      <div className={styles.calendar}>
        <div className={styles.calendarHeader}>
          <button
            className={styles.navBtn}
            onClick={() => {
              if (viewMonth === 0) {
                setViewMonth(11);
                setViewYear((y) => y - 1);
              } else {
                setViewMonth((m) => m - 1);
              }
            }}
          >
            ←
          </button>
          <span className={styles.calendarTitle}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button
            className={styles.navBtn}
            onClick={() => {
              if (viewMonth === 11) {
                setViewMonth(0);
                setViewYear((y) => y + 1);
              } else {
                setViewMonth((m) => m + 1);
              }
            }}
          >
            →
          </button>
        </div>

        <div className={styles.weekDays}>
          {DAY_NAMES.map((d) => (
            <span key={d} className={styles.weekDay}>
              {d}
            </span>
          ))}
        </div>

        <div className={styles.days}>
          {calendar.map((d, i) => (
            <button
              key={i}
              className={`${styles.day} ${
                d === null ? styles.empty : ""
              } ${isToday(d ?? 0) ? styles.today : ""} ${
                isSelected(d ?? 0) ? styles.selectedDay : ""
              } ${d !== null && isPast(d) ? styles.past : ""}`}
              disabled={d === null || isPast(d)}
              onClick={() => {
                if (d !== null) onDateSelect(new Date(viewYear, viewMonth, d));
              }}
              style={
                isSelected(d ?? 0)
                  ? { background: brandColor, borderColor: brandColor }
                  : undefined
              }
            >
              {d ?? ""}
            </button>
          ))}
        </div>
      </div>

      {shift && (
        <div className={styles.slotsSection}>
          <p className={styles.slotInfo}>
            Рабочие часы: {shift.start.slice(0, 5)}–{shift.end.slice(0, 5)}
          </p>
          {slots.length === 0 ? (
            <p className={styles.noSlots}>Нет свободных слотов на этот день</p>
          ) : (
            <div className={styles.slots}>
              {slots.map((time) => (
                <button
                  key={time}
                  className={`${styles.slot} ${
                    selectedSlot === time ? styles.selectedSlot : ""
                  }`}
                  onClick={() => onSlotSelect(time)}
                  style={
                    selectedSlot === time
                      ? { background: brandColor, borderColor: brandColor }
                      : undefined
                  }
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
