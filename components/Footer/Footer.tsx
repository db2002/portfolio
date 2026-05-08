import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.name}>© {year} • Designed  + coded with ♡ by Diya</span>
        </div>

        <nav className={styles.nav} aria-label="Footer navigation">
          <a href="https://www.linkedin.com/in/diyabhatia/" className={styles.link} target="_blank" rel="noopener noreferrer">
            LinkedIn
            <svg className={styles.arrow} width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="mailto:diya@diyabhatia.com" className={styles.link}>
            Email
            <svg className={styles.arrow} width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </nav>
      </div>
    </footer>
  );
}
