'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';
import styles from './HeroAnimation.module.css';

interface Props {
  label?: string;
  headline: React.ReactNode;
  labelClassName?: string;
  headlineClassName: string;
  children?: React.ReactNode;
  childrenClassName?: string;
  disableSplit?: boolean;
}

export default function HeroAnimation({ label, headline, labelClassName, headlineClassName, children, childrenClassName, disableSplit }: Props) {
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const l = labelRef.current;
      const h = headlineRef.current;
      const c = childrenRef.current;
      if (!h) return;

      const tl = gsap.timeline();

      if (disableSplit) {
        const targets = [...(l ? [l] : []), h, ...(c ? [c] : [])];
        gsap.set(targets, { y: 40, opacity: 0 });
        if (l) tl.to(l, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' });
        tl.to(h, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }, l ? '-=0.6' : 0)
          .to(c ?? [], { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }, '-=0.6');
      } else {
        const splitH = new SplitType(h, { types: 'lines' });
        const targets = [...(l ? [l] : []), ...(splitH.lines ?? []), ...(c ? [c] : [])];
        gsap.set(targets, { y: 40, opacity: 0 });
        if (l) tl.to(l, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' });
        tl.to(splitH.lines ?? [], { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.08 }, l ? '-=0.6' : 0)
          .to(c ?? [], { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }, '-=0.6');
      }
    });

    return () => ctx.revert();
  }, [disableSplit]);

  return (
    <>
      {label && <p ref={labelRef} className={labelClassName}>{label}</p>}
      <h1 ref={headlineRef} className={`${headlineClassName} ${styles.clip}`}>{headline}</h1>
      {children && (
        <div ref={childrenRef} className={childrenClassName}>{children}</div>
      )}
    </>
  );
}
