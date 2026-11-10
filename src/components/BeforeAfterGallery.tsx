import React, { useState } from 'react';
import { SlidersHorizontal, ArrowRight } from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/sampleImages';
import { SampleImageItem } from '../types';
import { handleImageError } from '../utils/imageFallback';

interface GalleryExample {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  presetStyleClass: string;
  originalLabel: string;
  editedLabel: string;
  recommendedSample: SampleImageItem;
}

interface BeforeAfterGalleryProps {
  onLoadExample: (sample: SampleImageItem) => void;
}

export const BeforeAfterGallery: React.FC<BeforeAfterGalleryProps> = ({ onLoadExample }) => {
  const [activeSliderIndex, setActiveSliderIndex] = useState<number | null>(null);
  const [sliderPositions, setSliderPositions] = useState<{ [key: string]: number }>({
    'ex-bw': 50,
    'ex-warm': 50,
    'ex-vintage': 50,
    'ex-cool': 50,
    'ex-duotone': 50,
    'ex-cinematic': 50,
  });

  const examples: GalleryExample[] = [
    {
      id: 'ex-bw',
      title: 'Studio Portrait Monochrome',
      category: 'Color to Black & White',
      description: 'Luminance-weighted grayscale maintaining highlight roll-off and skin tonal separation.',
      imageUrl: SAMPLE_IMAGES[2].url, // Fashion model
      presetStyleClass: 'grayscale contrast-110',
      originalLabel: 'Natural Color',
      editedLabel: 'B&W Tonal',
      recommendedSample: { ...SAMPLE_IMAGES[2], recommendedPreset: 'bw' },
    },
    {
      id: 'ex-warm',
      title: 'Warm Golden Hour Cast',
      category: 'Warm Photo Effect',
      description: 'Amber temperature boost with lifted red/yellow spectrum for sunset richness.',
      imageUrl: SAMPLE_IMAGES[0].url, // Cobalt coat
      presetStyleClass: 'sepia-[0.35] saturate-125 contrast-105',
      originalLabel: 'Daylight Raw',
      editedLabel: 'Golden Cast',
      recommendedSample: { ...SAMPLE_IMAGES[0], recommendedPreset: 'warm' },
    },
    {
      id: 'ex-vintage',
      title: '70s Film Nostalgia',
      category: 'Vintage Effect',
      description: 'Warm shadow tones, faded contrast, and nostalgic sepia film undertones.',
      imageUrl: SAMPLE_IMAGES[1].url, // Retro sports car
      presetStyleClass: 'sepia-[0.5] contrast-95 brightness-105 saturate-90',
      originalLabel: 'Modern Clean',
      editedLabel: '70s Film Fade',
      recommendedSample: { ...SAMPLE_IMAGES[1], recommendedPreset: 'vintage' },
    },
    {
      id: 'ex-cool',
      title: 'Cool Marine Architecture',
      category: 'Cool Color Effect',
      description: 'Clean azure and cyan temperature attenuation for modern minimalist sharpness.',
      imageUrl: SAMPLE_IMAGES[0].url,
      presetStyleClass: 'hue-rotate-15 contrast-105 brightness-95 saturate-110',
      originalLabel: 'Standard Warm',
      editedLabel: 'Cool Azure',
      recommendedSample: { ...SAMPLE_IMAGES[0], recommendedPreset: 'cool' },
    },
    {
      id: 'ex-duotone',
      title: 'Cyberpunk Duotone Gradient',
      category: 'Duotone Two-Tone',
      description: 'Shadow mapping to deep obsidian navy and highlights to electric ultraviolet.',
      imageUrl: SAMPLE_IMAGES[3].url, // Lounge armchair
      presetStyleClass: 'invert-[0.1] contrast-125 saturate-150 hue-rotate-[240deg]',
      originalLabel: 'Natural Living Room',
      editedLabel: 'Electric Duotone',
      recommendedSample: { ...SAMPLE_IMAGES[3], recommendedPreset: 'duotone' },
    },
    {
      id: 'ex-cinematic',
      title: 'Cinematic Teal & Orange',
      category: 'Cinematic Color Grade',
      description: 'Moody teal shadow split contrasting with rich amber highlights in classic Hollywood grading.',
      imageUrl: SAMPLE_IMAGES[1].url,
      presetStyleClass: 'contrast-115 saturate-130 brightness-95',
      originalLabel: 'Studio Raw',
      editedLabel: 'Teal & Orange',
      recommendedSample: { ...SAMPLE_IMAGES[1], recommendedPreset: 'cinematic' },
    },
  ];

  const handleSliderMove = (id: string, val: number) => {
    setSliderPositions((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <section id="examples" className="py-16 sm:py-20 bg-white border-b border-neutral-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-wider">
            Real Transformations
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Before & After Color Variations
          </h2>
          <p className="text-base text-neutral-600 mt-3 leading-relaxed">
            Drag the interactive dividers below to compare original source images with browser-rendered
            recolor presets.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((item) => {
            const pos = sliderPositions[item.id] ?? 50;

            return (
              <div
                key={item.id}
                className="bg-neutral-50 rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Interactive Card Slider */}
                <div className="relative aspect-[4/3] w-full overflow-hidden select-none bg-neutral-900 group">
                  {/* Edited image layer */}
                  <img
                    src={item.imageUrl}
                    alt={`${item.title} edited`}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, item.recommendedSample.fallbackUrl, `${item.title} edited`)}
                    className={`absolute inset-0 w-full h-full object-cover ${item.presetStyleClass}`}
                  />

                  {/* Original image layer (clipped by slider using clipPath to preserve natural dimensions) */}
                  <img
                    src={item.imageUrl}
                    alt={`${item.title} original`}
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, item.recommendedSample.fallbackUrl, `${item.title} original`)}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                  />
                  <div
                    className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded pointer-events-none transition-opacity"
                    style={{ opacity: pos > 15 ? 1 : 0 }}
                  >
                    {item.originalLabel}
                  </div>

                  <div
                    className="absolute top-3 right-3 bg-neutral-900/80 backdrop-blur-xs text-sky-400 text-[10px] font-semibold px-2 py-0.5 rounded pointer-events-none transition-opacity"
                    style={{ opacity: pos < 85 ? 1 : 0 }}
                  >
                    {item.editedLabel}
                  </div>

                  {/* Divider line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md pointer-events-none"
                    style={{ left: `${pos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-md">
                      <SlidersHorizontal className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Range input */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={pos}
                    onChange={(e) => handleSliderMove(item.id, Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                    aria-label={`Compare ${item.title}`}
                  />
                </div>

                {/* Card Info & Launch Button */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-neutral-500 mb-1">
                      {item.category}
                    </div>
                    <h3 className="text-base font-bold text-neutral-900 mb-1.5">{item.title}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-200/80 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500 font-medium">Live Preview</span>
                    <button
                      onClick={() => {
                        onLoadExample(item.recommendedSample);
                        const editorEl = document.getElementById('editor');
                        editorEl?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-sky-600 transition-colors cursor-pointer"
                    >
                      <span>Try in Editor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
