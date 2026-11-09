import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('recolor_cookie_consent');
    if (!consent) {
      // Delay slightly so it doesn't flash on first paint
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('recolor_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('recolor_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie consent notice"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white border border-neutral-200 rounded-2xl shadow-xl p-4 sm:p-5 text-neutral-700 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
          <Cookie className="w-4 h-4 text-neutral-800" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h4 className="text-xs font-bold text-neutral-900">Privacy & Cookie Preferences</h4>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            We use essential local browser memory for image editing. Third-party advertising partners
            may use non-intrusive cookies to deliver contextual advertisements.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleAccept}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-medium cursor-pointer transition-colors"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
