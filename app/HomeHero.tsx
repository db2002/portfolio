'use client';

import dynamic from 'next/dynamic';
import { useRef, useEffect, useState } from 'react';
import ProfileIllustration from '@/components/ProfileIllustration/ProfileIllustration';
import styles from './work/work.module.css';

const HeroAnimation = dynamic(() => import('@/components/HeroAnimation/HeroAnimation'), { ssr: false });
const StickerSpawner = dynamic(() => import('@/components/StickerSpawner/StickerSpawner'), { ssr: false });

export default function HomeHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <div ref={heroRef} className={styles.hero}>
      {isDesktop && <StickerSpawner containerRef={heroRef} />}

      <ProfileIllustration className={styles.heroIllustration} />
      <HeroAnimation
        headline={<><span style={{ display: 'block', marginBottom: '0.15em' }}>Hello, I&apos;m Diya.</span><span style={{ display: 'block' }}>I build thoughtful experiences that empower individuality.</span></>}
        labelClassName={styles.heroHeadline}
        headlineClassName={styles.heroSub}
        childrenClassName={styles.heroCurrent}
        disableSplit
      >
        <a
          href="https://www.linkedin.com/in/diyabhatia/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.currentLink}
        >
          Currently designing web experiences at Vagaro
          <svg className={styles.currentArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </HeroAnimation>
    </div>
  );
}
