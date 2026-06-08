import type { Owner, EventType, Appointment, Guest } from './types.js';

export interface Store {
  owner: Owner;
  eventTypes: EventType[];
  appointments: Appointment[];
  nextEventTypeId: number;
  nextAppointmentId: number;
}

export function createStore(): Store {
  return {
    owner: {
      id: '1',
      email: 'owner@example.com',
      username: 'Буравлев Артур',
      description: 'Организатор мероприятий',
      workTimeStart: '09:00',
      workTimeEnd: '18:00',
      workDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    },
    eventTypes: [
      {
        id: '1',
        name: 'Консультация',
        description: 'Индивидуальная консультация',
        durationMinutes: 30,
      },
      { id: '2', name: 'Встреча', description: null, durationMinutes: 60 },
      { id: '3', name: 'Вебинар', description: 'Групповой онлайн-вебинар', durationMinutes: 90 },
    ],
    appointments: [],
    nextEventTypeId: 4,
    nextAppointmentId: 1,
  };
}

export function getEventTypeById(store: Store, id: string): EventType | undefined {
  return store.eventTypes.find((et) => et.id === id);
}

export function listEventTypes(store: Store): EventType[] {
  return store.eventTypes;
}

export function createEventType(
  store: Store,
  data: { name: string; description?: string | null; durationMinutes: number },
): EventType {
  const eventType: EventType = {
    id: String(store.nextEventTypeId++),
    name: data.name,
    description: data.description ?? null,
    durationMinutes: data.durationMinutes,
  };
  store.eventTypes.push(eventType);
  return eventType;
}

export function listAppointments(store: Store): Appointment[] {
  return store.appointments;
}

export function addAppointment(
  store: Store,
  data: {
    eventType: EventType;
    timeSlot: { id: string; timeStart: string; timeEnd: string };
    guest: Guest;
  },
): Appointment {
  const appointment: Appointment = {
    id: String(store.nextAppointmentId++),
    eventType: data.eventType,
    timeSlot: data.timeSlot,
    guest: data.guest,
  };
  store.appointments.push(appointment);
  return appointment;
}
