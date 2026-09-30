export interface HubProject {
  id: string;
  name: string;
  url: string;
  subdomain: string;
  category: string;
  image: string;
  description: string;
  displayOrder: number;
  status: 'Active' | 'Inactive' | string;
}

export type SheetRowData = Record<string, unknown>;
