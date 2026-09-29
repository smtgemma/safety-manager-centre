import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center rounded-3xl border border-neutral-800 bg-neutral-900/40 p-8 sm:p-12 backdrop-blur-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-neutral-800 flex items-center justify-center text-neutral-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">404 Error</span>
        <h1 className="mt-2 text-2xl font-bold text-white">Product Not Found</h1>
        <p className="mt-3 text-sm text-neutral-400">
          The requested product could not be located in our Google Sheets catalog or may have been removed.
        </p>
        <div className="mt-8">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            ← Return to Products
          </Link>
        </div>
      </div>
    </main>
  );
}
