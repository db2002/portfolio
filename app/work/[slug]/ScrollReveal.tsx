'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  className?: string;
  children: React.ReactNode;
}

export default function ScrollReveal({ className, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // ── Stagger grids — cells animate in sequence when container enters view
    const staggerContainers = Array.from(el.querySelectorAll<Element>('[data-stagger]'));

    // Pre-hide all stagger children immediately so there's no flash before effects run
    staggerContainers.forEach(container => {
      gsap.set(Array.from(container.children), { opacity: 0, y: 36 });
    });

    staggerContainers.forEach(container => {
      gsap.fromTo(
        Array.from(container.children),
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: container,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // ── Individual elements
    const raw = Array.from(
      el.querySelectorAll<Element>('h1, h2, h3, h4, p, li, img, figure, [data-reveal]')
    );

    const targets = raw.filter(target => {
      // Exclude if a sibling animated target already contains it
      if (raw.some(other => other !== target && other.contains(target))) return false;
      // Exclude if inside a stagger container
      if (staggerContainers.some(c => c.contains(target))) return false;
      // Exclude if inside a no-reveal container (e.g. hero — always in viewport on load)
      if (target.closest('[data-no-reveal]')) return false;
      // Exclude children inside a data-reveal container (the container itself animates)
      const revealParent = target.closest('[data-reveal]');
      if (revealParent && revealParent !== target) return false;
      return true;
    });

    // Pre-hide all individual targets immediately
    gsap.set(targets, { opacity: 0, y: 36 });

    targets.forEach(target => {
      gsap.fromTo(
        target,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: target,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <article ref={ref} className={className}>
      {children}
    </article>
  );
}
