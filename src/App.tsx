/**
 * ReColor Image - Production-Ready Image Recoloring Application
 * Client-Side HTML5 Canvas Processing. Zero API calls. Zero external processing.
 */

import React, { useState, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { ImageEditor } from './components/ImageEditor/ImageEditor';
import { DeferredSection } from './components/DeferredSection';
import type { LegalModalType } from './components/LegalModals';
import { SampleImageItem } from './types';

// Code-split below-the-fold components
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

        {/* Deferred Sections: Loaded on viewport intersection to dramatically improve mobile Speed Index */}
        <DeferredSection fallback={<div className="h-24" />}>
          <Suspense fallback={<div className="h-24" />}>
            <AdPlaceholder
              slotId="below-editor"
              slotName="Editor Bottom Banner (Adsterra / Display Ads Slot 1)"
              sizeLabel="Leaderboard (728x90 desktop / 320x50 mobile)"
            />
          </Suspense>
        </DeferredSection>

        <DeferredSection sectionId="examples" fallback={<div className="h-96" />}>
          <Suspense fallback={<div className="h-96" />}>
            <BeforeAfterGallery onLoadExample={handleSelectSample} />
          </Suspense>
        </DeferredSection>

        <DeferredSection sectionId="features" fallback={<div className="h-80" />}>
          <Suspense fallback={<div className="h-80" />}>
            <FeaturesGrid />
          </Suspense>
        </DeferredSection>

        <DeferredSection fallback={<div className="h-32" />}>
          <Suspense fallback={<div className="h-32" />}>
            <AdPlaceholder
              slotId="between-sections"
              slotName="In-Feed Content Banner (Adsterra / Display Ads Slot 2)"
              sizeLabel="Responsive Billboard (970x250 / 300x250)"
            />
          </Suspense>
        </DeferredSection>

        <DeferredSection sectionId="how-it-works" fallback={<div className="h-80" />}>
          <Suspense fallback={<div className="h-80" />}>
            <HowItWorks />
          </Suspense>
        </DeferredSection>

        <DeferredSection sectionId="use-cases" fallback={<div className="h-96" />}>
          <Suspense fallback={<div className="h-96" />}>
            <UseCases />
          </Suspense>
        </DeferredSection>

        <DeferredSection sectionId="faq" fallback={<div className="h-80" />}>
          <Suspense fallback={<div className="h-80" />}>
            <FAQ />
          </Suspense>
        </DeferredSection>

        <DeferredSection fallback={<div className="h-24" />}>
          <Suspense fallback={<div className="h-24" />}>
            <AdPlaceholder
              slotId="above-footer"
              slotName="Pre-Footer Leaderboard (Adsterra / Display Ads Slot 3)"
              sizeLabel="Bottom Leaderboard (728x90 / 320x50)"
            />
          </Suspense>
        </DeferredSection>
      </main>

      <DeferredSection fallback={<div className="h-64" />}>
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
      </DeferredSection>
    </div>
  );
}
