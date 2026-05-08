'use client';

import { useEffect, useCallback, useRef } from 'react';
import styles from './StickerSpawner.module.css';

const STICKERS = [
  '/images/stickers/sticker-1.png',
  '/images/stickers/sticker-2.png',
  '/images/stickers/sticker-3.png',
  '/images/stickers/sticker-4.png',
  '/images/stickers/sticker-5.png',
  '/images/stickers/sticker-6.png',
  '/images/stickers/sticker-7.png',
  '/images/stickers/sticker-8.png',
];

const LIFETIME_MS = 2200;
const SIZE = 100;

interface Props {
  containerRef?: React.RefObject<HTMLElement>;
}

export default function StickerSpawner({ containerRef }: Props) {
  const indexRef = useRef(0);

  const spawn = useCallback((x: number, y: number) => {
    const container = containerRef?.current ?? document.body;
    const src = STICKERS[indexRef.current % STICKERS.length];
    indexRef.current += 1;
    const rotation = (Math.random() - 0.5) * 40;
    const scale = 0.7 + Math.random() * 0.6;

    const el = document.createElement('img');
    el.src = src;
    el.className = styles.sticker;
    el.style.position = 'fixed';
    el.style.left = `${x - (SIZE * scale) / 2}px`;
    el.style.top = `${y - (SIZE * scale) / 2}px`;

    el.style.width = `${SIZE * scale}px`;
    el.style.setProperty('--rotation', `${rotation}deg`);

    container.appendChild(el);

    requestAnimationFrame(() => el.classList.add(styles.visible));

    setTimeout(() => {
      el.classList.add(styles.fadeOut);
      el.addEventListener('transitionend', () => el.remove(), { once: true });
    }, LIFETIME_MS);
  }, [containerRef]);

  useEffect(() => {
    const target = containerRef?.current ?? window;
    const onClick = (e: MouseEvent) => {
      const clickTarget = e.target as HTMLElement;
      if (clickTarget.closest('a, button, input, textarea, select')) return;
      const navEl = document.querySelector('header');
      if (navEl) {
        const r = navEl.getBoundingClientRect();
        const pad = 32;
        if (e.clientX >= r.left - pad && e.clientX <= r.right + pad &&
            e.clientY >= r.top - pad && e.clientY <= r.bottom + pad) return;
      }
      spawn(e.clientX, e.clientY);
    };

    target.addEventListener('click', onClick as EventListener);
    return () => target.removeEventListener('click', onClick as EventListener);
  }, [spawn, containerRef]);

  return null;
}
