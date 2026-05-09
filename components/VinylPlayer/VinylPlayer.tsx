'use client';

import { useEffect, useRef, useState, useId } from 'react';
import styles from './VinylPlayer.module.css';

// Deterministic PRNG — keeps dust specks stable across renders
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface VinylProps {
  rotation: number;
  isDark?: boolean;
  vinylColor?: string;
  accent?: string;
  labelColor?: string;
  title?: string;
  artist?: string;
}

function Vinyl({
  rotation,
  isDark = false,
  vinylColor = '#1c1a17',
  accent = '#586632',
  labelColor = '#efe9dd',
  title = 'my favorite tunes',
  artist = '',
}: VinylProps) {
  const rawId = useId();
  const uid = rawId.replace(/:/g, '');
  const diameter = 560;
  const r = diameter / 2;
  const discR = r * 0.985;
  const labelR = r * 0.4;
  const holeR = r * 0.018;
  const spindleR = r * 0.05;

  // Grooves
  const grooves = [];
  const grooveOuter = r * 0.96;
  const grooveInner = r * 0.42;
  const grooveCount = 140;
  const trackBreaks = new Set([18, 38, 56, 78, 96, 118]);
  for (let i = 0; i < grooveCount; i++) {
    const t = i / (grooveCount - 1);
    const rr = grooveOuter - (grooveOuter - grooveInner) * t;
    let op = 0.05 + (i % 3 === 0 ? 0.02 : 0);
    let w = 0.45;
    if (trackBreaks.has(i)) { op = 0.16; w = 0.7; }
    grooves.push(<circle key={i} cx={r} cy={r} r={rr} fill="none" stroke="#000" strokeOpacity={op} strokeWidth={w} />);
  }

  const microGrain = [];
  for (let i = 0; i < 10; i++) {
    const rr = grooveInner + (grooveOuter - grooveInner) * (i / 10) + 1;
    microGrain.push(<circle key={i} cx={r} cy={r} r={rr} fill="none" stroke="#fff" strokeOpacity={0.025} strokeWidth={0.35} />);
  }

  // Dust specks (rotate with disc)
  const specks = [];
  const rng = mulberry32(7);
  for (let i = 0; i < 14; i++) {
    const ang = rng() * Math.PI * 2;
    const rad = grooveInner + rng() * (grooveOuter - grooveInner);
    const x = r + Math.cos(ang) * rad;
    const y = r + Math.sin(ang) * rad;
    const sz = 0.4 + rng() * 0.7;
    specks.push(<circle key={i} cx={x} cy={y} r={sz} fill="#fff" opacity={0.08 + rng() * 0.06} />);
  }

  // Rosette for classic label
  const rosettePoints: string[] = [];
  const n = 12;
  const rOut = labelR * 0.42;
  const rIn = labelR * 0.22;
  for (let i = 0; i < n * 2; i++) {
    const a = (i * Math.PI) / n - Math.PI / 2;
    const rr = i % 2 === 0 ? rOut : rIn;
    rosettePoints.push(`${r + Math.cos(a) * rr},${r + Math.sin(a) * rr}`);
  }

  const spinStyle: React.CSSProperties = {
    transformOrigin: `${r}px ${r}px`,
    transform: `rotate(${rotation}deg)`,
    willChange: 'transform',
  };

  return (
    <svg viewBox={`0 0 ${diameter} ${diameter}`} width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={`vg-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={vinylColor} />
          <stop offset="55%" stopColor={vinylColor} />
          <stop offset="92%" stopColor="#040404" />
          <stop offset="100%" stopColor="#020202" />
        </radialGradient>
        <radialGradient id={`ga-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity={0.28} />
          <stop offset="55%" stopColor={accent} stopOpacity={0.1} />
          <stop offset="100%" stopColor={accent} stopOpacity={0} />
        </radialGradient>
        <filter id={`gf-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="30" />
        </filter>
        <radialGradient id={`sa-${uid}`} cx="32%" cy="26%" r="68%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.11} />
          <stop offset="30%" stopColor="#fff" stopOpacity={0.05} />
          <stop offset="70%" stopColor="#fff" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`sb-${uid}`} cx="74%" cy="78%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.05} />
          <stop offset="45%" stopColor="#fff" stopOpacity={0.015} />
          <stop offset="85%" stopColor="#fff" stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`sk-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity={0} />
          <stop offset="40%" stopColor="#fff" stopOpacity={0.025} />
          <stop offset="50%" stopColor="#fff" stopOpacity={0.085} />
          <stop offset="60%" stopColor="#fff" stopOpacity={0.025} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <linearGradient id={`bv-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.14} />
          <stop offset="16%" stopColor="#fff" stopOpacity={0.025} />
          <stop offset="50%" stopColor="#000" stopOpacity={0} />
          <stop offset="86%" stopColor="#000" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.55} />
        </linearGradient>
        <radialGradient id={`lg-${uid}`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={labelColor} stopOpacity={1} />
          <stop offset="80%" stopColor={labelColor} stopOpacity={0.96} />
          <stop offset="100%" stopColor={labelColor} stopOpacity={0.88} />
        </radialGradient>
        <filter id={`sh-${uid}`} x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <clipPath id={`dc-${uid}`}>
          <circle cx={r} cy={r} r={discR} />
        </clipPath>
        <path id={`tp-${uid}`} d={`M ${r - labelR * 0.71} ${r} a ${labelR * 0.71} ${labelR * 0.71} 0 0 1 ${labelR * 1.42} 0`} />
        <path id={`ap-${uid}`} d={`M ${r - labelR * 0.84} ${r} a ${labelR * 0.84} ${labelR * 0.84} 0 0 0 ${labelR * 1.68} 0`} />
      </defs>

      {/* Ambient glow — dark mode only */}
      {isDark && (
        <ellipse cx={r} cy={r} rx={r * 1.1} ry={r * 1.1} fill={`url(#ga-${uid})`} filter={`url(#gf-${uid})`} />
      )}

      {/* Drop shadow */}
      <ellipse cx={r + r * 0.01} cy={r + r * 0.05} rx={r * 0.97} ry={r * 0.96} fill="#000" opacity={0.34} filter={`url(#sh-${uid})`} />

      {/* Spinning group */}
      <g style={spinStyle}>
        <circle cx={r} cy={r} r={discR} fill={`url(#vg-${uid})`} />
        <g>{grooves}</g>
        <g>{microGrain}</g>
        <circle cx={r} cy={r} r={labelR + r * 0.012} fill={vinylColor} />
        <circle cx={r} cy={r} r={labelR + r * 0.012} fill="none" stroke="#000" strokeOpacity={0.45} strokeWidth={0.6} />
        <g>{specks}</g>

        {/* Label */}
        <circle cx={r} cy={r} r={labelR} fill={`url(#lg-${uid})`} />
        <circle cx={r} cy={r} r={labelR * 0.94} fill="none" stroke={accent} strokeOpacity={0.5} strokeWidth={1} />
        <circle cx={r} cy={r} r={labelR * 0.62} fill="none" stroke={accent} strokeOpacity={0.35} strokeWidth={0.6} />
        <polygon points={rosettePoints.join(' ')} fill={accent} opacity={0.08} />
        <circle cx={r} cy={r} r={labelR * 0.34} fill="none" stroke={accent} strokeOpacity={0.55} strokeWidth={0.5} strokeDasharray={`${labelR * 0.012} ${labelR * 0.024}`} />

        {/* Title arc */}
        <text fill={accent} style={{ fontFamily: '"EB Garamond", "Times New Roman", serif', fontStyle: 'italic', fontSize: labelR * 0.18, letterSpacing: '0.04em' }}>
          <textPath href={`#tp-${uid}`} startOffset="50%" textAnchor="middle">{title}</textPath>
        </text>

        {/* Artist arc */}
        {artist && (
          <text fill={accent} opacity={0.85} style={{ fontFamily: 'ui-monospace, monospace', fontSize: labelR * 0.085, letterSpacing: '0.18em' }}>
            <textPath href={`#ap-${uid}`} startOffset="50%" textAnchor="middle">{artist.toUpperCase()}</textPath>
          </text>
        )}

        {/* Spindle */}
        <circle cx={r} cy={r} r={spindleR} fill="#000" opacity={0.18} />
        <circle cx={r} cy={r} r={holeR} fill="#0a0908" />
      </g>

      {/* Fixed-light highlights */}
      <g clipPath={`url(#dc-${uid})`} style={{ pointerEvents: 'none' }}>
        <rect x="0" y="0" width={diameter} height={diameter} fill={`url(#sa-${uid})`} />
        <rect x="0" y="0" width={diameter} height={diameter} fill={`url(#sb-${uid})`} />
        <rect x="0" y="0" width={diameter} height={diameter} fill={`url(#sk-${uid})`} opacity={0.7} />
      </g>

      {/* Edge bevel */}
      <circle cx={r} cy={r} r={discR} fill={`url(#bv-${uid})`} style={{ pointerEvents: 'none' }} />
      <circle cx={r} cy={r} r={discR - 0.5} fill="none" stroke="#000" strokeOpacity={0.5} strokeWidth={1} style={{ pointerEvents: 'none' }} />
      <circle cx={r} cy={r} r={discR - 1.5} fill="none" stroke="#fff" strokeOpacity={isDark ? 0.2 : 0.03} strokeWidth={isDark ? 1.2 : 0.5} style={{ pointerEvents: 'none' }} />
    </svg>
  );
}

const PLAYLIST_ID = '3QqQ0p6RjmxnI9oit5MLxP';
const RPM = 33;

function useDarkMode() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const update = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDark(
        theme === 'dark' ||
        (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    };
    update();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', update);
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      mq.removeEventListener('change', update);
      observer.disconnect();
    };
  }, []);
  return isDark;
}

