'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './SurveyStats.module.css';

interface Stat {
  percentage: number;
  numerator: number;
  denominator: number;
  label: string;
}

function DonutChart({ percentage, animate }: { percentage: number; animate: boolean }) {
  const size = 160;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.svg}>
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#DDD9EE"
        strokeWidth={strokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--renew-purple)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={animate ? offset : circumference}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className={styles.arc}
        style={{ transition: animate ? 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' : 'none' }}
      />
    </svg>
  );
}

function StatItem({ stat, animate }: { stat: Stat; animate: boolean }) {
  return (
    <div className={styles.statItem}>
      <div className={styles.chartWrap}>
        <DonutChart percentage={stat.percentage} animate={animate} />
        <div className={styles.chartCenter}>
          <span className={styles.percentage}>{stat.percentage}%</span>
          <span className={styles.fraction}>{stat.numerator} of {stat.denominator}</span>
        </div>
      </div>
      <p className={styles.label}>{stat.label}</p>
    </div>
  );
}

interface SurveyStatsProps {
  stats: Stat[];
}

export default function SurveyStats({ stats }: SurveyStatsProps) {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimate(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={styles.root}>
      {stats.map((stat) => (
        <StatItem key={stat.label} stat={stat} animate={animate} />
      ))}
    </div>
  );
}
