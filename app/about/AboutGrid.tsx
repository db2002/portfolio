'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './about.module.css';

const HeroAnimation = dynamic(() => import('@/components/HeroAnimation/HeroAnimation'), { ssr: false });
const StickerSpawner = dynamic(() => import('@/components/StickerSpawner/StickerSpawner'), { ssr: false });

export default function AboutGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!bodyRef.current) return;
      const targets = bodyRef.current.querySelectorAll('p, [data-ctas]');
      gsap.set(targets, { y: 24, opacity: 0 });
      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.08,
        delay: 0.6,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={gridRef} className={styles.grid}>
      <StickerSpawner />

      {/* ── Photo ───────────────────────────────────────── */}
      <aside className={styles.photo}>
        <Image
          src="/images/about/DiyaBhatia-ProductionDesignTeam-04.jpg"
          alt="Diya Bhatia"
          fill
          className={styles.photoImg}
          sizes="(max-width: 768px) 100vw, 480px"
        />
      </aside>

      {/* ── Bio ─────────────────────────────────────────── */}
      <div className={styles.bio}>
        <HeroAnimation
          label="Hello, I'm Diya"
          headline={<>I&apos;m a designer, ceramicist, crocheter, bookworm, and <em>explorer of the unknown.</em></>}
          labelClassName={styles.name}
          headlineClassName={styles.headline}
        />

        <div ref={bodyRef} className={styles.bioBody}>
          <p>
            My curiosity for human connection is at the heart of everything I make. I believe the best experiences spark a moment of joy. That&apos;s the thread I chase in every project.
          </p>
          <p>
            I hold a Bachelor&apos;s in Industrial Design, which has shaped how I think about people, products, and what makes an interaction feel intentional. (I also developed an obsession with MCM chairs, but that's between me and my bank account.)
          </p>
          <p>
            When I&apos;m not in pixels, I&apos;m usually at the pottery studio, mid-crochet with a good TV show on, or halfway through a book I swore I&apos;d finish by book club. I&apos;m always open to chat!
          </p>

          <div className={styles.ctas} data-ctas>
            <a href="mailto:hello@diyabhatia.com" className={styles.ctaPrimary}>
              Let&apos;s connect!
            </a>
            <a
              href="/diya-bhatia-resume.pdf"
              className={styles.ctaSecondary}
              target="_blank"
              rel="noopener noreferrer"
            >
              See my resume
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
