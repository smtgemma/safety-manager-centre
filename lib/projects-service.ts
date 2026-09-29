import { google } from 'googleapis';
import { unstable_cache } from 'next/cache';

export type HubProject = {
  id: string;
  name: string;
  subdomain: string;
  url: string;
  description: string;
  image: string;
  category: string;
};

export const REVALIDATE_SECONDS = 300;

export const DEFAULT_SAFETY_PROJECTS: HubProject[] = [
  {
    id: 'warehouse-safety',
    name: 'Warehouse Safety Manager',
    subdomain: 'warehouse.safetymanagercentre.com',
    url: 'https://warehouse.safetymanagercentre.com',
    description: 'Floor safety management, shift hazards tracking, and daily PPE compliance oversight.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&auto=format&fit=crop&q=80',
    category: 'Safety Management',
  },
  {
    id: 'pallet-racks',
    name: 'Pallet Rack Inspection',
    subdomain: 'racks.safetymanagercentre.com',
    url: 'https://racks.safetymanagercentre.com',
    description: 'EN 15635 compliant racking damage logs, uprights assessment, and beam load verification.',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=900&auto=format&fit=crop&q=80',
    category: 'Inspections',
  },
  {
    id: 'incident-reporter',
    name: 'Incident & Near-Miss Reporter',
    subdomain: 'incidents.safetymanagercentre.com',
    url: 'https://incidents.safetymanagercentre.com',
    description: 'Rapid incident capture, near-miss logging, and OSHA/HSE compliant corrective action workflows.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&auto=format&fit=crop&q=80',
    category: 'EHS & Incident Logs',
  },
  {
    id: 'forklift-fleet',
    name: 'Forklift & Fleet Pre-Shift',
    subdomain: 'forklift.safetymanagercentre.com',
    url: 'https://forklift.safetymanagercentre.com',
    description: 'Daily pre-shift checklist for forklifts, battery diagnostics, and certified driver sign-offs.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df57046475a?w=900&auto=format&fit=crop&q=80',
    category: 'Operations',
  },
  {
    id: 'ehs-compliance',
    name: 'EHS Audits & Regulations',
    subdomain: 'compliance.safetymanagercentre.com',
    url: 'https://compliance.safetymanagercentre.com',
    description: 'ISO 45001 audit checklists, safety certificate renewals, and statutory compliance archive.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&auto=format&fit=crop&q=80',
    category: 'Audits',
  },
  {
    id: 'emergency-fire',
    name: 'Emergency & Fire Readiness',
    subdomain: 'emergency.safetymanagercentre.com',
    url: 'https://emergency.safetymanagercentre.com',
    description: 'Fire extinguisher routine logbook, warden rosters, and emergency exit clearance checks.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&auto=format&fit=crop&q=80',
    category: 'Emergency',
  },
];

async function fetchFromGoogleSheet(): Promise<HubProject[]> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!spreadsheetId || !clientEmail || !privateKey || spreadsheetId === 'PUT_YOUR_SHEET_ID_HERE') {
    return DEFAULT_SAFETY_PROJECTS;
  }

  privateKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const range = process.env.GOOGLE_SHEET_RANGE || 'A:Z';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return DEFAULT_SAFETY_PROJECTS;
    }

    const headers = (rows[0] as string[]).map((h) => String(h || '').trim().toLowerCase());
    const idIdx = headers.indexOf('id');
    const nameIdx = headers.indexOf('name');
    const slugIdx = headers.indexOf('slug');
    const subdomainIdx = headers.indexOf('subdomain');
    const urlIdx = headers.indexOf('url');
    const imageIdx = headers.indexOf('image');
    const descIdx = headers.indexOf('description');
    const catIdx = headers.indexOf('category');

    const sheetProjects: HubProject[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i] as unknown[];
      if (!row || row.length === 0 || row.every((c) => !c || String(c).trim() === '')) {
        continue;
      }

      const id = String(row[idIdx !== -1 ? idIdx : 0] ?? `proj-${i}`).trim();
      const name = String(row[nameIdx !== -1 ? nameIdx : 1] ?? '').trim();
      if (!name) continue;

      const rawSub = subdomainIdx !== -1 ? String(row[subdomainIdx] ?? '').trim() : '';
      const rawSlug = slugIdx !== -1 ? String(row[slugIdx] ?? '').trim() : '';
      const rawUrl = urlIdx !== -1 ? String(row[urlIdx] ?? '').trim() : '';

      const cleanSub =
        rawSub ||
        (rawSlug
          ? `${rawSlug}.safetymanagercentre.com`
          : `${id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.safetymanagercentre.com`);

      const url = rawUrl || (cleanSub.startsWith('http') ? cleanSub : `https://${cleanSub}`);
      const image = imageIdx !== -1 ? String(row[imageIdx] ?? '').trim() : '';
      const description = descIdx !== -1 ? String(row[descIdx] ?? '').trim() : '';
      const category = catIdx !== -1 ? String(row[catIdx] ?? '').trim() || 'Safety Module' : 'Safety Module';

      sheetProjects.push({
        id,
        name,
        subdomain: cleanSub.replace(/^https?:\/\//, '').replace(/\/$/, ''),
        url,
        description: description || 'Specialized workplace safety application hosted on a dedicated subdomain.',
        image: image || DEFAULT_SAFETY_PROJECTS[(i - 1) % DEFAULT_SAFETY_PROJECTS.length].image,
        category,
      });
    }

    if (sheetProjects.length === 0) {
      return DEFAULT_SAFETY_PROJECTS;
    }

    // If the sheet has fewer than 4 apps, supplement with the remaining default safety projects
    // so the grid looks full and balanced
    if (sheetProjects.length < 4) {
      const existingIds = new Set(sheetProjects.map((p) => p.id.toLowerCase()));
      const supplements = DEFAULT_SAFETY_PROJECTS.filter((p) => !existingIds.has(p.id.toLowerCase()));
      return [...sheetProjects, ...supplements];
    }

    return sheetProjects;
  } catch (error) {
    console.warn('[Google Sheets Integration] Using default safety projects:', error);
    return DEFAULT_SAFETY_PROJECTS;
  }
}

export const getHubProjects = unstable_cache(
  async (): Promise<HubProject[]> => {
    return fetchFromGoogleSheet();
  },
  ['safety-hub-projects-cache-v2'],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: ['hub-projects'],
  }
);
