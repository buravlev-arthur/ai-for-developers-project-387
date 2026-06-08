import { useEffect, useState, useReducer } from 'react';
import { Card, Calendar, List, Button, Modal, Form, Input, Spin, Avatar, Tag, Result } from 'antd';
import { LeftOutlined, RightOutlined, UserOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { getOwner, listEventTypes, listSlots, createAppointment } from '../api/endpoints';
import type { Owner, EventType, Slot, Appointment } from '../api/types';
import styles from './GuestBookingPage.module.css';

type SlotsState = { status: 'idle' } | { status: 'loading' } | { status: 'loaded'; data: Slot[] };

type SlotsAction = { type: 'RESET' } | { type: 'LOAD' } | { type: 'DONE'; data: Slot[] };

function slotsReducer(_state: SlotsState, action: SlotsAction): SlotsState {
  switch (action.type) {
    case 'RESET':
      return { status: 'idle' };
    case 'LOAD':
      return { status: 'loading' };
    case 'DONE':
      return { status: 'loaded', data: action.data };
  }
}

export default function GuestBookingPage() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slotsState, dispatch] = useReducer(slotsReducer, { status: 'idle' });
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [bookingData, setBookingData] = useState<Appointment | null>(null);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    getOwner().then(setOwner);
  }, []);

  useEffect(() => {
    listEventTypes().then(setEventTypes);
  }, []);

  useEffect(() => {
    if (!selectedType || !selectedDate) {
      dispatch({ type: 'RESET' });
      return;
    }
    dispatch({ type: 'LOAD' });
    listSlots(selectedType, selectedDate).then((data) => dispatch({ type: 'DONE', data }));
  }, [selectedType, selectedDate]);

  const canContinue = !!selectedType && !!selectedDate && !!selectedSlot?.isAvailable;

  const handleSubmit = async (values: { email: string; username: string; comment?: string }) => {
    if (!selectedSlot || !selectedType) return;
    try {
      const appointment = await createAppointment({
        eventTypeId: selectedType,
        timeSlotId: selectedSlot.id,
        guest: {
          email: values.email,
          username: values.username,
          comment: values.comment ?? null,
        },
      });
      setModalOpen(false);
      form.resetFields();
      setBookingData(appointment);
      setBookingStatus('success');
    } catch {
      setModalOpen(false);
      setErrorText('Не удалось создать бронь. Попробуйте ещё раз.');
      setBookingStatus('error');
    }
  };

  const handleRetry = () => {
    setBookingStatus('idle');
    setErrorText('');
  };

  const handlePrint = () => {
    if (!bookingData || !owner) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(
      [
        '<html><head><title>Подтверждение брони</title>',
        '<style>',
        'body { font-family: "Segoe UI", Tahoma, sans-serif; padding: 40px; }',
        'h1 { font-size: 24px; margin-bottom: 24px; }',
        '.info { margin-bottom: 12px; }',
        '.label { font-weight: 600; display: inline-block; width: 140px; }',
        '@media print { body { padding: 20px; } }',
        '</style></head><body>',
        '<h1>Подтверждение брони</h1>',
        '<div class="info"><span class="label">К кому:</span> ' + owner.username + '</div>',
        '<div class="info"><span class="label">Имя клиента:</span> ' +
          bookingData.guest.username +
          '</div>',
        '<div class="info"><span class="label">Email:</span> ' + bookingData.guest.email + '</div>',
        ...(bookingData.guest.comment
          ? [
              '<div class="info"><span class="label">Комментарий:</span> ' +
                bookingData.guest.comment +
                '</div>',
            ]
          : []),
        '<div class="info"><span class="label">Тип встречи:</span> ' +
          bookingData.eventType.name +
          '</div>',
        '<div class="info"><span class="label">Дата:</span> ' +
          dayjs(bookingData.timeSlot.timeStart).format('DD.MM.YYYY') +
          '</div>',
        '<div class="info"><span class="label">Время:</span> ' +
          dayjs(bookingData.timeSlot.timeStart).format('HH:mm') +
          ' — ' +
          dayjs(bookingData.timeSlot.timeEnd).format('HH:mm') +
          '</div>',
        '<div class="info"><span class="label">Длительность:</span> ' +
          bookingData.eventType.durationMinutes +
          ' мин.</div>',
        '</body></html>',
      ].join('\n'),
    );
    win.document.close();
    win.print();
  };

  return bookingStatus === 'idle' ? (
    <Card className={styles.bookingCard} styles={{ body: { flex: 1, overflow: 'hidden' } }}>
      <div className={styles.mainRow}>
        {/* ========== LEFT: Owner + Event Types ========== */}
        <div className={styles.leftColumn}>
          <div className={styles.avatarSection}>
            <Avatar size={64} icon={<UserOutlined />} />
            {owner && <div className={styles.ownerName}>{owner.username}</div>}
          </div>

          <div className={styles.sectionLabel}>Тип встречи</div>

          <div className={styles.scrollArea}>
            <List
              split={false}
              dataSource={eventTypes}
              renderItem={(item) => {
                const active = selectedType === item.id;
                return (
                  <List.Item
                    onClick={() => {
                      setSelectedType(item.id);
                      setSelectedSlot(null);
                    }}
                    className={clsx(styles.eventTypeItem, {
                      [styles.eventTypeItemSelected]: active,
                    })}
                  >
                    <List.Item.Meta
                      title={<span className={styles.eventTypeName}>{item.name}</span>}
                      description={
                        item.description ? (
                          <span className={styles.eventTypeDesc}>{item.description}</span>
                        ) : (
                          <span className={styles.eventTypeDescEmpty}>Описание отсутствует</span>
                        )
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </div>
        </div>

        {/* ========== CENTER: Calendar ========== */}
        <div className={styles.centerColumn}>
          <div className={styles.sectionLabel}>Доступные даты</div>
          <Calendar
            fullscreen={false}
            defaultValue={dayjs()}
            onSelect={(date) => {
              setSelectedDate(date.format('YYYY-MM-DD'));
              setSelectedSlot(null);
            }}
            headerRender={({ value, onChange }) => (
              <div className={styles.calendarHeader}>
                <Button
                  type="text"
                  icon={<LeftOutlined />}
                  onClick={() => onChange(dayjs(value).subtract(1, 'month'))}
                />
                <span className={styles.calendarMonth}>
                  {dayjs(value).locale('ru').format('MMMM YYYY')}
                </span>
                <Button
                  type="text"
                  icon={<RightOutlined />}
                  onClick={() => onChange(dayjs(value).add(1, 'month'))}
                />
              </div>
            )}
            disabledDate={(current) => {
              const today = dayjs().startOf('day');
              const maxDate = today.add(13, 'day');
              return current.isBefore(today, 'day') || current.isAfter(maxDate, 'day');
            }}
          />
        </div>

        {/* ========== RIGHT: Slots + Button ========== */}
        <div className={styles.rightColumn}>
          <div className={styles.sectionLabel}>Доступное время</div>

          {!selectedType || !selectedDate ? (
            <div className={styles.centeredMessage}>Выберите тип встречи и дату</div>
          ) : slotsState.status === 'loading' ? (
            <div className={styles.centeredSpinner}>
              <Spin />
            </div>
          ) : slotsState.status !== 'loaded' ? null : slotsState.data.length === 0 ? (
            <div className={styles.centeredMessageSecondary}>
              Нет доступного времени на выбранную дату
            </div>
          ) : (
            <div className={styles.slotList}>
              <List
                split={false}
                dataSource={slotsState.data}
                renderItem={(slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  return (
                    <List.Item
                      onClick={() => {
                        if (slot.isAvailable) setSelectedSlot(slot);
                      }}
                      className={clsx(styles.slotItem, {
                        [styles.slotItemAvailable]: slot.isAvailable,
                        [styles.slotItemUnavailable]: !slot.isAvailable,
                        [styles.slotItemSelected]: isSelected,
                      })}
                    >
                      <div className={styles.slotRow}>
                        <span className={styles.slotTime}>
                          {dayjs(slot.timeStart).format('HH:mm')} —{' '}
                          {dayjs(slot.timeEnd).format('HH:mm')}
                        </span>
                        <Tag color={slot.isAvailable ? 'green' : 'default'}>
                          {slot.isAvailable ? 'свободно' : 'занято'}
                        </Tag>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </div>
          )}

          <Button
            type="primary"
            size="large"
            disabled={!canContinue}
            onClick={() => setModalOpen(true)}
            className={styles.continueButton}
          >
            Продолжить
          </Button>
        </div>
      </div>

      <Modal
        title="Подтверждение брони"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Записаться"
        cancelText="Отменить"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="username"
            label="Имя"
            rules={[{ required: true, message: 'Введите имя' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Некорректный email' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="comment" label="Комментарий">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  ) : bookingStatus === 'success' ? (
    <div className={styles.successWrapper}>
      <Card className={styles.successCard}>
        <Result status="success" title="Вы записаны" className={styles.successResult} />
        <div className={styles.successContent}>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>К кому</div>
            <div className={styles.detailValue}>{owner?.username}</div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>Имя клиента</div>
            <div className={styles.detailValue}>{bookingData?.guest.username}</div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>Email</div>
            <div className={styles.detailValue}>{bookingData?.guest.email}</div>
          </div>
          {bookingData?.guest.comment && (
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Комментарий</div>
              <div className={styles.detailValue}>{bookingData?.guest.comment}</div>
            </div>
          )}
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>Тип встречи</div>
            <div className={styles.detailValue}>{bookingData?.eventType.name}</div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>Дата</div>
            <div className={styles.detailValue}>
              {bookingData && dayjs(bookingData.timeSlot.timeStart).format('DD.MM.YYYY')}
            </div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>Время</div>
            <div className={styles.detailValue}>
              {bookingData && dayjs(bookingData.timeSlot.timeStart).format('HH:mm')} —{' '}
              {bookingData && dayjs(bookingData.timeSlot.timeEnd).format('HH:mm')}
            </div>
          </div>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>Длительность</div>
            <div className={styles.detailValue}>{bookingData?.eventType.durationMinutes} мин.</div>
          </div>
          <div className={styles.printButtonRow}>
            <Button type="primary" onClick={handlePrint}>
              Распечатать
            </Button>
          </div>
        </div>
      </Card>
    </div>
  ) : (
    <Card className={styles.errorCard}>
      <div className={styles.errorWrapper}>
        <Result
          status="error"
          title={errorText}
          extra={
            <Button type="primary" onClick={handleRetry}>
              Попробовать ещё раз
            </Button>
          }
        />
      </div>
    </Card>
  );
}
