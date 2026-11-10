import React from 'react';
import {
  SlidersHorizontal,
  Sliders,
  ShieldCheck,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  const capabilities = [
    {
      icon: <SlidersHorizontal className="w-5 h-5 text-sky-500" />,
      title: '10 Studio Tone Presets',
      description:
        'One-click styles including Black & White, Warm Sunset, Cool Marine, 70s Vintage, Cinematic Teal & Orange, Pastel Dream, and Duotone with instant live preview.',
      badge: 'One-Click Styles',
    },
    {
      icon: <Sliders className="w-5 h-5 text-sky-500" />,
      title: 'Precision Tone Adjustments',
      description:
        'Fine-tune Brightness, Contrast, Saturation, Hue Rotation, Color Intensity, Temperature, and Tint with mathematical Canvas accuracy in real time.',
      badge: 'Granular Controls',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      title: '100% In-Browser Privacy',
      description:
        'Your photos never leave your device. All editing is calculated locally inside your browser memory with zero cloud uploads or tracking.',
      badge: 'Zero Cloud Uploads',
    },
    {
      icon: <Layers className="w-5 h-5 text-sky-500" />,
      title: 'Real-Time Before/After Split',
      description:
        'Inspect subtle color gradations using the responsive split divider or side-by-side mode without losing image quality or waiting for server renders.',
      badge: 'Instant Comparison',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-fuchsia-500" />,
      title: 'Selective Recolor Brush',
      description:
        'Paint specific clothes, objects, or background highlights with customizable brush size, opacity, and eraser tools for targeted color changes.',
      badge: 'Targeted Painting',
    },
    {
      icon: <Download className="w-5 h-5 text-sky-500" />,
      title: 'Original Full HD Download',
      description:
        'Download your recolored images at 100% full original resolution in PNG, JPG, or WEBP without watermarks, subscriptions, or compression artifacts.',
      badge: 'No Watermarks',
    },
  ];

  return (
    <section id="features" className="py-14 sm:py-18 bg-neutral-50/70 border-b border-neutral-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Key Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Why Choose ReColor Image?
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2.5">
            Everything you need to recolor, tone, and transform photos in seconds—fast, private, and
            free without bloated software or server wait times.
          </p>
        </div>

        {/* 6 High-Impact Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => (
            <div
              key={cap.title}
              className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs hover:border-neutral-400 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                    {cap.icon}
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                    {cap.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">{cap.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{cap.description}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
                0{idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
