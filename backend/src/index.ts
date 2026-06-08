import { fileURLToPath } from 'node:url';
import path from 'node:path';
import express from 'express';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import {
  createStore,
  getEventTypeById,
  createEventType,
  listAppointments,
  addAppointment,
} from './store.js';
import { generateSlots } from './slots.js';

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

const store = createStore();

app.get('/api/owner', (_req, res) => {
  res.json(store.owner);
});

app.get('/api/event-types', (_req, res) => {
  res.json(store.eventTypes);
});

app.post('/api/event-types', (req, res) => {
  const { name, description, durationMinutes } = req.body;

  if (!name || typeof durationMinutes !== 'number') {
    return res.status(400).json({ error: 'name and durationMinutes are required' });
  }

  const eventType = createEventType(store, { name, description, durationMinutes });
  res.status(201).json(eventType);
});

app.get('/api/slots', (req, res) => {
  const { eventTypeId, date } = req.query;

  if (!eventTypeId || !date) {
    return res.status(400).json({ error: 'eventTypeId and date are required' });
  }

  const slots = generateSlots(store, eventTypeId as string, date as string);
  res.json(slots);
});

app.get('/api/appointments', (_req, res) => {
  res.json(listAppointments(store));
});

app.post('/api/appointments', (req, res) => {
  const { eventTypeId, timeSlotId, guest } = req.body;

  if (!eventTypeId || !timeSlotId || !guest?.email || !guest?.username) {
    return res
      .status(400)
      .json({ error: 'eventTypeId, timeSlotId, guest.email, and guest.username are required' });
  }

  const eventType = getEventTypeById(store, eventTypeId);
  if (!eventType) {
    return res.status(400).json({ error: 'Invalid eventTypeId' });
  }

  const dateStr = timeSlotId.slice(0, 10);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setUTCDate(maxDate.getUTCDate() + 13);

  const slotDate = new Date(dateStr + 'T00:00:00.000Z');
  if (slotDate < today || slotDate > maxDate) {
    return res.status(400).json({ error: 'Date must be within the next 14 days' });
  }

  const slots = generateSlots(store, eventTypeId, dateStr);
  const slot = slots.find((s) => s.id === timeSlotId);
  if (!slot) {
    return res.status(400).json({ error: 'Invalid timeSlotId' });
  }
  if (!slot.isAvailable) {
    return res.status(400).json({ error: 'Slot is already booked' });
  }

  const appointment = addAppointment(store, {
    eventType,
    timeSlot: { id: slot.id, timeStart: slot.timeStart, timeEnd: slot.timeEnd },
    guest: {
      email: guest.email,
      username: guest.username,
      comment: guest.comment ?? null,
    },
  });

  res.status(201).json(appointment);
});

app.use(express.static(path.join(__dirname, '../../client/dist')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}.`);
});
