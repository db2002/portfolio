'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './play.module.css';

const HeroAnimation = dynamic(() => import('@/components/HeroAnimation/HeroAnimation'), { ssr: false });

const tabs = [
  { id: 'pottery',        label: 'Pottery' },
  { id: 'screenprinting', label: 'Screen Printing' },
  { id: 'illustration',   label: 'Illustration' },
];

const images: Record<string, { src: string; alt: string }[]> = {
  pottery: [
    { src: '/images/play/pottery/Pottery - Brown 1.jpg', alt: 'Brown pottery piece' },
    { src: '/images/play/pottery/Pottery - Brown 2.jpg', alt: 'Brown pottery piece 2' },
    { src: '/images/play/pottery/Pottery - Brown 3.jpg', alt: 'Brown pottery piece 3' },
    { src: '/images/play/pottery/Pottery - Coffee Set-1.jpg', alt: 'Coffee set' },
    { src: '/images/play/pottery/Pottery - Coffee Set-2.jpg', alt: 'Coffee set 2' },
    { src: '/images/play/pottery/Pottery - Coffee Set.jpg', alt: 'Coffee set full' },
    { src: '/images/play/pottery/Pottery - Green 1.jpg', alt: 'Green pottery piece' },
    { src: '/images/play/pottery/Pottery - Green 2.jpg', alt: 'Green pottery piece 2' },
    { src: '/images/play/pottery/Pottery - Green 3.jpg', alt: 'Green pottery piece 3' },
    { src: '/images/play/pottery/Pottery - Natural 1.jpg', alt: 'Natural pottery piece' },
    { src: '/images/play/pottery/Pottery - Natural 2.jpg', alt: 'Natural pottery piece 2' },
    { src: '/images/play/pottery/Pottery - Natural 3.jpg', alt: 'Natural pottery piece 3' },
    { src: '/images/play/pottery/Pottery - White 1.jpg', alt: 'White pottery piece' },
    { src: '/images/play/pottery/Pottery - White 2.jpg', alt: 'White pottery piece 2' },
    { src: '/images/play/pottery/Pottery - White 3.jpg', alt: 'White pottery piece 3' },
  ],
  screenprinting: [
    { src: '/images/play/screen-printing/Screen Print 1.png', alt: 'Screen print 1' },
    { src: '/images/play/screen-printing/Screen Print 2.png', alt: 'Screen print 2' },
    { src: '/images/play/screen-printing/Screen Print 3.png', alt: 'Screen print 3' },
    { src: '/images/play/screen-printing/Screen Print 4.png', alt: 'Screen print 4' },
    { src: '/images/play/screen-printing/Screen Print 5.png', alt: 'Screen print 5' },
    { src: '/images/play/screen-printing/Screen Print 6.png', alt: 'Screen print 6' },
  ],
  illustration: [
    { src: '/images/play/illustration/Illustration 1.jpg', alt: 'Illustration 1' },
    { src: '/images/play/illustration/Illustration 2.jpg', alt: 'Illustration 2' },
    { src: '/images/play/illustration/Illustration 3.jpg', alt: 'Illustration 3' },
    { src: '/images/play/illustration/Illustration 4.jpg', alt: 'Illustration 4' },
    { src: '/images/play/illustration/Illustration 5.jpg', alt: 'Illustration 5' },
    { src: '/images/play/illustration/Illustration 6.jpg', alt: 'Illustration 6' },
  ],
};

export default function PlayPage() {
  const [active, setActive] = useState('pottery');

  return (
    <section className={styles.page}>
      <div className={styles.layout}>
        {/* ── Left: headline + tabs ──────────────────────── */}
        <div className={styles.sidebar}>
          <HeroAnimation
            headline={<>I like to explore different media, but mostly clay.</>}
            labelClassName={styles.name}
            headlineClassName={styles.headline}
          />
        </div>

        {/* ── Right: tabs + gallery ─────────────────────── */}
        <div className={styles.right}>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${active === tab.id ? styles.tabActive : ''}`}
                onClick={() => setActive(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className={styles.gallery}>
            {images[active].map((img) => (
              <div key={img.src} className={styles.galleryItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.alt} className={styles.galleryImage} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
