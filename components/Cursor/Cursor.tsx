'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Cursor.module.css';

export default function Cursor() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const move = (e: MouseEvent) => {
      wrapper.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      setVisible(true);

      const target = e.target as HTMLElement;
      const cursorEl = target.closest('[data-cursor]') as HTMLElement | null;
      if (document.documentElement.hasAttribute('data-hide-cursor')) {
        setVisible(false);
        return;
      }
      setLabel(cursorEl ? cursorEl.dataset.cursor ?? null : null);
      setVisible(true);
    };

    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    const observer = new MutationObserver(() => {
      if (document.documentElement.hasAttribute('data-hide-cursor')) {
        setVisible(false);
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-hide-cursor'] });

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    document.documentElement.addEventListener('mouseleave', leave);
    document.documentElement.addEventListener('mouseenter', enter);
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      document.documentElement.removeEventListener('mouseleave', leave);
      document.documentElement.removeEventListener('mouseenter', enter);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.wrapper} aria-hidden="true">
      <div className={`${styles.cursor} ${label ? styles.hasLabel : ''} ${pressed ? styles.pressed : ''} ${!visible ? styles.hidden : ''}`}>
        {label === 'view' && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.icon}>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className={styles.label}>View case study</span>
          </>
        )}
        {label === 'visit' && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.icon}>
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={styles.label}>View website</span>
          </>
        )}
      </div>
    </div>
  );
}
