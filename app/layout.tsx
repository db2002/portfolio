import type { Metadata } from 'next';
import Nav from '@/components/Nav/Nav';
import Footer from '@/components/Footer/Footer';
import Cursor from '@/components/Cursor/Cursor';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default:  'Diya Bhatia — UX & Product Designer',
    template: '%s — Diya Bhatia',
  },
  description:
    'UX and product designer crafting thoughtful, user-centred digital experiences. Available for full-time roles and freelance work.',
  openGraph: {
    siteName:  'Diya Bhatia',
    locale:    'en_US',
    type:      'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t||'light')}catch(e){document.documentElement.setAttribute('data-theme','light')}})()`,
          }}
        />
      </head>
      <body>
        <Cursor />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
