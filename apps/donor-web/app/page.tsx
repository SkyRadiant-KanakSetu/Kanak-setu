'use client';
import Link from 'next/link';

export default function Home() {
  const highlights = [
    { label: 'Verified Institutions', value: '100+' },
    { label: 'Donation Success Rate', value: '99.9%' },
    { label: 'Avg Checkout Time', value: '< 60 sec' },
    { label: 'Proof Availability', value: '24x7' },
  ];

  const features = [
    {
      title: 'Instant UPI QR Flow',
      desc: 'Enter an amount, pay with any UPI app, and confirm with your transaction reference.',
    },
    {
      title: 'Real-Time Donation Tracking',
      desc: 'Follow each donation from payment confirmation to gold allocation and settlement.',
    },
    {
      title: 'Tamper-Proof Audit Trail',
      desc: 'Every critical step is logged and traceable for institutions, donors, and compliance teams.',
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-gold-100 bg-gradient-to-br from-white via-gold-50 to-gold-100 px-6 py-14 md:px-12 md:py-20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="relative">
          <span className="inline-flex rounded-full border border-gold-200 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-700">
            Trusted Digital Gold Donations
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
            India&apos;s Most Transparent
            <br />
            <span className="text-gold-700">Digital Gold Giving Platform</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-gray-700 md:text-lg">
            Donate to verified temples and institutions with a smoother UPI-first flow, complete
            payment proof, and blockchain-backed transparency.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/institutions"
              className="rounded-xl bg-gold-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-gold-700"
            >
              Start Donating
            </Link>
            <Link
              href="/history"
              className="rounded-xl border border-gold-300 bg-white px-6 py-3 text-base font-semibold text-gold-800 transition hover:bg-gold-50"
            >
              View My Donations
            </Link>
            <Link
              href="/verify"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Verify a Donation
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => (
          <div key={item.label} className="rounded-2xl border border-gold-100 bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold text-gold-700">{item.value}</p>
            <p className="mt-1 text-sm text-gray-600">{item.label}</p>
          </div>
        ))}
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

      <section className="rounded-3xl border border-gold-100 bg-white p-8 md:p-10">
        <h2 className="font-display text-2xl font-bold text-gray-900 md:text-3xl">
          Built for Trust, Designed for Ease
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-100 bg-gold-50/30 p-5">
              <h3 className="text-base font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="mt-8 rounded-3xl bg-gold-700 px-8 py-14 text-center text-white">
        <h2 className="font-display text-3xl font-bold">Built on Trust &amp; Transparency</h2>
        <p className="mx-auto mt-4 max-w-2xl text-gold-100">
          Every donation generates an immutable proof anchored on Polygon blockchain. Direct
          settlement ensures traceability from donor payment to institution gold credit.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/institutions"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gold-700 hover:bg-gold-50"
          >
            Donate Now
          </Link>
          <Link
            href="/verify"
            className="rounded-lg border border-gold-200 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gold-600"
          >
            Verify On-Chain Proof
          </Link>
        </div>
      </section>
    </div>
  );
}
