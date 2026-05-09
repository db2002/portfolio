import Image from 'next/image';
import type { MDXComponents as MDXComponentsType } from 'mdx/types';
import styles from './MDXComponents.module.css';
import MarketMatrix from './MarketMatrix';
import Marquee from './Marquee';
import BeautyPlaybookMatrix from './BeautyPlaybookMatrix';
import BrandMarquee from './BrandMarquee';
import BentoBrand from './BentoBrand';
import BentoWeb from './BentoWeb';
import SurveyStats from './SurveyStats';
import RenewMatrix from './RenewMatrix';
import RenewPersona from './RenewPersona';
import RenewJourney from './RenewJourney';
import VideoFeatureList from './VideoFeatureList';
import RenewVideoList from './RenewVideoList';

/* Pull quote */
function Callout({ children }: { children: React.ReactNode }) {
  return <blockquote className={styles.callout}>{children}</blockquote>;
}

/* Full-width image */
function FullImage({ src, alt, caption, aspect, noRadius, contained }: { src: string; alt: string; caption?: string; aspect?: string; noRadius?: boolean; contained?: boolean }) {
  return (
    <figure className={styles.fullImage} style={contained ? { margin: 'var(--space-16) 0' } : undefined}>
      <div className={styles.fullImageWrapper} style={{ ...(aspect ? { aspectRatio: aspect } : {}), ...(noRadius ? { borderRadius: 0 } : {}) }}>
        <Image src={src} alt={alt} fill className={styles.fullImageImg} sizes="100vw" />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}

/* Two-up image grid */
function ImageGrid({ children }: { children: React.ReactNode }) {
  return <div className={styles.imageGrid}>{children}</div>;
}

/* Metadata row (role, timeline, tools) */
function MetaRow({ items = [] }: { items?: { label: string; value: string }[] }) {
  return (
    <dl className={styles.metaRow}>
      {items.map(({ label, value }) => (
        <div key={label} className={styles.metaItem}>
          <dt className={styles.metaLabel}>{label}</dt>
          <dd className={styles.metaValue}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* Section divider */
function Divider() {
  return <hr className={styles.divider} />;
}

/* Persona diagram */
function PersonaGrid({ personas = [] }: { personas?: { name: string; desc: string; img: string }[] }) {
  // viewBox: 1000 wide, 60 tall. 4 cols centered at 125, 375, 625, 875
  const W = 1000;
  const topY = 10;
  const bottomY = 55;
  const r = 10;
  const n = personas.length;
  const centers = personas.map((_, i) => Math.round(((i + 0.5) / n) * W));
  const left = centers[0];
  const right = centers[n - 1];

  const pathD = [
    `M ${left} ${bottomY}`,
    `L ${left} ${topY + r}`,
    `Q ${left} ${topY} ${left + r} ${topY}`,
    `L ${right - r} ${topY}`,
    `Q ${right} ${topY} ${right} ${topY + r}`,
    `L ${right} ${bottomY}`,
    ...centers.slice(1, -1).map(c => `M ${c} ${topY} L ${c} ${bottomY}`),
  ].join(' ');

  return (
    <div className={styles.personaSection} data-reveal>
      <p className={styles.personaLabel}>Vagaro User</p>
      <svg className={styles.personaConnector} viewBox={`0 0 ${W} 60`} preserveAspectRatio="none" aria-hidden="true">
        <path d={pathD} fill="none" stroke="#888888" strokeWidth="2" strokeDasharray="8 6" strokeLinecap="round" />
      </svg>
      <div className={styles.personaGrid}>
        {personas.map(({ name, desc, img }) => (
          <div key={name} className={styles.personaItem}>
            <div className={styles.personaAvatar}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={name} className={styles.personaImg} />
            </div>
            <p className={styles.personaName}>{name}</p>
            <p className={styles.personaDesc}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Three-column takeaway cards */
function TakeawayGrid({ items = [] }: { items?: { title: string; body: string }[] }) {
  return (
    <div className={styles.takeawayGrid} data-stagger>
      {items.map(({ title, body }) => (
        <div key={title} className={styles.takeawayCard}>
          <p className={styles.takeawayTitle}>{title}</p>
          <p className={styles.takeawayBody}>{body}</p>
        </div>
      ))}
    </div>
  );
}


/* VU brand bento grid */
function VUBentoGrid() {
  return (
    <div className={styles.vuBento} data-reveal>
      {/* Left big container */}
      <div className={styles.vuBentoLeft}>
        {/* Top row: bento-1 left, bento-2a/2b stack right */}
        <div className={styles.vuBentoTopRow}>
          <div className={`${styles.vuBentoCell} ${styles.vuBentoCalendar}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/vagaro-university/vu-bento-1.png" alt="Vagaro calendar feature" />
          </div>
          <div className={styles.vuBentoTypeStack}>
            <div className={styles.vuBentoCell}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/vagaro-university/vu-bento-2a.png" alt="Proxima Nova typography and color palette" />
            </div>
            <div className={styles.vuBentoCell}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/vagaro-university/vu-bento-2b.png" alt="Vagaro University logo" />
            </div>
          </div>
        </div>
        {/* Bottom: bento-3 people photo */}
        <div className={`${styles.vuBentoCell} ${styles.vuBentoPeople}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/vagaro-university/vu-bento-3.png" alt="Vagaro team" />
        </div>
      </div>
      {/* Right: phone mockup */}
      <div className={`${styles.vuBentoCell} ${styles.vuBentoPhone}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/vagaro-university/vu-bento-4.png" alt="Vagaro University mobile" />
      </div>
    </div>
  );
}

/* Before/after comparison grid */
function BeforeAfterGrid({ rows = [] }: { rows?: { beforeImg: string; beforeDesc: string; afterImg: string; afterDesc: string }[] }) {
  return (
    <div className={styles.beforeAfterGrid}>
      {rows.map((row, i) => (
        <div key={i} className={styles.beforeAfterRow} data-reveal>
          <div className={styles.beforeAfterCol}>
            <div className={styles.beforeAfterImgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={row.beforeImg} alt="Before" />
            </div>
            <div className={`${styles.beforeAfterAccent} ${styles.beforeAfterAccentBefore}`} />
            <p className={`${styles.beforeAfterTag} ${styles.beforeAfterTagBefore}`}>Before</p>
            <p className={styles.beforeAfterDesc}>{row.beforeDesc}</p>
          </div>
          <div className={styles.beforeAfterCol}>
            <div className={styles.beforeAfterImgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={row.afterImg} alt="After" />
            </div>
            <div className={`${styles.beforeAfterAccent} ${styles.beforeAfterAccentAfter}`} />
            <p className={`${styles.beforeAfterTag} ${styles.beforeAfterTagAfter}`}>After</p>
            <p className={styles.beforeAfterDesc}>{row.afterDesc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Two-column flow breakdown */
function FlowColumns({ columns = [] }: { columns?: { label: string; img: string; desc: string }[] }) {
  return (
    <div className={styles.flowColumns}>
      {columns.map(({ label, img, desc }) => (
        <div key={label} className={styles.flowColumn}>
          <div className={styles.flowColumnCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={label} className={styles.flowColumnCardImg} />
          </div>
          <p className={styles.flowColumnLabel}>{label}</p>
          <p className={styles.flowColumnDesc}>{desc}</p>
        </div>
      ))}
    </div>
  );
}

/* Light/dark themed image — shows srcLight in light mode, srcDark in dark mode */
function ThemedImage({ srcLight, srcDark, alt, caption, aspect }: { srcLight: string; srcDark: string; alt: string; caption?: string; aspect?: string }) {
  return (
    <figure className={styles.fullImage}>
      <div className={styles.fullImageWrapper} style={{ ...(aspect ? { aspectRatio: aspect } : {}), backgroundColor: 'transparent' }}>
        <Image src={srcLight} alt={alt} fill className={`${styles.fullImageImg} ${styles.themedLight}`} sizes="100vw" style={{ objectFit: 'contain' }} />
        <Image src={srcDark}  alt={alt} fill className={`${styles.fullImageImg} ${styles.themedDark}`}  sizes="100vw" style={{ objectFit: 'contain' }} />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}

export const mdxComponents: MDXComponentsType = {
  /* Custom components */
  Callout,
  FullImage,
  ThemedImage,
  ImageGrid,
  MetaRow,
  Divider,
  TakeawayGrid,
  PersonaGrid,
  MarketMatrix,
  Marquee,
  BeautyPlaybookMatrix,
  BrandMarquee,
  BentoBrand,
  BentoWeb,
  FlowColumns,
  VUBentoGrid,
  BeforeAfterGrid,
  SurveyStats,
  RenewMatrix,
  RenewPersona,
  RenewJourney,
  VideoFeatureList,
  RenewVideoList,

  /* HTML overrides */
  h1: (props) => <h1 className={styles.h1} {...props} />,
  h2: (props) => <h2 className={styles.h2} {...props} />,
  h3: (props) => <h3 className={styles.h3} {...props} />,
  p:  (props) => <p  className={styles.p}  {...props} />,
  ul: (props) => <ul className={styles.ul} {...props} />,
  ol: (props) => <ol className={styles.ol} {...props} />,
  li: (props) => <li className={styles.li} {...props} />,
  blockquote: (props) => <blockquote className={styles.blockquote} {...props} />,
  code: (props) => <code className={styles.code} {...props} />,
  strong: (props) => <strong className={styles.strong} {...props} />,
  a: ({ href, ...props }) => (
    <a
      href={href}
      className={styles.a}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    />
  ),
};
