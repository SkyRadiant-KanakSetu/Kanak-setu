'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { merkle, verify } from '@/lib/api';

const EXPLORER_TX_BASE_URL =
  process.env.NEXT_PUBLIC_BLOCK_EXPLORER_TX_BASE_URL || 'https://amoy.polygonscan.com/tx';

function VerifyContent() {
  const searchParams = useSearchParams();
  const donationId = searchParams.get('donation');
  const certRef = searchParams.get('ref');

  const [proof, setProof] = useState<any>(null);
  const [certData, setCertData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchRef, setSearchRef] = useState(certRef || '');
  const [info, setInfo] = useState('');

  useEffect(() => {
    if (donationId) {
      setLoading(true);
      merkle.proof(donationId).then((res) => {
        if (res.success) setProof(res.data);
        else setInfo(res.error?.message || 'Proof not available yet for this donation');
        setLoading(false);
      });
    }
    if (certRef) handleVerify(certRef);
  }, [donationId, certRef]);

  const handleVerify = async (ref?: string) => {
    const r = ref || searchRef;
    if (!r) return;
    setLoading(true);
    setInfo('');
    const res = await verify.certificate(r);
    if (res.success) setCertData(res.data);
    else setInfo(res.error?.message || 'Certificate not found');
    setLoading(false);
  };

  async function copyValue(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setInfo('Copied to clipboard');
      window.setTimeout(() => setInfo(''), 1400);
    } catch {
      setInfo('Could not copy');
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-3xl border border-gold-100 bg-gradient-to-r from-white via-gold-50 to-gold-100 p-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Verify Donation</h1>
        <p className="mt-1 text-sm text-gray-600">
          Validate donation authenticity using certificate reference or blockchain proof details.
        </p>
      </div>

      {/* Search by certificate ref */}
      {!donationId && (
        <div className="mt-6 flex gap-3 rounded-2xl border border-gray-100 bg-white p-4">
          <input
            type="text"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            placeholder="Enter certificate reference..."
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-gold-400 focus:outline-none"
          />
          <button
            onClick={() => handleVerify()}
            className="rounded-lg bg-gold-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-gold-700"
          >
            Verify
          </button>
        </div>
      )}

      {loading && <p className="mt-8 text-gray-400">Verifying...</p>}
      {!loading && info && <p className="mt-4 text-sm text-gray-500">{info}</p>}

      {/* Blockchain proof view */}
      {proof && (
        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <h3 className="font-semibold text-green-800">✓ Donation Proof Found</h3>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 space-y-3 text-sm">
            <div>
              <span className="text-gray-400">Donation Ref:</span>{' '}
              <strong>{proof.donationRef}</strong>
            </div>
            <div>
              <span className="text-gray-400">Amount:</span>{' '}
              <strong>
                {typeof proof.amountRupees === 'number'
                  ? `₹${proof.amountRupees.toFixed(2)}`
                  : `₹${((proof.amountPaise || 0) / 100).toFixed(2)}`}
              </strong>
            </div>
            <div>
              <span className="text-gray-400">Leaf Hash:</span>{' '}
              <code className="text-xs bg-gray-50 px-1 rounded">{proof.leafHash}</code>
              <button
                type="button"
                onClick={() => copyValue(proof.leafHash)}
                className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700 hover:bg-gray-200"
              >
                Copy
              </button>
            </div>
            <div>
              <span className="text-gray-400">Merkle Root:</span>{' '}
              <code className="text-xs bg-gray-50 px-1 rounded">{proof.merkleRoot}</code>
              <button
                type="button"
                onClick={() => copyValue(proof.merkleRoot)}
                className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700 hover:bg-gray-200"
              >
                Copy
              </button>
            </div>
            <div>
              <span className="text-gray-400">Batch #:</span> {proof.batchNumber} (
              {proof.batchStatus})
            </div>
            {!proof.blockchain && (
              <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
                Proof is generated but this batch is not anchored on-chain yet.
              </div>
            )}
            {proof.blockchain && (
              <>
                <div>
                  <span className="text-gray-400">Network:</span> {proof.blockchain.network}
                </div>
                <div>
                  <span className="text-gray-400">Anchor status:</span>{' '}
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                    {proof.blockchain.status || proof.batchStatus}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Attempts:</span> {proof.blockchain.attempts ?? 0}
                </div>
                <div>
                  <span className="text-gray-400">Tx Hash:</span>
                  <a
                    href={`${EXPLORER_TX_BASE_URL}/${proof.blockchain.txHash}`}
                    target="_blank"
                    rel="noopener"
                    className="ml-1 text-blue-600 hover:underline text-xs break-all"
                  >
                    {proof.blockchain.txHash}
                  </a>
                  <button
                    type="button"
                    onClick={() => copyValue(proof.blockchain.txHash)}
                    className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700 hover:bg-gray-200"
                  >
                    Copy
                  </button>
                </div>
                <div>
                  <span className="text-gray-400">Block:</span> {proof.blockchain.blockNumber}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Certificate verification view */}
      {certData && (
        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <h3 className="font-semibold text-green-800">✓ Certificate Verified</h3>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 space-y-3 text-sm">
            <div>
              <span className="text-gray-400">Serial:</span>{' '}
              <strong>{certData.serialNumber}</strong>
            </div>
            <div>
              <span className="text-gray-400">Type:</span> {certData.type}
            </div>
            <div>
              <span className="text-gray-400">Status:</span> {certData.status}
            </div>
            <div>
              <span className="text-gray-400">Institution:</span> {certData.donation?.institution}
            </div>
            <div>
              <span className="text-gray-400">Amount:</span> ₹
              {(certData.donation?.amountPaise / 100).toFixed(2)}
            </div>
            {certData.donation?.blockchain?.txHash && (
              <div>
                <span className="text-gray-400">Blockchain Tx:</span>
                <a
                  href={`${EXPLORER_TX_BASE_URL}/${certData.donation.blockchain.txHash}`}
                  target="_blank"
                  rel="noopener"
                  className="ml-1 text-blue-600 hover:underline text-xs"
                >
                  {certData.donation.blockchain.txHash}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-gray-400">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
