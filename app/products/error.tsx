'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log safe error locally without leaking internal credentials
    console.error('Products page error caught by boundary:', error.message);
  }, [error]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center rounded-3xl border border-red-900/30 bg-neutral-900/50 p-8 sm:p-12 backdrop-blur-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-red-400">Catalog Service Notice</span>
        <h1 className="mt-2 text-2xl font-bold text-white">Unable to Load Products</h1>
        <p className="mt-3 text-sm text-neutral-400">
          We encountered an issue syncing with the catalog. Please try refreshing or check your connection.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
