import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Card, Table, Button, Modal, Form, InputNumber, Input, message } from 'antd';
import { listEventTypes, createEventType } from '../api/endpoints';
import type { EventType } from '../api/types';
import styles from './EventTypesPage.module.css';

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    listEventTypes()
      .then(setEventTypes)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (values: {
    name: string;
    description?: string;
    durationMinutes: number;
  }) => {
    try {
      const created = await createEventType(values);
      setEventTypes((prev) => [...prev, created]);
      message.success('Тип события создан');
      setModalOpen(false);
      form.resetFields();
    } catch {
      message.error('Ошибка при создании');
    }
  };

  const columns = [
    { title: 'Название', dataIndex: 'name', key: 'name' },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      render: (v: string | null) => v ?? '—',
    },
    { title: 'Длительность (мин)', dataIndex: 'durationMinutes', key: 'durationMinutes' },
  ];

  return (
    <Card
      title="Типы событий"
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)} />}
      className={styles.eventTypeCard}
      styles={{ header: { position: 'relative', zIndex: 1 }, body: { flex: 1, overflow: 'auto' } }}
    >
      <Table dataSource={eventTypes} columns={columns} rowKey="id" loading={loading} />

      <Modal
        title="Новый тип события"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Добавить"
        cancelText="Отменить"
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="Название" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input />
          </Form.Item>
          <Form.Item name="durationMinutes" label="Длительность (мин)" rules={[{ required: true }]}>
            <InputNumber min={5} max={480} className={styles.fullWidth} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
