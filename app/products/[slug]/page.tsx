import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/products';

// Next.js route segment revalidation (300 seconds = 5 minutes)
export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found in our catalog.',
    };
  }

  return {
    title: `${product.name} - $${product.price.toFixed(2)} | Product Catalog`,
    description: product.description || `Buy ${product.name} online from our catalog.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-neutral-400">
            <li>
              <Link href="/products" className="hover:text-white transition-colors">
                Products
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-neutral-500">{product.category}</li>
            <li>
              <svg className="w-4 h-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-neutral-200 truncate font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Product Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-10 backdrop-blur-md shadow-2xl">
          {/* Product Image */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-neutral-950/80 text-neutral-200 border border-neutral-700/60 backdrop-blur-md">
                {product.category}
              </span>
            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">
                  SKU / ID: #{product.id}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  In Stock (Google Sheets)
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
                {product.name}
              </h1>

              <div className="inline-block mb-6">
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20">
                  ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="border-t border-neutral-800 pt-6 mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                  Description
                </h2>
                <p className="text-neutral-300 leading-relaxed whitespace-pre-line text-base">
                  {product.description || 'No detailed description available for this item.'}
                </p>
              </div>
            </div>

            {/* Actions & Meta Info */}
            <div className="space-y-4 pt-6 border-t border-neutral-800">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  id="order-now-btn"
                  className="flex-1 py-3.5 px-6 rounded-xl font-bold text-center text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30"
                >
                  Order Now
                </button>
                <Link
                  href="/products"
                  className="py-3.5 px-6 rounded-xl font-semibold text-center text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white transition-colors"
                >
                  Back to Catalog
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-neutral-400 pt-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Real-time CMS Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure Server Rendering</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
