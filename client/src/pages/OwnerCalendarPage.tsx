import { useEffect, useState } from 'react';
import { Calendar, Badge, Card, Popover, Spin } from 'antd';
import type { Dayjs } from 'dayjs';
import { listAppointments } from '../api/endpoints';
import type { Appointment } from '../api/types';
import styles from './OwnerCalendarPage.module.css';

export default function OwnerCalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAppointments()
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, []);

  const dateCellRender = (value: Dayjs) => {
    const dayAppointments = appointments.filter((a) => value.isSame(a.timeSlot.timeStart, 'day'));

    return (
      <ul className={styles.appointmentList}>
        {dayAppointments.map((a) => {
          const badgeText = `${a.timeSlot.timeStart.slice(11, 16)} — ${a.eventType.name} — ${a.guest.username}`;
          return (
            <li key={a.id}>
              <Popover
                title={a.guest.username}
                content={
                  <div>
                    <p><strong>Email:</strong> {a.guest.email}</p>
                    <p><strong>Тип встречи:</strong> {a.eventType.name}</p>
                    <p><strong>Длительность:</strong> {a.eventType.durationMinutes} мин</p>
                    {a.guest.comment && <p><strong>Комментарий:</strong> {a.guest.comment}</p>}
                  </div>
                }
              >
                <Badge
                  status="success"
                  text={badgeText}
                />
              </Popover>
            </li>
          );
        })}
      </ul>
    );
  };

  if (loading) return <Spin size="large" className={styles.loadingSpin} />;

  return (
    <Card
      title="Брони"
      className={styles.calendarCard}
      styles={{ header: { position: 'relative', zIndex: 1 }, body: { flex: 1, overflow: 'auto' } }}
    >
      <Calendar cellRender={(value) => dateCellRender(value as Dayjs)} />
    </Card>
  );
}
