import React from 'react';
import { Shirt, Car, Package, Armchair, Sparkles, Image as ImageIcon, Camera, Share2 } from 'lucide-react';

export const UseCases: React.FC = () => {
  const cases = [
    {
      icon: <Shirt className="w-5 h-5 text-sky-500" />,
      title: 'Clothing & Fashion Apparel',
      desc: 'Simulate color variations for blazers, coats, dresses, and fabric samples before ordering production dyes or listing variant catalog swatches.',
      badge: 'Variant Simulation',
    },
    {
      icon: <Car className="w-5 h-5 text-sky-500" />,
      title: 'Car & Automotive Photography',
      desc: 'Enhance automotive exterior finishes, intensify reflections, or test duotone graphics for automotive styling and marketing showcases.',
      badge: 'Automotive Styling',
    },
    {
      icon: <Package className="w-5 h-5 text-sky-500" />,
      title: 'E-Commerce Product Photos',
      desc: 'Standardize catalog lighting, eliminate unwanted green or yellow ambient color casts, and produce consistent white-balanced product galleries.',
      badge: 'Catalog Consistency',
    },
    {
      icon: <Armchair className="w-5 h-5 text-sky-500" />,
      title: 'Furniture & Interior Decor',
      desc: 'Visualize architectural furniture in alternate palettes, harmonizing wood tones and textile accents with room lighting environments.',
      badge: 'Interior Staging',
    },
    {
      icon: <Camera className="w-5 h-5 text-sky-500" />,
      title: 'Archival & Vintage Restoration',
      desc: 'Convert faded color prints into deep historical monochrome, or apply warm sepia washes to evoke turn-of-the-century heritage photo collections.',
      badge: 'Historical Archiving',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-sky-500" />,
      title: 'Hair & Beauty Toning',
      desc: 'Explore subtle warm or cool undertones in portraits, adjust overall skin warmth, or selectively paint highlight tints with the brush tool.',
      badge: 'Studio Portraits',
    },
    {
      icon: <Share2 className="w-5 h-5 text-sky-500" />,
      title: 'Social Media & Graphic Posters',
      desc: 'Create eye-catching duotone album covers, promotional social flyers, and vibrant Instagram thumbnails that stand out in crowded feeds.',
      badge: 'Brand Creative',
    },
    {
      icon: <ImageIcon className="w-5 h-5 text-sky-500" />,
      title: 'Footwear & Accessories',
      desc: 'Preview leather tones, sneaker soles, and handbag materials in alternate colorways without shooting separate photo sessions.',
      badge: 'Accessories Staging',
    },
  ];

  return (
    <section id="use-cases" className="py-16 sm:py-20 bg-white border-b border-neutral-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Real-World Applications
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Built for Creatives, Sellers & Photographers
          </h2>
          <p className="text-base text-neutral-600 mt-3">
            Whether preparing retail product variants or stylizing editorial photography, ReColor
            Image delivers instant color adjustments without specialized desktop software.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((item) => (
            <div
              key={item.title}
              className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/90 shadow-2xs hover:border-neutral-400 hover:bg-neutral-50/90 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  {item.badge}
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Clear Distinction Callout: General Color Tuning vs Selective Object Recognition */}
        <div className="mt-12 p-5 sm:p-6 rounded-2xl bg-sky-50/60 border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-neutral-900">
              Tip: Changing Overall Colors vs. Specific Items
            </h4>
            <p className="text-xs text-neutral-600 mt-1 max-w-3xl">
              ReColor Image transforms the colors, shades, and moods across your photo instantly. If you
              want to recolor only one specific item (such as painting a jacket or car body a different
              color), click the &quot;Selective Brush&quot; tab above to paint it directly.
            </p>
          </div>
          <a
            href="#editor"
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Try Selective Brush
          </a>
        </div>
      </div>
    </section>
  );
};
