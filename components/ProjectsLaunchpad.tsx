'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { HubProject } from '@/lib/projects-service';
import { ProjectCard } from './ProjectCard';
import { IframePreviewModal } from './IframePreviewModal';

type ProjectsLaunchpadProps = {
  projects: HubProject[];
};

export function ProjectsLaunchpad({ projects }: ProjectsLaunchpadProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewProject, setPreviewProject] = useState<HubProject | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.subdomain.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Search & Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-800">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search safety applications..."
            aria-label="Search applications"
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm bg-white/95 border border-emerald-900/15 text-emerald-950 placeholder-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#064e3b] text-white shadow-xs'
                  : 'bg-white/90 text-emerald-950 border border-emerald-900/15 hover:bg-emerald-100/70 hover:border-emerald-900/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Applications */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-emerald-900/15 bg-white/90 max-w-md mx-auto shadow-2xs">
          <h3 className="text-sm font-bold text-emerald-950">No applications found</h3>
          <p className="mt-1 text-xs text-emerald-900/70">
            No application matches your current search or category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-3 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 transition-colors cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onPreview={(p) => setPreviewProject(p)}
            />
          ))}
        </div>
      )}

      {/* Live Iframe Preview Modal */}
      <IframePreviewModal
        project={previewProject}
        onClose={() => setPreviewProject(null)}
      />
    </div>
  );
}
