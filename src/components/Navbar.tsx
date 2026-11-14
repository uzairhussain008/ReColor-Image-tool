import React from 'react';
import { Palette, Sparkles } from 'lucide-react';

interface NavbarProps {
  onStartClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
        {/* Zone 1: Single text element wordmark with minimal recolor logo and colorful soft gradient */}
        <a
          href="#"
          className="flex items-center gap-2 sm:gap-2.5 text-base sm:text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 group"
          aria-label="ReColor Image Home"
        >
          {/* Minimal ReColor Logo Icon */}
          <span className="w-8 h-8 rounded-xl bg-neutral-950 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform p-1.5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              aria-hidden="true"
            >
              <circle cx="9" cy="10" r="5" fill="#8B5CF6" fillOpacity="0.85" />
              <circle cx="15" cy="10" r="5" fill="#EC4899" fillOpacity="0.85" />
              <circle cx="12" cy="15" r="5" fill="#0EA5E9" fillOpacity="0.85" />
              <circle cx="12" cy="12" r="2.2" fill="#FFFFFF" fillOpacity="0.95" />
            </svg>
          </span>
          <span className="tracking-tight text-base sm:text-lg">
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 bg-clip-text text-transparent font-extrabold">
              ReColor
            </span>{' '}
            <span className="text-neutral-900 font-bold">Image</span>
          </span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-8 text-sm font-medium text-neutral-600">
          <a
            href="#editor"
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
          >
            Editor
          </a>
          <a
            href="#examples"
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
          >
            Examples
          </a>
          <a
            href="#features"
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
          >
            Features
          </a>
          <a
            href="#use-cases"
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
          >
            Use Cases
          </a>
          <a
            href="#faq"
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
          >
            FAQ
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onStartClick}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 active:scale-98 transition-all whitespace-nowrap shrink-0 shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Start Recoloring</span>
          </button>
        </div>
      </div>
    </header>
  );
};
