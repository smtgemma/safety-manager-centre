import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-emerald-900/60 bg-[#064e3b] text-emerald-100/90 text-xs py-8 mt-auto shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-white">Safety Manager Centre</span>
          <span className="text-emerald-400">•</span>
          <span className="text-emerald-200 font-medium">Enterprise Application Launchpad</span>
        </div>
        <div className="text-emerald-300/80 text-[11px]">
          © {currentYear} Safety Manager Centre. All applications hosted on dedicated subdomains.
        </div>
      </div>
    </footer>
  );
}
