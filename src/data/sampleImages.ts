import { SampleImageItem } from '../types';
import sampleCoat from '../assets/images/hero_sample_photo_1794224583683.jpg';
import sampleCar from '../assets/images/sample_retro_car_1794224584123.jpg';
import sampleFashion from '../assets/images/sample_fashion_model_1794224584790.jpg';
import sampleFurniture from '../assets/images/sample_interior_furniture_1794224585198.jpg';

export const SAMPLE_IMAGES: SampleImageItem[] = [
  {
    id: 'sample-coat',
    title: 'Cobalt Trench Coat',
    category: 'Fashion & Street',
    url: sampleCoat,
    fallbackUrl: '/samples/cobalt-trench-coat.jpg',
    recommendedPreset: 'vintage',
  },
  {
    id: 'sample-car',
    title: 'Vintage Sports Car',
    category: 'Automotive',
    url: sampleCar,
    fallbackUrl: '/samples/vintage-sports-car.jpg',
    recommendedPreset: 'cinematic',
  },
  {
    id: 'sample-fashion',
    title: 'Emerald Tailored Blazer',
    category: 'Portrait & Studio',
    url: sampleFashion,
    fallbackUrl: '/samples/emerald-tailored-blazer.jpg',
    recommendedPreset: 'bw',
  },
  {
    id: 'sample-furniture',
    title: 'Mustard Lounge Armchair',
    category: 'Interior & Decor',
    url: sampleFurniture,
    fallbackUrl: '/samples/mustard-lounge-armchair.jpg',
    recommendedPreset: 'duotone',
  },
];
