import { Layout, Menu, Avatar, Typography } from 'antd';
import { CalendarOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getOwner } from '../api/endpoints';
import type { Owner } from '../api/types';
import AppHeader from './AppHeader';
import PageContent from './PageContent';
import styles from './OwnerLayout.module.css';

const { Content, Sider } = Layout;

const menuItemStyle = { margin: 0, borderRadius: 0, width: '100%' };

export default function OwnerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [ownerLoading, setOwnerLoading] = useState(true);

  useEffect(() => {
    getOwner()
      .then(setOwner)
      .catch(() => setOwner(null))
      .finally(() => setOwnerLoading(false));
  }, []);

  const menuItems = [
    {
      key: '/owner',
      icon: <CalendarOutlined />,
      label: 'Календарь',
      style: menuItemStyle,
    },
    {
      key: '/owner/event-types',
      icon: <UnorderedListOutlined />,
      label: 'Типы событий',
      style: menuItemStyle,
    },
  ];

  return (
    <Layout className={styles.layout}>
      <AppHeader />
      <div className={styles.contentWrapper}>
        <PageContent>
          <Layout className={styles.innerLayout}>
            <Sider breakpoint="lg" collapsedWidth={0} className={styles.sider}>
              <div className={styles.siderTop}>
                <Avatar
                  size={40}
                  icon={<UserOutlined className={styles.avatarIcon} />}
                  className={styles.avatar}
                />
                <Typography.Text strong className={styles.ownerName}>
                  {ownerLoading ? 'Загрузка...' : (owner?.username ?? 'Владелец')}
                </Typography.Text>
              </div>
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={({ key }) => navigate(key)}
                className={styles.menu}
              />
            </Sider>
            <Content className={styles.contentArea}>
              <Outlet />
            </Content>
          </Layout>
        </PageContent>
      </div>
    </Layout>
  );
}
