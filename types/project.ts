export type ProjectStatus = 'Active' | 'Disabled' | 'Coming Soon';

export interface HubProject {
  id: string;
  name: string;
  url: string;
  subdomain: string;
  category: string;
  image: string;
  description: string;
  displayOrder: number;
  status: ProjectStatus;
}

export type SheetRowData = Record<string, unknown>;
