import { google } from 'googleapis';

export type HubProject = {
  id: string;
  name: string;
  subdomain: string;
  url: string;
  description: string;
  image: string;
  category: string;
};

export async function fetchFromGoogleSheet(): Promise<HubProject[]> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!spreadsheetId || !clientEmail || !privateKey) {
    return [];
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
      return [];
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
      const category = catIdx !== -1 ? String(row[catIdx] ?? '').trim() || 'General' : 'General';

      sheetProjects.push({
        id,
        name,
        subdomain: cleanSub.replace(/^https?:\/\//, '').replace(/\/$/, ''),
        url,
        description: description || 'Application managed in Google Sheets.',
        image: image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&auto=format&fit=crop&q=80',
        category,
      });
    }

    return sheetProjects;
  } catch (error) {
    console.error('[Google Sheets Integration Error]:', error);
    return [];
  }
}

export async function getHubProjects(): Promise<HubProject[]> {
  return fetchFromGoogleSheet();
}
