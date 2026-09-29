import type { Metadata } from 'next';
import { getHubProjects } from '@/lib/projects-service';
import { Header } from '@/components/Header';
import { ProjectsLaunchpad } from '@/components/ProjectsLaunchpad';
import { Footer } from '@/components/Footer';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Safety Manager Centre | Application Hub',
  description:
    'Central launchpad providing secure access to dedicated workplace safety, warehouse rack inspection, and EHS compliance subdomains.',
};

export default async function HomePage() {
  const projects = await getHubProjects();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#eaf4ed] via-[#f1f8f3] to-[#e6f3eb] text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      {/* Deep Forest Green Header */}
      <Header />

      {/* Compact Section Title */}
      <section className="pt-8 pb-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#063a24]">
          Safety Manager <span className="text-emerald-700">Hub</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-emerald-950/70 font-medium">
          Select an application below to launch its dedicated safety or inspection portal.
        </p>
      </section>

      {/* Directory & Iframe Engine */}
      <div className="flex-1">
        <ProjectsLaunchpad projects={projects} />
      </div>

      {/* Deep Forest Green Footer */}
      <Footer />
    </div>
  );
}
