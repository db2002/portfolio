import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import styles from './about.module.css';
import AboutGrid from './AboutGrid';

const VinylPlayer = dynamic(() => import('@/components/VinylPlayer/VinylPlayer'), { ssr: false });

export const metadata: Metadata = {
  title: 'About',
  description: 'Background, values, and how to work with Diya Bhatia.',
};

const books = [
  { title: 'The Nightingale', author: 'Kristin Hannah', cover: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1681839850i/21853621.jpg', goodreads: 'https://www.goodreads.com/book/show/21853621-the-nightingale' },
  { title: 'Project Hail Mary', author: 'Andy Weir', cover: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1764703833i/54493401.jpg', goodreads: 'https://www.goodreads.com/book/show/54493401-project-hail-mary' },
  { title: 'The Lion Women of Tehran', author: 'Marjan Kamali', cover: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1719409771i/199798217.jpg', goodreads: 'https://www.goodreads.com/book/show/199798217-the-lion-women-of-tehran' },
  { title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', cover: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1636978687i/58784475.jpg', goodreads: 'https://www.goodreads.com/book/show/58784475-tomorrow-and-tomorrow-and-tomorrow' },
  { title: 'Remarkably Bright Creatures', author: 'Shelby Van Pelt', cover: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1651600548i/58733693.jpg', goodreads: 'https://www.goodreads.com/book/show/58733693-remarkably-bright-creatures' },
  { title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', cover: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1664458703i/32620332.jpg', goodreads: 'https://www.goodreads.com/book/show/32620332-the-seven-husbands-of-evelyn-hugo' },
  { title: 'Sunrise on the Reaping', author: 'Suzanne Collins', cover: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1729085500i/214331246.jpg', goodreads: 'https://www.goodreads.com/book/show/214331246-sunrise-on-the-reaping' },
  { title: 'Lessons in Chemistry', author: 'Bonnie Garmus', cover: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1634748496i/58065033.jpg', goodreads: 'https://www.goodreads.com/book/show/58065033-lessons-in-chemistry' },
  { title: 'Harry Potter and the Half-Blood Prince', author: 'J.K. Rowling', cover: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1627043894i/58613345.jpg', goodreads: 'https://www.goodreads.com/book/show/58613345-harry-potter-and-the-half-blood-prince' },
  { title: 'Atmosphere', author: 'Taylor Jenkins Reid', cover: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1730469032i/220817728.jpg', goodreads: 'https://www.goodreads.com/book/show/220817728-atmosphere' },
];

export default function AboutPage() {
  return (
    <section className={styles.page}>
      <AboutGrid />

      {/* ── My Shelf + Spotify ───────────────────────────── */}
      <div className={styles.shelf}>
        <div className={styles.shelfRow}>
          <div className={styles.shelfBooks}>
            <h2 className={styles.shelfHeading}>Favorite reads</h2>
            <div className={styles.books}>
              {books.map((book, i) => (
                <a
                  key={i}
                  href={book.goodreads || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.book}
                  aria-label={`View ${book.title} on Goodreads`}
                >
                  <div className={styles.bookCover}>
                    {book.cover && (
                      <Image src={book.cover} alt={book.title} fill className={styles.bookImg} sizes="120px" />
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className={styles.shelfSpotify}>
            <h2 className={styles.shelfHeading}>Currently listening to</h2>
            <VinylPlayer />
          </div>
        </div>
      </div>
    </section>
  );
}
