'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import styles from './ModalShell.module.css';

// Used only for direct /work/[slug] navigation (not from the work grid)
export default function ModalShell({ children, slug }: { children: React.ReactNode; slug: string }) {
  const router     = useRouter();
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef    = useRef<HTMLDivElement>(null);
  const gsapCtxRef  = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Reset any leftover GSAP inline styles every time the modal opens
    const modal    = modalRef.current;
    const backdrop = backdropRef.current;
    if (modal) {
      modal.style.transform  = '';
      modal.style.opacity    = '';
      modal.style.borderRadius = '';
      modal.style.pointerEvents = '';
    }
    if (backdrop) {
      backdrop.style.opacity = '';
    }

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') router.back(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      gsapCtxRef.current?.();
    };
  }, [router]);

  function handleExpand() {
    const modal    = modalRef.current;
    const backdrop = backdropRef.current;
    if (!modal || !backdrop) { window.location.href = `/work/${slug}`; return; }

    import('gsap').then(({ gsap }) => {
      const rect   = modal.getBoundingClientRect();
      const scaleX = window.innerWidth  / rect.width;
      const scaleY = window.innerHeight / rect.height;
      const dx     = (window.innerWidth  / 2) - (rect.left + rect.width  / 2);
      const dy     = (window.innerHeight / 2) - (rect.top  + rect.height / 2);

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ onComplete: () => { window.location.href = `/work/${slug}`; } });
        tl.to(backdrop, { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 0);
        tl.to(modal, {
          x: dx, y: dy, scaleX, scaleY,
          borderRadius: 0,
          transformOrigin: 'center center',
          duration: 0.5,
          ease: 'power4.inOut',
        }, 0);
      });

      gsapCtxRef.current = () => ctx.revert();
    });
  }

  return (
    <div ref={backdropRef} className={styles.backdrop} onClick={() => router.back()} aria-modal="true" role="dialog">
      <div ref={modalRef} className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.actions}>
          <button className={styles.expand} aria-label="View full page" onClick={handleExpand}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className={styles.close} onClick={() => router.back()} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className={styles.scroll}>
          {children}
        </div>
      </div>
    </div>
  );
}