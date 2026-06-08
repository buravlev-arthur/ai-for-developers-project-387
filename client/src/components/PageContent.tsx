import { type ReactNode } from 'react';
import styles from './PageContent.module.css';

interface Props {
  children: ReactNode;
}

export default function PageContent({ children }: Props) {
  return <div className={styles.container}>{children}</div>;
}
