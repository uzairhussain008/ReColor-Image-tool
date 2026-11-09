import React, { useState } from 'react';
import { ArrowDown, SlidersHorizontal, ShieldCheck, Zap, Download } from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/sampleImages';
import { SampleImageItem } from '../types';

interface HeroProps {
  onSelectSample: (sample: SampleImageItem) => void;
  onScrollToEditor: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectSample, onScrollToEditor }) => {
  const [sliderPos, setSliderPos] = useState(52);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <section className="relative pt-8 pb-14 sm:pt-14 sm:pb-20 border-b border-neutral-200/60 bg-gradient-to-b from-white to-neutral-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Subtitle, CTAs & Value Props */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Clean unboxed metadata with typographic separators */}
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-4">
              <span>100% Free & Private</span>
              <span aria-hidden="true">·</span>
              <span>No Sign-Up Needed</span>
              <span aria-hidden="true">·</span>
              <span>Instant Online Tool</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.1] mb-5 text-balance">
              Bring New Life to Your Images
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mb-8 leading-relaxed">
              Convert, recolor, and transform your photos in seconds. Apply studio color styles,
              change color tones, adjust brightness, or paint specific parts with an easy brush—right on
              your device.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                onClick={onScrollToEditor}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 active:scale-98 transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                <span>Start Recoloring Now</span>
                <ArrowDown className="w-4 h-4 text-sky-400 animate-bounce" />
              </button>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 hover:border-neutral-400 transition-all cursor-pointer shadow-2xs"
              >
                <span>How It Works</span>
              </a>
            </div>

            {/* Value props strip in simple, clear language */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200 w-full max-w-lg text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">100% Private (No Photos Saved)</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-medium">Instant (No Waiting)</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="font-medium">Original HD Quality</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Before/After Showcase */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-neutral-200/80 p-3 shadow-md">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden select-none bg-neutral-950">
                {/* Edited image layer (bottom) */}
                <img
                  src={SAMPLE_IMAGES[0].url}
                  alt="Recolored sample photo"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover filter contrast-110 saturate-125 sepia-[0.35] hue-rotate-15"
                />

                {/* Original image layer (clipped by slider using clipPath to preserve aspect ratio) */}
                <img
                  src={SAMPLE_IMAGES[0].url}
                  alt="Original sample photo"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                />

                <div
                  className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md pointer-events-none transition-opacity"
                  style={{ opacity: sliderPos > 15 ? 1 : 0 }}
                >
                  Original
                </div>

                <div
                  className="absolute top-3 right-3 bg-neutral-900/80 backdrop-blur-xs text-sky-400 text-[11px] font-medium px-2 py-0.5 rounded-md pointer-events-none transition-opacity"
                  style={{ opacity: sliderPos < 85 ? 1 : 0 }}
                >
                  Vintage Recolored
                </div>

                {/* Vertical Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg border border-neutral-200">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Drag range input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={handleSliderChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                  aria-label="Drag before and after comparison slider"
                />
              </div>

              {/* Sample Photo Instant Launch Strip */}
              <div className="mt-3 pt-3 border-t border-neutral-100">
                <div className="text-[11px] font-semibold text-neutral-500 mb-2 flex items-center justify-between">
                  <span>Quick Test With Sample Photos:</span>
                  <span className="text-neutral-400">Click to edit</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {SAMPLE_IMAGES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => onSelectSample(sample)}
                      className="group relative rounded-lg overflow-hidden border border-neutral-200 hover:border-neutral-900 transition-all text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                      title={`Load ${sample.title}`}
                    >
                      <div className="aspect-square w-full overflow-hidden bg-neutral-100">
                        <img
                          src={sample.url}
                          alt={sample.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <div className="p-1 text-[10px] truncate font-medium text-neutral-700 bg-white">
                        {sample.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
