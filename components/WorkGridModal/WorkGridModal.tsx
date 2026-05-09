'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { CaseStudyFull, CaseStudyMeta } from '@/lib/mdx';
import gridStyles from '../WorkGrid/WorkGrid.module.css';
import modalStyles from '../CaseStudyModal/ModalShell.module.css';
import styles from '@/app/work/[slug]/slug.module.css';
import metaStyles from '@/components/MDXComponents/MDXComponents.module.css';

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 30 };

const CARD_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CARD_BASE_DELAY = 0.8; // starts as hero text finishes

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: CARD_EASE, delay: CARD_BASE_DELAY + i * 0.08 },
  }),
};

// Pixel values matching --radius-lg and --radius-xl tokens
const CARD_RADIUS  = 12;
const MODAL_RADIUS = 20;
// z-index values matching --z-modal: 300
const Z_BACKDROP = 300;
const Z_MODAL    = 301;

interface Props {
  studies: CaseStudyMeta[];
  metas:   Record<string, CaseStudyFull>;
  bodies:  Record<string, React.ReactNode>;
}

export default function WorkGridModal({ studies, metas, bodies }: Props) {
  const router = useRouter();
  const [openSlug,      setOpenSlug]      = useState<string | null>(null);
  const [openKey,       setOpenKey]       = useState(0);
  const [backdropReady, setBackdropReady] = useState(false);
  const [isMobile,      setIsMobile]      = useState(false);
  const openSlugRef = useRef<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  function open(slug: string) {
    openSlugRef.current = slug;
    setOpenSlug(slug);
    setOpenKey(k => k + 1);
    setBackdropReady(false);
    document.body.style.overflow = 'hidden';
    router.prefetch(`/work/${slug}`);
  }

  function close() {
    openSlugRef.current = null;
    setOpenSlug(null);
    setBackdropReady(false);
    document.body.style.overflow = '';
  }

  function handleExpand() {
    const slug = openSlugRef.current;
    if (!slug) return;
    document.body.style.overflow = '';
    window.location.href = `/work/${slug}`;
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, []);

  const openMeta  = openSlug ? metas[openSlug]                        : null;
  const openStudy = openSlug ? studies.find(s => s.slug === openSlug) : null;

  return (
    <>
      {/* ── Work grid ──────────────────────────────────────────────── */}
      <div className={gridStyles.grid}>
        {studies.map((s, i) => {
          const isExternal = Boolean(s.externalUrl);

          const cardContent = (
            <>
              <div className={gridStyles.imageWrapper}>
                {(s.cardImage ?? s.coverImage) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.cardImage ?? s.coverImage}
                    alt={s.title}
                    className={gridStyles.image}
                    loading={i < 2 ? 'eager' : 'lazy'}
                  />
                )}
              </div>
              <div className={gridStyles.titleRow}>
                <h2 className={gridStyles.title}>{s.cardTitle ?? s.title}</h2>
                <span className={gridStyles.meta}>
                  {[s.company, s.year, s.type].filter(Boolean).join(' · ')}
                </span>
              </div>
            </>
          );

          if (isExternal) {
            return (
              <motion.a
                key={s.slug}
                href={s.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${gridStyles.card} ${s.featured ? gridStyles.featured : ''}`}
                aria-label={`Visit website: ${s.title}`}
                data-cursor="visit"
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                {cardContent}
              </motion.a>
            );
          }

          if (isMobile) {
            return (
              <motion.a
                key={s.slug}
                href={`/work/${s.slug}`}
                className={`${gridStyles.card} ${s.featured ? gridStyles.featured : ''}`}
                aria-label={`View case study: ${s.title}`}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                {cardContent}
              </motion.a>
            );
          }

          return (
            <motion.button
              key={s.slug}
              layoutId={`case-study-${s.slug}`}
              className={`${gridStyles.card} ${s.featured ? gridStyles.featured : ''}`}
              aria-label={`View case study: ${s.title}`}
              data-cursor="view"
              onClick={() => open(s.slug)}
              style={{ borderRadius: CARD_RADIUS }}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={SPRING}
            >
              {cardContent}
            </motion.button>
          );
        })}
      </div>

      {/*
       * ── Backdrop ──────────────────────────────────────────────────
       * Kept in its own AnimatePresence so its 0.2 s opacity exit does
       * NOT control the lifecycle of the layoutId element below.
       * The backdrop is a pure visual overlay; it never wraps the modal.
       */}
      <AnimatePresence>
        {openSlug && (
          <motion.div
            key={`bd-${openKey}`}

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => { if (backdropReady) close(); }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              zIndex: Z_BACKDROP,
            }}
          />
        )}
      </AnimatePresence>

      {/*
       * ── Modal ─────────────────────────────────────────────────────
       * The motion.div with layoutId is the DIRECT AnimatePresence child
       * so Framer Motion owns its full lifecycle. The backdrop's exit
       * timing can never prematurely unmount this element and corrupt
       * the layoutId snapshot used for the next open cycle.
       *
       * Centred via position:fixed + inset + margin:auto (no flex
       * wrapper needed).
       */}
      <AnimatePresence>
        {openSlug && openMeta && openStudy && (
          <motion.div
            key={`modal-${openKey}`}

            layoutId={`case-study-${openSlug}`}
            className={modalStyles.modal}
            role="dialog"
            aria-modal="true"
            onLayoutAnimationComplete={() => setBackdropReady(true)}
            style={{
              position: 'fixed',
              top: 'var(--space-8)',
              bottom: 'var(--space-8)',
              left: 0,
              right: 0,
              margin: 'auto',
              borderRadius: MODAL_RADIUS,
              zIndex: Z_MODAL,
            }}
            transition={SPRING}
          >
            <div className={modalStyles.actions} data-actions>
              <button
                className={modalStyles.expand}
                aria-label="View full page"
                onClick={handleExpand}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                className={modalStyles.close}
                onClick={close}
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <motion.div
              className={modalStyles.scroll}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, delay: 0.1 }}
            >
              <article className={styles.article}>
                <header className={styles.hero}>
                  <h1 className={styles.heroTitle}>{openMeta.title}</h1>
                  <p className={styles.heroSubtitle}>{openMeta.subtitle}</p>
                </header>
                {(openMeta.role || openMeta.timeline || openMeta.tools?.length > 0 || openMeta.teams?.length > 0) && (
                  <dl className={metaStyles.metaRow}>
                    {openMeta.role && (
                      <div className={metaStyles.metaItem}>
                        <dt className={metaStyles.metaLabel}>Role</dt>
                        <dd className={metaStyles.metaValue}>{openMeta.role}</dd>
                      </div>
                    )}
                    {openMeta.timeline && (
                      <div className={metaStyles.metaItem}>
                        <dt className={metaStyles.metaLabel}>Timeline</dt>
                        <dd className={metaStyles.metaValue}>{openMeta.timeline}</dd>
                      </div>
                    )}
                    {openMeta.teams?.length > 0 && (
                      <div className={metaStyles.metaItem}>
                        <dt className={metaStyles.metaLabel}>Teams</dt>
                        <dd className={metaStyles.metaValue}>{openMeta.teams.join(', ')}</dd>
                      </div>
                    )}
                    {openMeta.tools?.length > 0 && (
                      <div className={metaStyles.metaItem}>
                        <dt className={metaStyles.metaLabel}>Tools</dt>
                        <dd className={metaStyles.metaValue}>{openMeta.tools.join(', ')}</dd>
                      </div>
                    )}
                  </dl>
                )}
                <div className={styles.cover}>
                  <Image
                    src={openMeta.coverImage}
                    alt={openMeta.title}
                    fill
                    sizes="(max-width: 1100px) 100vw, 1100px"
                    className={styles.coverImg}
                  />
                </div>
                <div className={styles.body}>
                  {bodies[openSlug]}
                </div>
              </article>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
