import clsx from 'clsx';
import { Layout, Space, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import styles from './AppHeader.module.css';

const { Header } = Layout;
const { Text } = Typography;

export default function AppHeader() {
  const location = useLocation();

  const navItems = [
    { path: '/booking', label: 'Записаться' },
    { path: '/owner', label: 'Кабинет администратора' },
  ];

  return (
    <Header className={styles.header}>
      <Link to="/" className={styles.logoLink}>
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <Text strong className={styles.logoText}>
          CalMe
        </Text>
      </Link>

      <Space size={24}>
        {navItems.map((item) => {
          const isActive =
            item.path === '/owner'
              ? location.pathname.startsWith('/owner')
              : location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(styles.navLink, { [styles.navLinkActive]: isActive })}
            >
              {item.label}
            </Link>
          );
        })}
      </Space>
    </Header>
  );
}
