import styles from './RenewJourney.module.css';

const journeyData = [
  {
    stage: 'Plan',
    action: 'Checks Facebook to find out about local clothing-related events in Floyd',
    thoughts: [
      'Nobody is consistent about posting what goes on in this town!',
      'Are there any clothing swaps for women who are looking for maternity clothing?',
    ],
    opportunities: [
      'Establish system to connect and inform community about local events',
    ],
  },
  {
    stage: 'Consideration',
    action: "Doesn't find anything, goes to consignment store 20 miles away",
    thoughts: [
      'Getting my baby into his car seat is so hard, all just to get rid of some old clothing',
      "I'll try a consignment store as there's a chance I can get some money back for my clothes",
    ],
    opportunities: [
      'Marketing opportunity for users who want to get something back, not just donate',
      'Adjustable radius in which individuals are willing to travel',
    ],
  },
  {
    stage: 'Complication',
    action: "The store doesn't take maternity clothing as they only sell regular clothing for women",
    thoughts: [
      "I guess women don't go shopping for maternity clothing enough to keep the store stocked",
      "Maybe other women don't have a need for their old maternity clothing anymore and are selling them online",
    ],
    opportunities: [
      'Target users who need near-perfect clothing that they bought for a certain occasion',
    ],
  },
  {
    stage: 'Retention',
    action: 'Turns back home without selling any clothing',
    thoughts: [
      'Is it worth trying to just donate my clothing instead of trying to make something back from it?',
      "I need to find a solution soon and hope that online shopping isn't my only option",
    ],
    opportunities: [
      'Create noise for ReNew by promoting ethical and sustainable online shopping',
    ],
  },
];

export default function RenewJourney() {
  return (
    <div className={styles.card} data-reveal>
      <div className={styles.cardHeader}>
        <span className={styles.goal}>End goal: sell old maternity clothing</span>
      </div>

      <div className={styles.stages} data-no-reveal>
        {/* Stage header row */}
        {journeyData.map(({ stage }) => (
          <div key={stage} className={styles.stageHeader}>{stage.toUpperCase()}</div>
        ))}

        {/* Actions row */}
        {journeyData.map(({ stage, action }) => (
          <div key={stage} className={styles.cell}>
            <p className={styles.sectionLabel}>Actions</p>
            <p className={styles.cellText}>{action}</p>
          </div>
        ))}

        <div className={styles.rowDivider} />

        {/* Thoughts row */}
        {journeyData.map(({ stage, thoughts }) => (
          <div key={stage} className={styles.cell}>
            <p className={styles.sectionLabel}>Thoughts</p>
            <ul className={styles.bullets}>
              {thoughts.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        ))}

        <div className={styles.rowDivider} />

        {/* Opportunities row */}
        {journeyData.map(({ stage, opportunities }) => (
          <div key={stage} className={styles.cell}>
            <p className={styles.sectionLabel}>Opportunities</p>
            <ul className={styles.bullets}>
              {opportunities.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
