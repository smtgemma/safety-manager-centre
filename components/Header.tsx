import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <>
      {/* Top Emerald Accent Line */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 w-full" />

      <header className="bg-[#064e3b] text-white border-b border-emerald-900/60 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-400/40 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                Safety Manager <span className="text-emerald-300 font-extrabold">Centre</span>
              </div>
              <div className="text-[11px] font-semibold text-emerald-200/80 tracking-wider uppercase">
                Application Launchpad
              </div>
            </div>
          </div>

          {/* System Online Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-200 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>All Systems Online</span>
          </div>
        </div>
      </header>
    </>
  );
}
