'use client';

import React, { useState } from 'react';
import { ExternalLink, Globe, ArrowUpRight, ShieldCheck, Clock, Ban } from 'lucide-react';
import type { HubProject } from '@/types/project';

export function ProjectCard({ project }: { project: HubProject }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasImage = Boolean(project.image && project.image.trim() !== '' && !imgFailed);

  const isActive = project.status === 'Active';
  const isDisabled = project.status === 'Disabled';
  const isComingSoon = project.status === 'Coming Soon';

  return (
    <div
      className={`group flex flex-col rounded-xl overflow-hidden app-card ${
        isDisabled ? 'opacity-65 grayscale-[35%]' : ''
      }`}
    >
      {/* ── Thumbnail / Header Banner ── */}
      <div
        className="relative aspect-[16/9] overflow-hidden shrink-0 block"
        style={{
          background: hasImage
            ? '#0e2417'
            : 'radial-gradient(circle at 50% 30%, #1c452e 0%, #0e2417 100%)',
        }}
      >
        {hasImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.name}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              loading="lazy"
              onError={() => setImgFailed(true)}
              className={`w-full h-full object-cover object-center transition-transform duration-500 ${
                isActive ? 'group-hover:scale-[1.04]' : ''
              }`}
            />
            {/* Scrim */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(12,24,16,0.10) 40%, rgba(12,24,16,0.60) 100%)',
              }}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(74, 222, 128, 0.12)',
                border: '1px solid rgba(74, 222, 128, 0.25)',
              }}
            >
              <ShieldCheck className="w-6 h-6 text-green-400" />
            </div>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-md"
              style={{ color: 'var(--text-3)' }}
            >
              {project.category}
            </span>
          </div>
        )}

        {/* Subdomain / Domain tag — top left */}
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

        {/* Status Badge — top right */}
        <span
          className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 shadow-sm"
          style={
            isActive
              ? {
                  background: 'rgba(22,163,74,0.90)',
                  color: '#ffffff',
                  backdropFilter: 'blur(6px)',
                }
              : isComingSoon
              ? {
                  background: 'rgba(202, 138, 4, 0.90)',
                  color: '#ffffff',
                  backdropFilter: 'blur(6px)',
                }
              : {
                  background: 'rgba(75, 85, 99, 0.90)',
                  color: '#e5e7eb',
                  backdropFilter: 'blur(6px)',
                }
          }
        >
          {isComingSoon && <Clock className="w-3 h-3" />}
          {isDisabled && <Ban className="w-3 h-3" />}
          {project.status}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        {/* Title */}
        <div>
          <h3
            className={`text-[15px] font-semibold leading-snug line-clamp-1 transition-colors ${
              isActive ? 'group-hover:text-green-400' : ''
            }`}
            style={{ color: 'var(--text-1)' }}
          >
            {isActive ? (
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                {project.name}
              </a>
            ) : (
              project.name
            )}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-[11px]"
              style={{ color: 'var(--text-4)', fontFamily: 'monospace' }}
            >
              {project.subdomain}
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{
                background: 'rgba(74, 222, 128, 0.08)',
                color: 'var(--text-3)',
              }}
            >
              {project.category}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-[12.5px] leading-relaxed line-clamp-2 flex-1"
          style={{ color: 'var(--text-3)' }}
        >
          {project.description}
        </p>

        {/* Action Button */}
        <div
          className="flex items-center justify-end gap-2 pt-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {isActive ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white app-btn-launch"
            >
              Launch Application
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : isComingSoon ? (
            <button
              disabled
              type="button"
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-not-allowed opacity-90"
              style={{
                background: 'rgba(202, 138, 4, 0.18)',
                border: '1px solid rgba(234, 179, 8, 0.35)',
                color: '#facc15',
              }}
            >
              <Clock className="w-3.5 h-3.5" />
              Coming Soon
            </button>
          ) : (
            <button
              disabled
              type="button"
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold cursor-not-allowed opacity-60"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-4)',
              }}
            >
              <Ban className="w-3.5 h-3.5" />
              Application Disabled
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
