import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'What is image recoloring?',
      answer:
        'Image recoloring is the process of altering the chromatic values, tone curves, color balance, or saturation of a digital photograph. It enables you to shift moods, harmonize color schemes, convert photographs to monochrome or vintage sepia, and apply stylized two-tone duotone effects without re-taking the shot.',
    },
    {
      question: 'How can I recolor an image online?',
      answer:
        'Simply drag and drop your image into the ReColor Image workspace above. Choose one of our 10 curated presets (such as Black & White, Vintage, or Duotone) or manually adjust Brightness, Contrast, Saturation, Temperature, and Tint. Once satisfied with the Before/After comparison, click Download to save your edited file.',
    },
    {
      question: 'Can I change the color of a specific object in a photo?',
      answer:
        'Yes, you can use our built-in Selective Recolor Brush tool to paint colors onto specific areas (like a jacket, car body, or hair). However, please note this uses manual brush strokes. Automatic semantic object segmentation (e.g. AI-powered "detect the car and turn it green") is marked as Coming Soon and is not part of this browser-based version.',
    },
    {
      question: 'Can I convert a black-and-white image into color?',
      answer:
        'You can apply color tints, duotone gradients, and manual brush coloring to monochrome images using ReColor Image. Full automated photographic colorization of old historical black-and-white photos requires heavy generative neural networks, which are not currently executed in this lightweight browser tool.',
    },
    {
      question: 'How can I convert a color image to black and white?',
      answer:
        'Select the "Black & White" preset in the presets tab. It applies a balanced luminance formula (0.299 Red + 0.587 Green + 0.114 Blue) to yield a rich photographic monochrome with deep shadows and clear highlight separation.',
    },
    {
      question: 'Can I change clothes or car colors?',
      answer:
        'Yes! For overall color changes across the whole image, use the Hue slider or Duotone palette. For selective parts like a red dress or sports car, switch to the Selective Brush tab, pick your target color swatch, and paint smoothly over the item with adjustable opacity.',
    },
    {
      question: 'Is ReColor Image free to use?',
      answer:
        'Yes, ReColor Image is 100% free with no registration, no subscriptions, no credit card required, and no watermarks added to your downloaded images.',
    },
    {
      question: 'Which image formats are supported?',
      answer:
        'ReColor Image supports all standard web image formats: JPG, JPEG, PNG (including full alpha channel transparency preservation), and modern WEBP images.',
    },
    {
      question: 'Are uploaded images stored on a server?',
      answer:
        'No. All image operations are executed exclusively on your local device using the HTML5 Canvas API in browser memory. Your images are never transmitted to our servers or stored anywhere.',
    },
    {
      question: 'Can I download images in HD resolution?',
      answer:
        'Yes. When you download your image, ReColor Image processes the original native resolution using an offscreen canvas. If you upload a 4000×3000 photo, your export will retain the exact 4000×3000 dimensions without downsampling.',
    },
    {
      question: 'Does the tool work on mobile devices?',
      answer:
        'Yes, the interface is fully responsive and supports touch dragging on the Before/After comparison slider, touch-friendly preset selection, and mobile file picker uploads on iOS and Android.',
    },
    {
      question: 'Does this tool use AI?',
      answer:
        'No. ReColor Image uses browser-native Canvas pixel algorithms, matrix transformations, and HSL color space mathematics. We do not use external AI APIs or paid cloud services, ensuring total privacy, zero latency, and free access. Natural generative AI object colorization is in research and marked as Coming Soon.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-neutral-50/70 border-b border-neutral-200 scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Everything You Need to Know
          </h2>
          <p className="text-base text-neutral-600 mt-3">
            Honest answers about image recoloring, privacy, supported formats, and our local processing engine.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-semibold text-neutral-900 hover:text-neutral-950 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-neutral-900' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
