import { HubProject } from '@/types/project';
import { getGoogleSheetsConfig, createGoogleSheetsClient } from './client';
import { normalizeHeader, mapRowToProject } from './mapper';

/**
 * Service to fetch and filter projects from the connected Google Sheet.
 */
export async function fetchProjectsFromSheet(): Promise<HubProject[]> {
  const config = getGoogleSheetsConfig();
  if (!config) {
    console.warn('[Google Sheets Service] Missing credentials in environment variables.');
    return [];
  }

  try {
    const sheets = createGoogleSheetsClient(config);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range: config.range,
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return [];
    }

    // Build header mapping dynamically from row 0
    const rawHeaders = rows[0] as unknown[];
    const headerMap = new Map<string, number>();

    rawHeaders.forEach((header, index) => {
      const normalized = normalizeHeader(header);
      if (normalized) {
        headerMap.set(normalized, index);
      }
    });

    const projects: HubProject[] = [];

    // Parse each content row
    for (let i = 1; i < rows.length; i++) {
      const project = mapRowToProject(rows[i] as unknown[], headerMap, i);
      if (project) {
        // Exclude Disabled projects from being displayed in the list
        if (project.status !== 'Disabled') {
          projects.push(project);
        }
      }
    }

    // Sort by Display Order ascending
    projects.sort((a, b) => a.displayOrder - b.displayOrder);

    return projects;
  } catch (error) {
    console.error('[Google Sheets Service Error]:', error);
    return [];
  }
}
