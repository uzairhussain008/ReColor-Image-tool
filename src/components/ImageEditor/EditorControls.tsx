import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  Palette,
  Paintbrush,
  Download,
  RotateCcw,
  Check,
  Undo2,
  Redo2,
  Eraser,
  HelpCircle,
} from 'lucide-react';
import {
  PRESETS,
  PresetId,
  ImageAdjustments,
  RecolorSettings,
  BlendMode,
  DEFAULT_ADJUSTMENTS,
  DEFAULT_RECOLOR,
} from '../../utils/imageProcessing';
import { BrushTool } from '../../types';

interface EditorControlsProps {
  currentPreset: PresetId;
  onPresetSelect: (preset: PresetId) => void;
  adjustments: ImageAdjustments;
  onAdjustmentChange: (key: keyof ImageAdjustments, value: number) => void;
  onResetAdjustment: (key: keyof ImageAdjustments) => void;
  onResetAllAdjustments: () => void;
  recolor: RecolorSettings;
  onRecolorChange: (recolor: Partial<RecolorSettings>) => void;
  onResetRecolor: () => void;
  brushTool: BrushTool;
  onBrushToolChange: (tool: BrushTool) => void;
  brushColor: string;
  onBrushColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  brushOpacity: number;
  onBrushOpacityChange: (opacity: number) => void;
  onUndoBrush: () => void;
  onRedoBrush: () => void;
  canUndoBrush: boolean;
  canRedoBrush: boolean;
  onClearBrush: () => void;
  onDownload: (format: 'png' | 'jpeg' | 'webp', quality: number) => void;
  onResetAll: () => void;
  onUploadNew: () => void;
  originalWidth: number;
  originalHeight: number;
}

type TabKey = 'presets' | 'adjust' | 'recolor' | 'brush' | 'export';

const CURATED_PALETTE = [
  '#2563eb', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#64748b', // Slate
];

const DUOTONE_PALETTES = [
  { name: 'Teal & Orange', shadow: '#042f2e', highlight: '#fb923c' },
  { name: 'Cyberpunk', shadow: '#1e1b4b', highlight: '#f43f5e' },
  { name: 'Amber & Navy', shadow: '#0f172a', highlight: '#fbbf24' },
  { name: 'Emerald & Gold', shadow: '#064e3b', highlight: '#fef08a' },
  { name: 'Violet & Rose', shadow: '#3b0764', highlight: '#f472b6' },
  { name: 'Monochrome Luxe', shadow: '#18181b', highlight: '#e4e4e7' },
];

