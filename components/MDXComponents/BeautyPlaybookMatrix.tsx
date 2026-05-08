'use client';

import MarketMatrix from './MarketMatrix';

export default function BeautyPlaybookMatrix() {
  return (
    <MarketMatrix
      xLabel="Engagement"
      yLabel="Content quality"
      quadrants={['QUALITY SPECIALISTS', 'INDUSTRY LEADERS', 'EMERGING PLAYERS', 'ENGAGEMENT-FOCUSED']}
      points={[
        { label: 'Beauty Playbook',    x: 45, y: 82, group: 'highlight' },
        { label: 'Vogue',              x: 90, y: 91, group: 'luxury' },
        { label: "Harper's Bazaar",    x: 74, y: 82, group: 'luxury' },
        { label: 'Elle',               x: 82, y: 74, group: 'luxury' },
        { label: 'Allure',             x: 72, y: 30, group: 'luxury' },
        { label: 'The Salon Business', x: 30, y: 72, group: 'trade' },
        { label: 'Modern Salon',       x: 55, y: 64, group: 'trade' },
        { label: 'Salon Today',        x: 38, y: 54, group: 'trade' },
        { label: 'American Salon',     x: 48, y: 52, group: 'trade' },
        { label: 'Behind the Chair',   x: 86, y: 24, group: 'trade' },
      ]}
    />
  );
}
