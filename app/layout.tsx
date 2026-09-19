import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kayla Orozco — Design Engineer & AI Product Builder',
  description:
    'Design engineer building thoughtful AI-powered products, mobile apps, and enterprise interaction systems from prototype to production.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
