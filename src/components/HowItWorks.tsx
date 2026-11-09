import React from 'react';
import { UploadCloud, Palette, Download, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload Your Image',
      description:
        'Drag and drop any JPG, JPEG, PNG, or WEBP file into the editor. Your image stays securely in browser memory without server uploads.',
      icon: <UploadCloud className="w-6 h-6 text-sky-500" />,
    },
    {
      number: '02',
      title: 'Choose Style & Adjust',
      description:
        'Select from 10 studio presets like Vintage or Duotone. Fine-tune temperature, hue, tint, or use the selective brush to colorize specific areas.',
      icon: <Palette className="w-6 h-6 text-sky-500" />,
    },
    {
      number: '03',
      title: 'Compare & Download',
      description:
        'Inspect your edits with the interactive Before/After comparison slider. Export at 100% full original resolution in PNG, JPG, or WEBP.',
      icon: <Download className="w-6 h-6 text-sky-500" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-neutral-50/70 border-b border-neutral-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Simple 3-Step Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            How to Recolor Any Photo in Seconds
          </h2>
          <p className="text-base text-neutral-600 mt-3">
            No complex layers, no confusing software suites, and no sign-up delays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl p-8 border border-neutral-200/90 shadow-2xs hover:shadow-xs transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-neutral-200 font-mono">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">{step.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{step.description}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-neutral-300 items-center justify-center text-neutral-400">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
