import styles from './RenewPersona.module.css';

function ExperienceBar({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.barItem}>
      <span className={styles.barLabel}>{label}</span>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function NytLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="New York Times">
      <text x="16" y="26" textAnchor="middle" fontFamily="Georgia, Times New Roman, serif" fontSize="30" fontWeight="bold" fill="currentColor">𝔗</text>
    </svg>
  );
}

function InstagramLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Instagram">
      <rect x="5" y="5" width="22" height="22" rx="6" />
      <circle cx="16" cy="16" r="5.5" />
      <circle cx="22.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function RenewPersona() {
  return (
    <div className={styles.card} data-reveal>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.avatar}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/renew/renew-persona-profile.jpg" alt="Angela S." className={styles.avatarImg} />
        </div>
        <div>
          <h2 className={styles.name}>Meet Angela S.</h2>
          <p className={styles.tagline}>28-year-old ceramicist living in Floyd, VA</p>
        </div>
      </div>

      {/* Bio */}
      <div className={styles.bioRow}>
        <div className={styles.bioSection}>
          <p className={styles.sectionLabel}>Bio</p>
          <p className={styles.body}>
            Angela lives sustainably and shops locally — farmer's markets, thrift stores, walking to work. After her first child, she needs to clear out her maternity wardrobe and find pieces that fit her new life as a mother.
          </p>
        </div>

        {/* Goals + Pain Points side by side */}
        <div className={styles.listsRow}>
          <div>
            <p className={styles.sectionLabel}>Goals</p>
            <ul className={styles.list}>
              <li>Avoid cross-country resale platforms that increase her carbon footprint</li>
              <li>Support local businesses, farmer's markets, and her community</li>
              <li>Find a good home for her clothes while getting something back in return</li>
            </ul>
          </div>
          <div>
            <p className={styles.sectionLabel}>Pain Points</p>
            <ul className={styles.list}>
              <li>No local online presence for clothing swaps — neighbors rely on word of mouth</li>
              <li>The town's only thrift store rejects most donations due to lack of volunteers</li>
              <li>A young child at home limits how long she can be out of the house</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Purple footer strip */}
      <div className={styles.footer}>
        <div className={styles.footerSection}>
          <p className={styles.sectionLabel}>Experience level</p>
          <ExperienceBar label="Online resale sites" value={25} />
          <ExperienceBar label="Clothing swaps"      value={38} />
          <ExperienceBar label="Thrift stores"       value={72} />
        </div>

        <div className={styles.footerSection}>
          <p className={styles.sectionLabel}>Brands</p>
          <div className={styles.brands}>
            <NytLogo />
            <InstagramLogo />
            <span className={styles.brandText}>ILIA</span>
            <span className={`${styles.brandText} ${styles.brandTextSans}`}>patagonia</span>
          </div>
        </div>

        <div className={styles.footerDivider} />
        <blockquote className={styles.quote}>
          <span className={styles.quoteMarks}>&ldquo;</span>
          <p className={styles.quoteBody}>
            Living sustainably isn't just a trend for me, it's a value that guides every decision I make. Clearing out my maternity clothes is a conscious effort to give them new purpose and reduce waste — and a way to teach my child that even small actions matter.
          </p>
        </blockquote>
      </div>
    </div>
  );
}
