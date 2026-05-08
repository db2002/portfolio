'use client';

import styles from './RenewMatrix.module.css';

interface Competitor {
  label: string;
  x: number;     // 0–100 left → right (Independent → Nation-Wide)
  y: number;     // 0–100 bottom → top (Buying/Selling → Environmental Awareness)
  iconSrc?: string;
  iconBg?: string;
  iconRadius?: string;
  isHighlight?: boolean;
}

const competitors: Competitor[] = [
  {
    label: 'Save Your\nWardrobe',
    x: 10, y: 84,
    iconSrc: '/images/renew/save-your-wardrobe.jpg',
    iconBg: '#f5f5f5',
    iconRadius: '22%',
  },
  {
    label: 'Good on You',
    x: 37, y: 70,
    iconSrc: '/images/renew/good-on-you.webp',
    iconBg: '#1a1a1a',
    iconRadius: '22%',
  },
  {
    label: 'Nuw.',
    x: 62, y: 73,
    iconSrc: '/images/renew/nuw.jpeg',
    iconBg: '#ede9f5',
    iconRadius: '22%',
  },
  {
    label: 'DoneGood',
    x: 80, y: 78,
    iconSrc: '/images/renew/donegood.jpg',
    iconBg: '#E8540A',
    iconRadius: '22%',
  },
  {
    label: 'ThredUp',
    x: 62, y: 43,
    iconSrc: '/images/renew/thredup.png',
    iconBg: '#20C47C',
    iconRadius: '22%',
  },
  {
    label: 'Lucky\nSweater',
    x: 37, y: 33,
    iconSrc: '/images/renew/lucky-sweater.webp',
    iconBg: '#f5f5f0',
    iconRadius: '22%',
  },
  {
    label: 'Poshmark',
    x: 74, y: 21,
    iconSrc: '/images/renew/poshmark.png',
    iconBg: '#7D1935',
    iconRadius: '22%',
  },
  {
    label: 'Depop',
    x: 88, y: 25,
    iconSrc: '/images/renew/depop.webp',
    iconBg: '#FF2300',
    iconRadius: '22%',
  },
  {
    label: 'ReNew',
    x: 19, y: 40,
    isHighlight: true,
  },
];

function AppIcon({ competitor }: { competitor: Competitor }) {
  if (competitor.isHighlight) {
    return (
      <div className={styles.highlightWrap}>
        <div className={styles.highlightCircle} />
        <div className={styles.highlightDot} />
      </div>
    );
  }

  return (
    <div
      className={styles.icon}
      style={{
        backgroundColor: competitor.iconBg ?? '#e0e0e0',
        borderRadius: competitor.iconRadius ?? '22%',
      }}
    >
      {competitor.iconSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={competitor.iconSrc} alt={competitor.label} className={styles.iconImg} />
      ) : null}
    </div>
  );
}

export default function RenewMatrix() {
  return (
    <figure className={styles.figure} data-reveal>
      <div className={styles.outer} data-no-reveal>
        {/* Left axis label */}
        <div className={`${styles.sideAxis} ${styles.sideLeft}`}>
          <span className={styles.axisLabel}>Independent</span>
        </div>

        <div className={styles.chartCol}>
          {/* Top axis label */}
          <div className={styles.topAxis}>
            <span className={styles.axisLabel}>Environmental Awareness</span>
          </div>

          {/* Matrix */}
          <div className={styles.matrix}>
            <div className={styles.vLine} />
            <div className={styles.hLine} />

            {competitors.map((c) => (
              <div
                key={c.label}
                className={`${styles.point} ${c.isHighlight ? styles.pointHighlight : ''}`}
                style={{ left: `${c.x}%`, bottom: `${c.y}%` }}
              >
                <AppIcon competitor={c} />
                <span
                  className={`${styles.label} ${c.isHighlight ? styles.labelHighlight : ''}`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {c.label}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom axis label */}
          <div className={styles.bottomAxis}>
            <span className={styles.axisLabel}>Buying/Selling</span>
          </div>
        </div>

        {/* Right axis label */}
        <div className={`${styles.sideAxis} ${styles.sideRight}`}>
          <span className={styles.axisLabel}>Nation-Wide</span>
        </div>
      </div>
    </figure>
  );
}
