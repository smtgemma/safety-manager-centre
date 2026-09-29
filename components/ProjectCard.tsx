'use client';

import React from 'react';
import { ExternalLink, Eye, ArrowUpRight, Globe } from 'lucide-react';
import type { HubProject } from '@/lib/projects-service';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ProjectCardProps = {
  project: HubProject;
  onPreview: (project: HubProject) => void;
};

export function ProjectCard({ project, onPreview }: ProjectCardProps) {
  return (
    <Card className="flex flex-col justify-between overflow-hidden border-emerald-950/10 bg-white hover:border-emerald-600/70 hover:shadow-xl transition-all duration-200 group rounded-2xl">
      <div>
        {/* Project Thumbnail Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-emerald-950/5 border-b border-emerald-950/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300 ease-out"
          />

          {/* Subdomain Pill on Image */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-emerald-950/90 text-emerald-300 backdrop-blur-md border border-emerald-700/60 shadow-xs">
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>{project.subdomain}</span>
            </span>
          </div>

          {/* Category Badge on Image */}
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/95 text-emerald-900 backdrop-blur-xs border border-emerald-200/80 shadow-xs">
              {project.category}
            </span>
          </div>

          {/* Quick Preview Hover Trigger */}
          <button
            type="button"
            onClick={() => onPreview(project)}
            aria-label={`Preview ${project.name}`}
            className="absolute inset-0 bg-emerald-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-800/90 hover:bg-emerald-700 backdrop-blur-xs shadow-md border border-emerald-600/50">
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </span>
          </button>
        </div>

        {/* Card Header & Subdomain Link */}
        <CardHeader className="pt-4 pb-2 px-5">
          <CardTitle className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
            {project.name}
          </CardTitle>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-700 hover:text-emerald-900 transition-colors mt-0.5"
          >
            <span>https://{project.subdomain}</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </CardHeader>

        {/* Description */}
        <CardContent className="pb-4 px-5">
          <CardDescription className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {project.description}
          </CardDescription>
        </CardContent>
      </div>

      {/* Card Action Footer */}
      <CardFooter className="pt-3 pb-4 px-5 border-t border-emerald-950/5 flex items-center justify-between gap-2 bg-emerald-50/20">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPreview(project)}
          className="text-xs font-semibold text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100/60 border-emerald-200/80 gap-1.5 h-8.5 px-3"
        >
          <Eye className="w-3.5 h-3.5 text-emerald-700" />
          <span>Live Preview</span>
        </Button>

        <Button
          asChild
          size="sm"
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs h-8.5 px-3.5 gap-1.5 shadow-xs"
        >
          <a href={project.url} target="_blank" rel="noopener noreferrer">
            <span>Launch App</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