export const EditorControls: React.FC<EditorControlsProps> = ({
  currentPreset,
  onPresetSelect,
  adjustments,
  onAdjustmentChange,
  onResetAdjustment,
  onResetAllAdjustments,
  recolor,
  onRecolorChange,
  onResetRecolor,
  brushTool,
  onBrushToolChange,
  brushColor,
  onBrushColorChange,
  brushSize,
  onBrushSizeChange,
  brushOpacity,
  onBrushOpacityChange,
  onUndoBrush,
  onRedoBrush,
  canUndoBrush,
  canRedoBrush,
  onClearBrush,
  onDownload,
  onResetAll,
  onUploadNew,
  originalWidth,
  originalHeight,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('presets');
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [exportQuality, setExportQuality] = useState<number>(0.92);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'presets', label: 'Presets', icon: <Sparkles className="w-4 h-4 text-sky-500" /> },
    { key: 'adjust', label: 'Adjust', icon: <Sliders className="w-4 h-4 text-sky-500" /> },
    { key: 'recolor', label: 'Recolor & Duotone', icon: <Palette className="w-4 h-4 text-sky-500" /> },
    { key: 'brush', label: 'Selective Brush', icon: <Paintbrush className="w-4 h-4 text-sky-500" /> },
    { key: 'export', label: 'Export', icon: <Download className="w-4 h-4 text-sky-500" /> },
  ];

  const adjustmentSliders: {
    key: keyof ImageAdjustments;
    label: string;
    min: number;
    max: number;
    step: number;
    defaultVal: number;
    unit: string;
  }[] = [
    { key: 'brightness', label: 'Brightness', min: -100, max: 100, step: 1, defaultVal: 0, unit: '' },
    { key: 'contrast', label: 'Contrast', min: -100, max: 100, step: 1, defaultVal: 0, unit: '' },
    { key: 'saturation', label: 'Saturation', min: -100, max: 100, step: 1, defaultVal: 0, unit: '' },
    { key: 'hue', label: 'Hue Rotate', min: -180, max: 180, step: 1, defaultVal: 0, unit: '°' },
    { key: 'intensity', label: 'Color Intensity', min: 0, max: 200, step: 1, defaultVal: 100, unit: '%' },
    { key: 'temperature', label: 'Temperature (Warm/Cool)', min: -100, max: 100, step: 1, defaultVal: 0, unit: '' },
    { key: 'tint', label: 'Tint (Green/Magenta)', min: -100, max: 100, step: 1, defaultVal: 0, unit: '' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-md flex flex-col h-full overflow-hidden">
      {/* Top Segmented Navigation Tabs */}
      <div className="border-b border-neutral-200 bg-neutral-50/70 p-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/80'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content Panels */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto max-h-[580px]">
        {/* TAB 1: PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="font-semibold text-neutral-900">10 Studio Color Styles</span>
              <span>Original is always safe</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {PRESETS.map((preset) => {
                const isActive = currentPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onPresetSelect(preset.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative group ${
                      isActive
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-white hover:border-neutral-400 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: preset.previewColor }}
                        />
                        <span className="font-semibold text-xs tracking-tight">{preset.name}</span>
                      </div>
                      {isActive && <Check className="w-3.5 h-3.5 text-sky-400" />}
                    </div>
                    <p
                      className={`text-[11px] leading-tight line-clamp-2 ${
                        isActive ? 'text-neutral-300' : 'text-neutral-500'
                      }`}
                    >
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ADJUSTMENTS */}
        {activeTab === 'adjust' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-900">Fine Color Controls</span>
              <button
                onClick={onResetAllAdjustments}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>

            <div className="space-y-4">
              {adjustmentSliders.map((slider) => {
                const val = adjustments[slider.key];
                const isModified = val !== slider.defaultVal;

                return (
                  <div key={slider.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-medium text-neutral-700 flex items-center gap-1.5">
                        <span>{slider.label}</span>
                        {isModified && (
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                        )}
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-neutral-900 font-semibold text-[11px] min-w-[36px] text-right">
                          {val > 0 ? `+${val}` : val}
                          {slider.unit}
                        </span>
                        {isModified && (
                          <button
                            onClick={() => onResetAdjustment(slider.key)}
                            className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                            title={`Reset ${slider.label}`}
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <input
                      type="range"
                      min={slider.min}
                      max={slider.max}
                      step={slider.step}
                      value={val}
                      onChange={(e) => onAdjustmentChange(slider.key, Number(e.target.value))}
                      className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: RECOLOR & DUOTONE */}
        {activeTab === 'recolor' && (
          <div className="space-y-6">
            {/* Section A: Overall Color Wash / Tint */}
            <div className="space-y-3 pb-5 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Color Tint & Wash</h4>
                  <p className="text-[11px] text-neutral-500">
                    Apply overall chromatic wash with blend modes
                  </p>
                </div>
                {recolor.tintOpacity > 0 && (
                  <button
                    onClick={() => onRecolorChange({ tintOpacity: 0 })}
                    className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
                  >
                    Clear Tint
                  </button>
                )}
              </div>

              {/* Tint Color Swatches + Picker */}
              <div className="flex items-center gap-2 flex-wrap">
                {CURATED_PALETTE.map((c) => (
                  <button
                    key={c}
                    onClick={() => onRecolorChange({ tintColor: c, tintOpacity: Math.max(30, recolor.tintOpacity) })}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                      recolor.tintColor === c && recolor.tintOpacity > 0
                        ? 'ring-2 ring-neutral-900 ring-offset-2 scale-110'
                        : 'border-neutral-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input
                  type="color"
                  value={recolor.tintColor}
                  onChange={(e) =>
                    onRecolorChange({ tintColor: e.target.value, tintOpacity: Math.max(30, recolor.tintOpacity) })
                  }
                  className="w-7 h-7 rounded-lg border border-neutral-300 p-0.5 cursor-pointer"
                  title="Custom Tint Color"
                />
              </div>

              {/* Tint Opacity */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>Tint Strength</span>
                  <span className="font-mono font-semibold">{recolor.tintOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={recolor.tintOpacity}
                  onChange={(e) => onRecolorChange({ tintOpacity: Number(e.target.value) })}
                  className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
                />
              </div>

              {/* Blend Mode */}
              <div className="space-y-1">
                <label className="text-xs text-neutral-600">Blend Mode</label>
                <select
                  value={recolor.tintBlendMode}
                  onChange={(e) => onRecolorChange({ tintBlendMode: e.target.value as BlendMode })}
                  className="w-full text-xs font-medium bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-neutral-900"
                >
                  <option value="color">Color (Preserves Luminance)</option>
                  <option value="overlay">Overlay (High Contrast Pop)</option>
                  <option value="multiply">Multiply (Rich Deep Darks)</option>
                  <option value="screen">Screen (Luminous Brights)</option>
                  <option value="soft-light">Soft Light (Subtle Ambient Wash)</option>
                </select>
              </div>
            </div>

            {/* Section B: Duotone Generator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Duotone Palette Mapping</h4>
                  <p className="text-[11px] text-neutral-500">
                    Dual gradient mapping for shadows and highlights
                  </p>
                </div>
                <button
                  onClick={() => onPresetSelect('duotone')}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700"
                >
                  Apply Duotone
                </button>
              </div>

              {/* Quick Duotone Presets */}
              <div className="grid grid-cols-2 gap-2">
                {DUOTONE_PALETTES.map((pal) => (
                  <button
                    key={pal.name}
                    onClick={() => {
                      onRecolorChange({
                        duotoneShadow: pal.shadow,
                        duotoneHighlight: pal.highlight,
                        duotoneIntensity: 100,
                      });
                      onPresetSelect('duotone');
                    }}
                    className="flex items-center gap-2 p-2 border border-neutral-200 rounded-lg hover:border-neutral-900 text-left transition-colors cursor-pointer bg-neutral-50/50"
                  >
                    <div className="flex items-center shrink-0 -space-x-1">
                      <span
                        className="w-4 h-4 rounded-full border border-white"
                        style={{ backgroundColor: pal.shadow }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white"
                        style={{ backgroundColor: pal.highlight }}
                      />
                    </div>
                    <span className="text-xs font-medium text-neutral-800 truncate">{pal.name}</span>
                  </button>
                ))}
              </div>

              {/* Custom Duotone Pickers */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-600 flex items-center justify-between">
                    <span>Shadow Tone</span>
                    <span className="font-mono text-neutral-500">{recolor.duotoneShadow}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={recolor.duotoneShadow}
                      onChange={(e) => {
                        onRecolorChange({ duotoneShadow: e.target.value });
                        onPresetSelect('duotone');
                      }}
                      className="w-8 h-8 rounded-lg border border-neutral-300 p-0.5 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-neutral-700">Darks</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-neutral-600 flex items-center justify-between">
                    <span>Highlight Tone</span>
                    <span className="font-mono text-neutral-500">{recolor.duotoneHighlight}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={recolor.duotoneHighlight}
                      onChange={(e) => {
                        onRecolorChange({ duotoneHighlight: e.target.value });
                        onPresetSelect('duotone');
                      }}
                      className="w-8 h-8 rounded-lg border border-neutral-300 p-0.5 cursor-pointer"
                    />
                    <span className="text-xs font-medium text-neutral-700">Lights</span>
                  </div>
                </div>
              </div>

              {/* Duotone Intensity / Blend Strength Slider */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>Duotone Blend Strength</span>
                  <span className="font-mono font-semibold">{recolor.duotoneIntensity ?? 100}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={recolor.duotoneIntensity ?? 100}
                  onChange={(e) => {
                    onRecolorChange({ duotoneIntensity: Number(e.target.value) });
                    onPresetSelect('duotone');
                  }}
                  className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SELECTIVE BRUSH */}
        {activeTab === 'brush' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-neutral-900">Selective Recolor Brush</h4>
                <p className="text-[11px] text-neutral-500">
                  Paint directly onto parts of the image to recolor manually
                </p>
              </div>
            </div>

            {/* Brush Mode Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onBrushToolChange('none')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors ${
                  brushTool === 'none'
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                Off (Pan)
              </button>
              <button
                onClick={() => onBrushToolChange('brush')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                  brushTool === 'brush'
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <Paintbrush className="w-3.5 h-3.5" />
                <span>Brush</span>
              </button>
              <button
                onClick={() => onBrushToolChange('eraser')}
                className={`py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                  brushTool === 'eraser'
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Eraser</span>
              </button>
            </div>

            {/* Color Swatches */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-700">Brush Color</label>
              <div className="flex items-center gap-2 flex-wrap">
                {CURATED_PALETTE.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onBrushColorChange(c);
                      onBrushToolChange('brush');
                    }}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                      brushColor === c && brushTool === 'brush'
                        ? 'ring-2 ring-neutral-900 ring-offset-2 scale-110'
                        : 'border-neutral-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => {
                    onBrushColorChange(e.target.value);
                    onBrushToolChange('brush');
                  }}
                  className="w-7 h-7 rounded-lg border border-neutral-300 p-0.5 cursor-pointer"
                  title="Pick Any Color"
                />
              </div>
            </div>

            {/* Brush Size */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-neutral-700">
                <span>Brush Size</span>
                <span className="font-mono font-semibold">{brushSize}px</span>
              </div>
              <input
                type="range"
                min="4"
                max="120"
                value={brushSize}
                onChange={(e) => onBrushSizeChange(Number(e.target.value))}
                className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
              />
            </div>

            {/* Brush Opacity */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-neutral-700">
                <span>Brush Opacity</span>
                <span className="font-mono font-semibold">{brushOpacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={brushOpacity}
                onChange={(e) => onBrushOpacityChange(Number(e.target.value))}
                className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
              />
            </div>

            {/* Brush Undo / Redo / Clear actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
              <button
                onClick={onUndoBrush}
                disabled={!canUndoBrush}
                className="flex-1 py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 rounded-lg text-xs font-medium flex items-center justify-center gap-1 text-neutral-700 cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo Stroke</span>
              </button>
              <button
                onClick={onRedoBrush}
                disabled={!canRedoBrush}
                className="flex-1 py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 rounded-lg text-xs font-medium flex items-center justify-center gap-1 text-neutral-700 cursor-pointer"
              >
                <Redo2 className="w-3.5 h-3.5" />
                <span>Redo</span>
              </button>
              <button
                onClick={onClearBrush}
                className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: EXPORT & DOWNLOAD */}
        {activeTab === 'export' && (
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold text-neutral-900">Export & Download Image</h4>
              <p className="text-[11px] text-neutral-500">
                Processed at 100% original dimensions with zero watermark
              </p>
            </div>

            {/* Format Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-700">File Format</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setExportFormat('png')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                    exportFormat === 'png'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  PNG
                  <span className="block text-[10px] font-normal opacity-80">Lossless</span>
                </button>
                <button
                  onClick={() => setExportFormat('jpeg')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                    exportFormat === 'jpeg'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  JPG
                  <span className="block text-[10px] font-normal opacity-80">Standard</span>
                </button>
                <button
                  onClick={() => setExportFormat('webp')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                    exportFormat === 'webp'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  WEBP
                  <span className="block text-[10px] font-normal opacity-80">Modern Web</span>
                </button>
              </div>
            </div>

            {/* Quality Slider for JPEG / WEBP */}
            {exportFormat !== 'png' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-neutral-700">
                  <span>Image Quality</span>
                  <span className="font-mono font-semibold">
                    {Math.round(exportQuality * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.0"
                  step="0.05"
                  value={exportQuality}
                  onChange={(e) => setExportQuality(Number(e.target.value))}
                  className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
                />
              </div>
            )}

            {/* Resolution info card in simple terms */}
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Original Quality:</span>
                <span className="font-mono font-semibold text-neutral-900">
                  {originalWidth} × {originalHeight} px
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Watermark:</span>
                <span className="font-semibold text-emerald-600">None (100% Clean)</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Privacy:</span>
                <span className="text-neutral-700">100% Private (No upload)</span>
              </div>
            </div>

            {/* Primary Download Button in Export Tab */}
            <button
              onClick={() => onDownload(exportFormat, exportQuality)}
              className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-sky-600 hover:opacity-95 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Download High Quality {exportFormat.toUpperCase()}</span>
            </button>
          </div>
        )}
      </div>

      {/* Permanent, Always-Visible Quick Export Bar (Available Across ALL Tabs) */}
      <div className="p-3 bg-white border-t border-neutral-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDownload(exportFormat, exportQuality)}
            className="flex-1 py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            title={`Download ${exportFormat.toUpperCase()} at full original resolution`}
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Download Image ({exportFormat.toUpperCase()})</span>
          </button>

          {/* Quick Format Selector */}
          <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 shrink-0 text-[11px] font-semibold">
            {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setExportFormat(fmt)}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer uppercase ${
                  exportFormat === fmt
                    ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title={`Export as ${fmt === 'jpeg' ? 'JPG' : fmt.toUpperCase()}`}
              >
                {fmt === 'jpeg' ? 'JPG' : fmt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Global Action Strip */}
      <div className="px-3 py-2.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs">
        <button
          onClick={onUploadNew}
          className="text-neutral-600 hover:text-neutral-900 font-medium cursor-pointer"
        >
          Change Image
        </button>
        <button
          onClick={onResetAll}
          className="text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
        >
          Reset All Edits
        </button>
      </div>
    </div>
  );
};
