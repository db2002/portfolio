import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.desc}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/work" className={styles.link}>
        ← Back to Work
      </Link>
    </div>
  );
}
