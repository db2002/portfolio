import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Play',
  description: 'Photography, pottery, and creative projects outside of work.',
};

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
