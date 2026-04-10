'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="font-display text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
          India&apos;s Digital Gold
          <br />
          <span className="text-gold-600">Donation Highway</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Donate verified digital gold directly to temples and institutions. Every donation is
          blockchain-anchored for transparency and trust.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/institutions"
            className="rounded-xl bg-gold-500 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-gold-600 transition"
          >
            Browse Institutions
          </Link>
          <Link
            href="/verify"
            className="rounded-xl border-2 border-gold-300 px-8 py-3 text-lg font-semibold text-gold-700 hover:bg-gold-50 transition"
          >
            Verify Donation
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <h2 className="text-center font-display text-3xl font-bold text-gray-900">How It Works</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {[
            { step: '1', title: 'Choose', desc: 'Select a temple or institution' },
            { step: '2', title: 'Donate', desc: 'Pay and digital gold is allocated' },
            { step: '3', title: 'Verify', desc: 'Donation anchored on blockchain' },
            { step: '4', title: 'Certificate', desc: 'Download your proof certificate' },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-2xl border border-gold-100 bg-white p-6 text-center shadow-sm"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 font-display text-xl font-bold text-gold-700">
                {s.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="rounded-3xl bg-gold-700 px-8 py-16 text-center text-white mb-16">
        <h2 className="font-display text-3xl font-bold">Built on Trust &amp; Transparency</h2>
        <p className="mx-auto mt-4 max-w-xl text-gold-100">
          Every donation generates an immutable Merkle proof anchored on Polygon blockchain. Direct
          settlement model — funds go straight to verified gold allocation.
        </p>
      </section>
    </div>
  );
}
