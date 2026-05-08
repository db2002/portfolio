'use client';

import Link from 'next/link';
import type { CaseStudyMeta } from '@/lib/mdx';
import styles from './WorkGrid.module.css';

interface Props {
  studies: CaseStudyMeta[];
}

export default function WorkGrid({ studies }: Props) {

  return (
    <div className={styles.grid}>
      {studies.map((study, i) => {
        const isExternal = Boolean(study.externalUrl);
        const cardContent = (
          <>
            <div className={styles.imageWrapper}>
              {study.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={study.coverImage}
                  alt={study.title}
                  className={styles.image}
                  loading={i < 2 ? 'eager' : 'lazy'}
                />
              )}
            </div>
            <div className={styles.titleRow}>
              <h2 className={styles.title}>{study.cardTitle ?? study.title}</h2>
              <span className={styles.meta}>
                {[study.company, study.year, study.type].filter(Boolean).join(' · ')}
              </span>
            </div>
          </>
        );

        if (isExternal) {
          return (
            <a
              key={study.slug}
              href={study.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.card} ${study.featured ? styles.featured : ''}`}
              aria-label={`Visit website: ${study.title}`}
              data-cursor="visit"
            >
              {cardContent}
            </a>
          );
        }

        return (
          <Link
            key={study.slug}
            href={`/work/${study.slug}`}
            className={`${styles.card} ${study.featured ? styles.featured : ''}`}
            aria-label={`View case study: ${study.title}`}
            data-cursor="view"

          >
            {cardContent}
          </Link>
        );
      })}
    </div>
  );
}
