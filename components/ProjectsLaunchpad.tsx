'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Layers } from 'lucide-react';
import type { HubProject } from '@/types/project';
import { ProjectCard } from './ProjectCard';

export function ProjectsLaunchpad({ initialProjects }: { initialProjects: HubProject[] }) {
  const [projects, setProjects] = useState<HubProject[]>(initialProjects);
  const [, startTransition] = useTransition();

  // Background realtime sync
  const syncLiveApplications = async () => {
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
      // Background sync fail silently
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      syncLiveApplications();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Grid ── */}
      {projects.length === 0 ? (
        <div
          className="py-20 rounded-xl text-center max-w-sm mx-auto"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <Layers className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-4)' }} />
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-1)' }}>
            No applications available
          </p>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>
            Applications will appear here automatically once added.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <div key={p.id} style={{ animation: `fade-up 0.35s ${0.05 + i * 0.04}s ease-out both` }}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
