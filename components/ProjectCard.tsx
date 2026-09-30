'use client';

import React from 'react';
import { ExternalLink, Eye, Globe, ArrowUpRight } from 'lucide-react';
import type { HubProject } from '@/lib/projects-service';

export function ProjectCard({
  project,
  onPreview,
}: {
  project: HubProject;
  onPreview: (p: HubProject) => void;
}) {
  return (
    <div className="group flex flex-col rounded-xl overflow-hidden app-card">
      {/* ── Thumbnail ── */}
      <div
        className="relative aspect-[16/9] overflow-hidden shrink-0"
        style={{ background: '#0e2417' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* Scrim */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(12,24,16,0.10) 40%, rgba(12,24,16,0.60) 100%)',
          }}
        />

        {/* Subdomain — top left */}
        <span
          className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium"
          style={{
            background: 'rgba(12,24,16,0.80)',
            border: '1px solid rgba(74,222,128,0.20)',
            color: '#a7f3c0',
            backdropFilter: 'blur(6px)',
            fontFamily: 'monospace',
          }}
        >
          <Globe className="w-2.5 h-2.5" />
          {project.subdomain}
        </span>

        {/* Category — top right */}
        <span
          className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-semibold"
          style={{
            background: 'rgba(22,163,74,0.85)',
            color: '#ffffff',
            backdropFilter: 'blur(6px)',
          }}
        >
          {project.category}
        </span>

        {/* Hover overlay */}
        <button
          type="button"
          onClick={() => onPreview(project)}
          aria-label={`Preview ${project.name}`}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
          style={{ background: 'rgba(12,24,16,0.45)' }}
        >
          <span
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white transition-transform duration-150 hover:scale-105"
            style={{
              background: 'var(--green-cta)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.40)',
              border: '1px solid rgba(74,222,128,0.30)',
            }}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </span>
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        {/* Title */}
        <div>
          <h3
            className="text-[15px] font-semibold leading-snug line-clamp-1 transition-colors group-hover:text-green-400"
            style={{ color: 'var(--text-1)' }}
          >
            {project.name}
          </h3>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 mt-0.5 text-[11px] hover:text-green-400 transition-colors"
            style={{ color: 'var(--text-4)', fontFamily: 'monospace' }}
          >
            {project.subdomain}
            <ArrowUpRight className="w-2.5 h-2.5" />
          </a>
        </div>

        {/* Description */}
        <p
          className="text-[12.5px] leading-relaxed line-clamp-2 flex-1"
          style={{ color: 'var(--text-3)' }}
        >
          {project.description}
        </p>

        {/* Actions */}
        <div
          className="flex items-center justify-between gap-2 pt-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <button
            type="button"
            onClick={() => onPreview(project)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer app-btn-preview"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold text-white app-btn-launch"
          >
            Launch App
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
