'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, RotateCw, X, Monitor, Tablet, Smartphone, ShieldCheck, Lock } from 'lucide-react';
import type { HubProject } from '@/lib/projects-service';

type Viewport = 'desktop' | 'tablet' | 'mobile';

export function IframePreviewModal({
  project,
  onClose,
}: {
  project: HubProject | null;
  onClose: () => void;
}) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  useEffect(() => { if (project) setLoading(true); }, [project]);

  if (!project) return null;

  const widths: Record<Viewport, string> = {
    desktop: 'max-w-6xl w-full',
    tablet: 'max-w-[820px]',
    mobile: 'max-w-[400px]',
  };
  const labels: Record<Viewport, string> = {
    desktop: '100% width',
    tablet: '768px · iPad',
    mobile: '375px · iPhone',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
      style={{ background: 'rgba(8,14,10,0.75)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`flex flex-col h-[92vh] ${widths[viewport]} rounded-xl overflow-hidden transition-all duration-200`}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid rgba(74,222,128,0.20)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.60)',
        }}
      >
        {/* ── Browser chrome ── */}
        <div
          className="shrink-0 flex items-center gap-3 px-4 py-3"
          style={{
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={onClose} aria-label="Close" className="w-3 h-3 rounded-full cursor-pointer bg-red-500 hover:bg-red-400 transition-colors" />
            <span className="w-3 h-3 rounded-full opacity-50" style={{ background: '#fdbc40' }} />
            <span className="w-3 h-3 rounded-full opacity-50" style={{ background: '#34c749' }} />
          </div>

          {/* App name */}
          <div
            className="hidden sm:flex items-center gap-1.5 pl-3 text-xs font-semibold"
            style={{ borderLeft: '1px solid var(--border)', color: 'var(--text-2)' }}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-green-500" />
            <span className="truncate max-w-[180px]">{project.name}</span>
          </div>

          {/* URL bar */}
          <div
            className="flex-1 max-w-md mx-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px]"
            style={{
              background: 'var(--bg-page)',
              border: '1px solid var(--border)',
              color: 'var(--text-3)',
              fontFamily: 'monospace',
            }}
          >
            <Lock className="w-3 h-3 shrink-0 text-green-600" />
            <span className="truncate">https://{project.subdomain}</span>
          </div>

          {/* Viewport switcher */}
          <div
            className="hidden md:flex items-center rounded-lg p-0.5 gap-px"
            style={{ background: 'var(--bg-page)', border: '1px solid var(--border)' }}
          >
            {(['desktop', 'tablet', 'mobile'] as Viewport[]).map((v) => {
              const Icon = v === 'desktop' ? Monitor : v === 'tablet' ? Tablet : Smartphone;
              const active = viewport === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setViewport(v)}
                  title={v}
                  className="p-1.5 rounded-md transition-colors cursor-pointer"
                  style={
                    active
                      ? { background: 'var(--green-cta)', color: '#fff' }
                      : { color: 'var(--text-4)' }
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => { setLoading(true); setKey((k) => k + 1); }}
            title="Reload"
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ color: 'var(--text-4)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-4)'; }}
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Open */}
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white"
            style={{ background: 'var(--green-cta)', border: '1px solid rgba(74,222,128,0.25)' }}
          >
            <ExternalLink className="w-3 h-3" />
            Open
          </a>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors cursor-pointer ml-1"
            style={{ color: 'var(--text-4)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-4)'; }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subbar */}
        <div
          className="shrink-0 flex items-center justify-between px-4 py-1.5 text-[11px]"
          style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', color: 'var(--text-4)' }}
        >
          <span
            className="px-2 py-0.5 rounded-md font-medium"
            style={{
              background: 'rgba(74,222,128,0.10)',
              border: '1px solid rgba(74,222,128,0.20)',
              color: 'var(--green-bright)',
            }}
          >
            {project.category}
          </span>
          <span style={{ fontFamily: 'monospace' }}>{labels[viewport]}</span>
        </div>

        {/* Iframe */}
        <div className="relative flex-1 overflow-hidden" style={{ background: '#0a160d' }}>
          {loading && (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3"
              style={{ background: 'rgba(12,24,16,0.92)' }}
            >
              <div
                className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{ borderColor: 'rgba(74,222,128,0.20)', borderTopColor: 'var(--green-bright)' }}
              />
              <p className="text-xs" style={{ color: 'var(--text-3)', fontFamily: 'monospace' }}>
                Connecting to {project.subdomain}…
              </p>
            </div>
          )}

          <iframe
            key={key}
            src={project.url}
            title={project.name}
            onLoad={() => setLoading(false)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            className="w-full h-full border-0 bg-white"
          />

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none z-20">
            <div
              className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 rounded-full text-[11px] font-medium"
              style={{
                background: 'rgba(12,24,16,0.90)',
                border: '1px solid rgba(74,222,128,0.15)',
                color: 'var(--text-3)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.40)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
              Prefer full screen?
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
                style={{ color: 'var(--green-bright)' }}
              >
                Launch directly ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
