import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';

export const metadata = {
  title: 'Kanak Setu — Digital Gold Donation',
  description: "India's digital gold donation highway",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t border-gold-200 py-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Kanak Setu. All rights reserved.
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
