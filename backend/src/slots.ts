import type { DayOfWeek, Slot } from './types.js';
import type { Store } from './store.js';
import { getEventTypeById } from './store.js';

const DAY_NAMES: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function formatMinutesToHHmm(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function minutesToDate(totalMinutes: number, dateStr: string): Date {
  const d = new Date(dateStr + 'T00:00:00.000Z');
  d.setUTCMinutes(d.getUTCMinutes() + totalMinutes);
  return d;
}

function slotsOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
  return start1 < end2 && end1 > start2;
}

/**
 * Генерирует слоты для бронирования на указанную дату.
 *
 * Реализация использует UTC-время на всём протяжении, чтобы избежать
 * проблем с часовыми поясами при хранении и передаче.
 * Внутри цикла время считается в минутах от начала дня (целые числа) —
 * это упрощает арифметику и исключает ошибки floating-point.
 * Проверка пересечений через `slotsOverlap` (а не точное совпадение) нужна,
 * потому что брони разных типов событий могут иметь разную длительность
 * и частично перекрываться с границами соседних слотов.
 * ID слота формируется из даты и времени начала, что гарантирует
 * уникальность и согласованность с REST API.
 */
export function generateSlots(store: Store, eventTypeId: string, dateStr: string): Slot[] {
  const eventType = getEventTypeById(store, eventTypeId);
  if (!eventType) return [];

  const owner = store.owner;
  const date = new Date(dateStr + 'T00:00:00.000Z');
  const dayOfWeek = DAY_NAMES[date.getUTCDay()];

  if (!owner.workDays.includes(dayOfWeek)) return [];

  const workStart = parseTimeToMinutes(owner.workTimeStart);
  const workEnd = parseTimeToMinutes(owner.workTimeEnd);
  const duration = eventType.durationMinutes;

  const slots: Slot[] = [];

  for (let start = workStart; start + duration <= workEnd; start += duration) {
    const end = start + duration;
    const timeStart = minutesToDate(start, dateStr);
    const timeEnd = minutesToDate(end, dateStr);
    const timeStartISO = timeStart.toISOString();
    const timeEndISO = timeEnd.toISOString();

    const hhmm = formatMinutesToHHmm(start);
    const slotId = `${dateStr}T${hhmm}`;

    const isBooked = store.appointments.some((a) => {
      const aptStart = new Date(a.timeSlot.timeStart);
      const aptEnd = new Date(a.timeSlot.timeEnd);
      return slotsOverlap(timeStart, timeEnd, aptStart, aptEnd);
    });

    slots.push({
      id: slotId,
      timeStart: timeStartISO,
      timeEnd: timeEndISO,
      isAvailable: !isBooked,
    });
  }

  return slots;
}
