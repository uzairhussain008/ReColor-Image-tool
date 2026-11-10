import { PresetId, ImageAdjustments, RecolorSettings } from '../utils/imageProcessing';

export interface ImageDataState {
  imageElement: HTMLImageElement;
  sourceUrl: string;
  name: string;
  type: string;
  originalWidth: number;
  originalHeight: number;
  fileSizeBytes: number;
  isTransparentPng?: boolean;
}

export interface EditorSnapshot {
  preset: PresetId;
  adjustments: ImageAdjustments;
  recolor: RecolorSettings;
}

export type ViewMode = 'split' | 'side-by-side' | 'edited';

export type BrushTool = 'none' | 'brush' | 'eraser';

export interface BrushStroke {
  color: string;
  size: number;
  opacity: number;
  blendMode: 'source-over' | 'destination-out' | 'color';
  points: { x: number; y: number }[];
}

export interface SampleImageItem {
  id: string;
  title: string;
  category: string;
  url: string;
  fallbackUrl?: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  recommendedPreset: PresetId;
}
