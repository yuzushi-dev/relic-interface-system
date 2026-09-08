import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Relic Forensic Dashboard — RIS v2.8.0',
  description:
    'Tactical cyber forensic telemetry and incident command interface built on Relic Interface System v2.8.0.',
  keywords: ['forensic', 'telemetry', 'relic-ui', 'tactical-cyber', 'cyberpunk', 'nextjs'],
  authors: [{ name: 'Relic Interface System Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0608' },
    { media: '(prefers-color-scheme: light)', color: '#eef2f5' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" data-brand="relic" data-skin="cyber" suppressHydrationWarning>
      <body className="ris ris-grid-bg text-ris-fg1 min-h-screen antialiased">
        {/* WCAG 2.4.1 Skip Navigation Link */}
        <a className="ris-skip-nav" href="#main-content">
          SKIP TO FORENSIC TELEMETRY
        </a>
        {children}
      </body>
    </html>
  );
}
