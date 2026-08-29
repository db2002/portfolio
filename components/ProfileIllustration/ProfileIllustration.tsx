'use client';

import { useEffect, useRef } from 'react';
import styles from './ProfileIllustration.module.css';

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

// Padded viewBox shared by every layer — leaves room for the outline rim
// and shrinks the sticker within its container.
const VBOX = { x: -80, y: -60, w: 959, h: 718 };

// Eye white centres and resting pupil centres, in artwork coordinates.
const EYES = {
  left:  { white: [245.78, 357.826],  pupil: [233.129, 357.734] },
  right: { white: [513.246, 357.826], pupil: [500.595, 357.734] },
} as const;

const TRAVEL = 31;      // max pupil shift, artwork units
const Y_FACTOR = 0.85;  // vertical pupil range vs horizontal
const REACH = 0.55;     // cursor distance (× width) at which pupils max out
const SWAY_PX = 1.6;    // head translation range, px
const PARALLAX = 0.45;  // back layer sway relative to the head
const SPEED = 0.22;     // per-frame easing toward target
const REST_GAZE = { x: 19, y: 0 }; // resting pupil offset — eyes look to the right

export default function ProfileIllustration({ className, style }: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const outlineRef = useRef<HTMLImageElement>(null);
  const backRef = useRef<HTMLImageElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<SVGGElement>(null);
  const rightRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const outline = outlineRef.current;
    const back = backRef.current;
    const head = headRef.current;
    const lp = leftRef.current;
    const rp = rightRef.current;
    if (!wrap || !back || !head || !lp || !rp) return;

    const lo = {
      x: EYES.left.white[0] - EYES.left.pupil[0],
      y: EYES.left.white[1] - EYES.left.pupil[1],
    };
    const ro = {
      x: EYES.right.white[0] - EYES.right.pupil[0],
      y: EYES.right.white[1] - EYES.right.pupil[1],
    };

    const state = { lx: REST_GAZE.x, ly: REST_GAZE.y, rx: REST_GAZE.x, ry: REST_GAZE.y, hx: 0, hy: 0 };
    const target = { lx: REST_GAZE.x, ly: REST_GAZE.y, rx: REST_GAZE.x, ry: REST_GAZE.y, hx: 0, hy: 0 };
    let cursor: { x: number; y: number } | null = null;
    let raf = 0;

    const onMove = (e: MouseEvent) => { cursor = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => {
      target.lx = target.rx = REST_GAZE.x;
      target.ly = target.ry = REST_GAZE.y;
      target.hx = target.hy = 0;
    };

    const tick = () => {
      if (cursor) {
        const r = wrap.getBoundingClientRect();

        (['left', 'right'] as const).forEach((key) => {
          const eye = EYES[key];
          const ex = r.left + ((eye.white[0] - VBOX.x) / VBOX.w) * r.width;
          const ey = r.top + ((eye.white[1] - VBOX.y) / VBOX.h) * r.height;
          const dx = cursor!.x - ex;
          const dy = cursor!.y - ey;
          const d = Math.hypot(dx, dy) || 1;
          const reach = Math.min(1, d / (r.width * REACH));
          const p = key === 'left' ? 'l' : 'r';
          target[`${p}x` as 'lx'] = (dx / d) * TRAVEL * reach;
          target[`${p}y` as 'ly'] = (dy / d) * TRAVEL * Y_FACTOR * reach;
        });

        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        target.hx = Math.max(-1, Math.min(1, (cursor.x - cx) / (r.width * 0.7))) * SWAY_PX;
        target.hy = Math.max(-1, Math.min(1, (cursor.y - cy) / (r.height * 0.9))) * SWAY_PX * 0.5;
      }

      (Object.keys(state) as (keyof typeof state)[]).forEach((k) => {
        state[k] += (target[k] - state[k]) * SPEED;
      });

      head.style.transform = `translate(${state.hx.toFixed(2)}px, ${state.hy.toFixed(2)}px)`;
      const backShift = `translate(${(state.hx * PARALLAX).toFixed(2)}px, ${(state.hy * PARALLAX).toFixed(2)}px)`;
      back.style.transform = backShift;
      if (outline) outline.style.transform = backShift;
      lp.setAttribute('transform', `translate(${(lo.x + state.lx).toFixed(2)} ${(lo.y + state.ly).toFixed(2)})`);
      rp.setAttribute('transform', `translate(${(ro.x + state.rx).toFixed(2)} ${(ro.y + state.ry).toFixed(2)})`);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <span
      ref={wrapRef}
      className={`${styles.wrapper}${className ? ` ${className}` : ''}`}
      style={style}
    >
      <img ref={outlineRef} className={styles.outline} src="/images/sticker-eyes/outline.svg" alt="" aria-hidden="true" />
      <img ref={backRef} className={styles.back} src="/images/sticker-eyes/back.svg" alt="" aria-hidden="true" />
      <div ref={headRef} className={styles.head}>
        <img className={styles.features} src="/images/sticker-eyes/features.svg" alt="" aria-hidden="true" />
        <svg
          className={styles.eyes}
          viewBox={`${VBOX.x} ${VBOX.y} ${VBOX.w} ${VBOX.h}`}
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <ellipse cx="245.78" cy="357.826" rx="36.1441" ry="39.7585" fill="#fff" />
          <ellipse cx="513.246" cy="357.826" rx="36.1441" ry="39.7585" fill="#fff" />
          <g ref={leftRef}>
            <path d="M233.129 375.714C242.112 375.714 249.394 367.664 249.394 357.734C249.394 347.804 242.112 339.754 233.129 339.754C224.146 339.754 216.864 347.804 216.864 357.734C216.864 367.664 224.146 375.714 233.129 375.714Z" fill="#10120B" />
          </g>
          <g ref={rightRef}>
            <path d="M500.595 375.714C509.578 375.714 516.86 367.664 516.86 357.734C516.86 347.804 509.578 339.754 500.595 339.754C491.613 339.754 484.331 347.804 484.331 357.734C484.331 367.664 491.613 375.714 500.595 375.714Z" fill="#10120B" />
          </g>
        </svg>
      </div>
    </span>
  );
}
