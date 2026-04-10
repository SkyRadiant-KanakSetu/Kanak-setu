import './globals.css';

export const metadata = { title: 'Kanak Setu — Institution Portal' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <span className="font-serif text-lg font-bold text-amber-800">
              🏛 Kanak Setu · Institution
            </span>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
