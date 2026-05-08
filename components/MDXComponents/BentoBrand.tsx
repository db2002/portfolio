'use client';

import styles from './BentoBrand.module.css';

export default function BentoBrand() {
  return (
    <div className={styles.grid} data-stagger>
      <div className={styles.wide}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/beauty-playbook/bp-brand-bento-1.png" alt="Beauty Playbook billboard" className={styles.img} />
      </div>
      <div className={styles.left}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/beauty-playbook/bp-brand-bento-2.png" alt="Beauty Playbook business cards" className={styles.img} />
      </div>
      <div className={styles.right}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/beauty-playbook/bp-brand-bento-3.png" alt="Beauty Playbook Instagram content" className={styles.img} />
      </div>
    </div>
  );
}
