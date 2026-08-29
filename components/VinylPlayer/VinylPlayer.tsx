'use client';

import { useEffect, useRef, useState, useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import styles from './VinylPlayer.module.css';

/* ── config ──────────────────────────────────────────────── */
const PLAYLIST_ID = '3QqQ0p6RjmxnI9oit5MLxP';
const RPM = 45;
// [vinylColor, labelColor]
const PALETTE: [string, string] = ['#1c1a17', '#efe9dd'];

/* deterministic PRNG so dust specks stay stable across renders */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Vinyl — the spinning record + label (pure SVG) ─────── */
interface VinylProps {
  diameter?: number;
  vinylColor?: string;
  labelColor?: string;
  rotation?: number;
}

function Vinyl({
  diameter = 560,
  vinylColor = '#0e0d0c',
  labelColor = '#f3ece1',
  rotation = 0,
}: VinylProps) {
  const r = diameter / 2;
  const discR = r * 0.985;
  const labelR = r * 0.33;
  const holeR = r * 0.018;
  const spindleR = r * 0.05;

  const uid = useId().replace(/:/g, '');

  // grooves — paired dark/light lines so each groove reads as a cut
  const grooves: ReactNode[] = [];
  const grooveOuter = r * 0.945;
  const grooveInner = r * 0.42;
  const grooveCount = 210;
  const trackBreaks = new Set([26, 56, 84, 116, 144, 178]);
  for (let i = 0; i < grooveCount; i++) {
    const t = i / (grooveCount - 1);
    const rr = grooveOuter - (grooveOuter - grooveInner) * t;
    let op = 0.055 + (i % 3 === 0 ? 0.015 : 0);
    let w = 0.4;
    if (trackBreaks.has(i)) { op = 0.2; w = 0.9; }
    grooves.push(
      <circle key={`d${i}`} cx={r} cy={r} r={rr} fill="none" stroke="#000" strokeOpacity={op} strokeWidth={w} />
    );
    if (i % 2 === 0) {
      grooves.push(
        <circle key={`l${i}`} cx={r} cy={r} r={rr + 0.55} fill="none" stroke="#fff" strokeOpacity={0.018} strokeWidth={0.3} />
      );
    }
  }

  // lead-in groove
  const leadIn: ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    leadIn.push(
      <circle key={i} cx={r} cy={r} r={r * 0.955 + i * 0.9} fill="none" stroke="#000" strokeOpacity={0.22 - i * 0.03} strokeWidth={0.8} />
    );
  }

  // dust specks (rotate with disc)
  const specks: ReactNode[] = [];
  const speckRng = mulberry32(7);
  for (let i = 0; i < 22; i++) {
    const ang = speckRng() * Math.PI * 2;
    const rad = grooveInner + speckRng() * (grooveOuter - grooveInner);
    const x = r + Math.cos(ang) * rad;
    const y = r + Math.sin(ang) * rad;
    const sz = 0.35 + speckRng() * 0.65;
    specks.push(<circle key={i} cx={x} cy={y} r={sz} fill="#fff" opacity={0.07 + speckRng() * 0.06} />);
  }

  // fine hairline scratches
  const scratchLines: ReactNode[] = [];
  {
    const rng = mulberry32(19);
    for (let i = 0; i < 3; i++) {
      const a0 = rng() * Math.PI * 2;
      const span = 0.25 + rng() * 0.5;
      const rad = grooveInner + rng() * (grooveOuter - grooveInner) * 0.9;
      const x1 = r + Math.cos(a0) * rad, y1 = r + Math.sin(a0) * rad;
      const x2 = r + Math.cos(a0 + span) * rad, y2 = r + Math.sin(a0 + span) * rad;
      scratchLines.push(
        <path key={i} d={`M ${x1} ${y1} A ${rad} ${rad} 0 0 1 ${x2} ${y2}`} fill="none" stroke="#fff" strokeOpacity={0.05} strokeWidth={0.4} />
      );
    }
  }

  const spinStyle: CSSProperties = {
    transformOrigin: `${r}px ${r}px`,
    transform: `rotate(${rotation}deg)`,
    willChange: 'transform',
  };

  return (
    <svg viewBox={`0 0 ${diameter} ${diameter}`} width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={`vinylGrad-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={vinylColor} />
          <stop offset="55%" stopColor={vinylColor} />
          <stop offset="92%" stopColor="#040404" />
          <stop offset="100%" stopColor="#020202" />
        </radialGradient>

        <radialGradient id={`specA-${uid}`} cx="32%" cy="26%" r="68%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.11" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0.00" />
        </radialGradient>

        <radialGradient id={`specB-${uid}`} cx="74%" cy="78%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.015" />
          <stop offset="85%" stopColor="#ffffff" stopOpacity="0.00" />
        </radialGradient>

        <linearGradient id={`streak-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0.025" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.085" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0.025" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={`bevel-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="16%" stopColor="#ffffff" stopOpacity="0.025" />
          <stop offset="50%" stopColor="#000000" stopOpacity="0" />
          <stop offset="86%" stopColor="#000000" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
        </linearGradient>

        <radialGradient id={`labelGrad-${uid}`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={labelColor} stopOpacity="1" />
          <stop offset="80%" stopColor={labelColor} stopOpacity="0.96" />
          <stop offset="100%" stopColor={labelColor} stopOpacity="0.88" />
        </radialGradient>

        <filter id={`paper-${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="4" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g" result="t">
            <feFuncA type="table" tableValues="0 0.12" />
          </feComponentTransfer>
          <feComposite in="t" in2="SourceGraphic" operator="in" />
        </filter>

        <radialGradient id={`labelAO-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="82%" stopColor="#000" stopOpacity="0" />
          <stop offset="97%" stopColor="#000" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.34" />
        </radialGradient>

        <radialGradient id={`rimBloom-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="86%" stopColor="#fff" stopOpacity="0" />
          <stop offset="97%" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>

        <filter id={`grain-${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="11" result="n" />
          <feColorMatrix in="n" type="saturate" values="0" result="g" />
          <feComponentTransfer in="g" result="t">
            <feFuncA type="table" tableValues="0 0.30" />
          </feComponentTransfer>
          <feComposite in="t" in2="SourceGraphic" operator="in" />
        </filter>

        <linearGradient id={`refl-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="26%" stopColor="#fff" stopOpacity="0.010" />
          <stop offset="42%" stopColor="#fff" stopOpacity="0.032" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.055" />
          <stop offset="58%" stopColor="#fff" stopOpacity="0.032" />
          <stop offset="74%" stopColor="#fff" stopOpacity="0.010" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        <filter id={`vinylShadow-${uid}`} x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="9" />
        </filter>

        <clipPath id={`discClip-${uid}`}>
          <circle cx={r} cy={r} r={discR} />
        </clipPath>
      </defs>

      {/* drop shadow */}
      <ellipse cx={r + r * 0.01} cy={r + r * 0.05} rx={r * 0.97} ry={r * 0.96} fill="#000" opacity="0.34" filter={`url(#vinylShadow-${uid})`} />

      {/* === SPINNING content === */}
      <g style={spinStyle}>
        <circle cx={r} cy={r} r={discR} fill={`url(#vinylGrad-${uid})`} />

        <g>{grooves}</g>
        <g>{leadIn}</g>

        <circle cx={r} cy={r} r={discR} fill="#fff" filter={`url(#grain-${uid})`} opacity="0.5" />

        <g clipPath={`url(#discClip-${uid})`}>
          <path
            d={`M ${r - diameter * 0.85} ${r - diameter * 0.2}
                L ${r} ${r - diameter * 0.022}
                L ${r + diameter * 0.85} ${r - diameter * 0.2}
                L ${r + diameter * 0.85} ${r + diameter * 0.2}
                L ${r} ${r + diameter * 0.022}
                L ${r - diameter * 0.85} ${r + diameter * 0.2} Z`}
            fill={`url(#refl-${uid})`}
            transform={`rotate(-34 ${r} ${r})`}
          />
        </g>

        {/* deadwax */}
        <circle cx={r} cy={r} r={labelR + r * 0.028} fill={vinylColor} />
        <circle cx={r} cy={r} r={labelR + r * 0.028} fill="none" stroke="#000" strokeOpacity="0.45" strokeWidth="0.7" />
        <circle cx={r} cy={r} r={labelR + r * 0.019} fill="none" stroke="#000" strokeOpacity="0.3" strokeWidth="0.5" />

        <g>{specks}</g>
        <g>{scratchLines}</g>

        {/* label — plain pressed paper, no center graphic */}
        <circle cx={r} cy={r} r={labelR} fill={`url(#labelGrad-${uid})`} />
        <circle cx={r} cy={r} r={labelR} fill="#fff" filter={`url(#paper-${uid})`} opacity="0.5" />

        {/* label edge occlusion */}
        <circle cx={r} cy={r} r={labelR} fill={`url(#labelAO-${uid})`} />

        {/* spindle / hole */}
        <circle cx={r} cy={r} r={spindleR} fill="#000" opacity="0.18" />
        <circle cx={r} cy={r} r={holeR * 1.5} fill="#000" opacity="0.35" />
        <circle cx={r} cy={r} r={holeR} fill="#080706" />
        <circle cx={r} cy={r} r={holeR} fill="none" stroke="#fff" strokeOpacity="0.10" strokeWidth="0.5" />
      </g>

      {/* === FIXED-LIGHT highlights — DO NOT rotate === */}
      <g clipPath={`url(#discClip-${uid})`} style={{ pointerEvents: 'none' }}>
        <rect x="0" y="0" width={diameter} height={diameter} fill={`url(#specA-${uid})`} />
        <rect x="0" y="0" width={diameter} height={diameter} fill={`url(#specB-${uid})`} />
        <rect x="0" y="0" width={diameter} height={diameter} fill={`url(#streak-${uid})`} opacity="0.7" />
        <circle cx={r} cy={r} r={discR} fill={`url(#rimBloom-${uid})`} />
      </g>

      <circle cx={r} cy={r} r={discR} fill={`url(#bevel-${uid})`} style={{ pointerEvents: 'none' }} />
      <circle cx={r} cy={r} r={discR - 0.5} fill="none" stroke="#000" strokeOpacity="0.5" strokeWidth="1" style={{ pointerEvents: 'none' }} />
      <circle cx={r} cy={r} r={discR - 1.5} fill="none" stroke="#fff" strokeOpacity="0.03" strokeWidth="0.5" style={{ pointerEvents: 'none' }} />
    </svg>
  );
}

/* ── Turntable — plan-view plinth that hosts the <Vinyl> ─── */
const TT_W = 680;
const TT_H = 486;
const TT_CX = 288;
const TT_CY = 243;
const TT_PIVOT_X = 593;
const TT_PIVOT_Y = 98;
const TT_ARM_LEN = 268;
const TT_ANGLE_PARKED = 105;
const TT_ANGLE_PLAYING = 120;
const TT_STYLUS_OFF = 3.6;
const TT_STYLUS_R = 300;

const TT_CSS = `
.tt-fit{width:100%;max-width:${TT_W}px;position:relative;overflow-x:clip}
.tt{position:absolute;top:0;left:0;width:${TT_W}px;height:${TT_H}px;transform-origin:0 0}

.tt-cast{position:absolute;left:22px;right:22px;top:34px;bottom:-6px;border-radius:20px;
  background:rgba(30,28,24,.24);filter:blur(22px)}
.tt-plinth{position:absolute;inset:0;border-radius:15px;
  background:linear-gradient(163deg,#ffffff 0%,#eceae6 52%,#cfccc6 100%);
  box-shadow:0 14px 30px -22px rgba(30,28,24,.45)}
.tt-plinth-top{position:absolute;inset:5px;border-radius:11px;
  background:
    linear-gradient(112deg,rgba(255,255,255,.95) 0%,rgba(255,255,255,.35) 20%,rgba(255,255,255,0) 34%,rgba(0,0,0,.035) 66%,rgba(0,0,0,.09) 100%),
    linear-gradient(160deg,#ffffff 0%,#f7f6f3 44%,#e6e3dd 100%);
  box-shadow:
    0 1px 0 rgba(255,255,255,.95) inset,
    0 -1px 0 rgba(0,0,0,.14) inset,
    0 22px 40px -30px rgba(0,0,0,.28) inset}
.tt-plinth-edge{position:absolute;inset:0;border-radius:15px;
  border:1px solid rgba(150,146,138,.5);pointer-events:none;
  box-shadow:0 0 0 1px rgba(255,255,255,.7) inset}

.tt-well{position:absolute;border-radius:50%;
  background:radial-gradient(circle at 50% 42%,#d8d5cf 0%,#c2bfb8 70%,#a9a69f 100%);
  box-shadow:0 3px 8px rgba(0,0,0,.30) inset,0 1px 0 rgba(255,255,255,.85)}
.tt-platter{position:absolute;border-radius:50%;
  background:
    radial-gradient(circle at 36% 28%,rgba(255,255,255,.34) 0%,rgba(255,255,255,0) 46%),
    conic-gradient(from 18deg,#cfcac1,#9d9890,#d8d4cb,#a6a199,#cbc6bd,#918d86,#dbd7ce,#a09b93,#cfcac1);
  box-shadow:0 8px 18px -6px rgba(0,0,0,.55),0 1px 0 rgba(255,255,255,.55) inset}
.tt-platter-rim{position:absolute;border-radius:50%;pointer-events:none;
  background:repeating-conic-gradient(from 0deg,rgba(0,0,0,.16) 0deg .55deg,rgba(255,255,255,.10) .55deg 1.1deg);
  mask:radial-gradient(circle,transparent 0 90%,#000 90.5% 100%);
  -webkit-mask:radial-gradient(circle,transparent 0 90%,#000 90.5% 100%)}
.tt-platter-lip{position:absolute;border-radius:50%;pointer-events:none;
  box-shadow:0 0 0 1px rgba(0,0,0,.4) inset,0 2px 3px rgba(255,255,255,.35) inset}

.tt-mat{position:absolute;border-radius:50%;
  background:
    repeating-radial-gradient(circle at 50% 50%,rgba(0,0,0,.10) 0px,rgba(0,0,0,0) 2px,rgba(255,255,255,.05) 4px,rgba(0,0,0,0) 7px),
    radial-gradient(circle at 38% 30%,#93856c 0%,#736753 58%,#544a3c 100%);
  box-shadow:0 0 0 1px rgba(0,0,0,.38),0 5px 13px rgba(0,0,0,.32) inset,0 1px 0 rgba(255,247,222,.14) inset}
.tt-record{position:absolute;filter:drop-shadow(0 5px 8px rgba(0,0,0,.34))}

.tt-spindle-base{position:absolute;border-radius:50%;
  background:radial-gradient(circle at 50% 40%,rgba(0,0,0,.45),rgba(0,0,0,0) 72%)}
.tt-spindle{position:absolute;border-radius:50%;
  background:linear-gradient(150deg,#fbf8f1 0%,#cdc8bd 38%,#8f8a80 72%,#b6b1a7 100%);
  box-shadow:0 2px 3px rgba(0,0,0,.6),0 0 0 1px rgba(0,0,0,.35)}

.tt-arm-shadow{position:absolute;width:0;height:0;
  filter:drop-shadow(1px 4px 3px rgba(0,0,0,.18))}
.tt-arm-wrap{position:absolute;width:0;height:0;
  transition:transform .9s cubic-bezier(.4,.05,.2,1)}
.tt-arm-svg{position:absolute;left:0;top:-30px;overflow:visible;pointer-events:none}
.tt-arm-cw{position:absolute;border-radius:3px;
  background:linear-gradient(180deg,#514c47 0%,#2a2724 40%,#171614 72%,#0d0c0b 100%);
  box-shadow:0 1px 0 rgba(255,255,255,.22) inset}

.tt-headshell{position:absolute;transform-origin:0 50%}
.tt-headshell-body{position:absolute;left:0;top:-7px;width:28px;height:14px;border-radius:2px;
  background:linear-gradient(180deg,#4a4540 0%,#26241f 42%,#171614 74%,#0c0b0a 100%);
  box-shadow:0 1px 0 rgba(255,255,255,.20) inset}
.tt-stylus{position:absolute;left:26px;top:7px;width:2.5px;height:8px;
  background:linear-gradient(90deg,#6e6862,#171614 62%)}

.tt-pivot{position:absolute;border-radius:50%;
  background:radial-gradient(circle at 36% 28%,#565049 0%,#272420 56%,#131211 100%);
  box-shadow:0 1px 0 rgba(255,255,255,.16) inset}
.tt-rest{position:absolute;width:26px;height:7px;border-radius:3px;background:#171614;opacity:.5}

.tt-knob-wrap{position:absolute;display:flex;flex-direction:column;align-items:center;gap:5px}
.tt-knob{position:relative;width:36px;height:36px;border-radius:50%;cursor:pointer;
  background:
    radial-gradient(circle at 34% 26%,rgba(255,255,255,.85) 0%,rgba(255,255,255,0) 42%),
    conic-gradient(from 18deg,#f4f2ee,#adaaa3,#fbfaf7,#b9b6ae,#e6e3dd,#9f9c95,#f7f5f1,#b2afa7,#f4f2ee);
  box-shadow:0 2px 4px rgba(0,0,0,.26),0 1px 0 rgba(255,255,255,.9) inset,0 0 0 1px rgba(0,0,0,.16);
  transition:transform .35s cubic-bezier(.4,.05,.2,1)}
.tt-knob-face{position:absolute;inset:5px;border-radius:50%;
  background:radial-gradient(circle at 38% 30%,#fbfaf8,#d8d5ce 62%,#b6b3ab);
  box-shadow:0 1px 2px rgba(0,0,0,.22) inset}
.tt-knob-mark{position:absolute;left:50%;bottom:-1px;width:3px;height:7px;border-radius:2px 2px 0 0;
  margin-left:-1.5px;background:#171614}
.tt-knob-scale{position:absolute;inset:-22px;pointer-events:none}
.tt-knob-num{position:absolute;font-family:"Manrope",system-ui,sans-serif;font-size:9px;
  font-weight:700;letter-spacing:.06em;color:rgba(35,33,30,.42);transition:color .3s}
.tt-knob-num.on{color:#171614}
.tt-knob-cap{font-family:"Manrope",system-ui,sans-serif;font-size:7px;font-weight:700;
  letter-spacing:.28em;text-transform:uppercase;color:rgba(35,33,30,.4)}
`;

interface TurntableProps {
  spinning: boolean;
  rpm: number;
  onRpmChange?: (v: number) => void;
  recordSize?: number;
  children?: ReactNode;
}

function Turntable({ spinning, rpm, onRpmChange, recordSize = 412, children }: TurntableProps) {
  const fitRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = fitRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth || TT_W;
      setScale(w / TT_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const wellR = 218;
  const platterR = 210;
  const matR = 172;
  const armAngle = spinning ? TT_ANGLE_PLAYING : TT_ANGLE_PARKED;
  const restRad = ((TT_ANGLE_PARKED + TT_STYLUS_OFF) * Math.PI) / 180;
  const restX = TT_PIVOT_X + TT_STYLUS_R * Math.cos(restRad);
  const restY = TT_PIVOT_Y + TT_STYLUS_R * Math.sin(restRad);
  const circle = (cx: number, cy: number, rad: number) => ({
    left: cx - rad,
    top: cy - rad,
    width: rad * 2,
    height: rad * 2,
  });

  return (
    <div className="tt-fit" ref={fitRef} style={{ height: TT_H * scale }}>
      <style>{TT_CSS}</style>
      <div className="tt" style={{ transform: `scale(${scale})` }}>
        <div className="tt-cast" />
        <div className="tt-plinth" />
        <div className="tt-plinth-top" />

        <div className="tt-well" style={circle(TT_CX, TT_CY, wellR)} />
        <div className="tt-platter" style={circle(TT_CX, TT_CY, platterR)} />
        <div className="tt-platter-rim" style={circle(TT_CX, TT_CY, platterR)} />
        <div className="tt-platter-lip" style={circle(TT_CX, TT_CY, platterR)} />
        <div className="tt-mat" style={circle(TT_CX, TT_CY, matR)} />

        <div className="tt-record" style={circle(TT_CX, TT_CY, recordSize / 2)}>
          {children}
        </div>

        <div className="tt-spindle-base" style={circle(TT_CX, TT_CY, 9)} />
        <div className="tt-spindle" style={circle(TT_CX, TT_CY, 4.5)} />

        <div className="tt-rest" style={{ left: restX - 13, top: restY - 3.5, transform: `rotate(${TT_ANGLE_PARKED - 92}deg)` }} />

        <div className="tt-arm-shadow">
          <div className="tt-arm-wrap" style={{ left: TT_PIVOT_X, top: TT_PIVOT_Y, transform: `rotate(${armAngle}deg)` }}>
            <div className="tt-arm-cw" style={{ left: -54, top: -8, width: 34, height: 16 }} />
            <svg className="tt-arm-svg" width={TT_ARM_LEN + 20} height="60">
              <defs>
                <linearGradient id="ttArmTube" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4c4740" />
                  <stop offset="30%" stopColor="#282521" />
                  <stop offset="70%" stopColor="#171614" />
                  <stop offset="100%" stopColor="#0a0908" />
                </linearGradient>
              </defs>
              <path d="M 0 30 C 69 30 92 20 150 18 C 202 16 233 24 268 36" fill="none" stroke="url(#ttArmTube)" strokeWidth="8" strokeLinecap="round" />
              <path d="M 0 27.7 C 69 27.7 92 17.7 150 15.7 C 202 13.7 233 21.7 268 33.7" fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <div className="tt-headshell" style={{ left: TT_ARM_LEN - 4, top: 6, transform: 'rotate(21deg)' }}>
              <div className="tt-headshell-body" />
              <div className="tt-stylus" />
            </div>
          </div>
        </div>

        <div className="tt-pivot" style={circle(TT_PIVOT_X, TT_PIVOT_Y, 19)} />

        <div className="tt-knob-wrap" style={{ left: TT_W - 96, top: TT_H - 96 }}>
          <div className="tt-knob-cap">rpm</div>
          <div style={{ position: 'relative' }}>
            <div className="tt-knob-scale">
              <div className={`tt-knob-num${rpm === 33 ? ' on' : ''}`} style={{ left: 1, bottom: 12 }}>33</div>
              <div className={`tt-knob-num${rpm === 45 ? ' on' : ''}`} style={{ right: 5, bottom: 12 }}>45</div>
            </div>
            <div
              className="tt-knob"
              style={{ transform: `rotate(${rpm === 45 ? 32 : -32}deg)` }}
              onClick={() => onRpmChange && onRpmChange(rpm === 45 ? 33 : 45)}
            >
              <div className="tt-knob-face" />
              <div className="tt-knob-mark" />
            </div>
          </div>
        </div>

        <div className="tt-plinth-edge" />
      </div>
    </div>
  );
}

/* ── VinylPlayer — the wired-up widget for the About page ── */
export default function VinylPlayer() {
  const [rotation, setRotation] = useState(0);
  const [rpm, setRpm] = useState(RPM);
  const [spotifyPlaying, setSpotifyPlaying] = useState(false);
  const embedHostRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controllerRef = useRef<any>(null);

  const stateRef = useRef({ spinning: spotifyPlaying, rpm });
  stateRef.current.spinning = spotifyPlaying;
  stateRef.current.rpm = rpm;

  // rAF loop drives natural spin
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = stateRef.current;
      if (s.spinning) {
        const dps = (s.rpm * 360) / 60;
        setRotation((r) => (r + dps * dt) % 360);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Spotify IFrame API — disc spins iff Spotify is playing
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
            setSpotifyPlaying(!(e?.data?.isPaused ?? true));
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

  const [vinylColor, labelColor] = PALETTE;

  return (
    <div className={styles.wrap}>
      <div className={styles.rig}>
        <Turntable spinning={spotifyPlaying} rpm={rpm} onRpmChange={setRpm}>
          <div className={styles.stage}>
            <Vinyl rotation={rotation} vinylColor={vinylColor} labelColor={labelColor} />
          </div>
        </Turntable>
      </div>

      <div
        className={styles.embedHost}
        ref={embedHostRef}
        onMouseEnter={() => document.documentElement.setAttribute('data-hide-cursor', 'true')}
        onMouseLeave={() => document.documentElement.removeAttribute('data-hide-cursor')}
      />
    </div>
  );
}
