import { HubProject } from '@/types/project';

/**
 * Converts any Google Drive URL into high-speed direct embed URLs.
 * Handles:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=drive_link
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 */
export function convertGoogleDriveUrl(url: string): string {
  const matchFile = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFile && matchFile[1]) {
    return `https://lh3.googleusercontent.com/d/${matchFile[1]}`;
  }

  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) {
    return `https://lh3.googleusercontent.com/d/${matchId[1]}`;
  }

  return url;
}

export function resolveProjectImage(rawImage: string): string {
  const trimmed = rawImage.trim();
  if (!trimmed) {
    return '';
  }

  // Google Drive link support (including ?usp=drive_link, ?usp=sharing, etc.)
  if (trimmed.includes('drive.google.com')) {
    return convertGoogleDriveUrl(trimmed);
  }

  // Local static asset support (e.g. "warehouse.jpg" or "/images/warehouse.jpg")
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return trimmed.startsWith('/') ? trimmed : `/images/${trimmed}`;
  }

  return trimmed;
}

/**
 * Normalizes an arbitrary header string by removing special characters,
 * spaces, tabs, and casing differences.
 */
export function normalizeHeader(header: unknown): string {
  return String(header ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Extracts a readable domain/host from a URL for display purposes.
 */
export function extractDisplaySubdomain(url: string, fallbackId: string): string {
  if (!url) {
    return `${fallbackId.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.safetymanagercentre.com`;
  }

  try {
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    const parsed = new URL(formattedUrl);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0] || fallbackId;
  }
}

/**
 * Parses numeric values safely (e.g., display order).
 */
export function parseNumber(value: unknown, fallback: number = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseInt(value.replace(/[^0-9-]/g, ''), 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

/**
 * Maps a single spreadsheet row to a strongly typed HubProject.
 * Supports flexible headers matching ID, Name, App, Category, Image, Description, Display Order, Status.
 */
export function mapRowToProject(
  row: unknown[],
  headerMap: Map<string, number>,
  rowIndex: number
): HubProject | null {
  if (!row || row.length === 0 || row.every((c) => !c || String(c).trim() === '')) {
    return null;
  }

  const getCell = (key: string): string => {
    const idx = headerMap.get(key);
    if (idx === undefined || idx === -1 || idx >= row.length) return '';
    return String(row[idx] ?? '').trim();
  };

  const id = getCell('id') || `proj-${rowIndex}`;
  const name = getCell('name');
  if (!name) return null; // Name is required

  // URL / App field
  const rawAppUrl = getCell('app') || getCell('url') || getCell('subdomain') || '';
  const cleanUrl = rawAppUrl
    ? rawAppUrl.startsWith('http://') || rawAppUrl.startsWith('https://')
      ? rawAppUrl
      : `https://${rawAppUrl}`
    : '#';

  const subdomain = extractDisplaySubdomain(cleanUrl, id);
  const category = getCell('category') || 'Safety Application';
  const rawImage = getCell('image');
  const image = resolveProjectImage(rawImage);
  const description = getCell('description') || 'Official workplace application.';
  const displayOrder = parseNumber(getCell('displayorder') || getCell('order'), rowIndex);
  const status = getCell('status') || 'Active';

  return {
    id,
    name,
    url: cleanUrl,
    subdomain,
    category,
    image,
    description,
    displayOrder,
    status,
  };
}
