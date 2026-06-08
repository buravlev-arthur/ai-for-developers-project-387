import { useEffect, useState } from 'react';
import { Calendar, Card, Spin } from 'antd';
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
        {dayAppointments.map((a) => (
          <li key={a.id} className={styles.appointmentItem}>
            <div className={styles.appointmentTime}>{a.timeSlot.timeStart.slice(11, 16)}</div>
            <div className={styles.appointmentBody}>
              <div className={styles.appointmentTitle}>{a.eventType.name}</div>
              <div className={styles.appointmentGuest}>{a.guest.username}</div>
              {a.guest.email && <div className={styles.appointmentEmail}>{a.guest.email}</div>}
              {a.guest.comment && (
                <div className={styles.appointmentComment}>{a.guest.comment}</div>
              )}
            </div>
          </li>
        ))}
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
