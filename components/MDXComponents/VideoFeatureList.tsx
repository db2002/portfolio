import styles from './VideoFeatureList.module.css';

interface FeatureItem {
  video?: string;
  image?: string;
  title: string;
  description: string;
}

interface Props {
  items?: FeatureItem[];
}

export default function VideoFeatureList({ items = [] }: Props) {
  return (
    <div className={styles.list}>
      {items.map(({ video, image, title, description }, i) => (
        <div key={i} className={styles.row}>
          <div className={styles.videoWrap}>
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={title} className={styles.video} />
            ) : (
              <video src={video} autoPlay loop muted playsInline className={styles.video} />
            )}
          </div>
          <div className={styles.text}>
            <p className={styles.title}>{title}</p>
            <p className={styles.body}>{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
