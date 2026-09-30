'use client';

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import { Search, SlidersHorizontal, RefreshCw, Layers } from 'lucide-react';
import type { HubProject } from '@/lib/projects-service';
import { ProjectCard } from './ProjectCard';
import { IframePreviewModal } from './IframePreviewModal';

export function ProjectsLaunchpad({ initialProjects }: { initialProjects: HubProject[] }) {
  const [projects, setProjects] = useState<HubProject[]>(initialProjects);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [preview, setPreview] = useState<HubProject | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [, startTransition] = useTransition();

  // Background realtime sync without exposing sheets or interrupting UX
  const syncLiveApplications = async (manual = false) => {
    if (manual) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/projects?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.projects)) {
          startTransition(() => {
            setProjects(data.projects);
          });
        }
      }
    } catch {
      // Silent error in background
    } finally {
      if (manual) {
        setTimeout(() => setIsRefreshing(false), 300);
      }
    }
  };

  // Real-time background sync every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      syncLiveApplications(false);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const categories = useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => {
      if (p.category) s.add(p.category);
    });
    return ['All', ...Array.from(s)];
  }, [projects]);

  const filtered = useMemo(() =>
    projects.filter((p) => {
      const q = search.toLowerCase();
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.subdomain.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchC = cat === 'All' || p.category === cat;
      return matchQ && matchC;
    }),
    [projects, search, cat]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Controls bar ── */}
      <div
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8"
        style={{ animation: 'fade-up 0.35s 0.08s ease-out both' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
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
                          color: '#ffffff',
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
        </div>

        {/* Counter and manual refresh */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => syncLiveApplications(true)}
            disabled={isRefreshing}
            title="Refresh application directory"
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-4)';
            }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-green-400' : ''}`} />
          </button>

          <span className="text-xs hidden sm:block" style={{ color: 'var(--text-4)' }}>
            <span style={{ color: 'var(--green-bright)', fontWeight: 600 }}>{filtered.length}</span>
            {' '}of {projects.length}
          </span>
        </div>
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div
          className="py-20 rounded-xl text-center max-w-sm mx-auto"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <Layers className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-4)' }} />
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-1)' }}>
            No applications available
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-3)' }}>
            {projects.length === 0
              ? 'No applications are currently listed in the directory.'
              : 'Try clearing your search query or filters.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCat('All');
            }}
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
