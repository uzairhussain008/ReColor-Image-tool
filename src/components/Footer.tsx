import React from 'react';
import { Palette, Shield, Heart } from 'lucide-react';
import { LegalModalType } from './LegalModals';

interface FooterProps {
  onOpenLegal: (type: LegalModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="bg-white border-t border-neutral-200 pt-12 pb-8 text-neutral-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-neutral-200">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-neutral-950 flex items-center justify-center p-1.5 shadow-2xs">
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
              <span className="text-base tracking-tight">
                <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 bg-clip-text text-transparent font-extrabold">
                  ReColor
                </span>{' '}
                <span className="text-neutral-900 font-bold">Image</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
              Fast, free, and privacy-first online image recoloring and color adjustment utility.
              Converts color to black & white, duotone, vintage, and custom color washes right on your
              device.
            </p>
            <div className="flex items-center gap-2 text-neutral-500 text-[11px] pt-1 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% Private · Your photos never leave your device</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
              Navigation
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a href="#editor" className="hover:text-neutral-900 transition-colors">
                  Image Editor
                </a>
              </li>
              <li>
                <a href="#examples" className="hover:text-neutral-900 transition-colors">
                  Before & After Examples
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-neutral-900 transition-colors">
                  Product Features
                </a>
              </li>
              <li>
                <a href="#use-cases" className="hover:text-neutral-900 transition-colors">
                  Industry Use Cases
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-neutral-900 transition-colors">
                  FAQ & Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
              Privacy & Legal
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('contact')}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} ReColor Image. All rights reserved. Built with modern HTML5 Canvas.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted for high performance & privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
