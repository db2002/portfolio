'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import styles from './Nav.module.css';

const navLinks = [
  { href: '/work',  label: 'Work'  },
  { href: '/play',  label: 'Play'  },
  { href: '/about', label: 'About' },
];

export default function Nav() {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const activeIndex = navLinks.findIndex(({ href }) =>
      href === '/work'
        ? pathname === '/work' || pathname.startsWith('/work/')
        : pathname.startsWith(href)
    );
    const list = listRef.current;
    const activeEl = linkRefs.current[activeIndex];
    if (!list || !activeEl) return;

    const listRect = list.getBoundingClientRect();
    const linkRect = activeEl.getBoundingClientRect();
    setPill({ left: linkRect.left - listRect.left - 6, width: linkRect.width + 12 });
  }, [pathname]);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul className={styles.links} role="list" ref={listRef}>
          {pill && (
            <span
              className={styles.activePill}
              style={{ left: pill.left, width: pill.width }}
              aria-hidden="true"
            />
          )}
          {navLinks.map(({ href, label }, i) => {
            const isActive =
              href === '/work'
                ? pathname === '/work' || pathname.startsWith('/work/')
                : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  ref={(el) => { linkRefs.current[i] = el; }}
                  className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <ThemeToggle />
      </nav>
    </header>
  );
}
