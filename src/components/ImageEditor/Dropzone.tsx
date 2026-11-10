import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { SAMPLE_IMAGES } from '../../data/sampleImages';
import { SampleImageItem } from '../../types';
import { handleImageError } from '../../utils/imageFallback';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  onSelectSample: (sample: SampleImageItem) => void;
  errorMessage?: string | null;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelect,
  onSelectSample,
  errorMessage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {errorMessage && (
        <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-sm text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Drag-and-Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-neutral-900 bg-neutral-100 scale-[1.01]'
            : 'border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50/80 bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleInputChange}
          className="hidden"
          aria-label="Upload image input"
        />

        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
            <Upload className="w-7 h-7 text-neutral-700" />
          </div>

          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            Drag and drop your image here
          </h3>
          <p className="text-sm text-neutral-500 mb-6">
            Supports JPG, PNG, and WEBP. Processed locally in high resolution inside your browser.
          </p>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>Browse from Computer</span>
          </button>
        </div>
      </div>

      {/* Instant Sample Selectors */}
      <div className="mt-8 pt-6 border-t border-neutral-200">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-neutral-700">Don't have an image ready? Try a sample:</span>
          <span className="text-neutral-500">Instant 1-click load</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="flex items-center gap-3 p-2 bg-white border border-neutral-200 rounded-xl hover:border-neutral-900 hover:shadow-xs transition-all text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            >
              <img
                src={sample.thumbnailUrl || sample.url}
                alt={sample.title}
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, sample.fallbackUrl, sample.title)}
                className="w-12 h-12 rounded-lg object-cover shrink-0 bg-neutral-100"
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-neutral-900 truncate group-hover:text-neutral-950">
                  {sample.title}
                </div>
                <div className="text-[11px] text-neutral-500 truncate">{sample.category}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
