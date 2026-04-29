import './globals.css';
import { KsFontLink } from '@kanak-setu/ui';

export const metadata = {
  title: 'Kanak Setu — Admin Panel',
  metadataBase: new URL('https://admin.kanaksetu.com'),
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  openGraph: {
    title: 'Kanak Setu — Admin Panel',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Kanak Setu — Admin Panel',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <KsFontLink />
      </head>
      <body className="bg-[#fdf8f0] font-sans text-stone-900">{children}</body>
    </html>
  );
}
