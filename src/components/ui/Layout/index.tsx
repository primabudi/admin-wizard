import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <h2>Admin Wizard</h2>
        </Link>
        <nav className={styles.nav}>
          <Link to="/">Employees</Link>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}