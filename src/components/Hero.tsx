import React, { useState, useRef } from 'react';
import {
  SlidersHorizontal,
  ShieldCheck,
  Zap,
  Download,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/sampleImages';
import { SampleImageItem } from '../types';
import { handleImageError } from '../utils/imageFallback';

interface HeroProps {
  onFileSelect: (file: File) => void;
  onSelectSample: (sample: SampleImageItem) => void;
  errorMessage?: string | null;
}

export const Hero: React.FC<HeroProps> = ({
  onFileSelect,
  onSelectSample,
  errorMessage,
}) => {
  const [sliderPos, setSliderPos] = useState(52);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
    // Reset input value so selecting the same file again re-triggers onChange
    e.target.value = '';
  };

  return (
    <section className="relative pt-4 pb-8 sm:pt-10 sm:pb-16 border-b border-neutral-200/70 bg-gradient-to-b from-white via-neutral-50/50 to-neutral-100/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
          {/* Left Column: Headline & Integrated Image Upload Box */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Trust badge */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-500 mb-3">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Free & Private
              </span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>No Sign-Up Needed</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>Runs in Your Browser</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.12] mb-3 text-balance">
              Bring New Life to Your Images
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mb-6 leading-relaxed">
              Convert, recolor, and transform your photos instantly. Apply studio color styles,
              fine-tune color tones, or paint specific parts with an easy brush—100% privately on your device.
            </p>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="w-full mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Integrated Main Upload Box */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full relative border-2 border-dashed rounded-2xl p-6 sm:p-7 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-neutral-900 bg-neutral-100 scale-[1.01]'
                  : 'border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50/70 bg-white shadow-2xs'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleInputChange}
                className="hidden"
                aria-label="Upload image input"
              />

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5 text-neutral-700" />
                </div>

                <div className="text-base sm:text-lg font-bold text-neutral-900 mb-1">
                  Drag and drop your image here
                </div>
                <div className="text-xs text-neutral-500 mb-4">
                  Supports JPG, PNG, and WEBP · Up to 25MB · Processed in high resolution
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 active:scale-98 transition-all shadow-xs cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                  <span>Browse Photo from Device</span>
                </button>
              </div>
            </div>

            {/* Quick Test With Sample Photos */}
            <div className="w-full mt-4 pt-3.5 border-t border-neutral-200/70">
              <div className="text-xs font-semibold text-neutral-600 mb-2 flex items-center justify-between">
                <span>Or test immediately with a sample photo:</span>
                <span className="text-neutral-400 text-[11px]">1-click load</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SAMPLE_IMAGES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => onSelectSample(sample)}
                    className="flex items-center gap-2.5 p-2 bg-white border border-neutral-200 rounded-xl hover:border-neutral-900 hover:shadow-xs transition-all text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                    title={`Load ${sample.title}`}
                  >
                    <img
                      src={sample.thumbnailUrl || sample.url}
                      alt={sample.title}
                      width={40}
                      height={40}
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, sample.fallbackUrl, sample.title)}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 bg-neutral-100 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-neutral-800 truncate group-hover:text-neutral-950">
                        {sample.title}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">{sample.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Main Cover Color Difference Showcase */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-neutral-200/90 p-3.5 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2.5 px-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                  <span>Color Difference Preview</span>
                </div>
                <div className="text-[11px] text-neutral-500 font-medium">
                  Slide to compare tones
                </div>
              </div>

              {/* Interactive Split Comparison Card - Main LCP Element */}
              <div className="relative aspect-[16/11] rounded-xl overflow-hidden select-none bg-neutral-950 shadow-inner">
                {/* Recolored sample photo layer (vintage/warm cast) */}
                <img
                  src={SAMPLE_IMAGES[0].url}
                  srcSet={`${SAMPLE_IMAGES[0].mediumUrl || '/samples/cobalt-trench-coat-md.webp'} 600w, ${SAMPLE_IMAGES[0].url} 1376w`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 688px"
                  alt="Recolored sample preview"
                  width={688}
                  height={473}
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, SAMPLE_IMAGES[0].fallbackUrl, 'Recolored Preview')}
                  className="absolute inset-0 w-full h-full object-cover filter contrast-110 saturate-125 sepia-[0.35] hue-rotate-15"
                />

                {/* Original sample photo layer (clipped precisely by slider) */}
                <img
                  src={SAMPLE_IMAGES[0].url}
                  srcSet={`${SAMPLE_IMAGES[0].mediumUrl || '/samples/cobalt-trench-coat-md.webp'} 600w, ${SAMPLE_IMAGES[0].url} 1376w`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 688px"
                  alt="Original sample preview"
                  width={688}
                  height={473}
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, SAMPLE_IMAGES[0].fallbackUrl, 'Original Preview')}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                />

                {/* Top Labels */}
                <div
                  className="absolute top-2.5 left-2.5 bg-neutral-900/85 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md pointer-events-none transition-opacity"
                  style={{ opacity: sliderPos > 15 ? 1 : 0 }}
                >
                  Original Photo
                </div>

                <div
                  className="absolute top-2.5 right-2.5 bg-neutral-900/85 backdrop-blur-xs text-sky-400 text-[10px] font-semibold px-2 py-0.5 rounded-md pointer-events-none transition-opacity"
                  style={{ opacity: sliderPos < 85 ? 1 : 0 }}
                >
                  Recolored Tone
                </div>

                {/* Interactive Slider Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg border border-neutral-300">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-700" />
                  </div>
                </div>

                {/* Range Slider for Touch & Mouse */}
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

              {/* Action: Try This Photo in Editor */}
              <div className="mt-3.5 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectSample(SAMPLE_IMAGES[0])}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 active:scale-98 rounded-xl transition-all cursor-pointer border border-neutral-200"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  <span>Edit This Sample in Editor</span>
                </button>
              </div>

              {/* 3 Core Value Points */}
              <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-neutral-100 text-[11px] text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate font-medium">100% Private</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate font-medium">Instant Preview</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="truncate font-medium">Original HD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
