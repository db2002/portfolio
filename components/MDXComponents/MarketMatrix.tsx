import styles from './MarketMatrix.module.css';

interface Point {
  label: string;
  x: number; // 0–100, left to right
  y: number; // 0–100, bottom to top
  group: 'highlight' | 'luxury' | 'trade';
}

interface Props {
  title?: string;
  xLabel?: string;
  yLabel?: string;
  quadrants?: [string, string, string, string];
  points: Point[];
}

const GROUP_COLORS: Record<Point['group'], string> = {
  highlight: 'var(--bp-highlight)',
  luxury:    'var(--bp-trade)',
  trade:     'var(--bp-trade)',
};


export default function MarketMatrix({
  title,
  xLabel = 'Engagement',
  yLabel = 'Content quality',
  quadrants = ['QUALITY SPECIALISTS', 'INDUSTRY LEADERS', 'EMERGING PLAYERS', 'ENGAGEMENT-FOCUSED'],
  points,
}: Props) {
  return (
    <figure className={styles.figure}>
      {title && <p className={styles.title}>{title}</p>}

      <div className={styles.layout}>
        {/* Y-axis label */}
        <div className={styles.yAxis}>
          <span className={styles.axisArrow}>↑</span>
          <span className={styles.axisLabel}>{yLabel}</span>
        </div>

        <div className={styles.chartWrap}>
          <div className={styles.matrix}>
            {/* Quadrant labels */}
            <span className={`${styles.quadrant} ${styles.tl}`}>{quadrants[0]}</span>
            <span className={`${styles.quadrant} ${styles.tr}`}>{quadrants[1]}</span>
            <span className={`${styles.quadrant} ${styles.bl}`}>{quadrants[2]}</span>
            <span className={`${styles.quadrant} ${styles.br}`}>{quadrants[3]}</span>

            {/* Dividers */}
            <div className={styles.vLine} />
            <div className={styles.hLine} />

            {/* Points */}
            {points.map((p, i) => (
              <div
                key={i}
                className={styles.point}
                style={{ left: `${p.x}%`, bottom: `${p.y}%` }}
              >
                <div
                  className={`${styles.dot} ${p.group === 'highlight' ? styles.dotHighlight : ''}`}
                  style={{ background: GROUP_COLORS[p.group] }}
                />
                <span className={styles.label}>{p.label}</span>
              </div>
            ))}
          </div>

          {/* X-axis */}
          <div className={styles.xAxis}>
            <span className={styles.axisLabel}>{xLabel}</span>
            <span className={styles.axisArrow}>→</span>
          </div>
        </div>
      </div>
    </figure>
  );
}
