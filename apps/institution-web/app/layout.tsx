import './globals.css';
import Image from 'next/image';
import { KsFontLink } from '@kanak-setu/ui';

export const metadata = {
  title: 'Kanak Setu — Institution Portal',
  metadataBase: new URL('https://institution.kanaksetu.com'),
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  openGraph: {
    title: 'Kanak Setu — Institution Portal',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Kanak Setu — Institution Portal',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <KsFontLink />
      </head>
      <body className="bg-[#fdf8f0] font-sans text-stone-900">
        <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <span className="flex items-center gap-3 font-serif text-lg font-bold text-amber-800">
              <Image
                src="/logo.png"
                alt="Kanak Setu"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full border border-amber-300/70 p-0.5 shadow-[0_6px_18px_rgba(180,120,20,0.22)] saturate-150"
              />
              <span className="leading-tight">
                <span className="block">Kanak Setu</span>
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                  Institution Portal
                </span>
              </span>
            </span>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
