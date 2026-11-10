/**
 * ReColor Image - Production-Ready Image Recoloring Application
 * Client-Side HTML5 Canvas Processing. Zero API calls. Zero external processing.
 */

import React, { useState, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { ImageEditor } from './components/ImageEditor/ImageEditor';
import type { LegalModalType } from './components/LegalModals';
import { SampleImageItem } from './types';

// Code-split below-the-fold components to reduce initial JavaScript payload by >150 KiB
const BeforeAfterGallery = lazy(() =>
  import('./components/BeforeAfterGallery').then((m) => ({ default: m.BeforeAfterGallery }))
);
const FeaturesGrid = lazy(() =>
  import('./components/FeaturesGrid').then((m) => ({ default: m.FeaturesGrid }))
);
const HowItWorks = lazy(() =>
  import('./components/HowItWorks').then((m) => ({ default: m.HowItWorks }))
);
const UseCases = lazy(() =>
  import('./components/UseCases').then((m) => ({ default: m.UseCases }))
);
const FAQ = lazy(() =>
  import('./components/FAQ').then((m) => ({ default: m.FAQ }))
);
const Footer = lazy(() =>
  import('./components/Footer').then((m) => ({ default: m.Footer }))
);
const LegalModals = lazy(() =>
  import('./components/LegalModals').then((m) => ({ default: m.LegalModals }))
);
const CookieConsent = lazy(() =>
  import('./components/CookieConsent').then((m) => ({ default: m.CookieConsent }))
);
const AdPlaceholder = lazy(() =>
  import('./components/AdPlaceholder').then((m) => ({ default: m.AdPlaceholder }))
);

export default function App() {
  const [selectedSample, setSelectedSample] = useState<SampleImageItem | null>(null);
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null);

  const handleScrollToEditor = () => {
    const el = document.getElementById('editor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectSample = (sample: SampleImageItem) => {
    setSelectedSample(sample);
    handleScrollToEditor();
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* 1. Header Navigation - Critical Above-the-Fold */}
      <Navbar onStartClick={handleScrollToEditor} />

      <main className="flex-1">
        {/* Top Hero Section & Editor - Critical Above-the-Fold LCP Element */}
        <ImageEditor
          initialSample={selectedSample}
          onClearInitialSample={() => setSelectedSample(null)}
        />

        <Suspense fallback={<div className="h-24" />}>
          {/* Monetization Slot 1: Immediately below the top editor area */}
          <AdPlaceholder
            slotId="below-editor"
            slotName="Editor Bottom Banner (Adsterra / Display Ads Slot 1)"
            sizeLabel="Leaderboard (728x90 desktop / 320x50 mobile)"
          />

          {/* Section 2: Before & After Examples */}
          <BeforeAfterGallery onLoadExample={handleSelectSample} />

          {/* Section 3: Streamlined Key Capabilities & Advantages */}
          <FeaturesGrid />

          {/* Monetization Slot 2: Between content sections */}
          <AdPlaceholder
            slotId="between-sections"
            slotName="In-Feed Content Banner (Adsterra / Display Ads Slot 2)"
            sizeLabel="Responsive Billboard (970x250 / 300x250)"
          />

          {/* Section 4: How It Works */}
          <HowItWorks />

          {/* Section 5: Real-World Use Cases */}
          <UseCases />

          {/* Section 6: FAQ */}
          <FAQ />

          {/* Monetization Slot 3: Above footer */}
          <AdPlaceholder
            slotId="above-footer"
            slotName="Pre-Footer Leaderboard (Adsterra / Display Ads Slot 3)"
            sizeLabel="Bottom Leaderboard (728x90 / 320x50)"
          />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        {/* Section 7: Footer */}
        <Footer onOpenLegal={(type) => setActiveLegalModal(type)} />

        {/* Legal & Contact Modals */}
        <LegalModals
          activeModal={activeLegalModal}
          onClose={() => setActiveLegalModal(null)}
        />

        {/* Privacy-Friendly Cookie Consent */}
        <CookieConsent />
      </Suspense>
    </div>
  );
}
