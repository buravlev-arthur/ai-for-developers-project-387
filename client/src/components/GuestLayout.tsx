import clsx from 'clsx';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from './AppHeader';
import PageContent from './PageContent';
import styles from './GuestLayout.module.css';

const { Content } = Layout;

export default function GuestLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <Layout className={clsx(styles.layout, { [styles.layoutHome]: isHome })}>
      <AppHeader />
      <Content className={styles.content}>
        <div className={styles.contentWrapper}>
          <PageContent>
            <Outlet />
          </PageContent>
        </div>
      </Content>
    </Layout>
  );
}
