export type DayOfWeek = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export interface Owner {
  id: string;
  email: string;
  username: string;
  description?: string | null;
  workTimeStart: string;
  workTimeEnd: string;
  workDays: DayOfWeek[];
}

export interface EventType {
  id: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
}

export interface Guest {
  email: string;
  username: string;
  comment?: string | null;
}

export interface TimeSlot {
  id: string;
  timeStart: string;
  timeEnd: string;
}

export interface Slot {
  id: string;
  timeStart: string;
  timeEnd: string;
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  eventType: EventType;
  timeSlot: TimeSlot;
  guest: Guest;
}
