import apiClient from './client';
import type { Owner, EventType, Slot, Appointment, CreateAppointmentRequest } from './types';

export function getOwner(): Promise<Owner> {
  return apiClient.get('/owner').then((r) => r.data);
}

export function listEventTypes(): Promise<EventType[]> {
  return apiClient.get('/event-types').then((r) => r.data);
}

export function createEventType(data: {
  name: string;
  description?: string | null;
  durationMinutes: number;
}): Promise<EventType> {
  return apiClient.post('/event-types', data).then((r) => r.data);
}

export function listSlots(eventTypeId: string, date: string): Promise<Slot[]> {
  return apiClient.get('/slots', { params: { eventTypeId, date } }).then((r) => r.data);
}

export function listAppointments(): Promise<Appointment[]> {
  return apiClient.get('/appointments').then((r) => r.data);
}

export function createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
  return apiClient.post('/appointments', data).then((r) => r.data);
}
