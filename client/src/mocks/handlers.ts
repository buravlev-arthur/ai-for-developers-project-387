import { http, HttpResponse } from 'msw';
import type { Owner, EventType, Appointment, Slot } from '../api/types';

const owner: Owner = {
  id: '1',
  email: 'owner@example.com',
  username: 'Буравлев Артур',
  description: 'Организатор мероприятий',
  workTimeStart: '09:00',
  workTimeEnd: '18:00',
  workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
};

const eventTypes: EventType[] = [
  {
    id: '1',
    name: 'Консультация',
    description: 'Индивидуальная консультация',
    durationMinutes: 30,
  },
  { id: '2', name: 'Встреча', description: null, durationMinutes: 60 },
  { id: '3', name: 'Вебинар', description: 'Групповой онлайн-вебинар', durationMinutes: 90 },
];

const appointments: Appointment[] = [
  {
    id: '1',
    eventType: eventTypes[0],
    timeSlot: { id: 's1', timeStart: '2026-06-01T10:00:00Z', timeEnd: '2026-06-01T10:30:00Z' },
    guest: { email: 'ivan@example.com', username: 'Иван Петров', comment: null },
  },
];

const slots: Slot[] = [
  {
    id: 's1',
    timeStart: '2026-06-01T10:00:00Z',
    timeEnd: '2026-06-01T10:30:00Z',
    isAvailable: false,
  },
  {
    id: 's2',
    timeStart: '2026-06-01T11:00:00Z',
    timeEnd: '2026-06-01T11:30:00Z',
    isAvailable: true,
  },
  {
    id: 's3',
    timeStart: '2026-06-01T12:00:00Z',
    timeEnd: '2026-06-01T13:00:00Z',
    isAvailable: true,
  },
  {
    id: 's4',
    timeStart: '2026-06-02T14:00:00Z',
    timeEnd: '2026-06-02T14:30:00Z',
    isAvailable: true,
  },
  {
    id: 's5',
    timeStart: '2026-06-02T15:00:00Z',
    timeEnd: '2026-06-02T15:30:00Z',
    isAvailable: true,
  },
];

export const handlers = [
  http.get('/api/owner', () => {
    return HttpResponse.json(owner);
  }),

  http.get('/api/event-types', () => {
    return HttpResponse.json(eventTypes);
  }),

  http.post('/api/event-types', async ({ request }) => {
    const body = (await request.json()) as {
      name: string;
      description?: string | null;
      durationMinutes: number;
    };
    const newEventType: EventType = {
      id: String(eventTypes.length + 1),
      name: body.name,
      description: body.description ?? null,
      durationMinutes: body.durationMinutes,
    };
    eventTypes.push(newEventType);
    return HttpResponse.json(newEventType, { status: 201 });
  }),

  http.get('/api/slots', ({ request }) => {
    const url = new URL(request.url);
    const eventTypeId = url.searchParams.get('eventTypeId');
    const date = url.searchParams.get('date');

    if (!eventTypeId || !date) {
      return HttpResponse.json({ error: 'eventTypeId and date are required' }, { status: 400 });
    }

    const filtered = slots.filter((slot) => slot.timeStart.startsWith(date.slice(0, 10)));
    return HttpResponse.json(filtered);
  }),

  http.get('/api/appointments', () => {
    return HttpResponse.json(appointments);
  }),

  http.post('/api/appointments', async ({ request }) => {
    const body = (await request.json()) as {
      eventTypeId: string;
      timeSlotId: string;
      guest: { email: string; username: string; comment?: string | null };
    };
    const eventType = eventTypes.find((et) => et.id === body.eventTypeId);
    const slot = slots.find((s) => s.id === body.timeSlotId);

    if (!eventType || !slot) {
      return HttpResponse.json({ error: 'Invalid eventTypeId or timeSlotId' }, { status: 400 });
    }

    const newAppointment: Appointment = {
      id: String(appointments.length + 1),
      eventType,
      timeSlot: slot,
      guest: {
        email: body.guest.email,
        username: body.guest.username,
        comment: body.guest.comment ?? null,
      },
    };
    appointments.push(newAppointment);
    return HttpResponse.json(newAppointment, { status: 201 });
  }),
];
