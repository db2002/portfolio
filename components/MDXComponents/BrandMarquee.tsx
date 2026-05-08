'use client';

import Marquee from './Marquee';

const IMAGES = [
  '/images/beauty-playbook/brand-1.png',
  '/images/beauty-playbook/brand-2.png',
  '/images/beauty-playbook/brand-3.png',
  '/images/beauty-playbook/brand-4.png',
  '/images/beauty-playbook/brand-5.png',
  '/images/beauty-playbook/brand-6.png',
  '/images/beauty-playbook/brand-7.png',
  '/images/beauty-playbook/brand-8.png',
];

export default function BrandMarquee() {
  return <Marquee images={IMAGES} />;
}
