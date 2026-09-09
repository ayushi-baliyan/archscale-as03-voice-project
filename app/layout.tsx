import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ProjectTalk — Talk to your project',
  description: 'ArchScale AS-03 prototype: voice-driven project actions.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
