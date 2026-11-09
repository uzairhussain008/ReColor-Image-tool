import React from 'react';
import { Lock, Cpu, Sparkles, UserX, Infinity as InfinityIcon, Layers } from 'lucide-react';

export const WhyReColor: React.FC = () => {
  const points = [
    {
      icon: <Lock className="w-5 h-5 text-sky-500" />,
      title: 'Photos Stay on Your Device',
      desc: 'Your photos never leave your computer or phone. They are never uploaded to our servers or saved anywhere online.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-sky-500" />,
      title: 'Instant Live Updates',
      desc: 'No waiting for servers to load or process. Every slider change and color effect updates immediately as you move it.',
    },
    {
      icon: <UserX className="w-5 h-5 text-sky-500" />,
      title: 'No Login or Email Needed',
      desc: 'No sign-up forms, no passwords to remember, and no credit card. Jump straight in and edit whenever you want.',
    },
    {
      icon: <InfinityIcon className="w-5 h-5 text-sky-500" />,
      title: 'No Watermarks Added',
      desc: 'Download clean, professional pictures ready to share or print without any unwanted logo stamps or export limits.',
    },
    {
      icon: <Layers className="w-5 h-5 text-sky-500" />,
      title: 'Original Photo Stays Safe',
      desc: 'Your original picture is always preserved untouched. You can test styles, paint colors, and reset anytime with one click.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-sky-500" />,
      title: 'Simple & Easy for Everyone',
      desc: 'No complicated Photoshop menus or confusing layers. Clean, straightforward controls anyone can use in seconds.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            The Better Way to Edit
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Why Use ReColor Image?
          </h2>
          <p className="text-base text-neutral-600 mt-3">
            Traditional photo editors demand bulky subscriptions, complicated installation, or cloud
            uploads. ReColor Image provides a streamlined, private, and instant alternative.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((p) => (
            <div
              key={p.title}
              className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/90 shadow-2xs hover:border-neutral-300 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center mb-4">
                {p.icon}
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">{p.title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
