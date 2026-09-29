'use client';

import React, { useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';

export function Header() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* 2-px top accent line */}
      <div className="top-accent-line w-full relative z-40" />

      <header
        ref={headerRef}
        className="sticky top-0 z-30 transition-all duration-300"
        style={{
          background: 'rgba(7,14,10,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(74,222,128,0.08)',
          boxShadow: '0 1px 0 0 rgba(34,197,94,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            {/* Icon box */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(21,128,61,0.4), rgba(34,197,94,0.15))',
                border: '1px solid rgba(74,222,128,0.25)',
                boxShadow: '0 0 16px rgba(34,197,94,0.12)',
              }}
            >
              <ShieldCheck className="w-[18px] h-[18px] text-green-400" />
            </div>

            {/* Text */}
            <div className="leading-none">
              <div className="text-[15px] font-bold tracking-tight text-green-50">
                Safety Manager{' '}
                <span
                  className="font-extrabold"
                  style={{
                    background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Centre
                </span>
              </div>
              <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-green-600 mt-0.5">
                Application Hub
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold"
            style={{
              background: 'rgba(21,128,61,0.12)',
              border: '1px solid rgba(74,222,128,0.18)',
              color: '#86efac',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-green" />
            All Systems Operational
          </div>
        </div>
      </header>
    </>
  );
}
