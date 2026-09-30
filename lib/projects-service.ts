import { fetchProjectsFromSheet } from '@/lib/google-sheets';
import { HubProject } from '@/types/project';

export type { HubProject };

/**
 * Returns latest hub projects directly from Google Sheets.
 */
export async function getHubProjects(): Promise<HubProject[]> {
  return fetchProjectsFromSheet();
}
