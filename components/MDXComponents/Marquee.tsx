'use client';

import { useRef } from 'react';
import styles from './Marquee.module.css';

interface Props {
  images: string[];
}

export default function Marquee({ images }: Props) {
  if (!images || images.length === 0) return null;

  const doubled = [...images, ...images];
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
    el.style.cursor = 'grabbing';
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current.active) return;
    const el = trackRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = drag.current.scrollLeft - (x - drag.current.startX) * 1.5;
  };

  const onDragEnd = () => {
    drag.current.active = false;
    if (trackRef.current) trackRef.current.style.cursor = '';
  };

  return (
    <div
      className={styles.track}
      ref={trackRef}
      data-reveal
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
    >
      <div className={styles.inner}>
        {doubled.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt="" className={styles.image} />
        ))}
      </div>
    </div>
  );
}
