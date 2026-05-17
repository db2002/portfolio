import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getCaseStudy, getAllCaseStudies } from '@/lib/mdx';
import { mdxComponents } from '@/components/MDXComponents/MDXComponents';
import ScrollReveal from './ScrollReveal';
import styles from './slug.module.css';
import metaStyles from '@/components/MDXComponents/MDXComponents.module.css';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllCaseStudies().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = getCaseStudy(params.slug);
  if (!study) return {};
  return {
    title:       study.cardTitle,
    description: study.subtitle,
    openGraph: {
      images: [{ url: study.coverImage }],
    },
  };
}

export default function CaseStudyPage({ params }: Props) {
  const study = getCaseStudy(params.slug);
  if (!study) notFound();

  return (
    <ScrollReveal className={styles.article}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <header className={styles.hero} data-no-reveal>
        <h1 className={styles.heroTitle}>{study.title}</h1>
        <p className={styles.heroSubtitle}>{study.subtitle}</p>
      </header>

      {/* ── Meta row ─────────────────────────────────────── */}
      {(study.role || study.timeline || study.tools?.length || study.teams?.length) && (
        <dl className={metaStyles.metaRow} data-no-reveal>
          {study.role && (
            <div className={metaStyles.metaItem}>
              <dt className={metaStyles.metaLabel}>Role</dt>
              <dd className={metaStyles.metaValue}>{study.role}</dd>
            </div>
          )}
          {study.timeline && (
            <div className={metaStyles.metaItem}>
              <dt className={metaStyles.metaLabel}>Timeline</dt>
              <dd className={metaStyles.metaValue}>{study.timeline}</dd>
            </div>
          )}
          {study.teams?.length > 0 && (
            <div className={metaStyles.metaItem}>
              <dt className={metaStyles.metaLabel}>Teams</dt>
              <dd className={metaStyles.metaValue}>{study.teams.join(', ')}</dd>
            </div>
          )}
          {study.tools?.length > 0 && (
            <div className={metaStyles.metaItem}>
              <dt className={metaStyles.metaLabel}>Tools</dt>
              <dd className={metaStyles.metaValue}>{study.tools.join(', ')}</dd>
            </div>
          )}
        </dl>
      )}

      {/* ── Cover image ──────────────────────────────────── */}
      <div className={styles.cover} data-no-reveal>
        <Image
          src={study.coverImage}
          alt={study.title}
          fill
          priority
          sizes="100vw"
          className={styles.coverImg}
        />
      </div>

      {/* ── Body ─────────────────────────────────────────── */}
      <div className={styles.body}>
        <MDXRemote source={study.content} components={mdxComponents} />
      </div>
    </ScrollReveal>
  );
}
