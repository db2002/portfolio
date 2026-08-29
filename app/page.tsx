import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllCaseStudies, getCaseStudy } from '@/lib/mdx';
import type { CaseStudyFull } from '@/lib/mdx';
import { mdxComponents } from '@/components/MDXComponents/MDXComponents';
import WorkGridModal from '@/components/WorkGridModal/WorkGridModal';
import styles from './work/work.module.css';
import HomeHero from './HomeHero';

export const metadata: Metadata = {
  title: 'Work',
  description: 'UX and product design case studies — end-to-end product thinking, research, and craft.',
};

export default function HomePage() {
  const studies = getAllCaseStudies();

  const metas: Record<string, CaseStudyFull> = {};
  const bodies: Record<string, React.ReactNode> = {};

  for (const study of studies) {
    if (study.externalUrl) continue;
    const full = getCaseStudy(study.slug);
    if (!full) continue;
    metas[study.slug]  = full;
    bodies[study.slug] = <MDXRemote source={full.content} components={mdxComponents} />;
  }

  return (
    <section className={styles.page}>
      <HomeHero />

      {studies.length === 0 ? (
        <div className={styles.empty}>
          <p>Case studies coming soon.</p>
        </div>
      ) : (
        <WorkGridModal studies={studies} metas={metas} bodies={bodies} />
      )}
    </section>
  );
}
