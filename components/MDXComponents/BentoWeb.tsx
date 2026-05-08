'use client';

import styles from './BentoWeb.module.css';

export default function BentoWeb() {
  return (
    <div className={styles.grid} data-stagger>
      <div className={styles.full}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/beauty-playbook/bp-web-bento-1.png" alt="Beauty Playbook web experience" className={styles.img} />
      </div>

      <div className={styles.halfLeft}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/beauty-playbook/bp-web-bento-2a.png" alt="Beauty Playbook homepage" className={styles.img} />
      </div>
      <div className={styles.halfRight}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/beauty-playbook/bp-web-bento-2b.png" alt="Beauty Playbook browser mockup" className={styles.img} />
      </div>

      <div className={styles.wideLeft}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/beauty-playbook/bp-web-bento-3a.png" alt="Beauty Playbook contact form" className={styles.img} />
      </div>
      <div className={styles.narrowRight}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/beauty-playbook/bp-web-bento-3b.png" alt="Beauty Playbook reviews section" className={styles.img} />
      </div>

      <div className={styles.third}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/beauty-playbook/bp-web-bento-4a.png" alt="Beauty Playbook desktop view" className={styles.img} />
      </div>
      <div className={styles.third}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/beauty-playbook/bp-web-bento-4b.png" alt="Beauty Playbook tablet view" className={styles.img} />
      </div>
      <div className={styles.third}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/beauty-playbook/bp-web-bento-4c.png" alt="Beauty Playbook mobile view" className={styles.img} />
      </div>
    </div>
  );
}
