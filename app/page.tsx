import type { Metadata } from 'next';
import { getHubProjects } from '@/lib/projects-service';
import { ProjectsLaunchpad } from '@/components/ProjectsLaunchpad';
import { Footer } from '@/components/Footer';
import { ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Safety Manager Centre | Application Hub',
  description: 'Central launchpad for workplace safety, inspections, and compliance portals.',
};

export default async function HomePage() {
  const projects = await getHubProjects();

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: 'var(--bg-page)' }} suppressHydrationWarning>
      {/* ── Top green accent stripe ── */}
      <div
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #4ade80 30%, #22c55e 50%, #4ade80 70%, transparent)',
          flexShrink: 0,
        }}
      />

      {/* ── Brand Header Bar ── */}
      <div
        className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-6 relative z-10"
        style={{ animation: 'fade-up 0.35s ease-out both' }}
      >
        {/* Brand row */}
        <div className="flex items-center gap-3 mb-5">
          {/* Icon */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #15803d, #16a34a)',
              boxShadow: '0 0 0 1px rgba(74,222,128,0.25), 0 2px 8px rgba(0,0,0,0.30)',
            }}
          >
            <ShieldCheck className="w-[18px] h-[18px] text-white" />
          </div>

          {/* Company name */}
          <div>
            <p className="text-[13px] font-semibold" style={{ color: 'var(--text-3)' }}>
              Safety Manager Centre
            </p>
          </div>

          {/* Status indicator */}
          <div className="ml-auto">
            <span
              className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.18)',
                color: 'var(--green-bright)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
              All systems online
            </span>
          </div>
        </div>

        {/* Page title */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>
          Application Hub
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-3)' }}>
          Select an application below to open its dedicated portal.
        </p>
      </div>

      {/* ── Divider ── */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div style={{ height: '1px', background: 'var(--border)' }} />
      </div>

      {/* ── Grid ── */}
      <div className="flex-1 relative z-10">
        <ProjectsLaunchpad initialProjects={projects} />
      </div>

      <Footer />
    </div>
  );
}
