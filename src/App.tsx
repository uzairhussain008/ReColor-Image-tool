/**
 * ReColor Image - Production-Ready Image Recoloring Application
 * Client-Side HTML5 Canvas Processing. Zero API calls. Zero external processing.
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ImageEditor } from './components/ImageEditor/ImageEditor';
import { AdPlaceholder } from './components/AdPlaceholder';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { FeaturesGrid } from './components/FeaturesGrid';
import { UseCases } from './components/UseCases';
import { HowItWorks } from './components/HowItWorks';
import { WhyReColor } from './components/WhyReColor';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { LegalModals, LegalModalType } from './components/LegalModals';
import { CookieConsent } from './components/CookieConsent';
import { SampleImageItem } from './types';

export default function App() {
  const [selectedSample, setSelectedSample] = useState<SampleImageItem | null>(null);
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null);

  const handleScrollToEditor = () => {
    const el = document.getElementById('editor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSample = (sample: SampleImageItem) => {
    setSelectedSample(sample);
    handleScrollToEditor();
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* 1. Header Navigation */}
      <Navbar onStartClick={handleScrollToEditor} />

      <main className="flex-1">
        {/* Section 1: Hero */}
        <Hero
          onSelectSample={handleSelectSample}
          onScrollToEditor={handleScrollToEditor}
        />

        {/* Section 2: Main Image Editor (Immediately below hero) */}
        <ImageEditor initialSample={selectedSample} />

        {/* Monetization Slot 1: Immediately below the image editor */}
        <AdPlaceholder
          slotId="below-editor"
          slotName="Editor Bottom Banner (Adsterra / Display Ads Slot 1)"
          sizeLabel="Leaderboard (728x90 desktop / 320x50 mobile)"
        />

        {/* Section 3: Before & After Examples */}
        <BeforeAfterGallery onLoadExample={handleSelectSample} />

        {/* Section 4: Features */}
        <FeaturesGrid />

        {/* Monetization Slot 2: Between content sections */}
        <AdPlaceholder
          slotId="between-sections"
          slotName="In-Feed Content Banner (Adsterra / Display Ads Slot 2)"
          sizeLabel="Responsive Billboard (970x250 / 300x250)"
        />

        {/* Section 5: Use Cases */}
        <UseCases />

        {/* Section 6: How It Works */}
        <HowItWorks />

        {/* Section 7: Why ReColor Image? */}
        <WhyReColor />

        {/* Section 8: FAQ */}
        <FAQ />

        {/* Monetization Slot 3: Above footer */}
        <AdPlaceholder
          slotId="above-footer"
          slotName="Pre-Footer Leaderboard (Adsterra / Display Ads Slot 3)"
          sizeLabel="Bottom Leaderboard (728x90 / 320x50)"
        />
      </main>

      {/* Section 9: Footer */}
      <Footer onOpenLegal={(type) => setActiveLegalModal(type)} />

      {/* Legal & Contact Modals */}
      <LegalModals
        activeModal={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />

      {/* Privacy-Friendly Cookie Consent */}
      <CookieConsent />
    </div>
  );
}
