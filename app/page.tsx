import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllCaseStudies, getCaseStudy } from '@/lib/mdx';
import type { CaseStudyFull } from '@/lib/mdx';
import { mdxComponents } from '@/components/MDXComponents/MDXComponents';
import WorkGridModal from '@/components/WorkGridModal/WorkGridModal';
import styles from './work/work.module.css';
import ProfileIllustration from '@/components/ProfileIllustration/ProfileIllustration';

const HeroAnimation = dynamic(() => import('@/components/HeroAnimation/HeroAnimation'), { ssr: false });

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
      <div className={styles.hero}>
        <HeroAnimation
          headline={<><span style={{display:'block', marginBottom:'0.3em'}}><ProfileIllustration className={styles.heroAnimationInline} /> Hello, I&apos;m Diya.</span><span style={{display:'block'}}>I <em>create thoughtful experiences</em> that empower individuality.</span></>}
          labelClassName={styles.heroHeadline}
          headlineClassName={styles.heroSub}
          childrenClassName={styles.heroCurrent}
          disableSplit
        >
          <a
            href="https://www.linkedin.com/in/diyabhatia/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.currentLink}
          >
            Currently designing web experiences at Vagaro
            <svg className={styles.currentArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </HeroAnimation>
      </div>

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
