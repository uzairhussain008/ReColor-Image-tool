import { SampleImageItem } from '../types';

export const SAMPLE_IMAGES: SampleImageItem[] = [
  {
    id: 'sample-coat',
    title: 'Cobalt Trench Coat',
    category: 'Fashion & Street',
    url: '/samples/cobalt-trench-coat.webp',
    thumbnailUrl: '/samples/cobalt-trench-coat-thumb.webp',
    mediumUrl: '/samples/cobalt-trench-coat-md.webp',
    fallbackUrl: '/samples/cobalt-trench-coat.jpg',
    recommendedPreset: 'vintage',
  },
  {
    id: 'sample-car',
    title: 'Vintage Sports Car',
    category: 'Automotive',
    url: '/samples/vintage-sports-car.webp',
    thumbnailUrl: '/samples/vintage-sports-car-thumb.webp',
    mediumUrl: '/samples/vintage-sports-car-md.webp',
    fallbackUrl: '/samples/vintage-sports-car.jpg',
    recommendedPreset: 'cinematic',
  },
  {
    id: 'sample-fashion',
    title: 'Emerald Tailored Blazer',
    category: 'Portrait & Studio',
    url: '/samples/emerald-tailored-blazer.webp',
    thumbnailUrl: '/samples/emerald-tailored-blazer-thumb.webp',
    mediumUrl: '/samples/emerald-tailored-blazer-md.webp',
    fallbackUrl: '/samples/emerald-tailored-blazer.jpg',
    recommendedPreset: 'bw',
  },
  {
    id: 'sample-furniture',
    title: 'Mustard Lounge Armchair',
    category: 'Interior & Decor',
    url: '/samples/mustard-lounge-armchair.webp',
    thumbnailUrl: '/samples/mustard-lounge-armchair-thumb.webp',
    mediumUrl: '/samples/mustard-lounge-armchair-md.webp',
    fallbackUrl: '/samples/mustard-lounge-armchair.jpg',
    recommendedPreset: 'duotone',
  },
];
