'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { HubProject } from '@/lib/projects-service';
import { ProjectCard } from './ProjectCard';
import { IframePreviewModal } from './IframePreviewModal';

export function ProjectsLaunchpad({ projects }: { projects: HubProject[] }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [preview, setPreview] = useState<HubProject | null>(null);

  const categories = useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => s.add(p.category));
    return ['All', ...Array.from(s)];
  }, [projects]);

  const filtered = useMemo(() =>
    projects.filter((p) => {
      const q = search.toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.subdomain.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchC = cat === 'All' || p.category === cat;
      return matchQ && matchC;
    }),
    [projects, search, cat]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Controls bar ── */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8"
        style={{ animation: 'fade-up 0.35s 0.08s ease-out both' }}
      >
        {/* Search */}
        <div className="relative w-full sm:w-60">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
            style={{ color: 'var(--text-4)' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applications…"
            aria-label="Search applications"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg outline-none transition-all duration-150"
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              color: 'var(--text-1)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(74,222,128,0.40)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74,222,128,0.08)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-4)' }} />
          {categories.map((c) => {
            const active = cat === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer"
                style={
                  active
                    ? {
                        background: 'var(--green-cta)',
                        color: '#fff',
                        border: '1px solid rgba(74,222,128,0.30)',
                      }
                    : {
                        background: 'var(--bg-card)',
                        color: 'var(--text-3)',
                        border: '1px solid var(--border)',
                      }
                }
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = 'rgba(74,222,128,0.25)';
                    e.currentTarget.style.color = 'var(--text-1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-3)';
                  }
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Count */}
        <span className="ml-auto text-xs hidden sm:block" style={{ color: 'var(--text-4)' }}>
          <span style={{ color: 'var(--green-bright)', fontWeight: 600 }}>{filtered.length}</span>
          {' '}of {projects.length}
        </span>
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div
          className="py-20 rounded-xl text-center max-w-sm mx-auto"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <Search className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-4)' }} />
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-1)' }}>No applications found</p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-3)' }}>Try adjusting your filters.</p>
          <button
            type="button"
            onClick={() => { setSearch(''); setCat('All'); }}
            className="px-4 py-1.5 rounded-md text-xs font-medium cursor-pointer"
            style={{
              background: 'rgba(74,222,128,0.10)',
              border: '1px solid rgba(74,222,128,0.20)',
              color: 'var(--green-bright)',
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <div key={p.id} style={{ animation: `fade-up 0.35s ${0.08 + i * 0.05}s ease-out both` }}>
              <ProjectCard project={p} onPreview={setPreview} />
            </div>
          ))}
        </div>
      )}

      <IframePreviewModal project={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
