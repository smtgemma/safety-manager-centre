'use client';

import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  RotateCw,
  X,
  Monitor,
  Tablet,
  Smartphone,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { HubProject } from '@/lib/projects-service';

type IframePreviewModalProps = {
  project: HubProject | null;
  onClose: () => void;
};

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export function IframePreviewModal({ project, onClose }: IframePreviewModalProps) {
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const getContainerWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[400px]';
      case 'tablet':
        return 'max-w-[800px]';
      case 'desktop':
      default:
        return 'max-w-6xl w-full';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
    >
      <div
        className={`flex flex-col h-[92vh] ${getContainerWidth()} bg-white rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden transition-all duration-300`}
      >
        {/* Browser Mockup Top Bar */}
        <div className="bg-slate-900 text-slate-200 px-4 py-3 flex items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          {/* Traffic Lights & Project Name */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Preview"
                className="w-3 h-3 rounded-full bg-red-500 hover:opacity-80 transition-opacity"
              />
              <span className="w-3 h-3 rounded-full bg-amber-500 opacity-60" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 opacity-60" />
            </div>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-700 text-xs font-semibold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="truncate max-w-[200px]">{project.name}</span>
            </div>
          </div>

          {/* Centered URL Address Bar */}
          <div className="flex-1 max-w-lg mx-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-xs text-slate-300">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate font-mono select-all text-[11px] sm:text-xs">
              https://{project.subdomain}
            </span>
          </div>

          {/* Viewport Controls & Actions */}
          <div className="flex items-center gap-2">
            {/* Viewport Size Switcher */}
            <div className="hidden md:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                title="Desktop View"
                className={`p-1.5 rounded-md transition-colors ${
                  viewport === 'desktop'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewport('tablet')}
                title="Tablet View"
                className={`p-1.5 rounded-md transition-colors ${
                  viewport === 'tablet'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                title="Mobile View"
                className={`p-1.5 rounded-md transition-colors ${
                  viewport === 'mobile'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Refresh Frame */}
            <button
              type="button"
              onClick={handleRefresh}
              title="Reload Frame"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* Launch In New Tab Button */}
            <Button
              asChild
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-7 px-2.5 gap-1.5"
            >
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                <span className="hidden sm:inline">Open Subdomain</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport Notice & Category Info */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Badge variant="subtle" className="text-[10px] font-mono">
              {project.category}
            </Badge>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Embedded Live Portal View
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {viewport === 'desktop' ? '100% Responsive' : viewport === 'tablet' ? '768px (iPad)' : '375px (iPhone)'}
          </div>
        </div>

        {/* Iframe Display Container */}
        <div className="relative flex-1 bg-slate-100 flex items-center justify-center overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/90 gap-3">
              <div className="w-8 h-8 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin" />
              <p className="text-xs font-semibold text-slate-700">Connecting to {project.subdomain}...</p>
            </div>
          )}

          <iframe
            key={iframeKey}
            src={project.url}
            title={project.name}
            onLoad={() => setIsLoading(false)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            className="w-full h-full border-0 bg-white"
          />

          {/* Graceful fallback banner at the bottom */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-[11px] shadow-lg backdrop-blur-xs border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Need full screen or external login?</span>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-emerald-400 hover:text-emerald-300 font-semibold"
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
