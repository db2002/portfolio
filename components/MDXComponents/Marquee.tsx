'use client';

import styles from './Marquee.module.css';

interface Props {
  images: string[];
}

export default function Marquee({ images }: Props) {
  if (!images || images.length === 0) return null;

  const doubled = [...images, ...images];

  return (
    <div className={styles.track} data-reveal>
      <div className={styles.inner}>
        {doubled.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt="" className={styles.image} />
        ))}
      </div>
    </div>
  );
}