export default function VinylPlayer() {
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const isDark = useDarkMode();
  const embedHostRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controllerRef = useRef<any>(null);
  const playingRef = useRef(false);
  playingRef.current = isPlaying;

  // rAF spin loop
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (playingRef.current) {
        const dps = (RPM * 360) / 60;
        setRotation(r => (r + dps * dt) % 360);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Spotify IFrame API
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setup = (IFrameAPI: any) => {
      if (!embedHostRef.current || controllerRef.current) return;
      const target = document.createElement('div');
      embedHostRef.current.innerHTML = '';
      embedHostRef.current.appendChild(target);
      IFrameAPI.createController(
        target,
        { uri: `spotify:playlist:${PLAYLIST_ID}`, width: '100%', height: 80, theme: 'dark' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ec: any) => {
          controllerRef.current = ec;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ec.addListener('playback_update', (e: any) => {
            setIsPlaying(!(e?.data?.isPaused ?? true));
          });
        }
      );
    };

    if (!document.getElementById('spotify-iframe-api')) {
      win.onSpotifyIframeApiReady = (IFrameAPI: unknown) => {
        win.__SpotifyIFrameAPI = IFrameAPI;
        win.__spotifyApiReady = true;
        window.dispatchEvent(new Event('spotify-api-ready'));
      };
      const s = document.createElement('script');
      s.id = 'spotify-iframe-api';
      s.src = 'https://open.spotify.com/embed/iframe-api/v1';
      s.async = true;
      document.body.appendChild(s);
    }

    if (win.__spotifyApiReady && win.__SpotifyIFrameAPI) {
      setup(win.__SpotifyIFrameAPI);
    } else {
      const onReady = () => setup(win.__SpotifyIFrameAPI);
      window.addEventListener('spotify-api-ready', onReady, { once: true });
      return () => window.removeEventListener('spotify-api-ready', onReady);
    }
  }, []);

  return (
    <div
      className={styles.wrap}
      onMouseEnter={() => document.documentElement.setAttribute('data-hide-cursor', 'true')}
      onMouseLeave={() => document.documentElement.removeAttribute('data-hide-cursor')}
    >
      <div className={styles.stage}>
        <Vinyl rotation={rotation} isDark={isDark} />
      </div>
      <div className={styles.embedHost} ref={embedHostRef} />
    </div>
  );
}
