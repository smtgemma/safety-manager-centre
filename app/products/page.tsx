import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/products';

// Next.js route segment revalidation (300 seconds = 5 minutes)
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Our Products | Exclusive Catalog',
  description: 'Browse our latest collection of premium products synced live from our Google Sheets catalog.',
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 text-center md:text-left md:flex md:items-end md:justify-between border-b border-neutral-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Google Sheets Catalog
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              Featured Products
            </h1>
            <p className="mt-3 text-lg text-neutral-400 max-w-2xl">
              Explore our curated selection. Updates in Google Sheets appear automatically on this page.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-neutral-400">
            Total items: <span className="font-semibold text-white">{products.length}</span>
          </div>
        </header>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 backdrop-blur-sm">
            <div className="mx-auto w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">No products found</h2>
            <p className="mt-2 text-neutral-400 max-w-md mx-auto text-sm">
              Your Google Sheet seems empty or missing valid products. Add rows with id, slug, name, and price to see them here.
            </p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <article
                key={product.id}
                id={`product-${product.slug}`}
                className="group relative flex flex-col rounded-2xl border border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-neutral-700 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-neutral-950/80 text-neutral-300 backdrop-blur-md border border-neutral-700">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {product.name}
                    </h2>
                    <span className="text-lg font-bold text-emerald-400 shrink-0">
                      ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <p className="text-neutral-400 text-sm line-clamp-2 mb-6 flex-1">
                    {product.description || 'No description provided.'}
                  </p>

                  <Link
                    href={`/products/${product.slug}`}
                    id={`view-${product.slug}`}
                    className="mt-auto inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-neutral-800 hover:bg-blue-600 transition-colors duration-200 shadow-sm"
                  >
                    View Details
                    <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
