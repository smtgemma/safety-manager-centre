export type HubProject = {
  id: string;
  name: string;
  subdomain: string;
  url: string;
  description: string;
  icon: 'warehouse' | 'racks' | 'incidents' | 'forklift' | 'compliance' | 'emergency';
  category: string;
};

export const HUB_PROJECTS: HubProject[] = [
  {
    id: 'warehouse-safety',
    name: 'Warehouse Safety Manager',
    subdomain: 'warehouse.safetymanagercentre.com',
    url: 'https://warehouse.safetymanagercentre.com',
    description: 'Floor safety management, shift hazards tracking, and daily PPE compliance oversight.',
    icon: 'warehouse',
    category: 'Safety Management',
  },
  {
    id: 'pallet-racks',
    name: 'Pallet Rack Inspection',
    subdomain: 'racks.safetymanagercentre.com',
    url: 'https://racks.safetymanagercentre.com',
    description: 'EN 15635 compliant racking damage logs, uprights assessment, and beam load verification.',
    icon: 'racks',
    category: 'Inspections',
  },
  {
    id: 'incident-reporter',
    name: 'Incident & Near-Miss Reporter',
    subdomain: 'incidents.safetymanagercentre.com',
    url: 'https://incidents.safetymanagercentre.com',
    description: 'Rapid incident capture, near-miss logging, and OSHA/HSE compliant corrective action workflows.',
    icon: 'incidents',
    category: 'EHS & Compliance',
  },
  {
    id: 'forklift-check',
    name: 'Forklift & Fleet Pre-Shift',
    subdomain: 'forklift.safetymanagercentre.com',
    url: 'https://forklift.safetymanagercentre.com',
    description: 'Daily pre-shift checklist for forklifts, battery diagnostics, and certified driver sign-offs.',
    icon: 'forklift',
    category: 'Operations',
  },
  {
    id: 'ehs-compliance',
    name: 'EHS Audits & Regulations',
    subdomain: 'compliance.safetymanagercentre.com',
    url: 'https://compliance.safetymanagercentre.com',
    description: 'ISO 45001 audit checklists, safety certificate renewals, and statutory compliance archive.',
    icon: 'compliance',
    category: 'Audits',
  },
  {
    id: 'emergency-fire',
    name: 'Emergency & Fire Readiness',
    subdomain: 'emergency.safetymanagercentre.com',
    url: 'https://emergency.safetymanagercentre.com',
    description: 'Fire extinguisher routine logbook, warden rosters, and emergency exit clearance checks.',
    icon: 'emergency',
    category: 'Emergency',
  },
];
