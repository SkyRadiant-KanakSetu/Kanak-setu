import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import Image from 'next/image';
import { KsFontLink } from '@kanak-setu/ui';

export const metadata = {
  title: 'Kanak Setu — Digital Gold Donation',
  description: "India's digital gold donation highway",
  metadataBase: new URL('https://kanaksetu.com'),
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  openGraph: {
    title: 'Kanak Setu — Digital Gold Donation',
    description: "India's digital gold donation highway",
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Kanak Setu — Digital Gold Donation',
    description: "India's digital gold donation highway",
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
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t border-gold-200 py-8 text-center text-sm text-gray-500">
            <div className="mx-auto mb-3 flex max-w-6xl items-center justify-center gap-2">
              <Image
                src="/logo.png"
                alt="Kanak Setu"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border border-gold-300/70 p-0.5 shadow-[0_4px_12px_rgba(180,120,20,0.2)] saturate-150"
              />
              <span className="font-display text-base font-semibold text-gold-800">Kanak Setu</span>
            </div>
            © {new Date().getFullYear()} Kanak Setu. All rights reserved.
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
