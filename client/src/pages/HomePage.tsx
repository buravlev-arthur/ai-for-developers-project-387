import { Typography, Button, Card, Row, Col, List } from 'antd';
import { ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const { Title, Paragraph } = Typography;

const features = [
  { text: 'Бронирование за пару кликов' },
  { text: 'Выбор удобного времени из свободных слотов' },
  { text: 'Напоминания о предстоящих встречах' },
  { text: 'Управление типами событий в личном кабинете' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Row>
      <Col xs={24} md={14} xl={16}>
        <Title className={styles.title}>Календарь Cal.me</Title>
        <Paragraph className={styles.subtitle}>
          Выберите тип события и забронируйте встречу в пару шагов в удобное время
        </Paragraph>
        <Button type="primary" size="large" onClick={() => navigate('/booking')}>
          Записаться <ArrowRightOutlined />
        </Button>
      </Col>
      <Col xs={24} md={10} xl={8}>
        <Card
          title="Возможности"
          className={styles.featureCard}
          styles={{
            header: { borderBottom: 'none' },
            body: { paddingTop: 12 },
          }}
        >
          <List
            dataSource={features}
            renderItem={(item) => (
              <List.Item className={styles.featureListItem}>
                <List.Item.Meta
                  avatar={<CheckCircleOutlined className={styles.checkIcon} />}
                  title={item.text}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
}
