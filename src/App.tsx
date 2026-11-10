/**
 * ReColor Image - Production-Ready Image Recoloring Application
 * Client-Side HTML5 Canvas Processing. Zero API calls. Zero external processing.
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ImageEditor } from './components/ImageEditor/ImageEditor';
import { AdPlaceholder } from './components/AdPlaceholder';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { FeaturesGrid } from './components/FeaturesGrid';
import { UseCases } from './components/UseCases';
import { HowItWorks } from './components/HowItWorks';
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
      {/* 1. Header Navigation */}
      <Navbar onStartClick={handleScrollToEditor} />

      <main className="flex-1">
        {/* Top Hero Section: Main Cover with Integrated Image Upload Box & Color Difference Showcase / Active Editor */}
        <ImageEditor
          initialSample={selectedSample}
          onClearInitialSample={() => setSelectedSample(null)}
        />

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
      </main>

      {/* Section 7: Footer */}
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
