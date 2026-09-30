import { google } from 'googleapis';
import { unstable_cache } from 'next/cache';

/**
 * Product Data Type definition
 */
export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
};

/**
 * Revalidation period in seconds (5 minutes = 300 seconds).
 * Edit this value to change how frequently Next.js fetches fresh data from Google Sheets.
 */
export const PRODUCT_REVALIDATE_SECONDS = 300;

/**
 * Helper to parse and sanitize price values.
 * Handles strings with currency symbols (e.g. "$799", "699.00", "৳1,200") as well as direct numbers.
 */
function parsePrice(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value >= 0 ? value : null;
  }

  if (typeof value === 'string') {
    // Remove currency symbols, commas, and whitespace
    const sanitized = value.replace(/[^0-9.-]+/g, '').trim();
    if (!sanitized) return null;

    const parsed = parseFloat(sanitized);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  }

  return null;
}

/**
 * Safely fetches raw rows from the Google Sheet via the Google Sheets API v4.
 * Running strictly on the server side using a Google Service Account.
 */
async function fetchProductsFromGoogleSheets(): Promise<Product[]> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  // 1. Verify required environment variables
  if (!spreadsheetId || !clientEmail || !privateKey) {
    console.warn(
      '[Google Sheets API] Warning: Missing required environment variables. ' +
        'Please ensure GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, and GOOGLE_PRIVATE_KEY are defined in .env.local.'
    );
    return [];
  }

  // Handle line breaks in the private key if stored as an escaped string in .env
  privateKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');

  try {
    // 2. Authenticate with Google Service Account (JWT)
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Optional range override, defaults to reading the whole first sheet 'A:Z'
    const range = process.env.GOOGLE_SHEET_RANGE || 'A:Z';

    // 3. Query the Google Sheets API
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      valueRenderOption: 'FORMATTED_VALUE',
    });

    const rows = response.data.values;

    // 4. Handle empty sheet
    if (!rows || rows.length <= 1) {
      console.warn('[Google Sheets API] Notice: The Google Sheet is empty or contains only a header row.');
      return [];
    }

    // 5. Dynamic header extraction
    const rawHeaders = rows[0] as unknown[];
    const headers = rawHeaders.map((header) => String(header || '').trim().toLowerCase());

    const idIndex = headers.indexOf('id');
    const slugIndex = headers.indexOf('slug');
    const nameIndex = headers.indexOf('name');
    const priceIndex = headers.indexOf('price');
    const categoryIndex = headers.indexOf('category');
    const imageIndex = headers.indexOf('image');
    const descriptionIndex = headers.indexOf('description');

    // If this sheet was repurposed for the Applications Hub (id, name, app, category, etc.)
    if (idIndex === -1 || nameIndex === -1 || (priceIndex === -1 && slugIndex === -1)) {
      return [];
    }

    const products: Product[] = [];
    const seenSlugs = new Set<string>();

    // 6. Process and validate data rows (starting from row index 1)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      const rowIndex = i + 1; // 1-based sheet row number for friendly logs

      // Ignore completely empty rows
      if (!row || row.length === 0 || row.every((cell) => cell === undefined || cell === null || String(cell).trim() === '')) {
        continue;
      }

      const id = String(row[idIndex] ?? '').trim();
      const rawSlug = String(row[slugIndex] ?? '').trim();
      const slug = rawSlug.toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
      const name = String(row[nameIndex] ?? '').trim();
      const rawPrice = row[priceIndex];
      const price = parsePrice(rawPrice);
      const category = categoryIndex !== -1 ? String(row[categoryIndex] ?? '').trim() || 'General' : 'General';
      const image = imageIndex !== -1 ? String(row[imageIndex] ?? '').trim() : '';
      const description = descriptionIndex !== -1 ? String(row[descriptionIndex] ?? '').trim() : '';

      // Validate required product fields
      if (!id || !slug || !name || price === null) {
        console.warn(
          `[Google Sheets API] Skipping malformed row ${rowIndex}: Missing required fields or invalid price.`,
          { id, slug, name, rawPrice }
        );
        continue;
      }

      // Check for duplicate slugs
      if (seenSlugs.has(slug)) {
        console.warn(
          `[Google Sheets API] Duplicate slug "${slug}" found at row ${rowIndex}. Skipping duplicate to preserve unique route mapping.`
        );
        continue;
      }

      seenSlugs.add(slug);

      products.push({
        id,
        slug,
        name,
        price,
        category,
        image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
        description,
      });
    }

    return products;
  } catch (error: unknown) {
    // Protect sensitive credentials and internal API traces from bubbling to the client
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Google Sheets API Error]:', errorMessage);

    // Re-throw a generic safe error
    throw new Error('Unable to fetch products from the catalog service.');
  }
}

/**
 * Cached server-side function to retrieve all products.
 * Uses Next.js unstable_cache with time-based revalidation (PRODUCT_REVALIDATE_SECONDS).
 */
export const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    return fetchProductsFromGoogleSheets();
  },
  ['google-sheets-products-list'],
  {
    revalidate: PRODUCT_REVALIDATE_SECONDS,
    tags: ['products'],
  }
);

/**
 * Retrieves a single product by its unique slug.
 * Leverages the cached getProducts() call to avoid extra API hits.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  const normalized = slug.trim().toLowerCase();
  return products.find((product) => product.slug.toLowerCase() === normalized) ?? null;
}
