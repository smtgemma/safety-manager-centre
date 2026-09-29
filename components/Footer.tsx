import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="mt-auto py-5 px-4 sm:px-6 lg:px-8 relative z-10"
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>
            Safety Manager Centre
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--text-4)' }}>
          © {year} · Enterprise Application Hub
        </span>
      </div>
    </footer>
  );
}
