import React from 'react';
import {
  Sparkles,
  Sliders,
  ShieldCheck,
  Download,
  SlidersHorizontal,
  Smartphone,
  EyeOff,
  Zap,
} from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: <Sparkles className="w-5 h-5 text-sky-500" />,
      title: 'Free Browser Recoloring',
      description:
        'Zero paywalls, subscriptions, or hidden limits. Edit and recolor as many images as you need directly on your machine.',
    },
    {
      icon: <SlidersHorizontal className="w-5 h-5 text-sky-500" />,
      title: '10 Studio Tone Presets',
      description:
        'One-click access to Black & White, Warm Sunset, Cool Marine, Vintage 70s, Cinematic Teal & Orange, Pastel Dream, and Duotone.',
    },
    {
      icon: <Sliders className="w-5 h-5 text-sky-500" />,
      title: 'Granular Adjustments',
      description:
        'Fine-tune Brightness, Contrast, Saturation, Hue Rotation, Color Intensity, Temperature, and Tint with live mathematical precision.',
    },
    {
      icon: <Zap className="w-5 h-5 text-sky-500" />,
      title: 'Interactive Comparison',
      description:
        'Drag the split slider or switch to side-by-side view to inspect subtle color gradations against your pristine original file.',
    },
    {
      icon: <Download className="w-5 h-5 text-sky-500" />,
      title: 'Original HD Download',
      description:
        'Keep your photos in full crisp resolution. Download in clean PNG, JPG, or WEBP without any watermarks.',
    },
    {
      icon: <EyeOff className="w-5 h-5 text-sky-500" />,
      title: 'No Account or Sign-Up',
      description:
        'No email required, no passwords to create, and no credit card. Jump straight to editing in five seconds.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-sky-500" />,
      title: 'Photos Never Leave Your Device',
      description:
        'Your photos are not uploaded to any external server or cloud. Everything is edited 100% privately right on your phone or laptop.',
    },
    {
      icon: <Smartphone className="w-5 h-5 text-sky-500" />,
      title: 'Touch & Mobile Friendly',
      description:
        'Fully responsive interface engineered for desktop mice and mobile touch gestures with responsive touch slider tracking.',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-20 bg-neutral-50/70 border-b border-neutral-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Key Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Engineered for Fast, Reliable Color Transformations
          </h2>
          <p className="text-base text-neutral-600 mt-3">
            Every tool in ReColor Image is designed to provide immediate, reversible visual results
            without bloated software or external processing latency.
          </p>
        </div>

        {/* Asymmetric / Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div
              key={feat.title}
              className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs hover:border-neutral-400 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">{feat.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{feat.description}</p>
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
