import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Hero } from '../Hero';
import {
  PresetId,
  ImageAdjustments,
  RecolorSettings,
  DEFAULT_ADJUSTMENTS,
  DEFAULT_RECOLOR,
  processImageData,
} from '../../utils/imageProcessing';
import {
  ImageDataState,
  ViewMode,
  BrushTool,
  BrushStroke,
  SampleImageItem,
} from '../../types';
import { CheckCircle2, AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { createFallbackCanvas } from '../../utils/imageFallback';

// Dynamic code-splitting for active studio: only loaded when an image is selected/uploaded
const CanvasWorkspace = lazy(() =>
  import('./CanvasWorkspace').then((m) => ({ default: m.CanvasWorkspace }))
);
const EditorControls = lazy(() =>
  import('./EditorControls').then((m) => ({ default: m.EditorControls }))
);

const prefetchStudioModules = () => {
  import('./CanvasWorkspace');
  import('./EditorControls');
};

interface ImageEditorProps {
  initialSample?: SampleImageItem | null;
  onClearInitialSample?: () => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  initialSample,
  onClearInitialSample,
}) => {
  const [imageState, setImageState] = useState<ImageDataState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(
    null
  );

  // Editor states
  const [preset, setPreset] = useState<PresetId>('original');
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);
  const [recolor, setRecolor] = useState<RecolorSettings>(DEFAULT_RECOLOR);
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  // Brush states
  const [brushTool, setBrushTool] = useState<BrushTool>('none');
  const [brushColor, setBrushColor] = useState<string>('#ef4444');
  const [brushSize, setBrushSize] = useState<number>(35);
  const [brushOpacity, setBrushOpacity] = useState<number>(85);
  const [brushStrokes, setBrushStrokes] = useState<BrushStroke[]>([]);
  const [brushHistory, setBrushHistory] = useState<BrushStroke[][]>([]);
  const [brushHistoryIndex, setBrushHistoryIndex] = useState<number>(-1);

  // Toast auto-clear
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Load sample image with multi-tier fallback resilience
  const loadFromUrl = useCallback(
    (url: string, name: string, defaultPreset: PresetId = 'original', fallbackUrl?: string) => {
      setErrorMessage(null);

      const applyLoadedImage = (img: HTMLImageElement, effectiveUrl: string) => {
        setImageState({
          imageElement: img,
          sourceUrl: effectiveUrl,
          name: name.replace(/\.[^/.]+$/, ''),
          type: 'image/jpeg',
          originalWidth: img.naturalWidth || img.width || 1200,
          originalHeight: img.naturalHeight || img.height || 800,
          fileSizeBytes: 0,
          isTransparentPng: false,
        });
        setPreset(defaultPreset);
        setAdjustments(DEFAULT_ADJUSTMENTS);
        setRecolor(DEFAULT_RECOLOR);
        setBrushStrokes([]);
        setBrushHistory([]);
        setBrushHistoryIndex(-1);
        setToastMessage({
          text: `Loaded ${name} (${img.naturalWidth || img.width} × ${img.naturalHeight || img.height} px)`,
          type: 'success',
        });
      };

      const tryFallbackCanvas = () => {
        try {
          const fallbackCanvas = createFallbackCanvas(name, 1200, 800);
          const fallbackImg = new Image();
          fallbackImg.onload = () => applyLoadedImage(fallbackImg, fallbackCanvas.toDataURL());
          fallbackImg.src = fallbackCanvas.toDataURL();
        } catch (_err) {
          setErrorMessage('Failed to decode image. Please select another photo from your device.');
        }
      };

      const tryFallbackUrl = () => {
        if (fallbackUrl && fallbackUrl !== url) {
          const fbImg = new Image();
          fbImg.onload = () => applyLoadedImage(fbImg, fallbackUrl);
          fbImg.onerror = () => tryFallbackCanvas();
          fbImg.src = fallbackUrl;
        } else {
          tryFallbackCanvas();
        }
      };

      const tryWithoutCors = () => {
        const plainImg = new Image();
        plainImg.onload = () => applyLoadedImage(plainImg, url);
        plainImg.onerror = () => tryFallbackUrl();
        plainImg.src = url;
      };

      const primaryImg = new Image();
      primaryImg.crossOrigin = 'anonymous';
      primaryImg.onload = () => applyLoadedImage(primaryImg, url);
      primaryImg.onerror = () => tryWithoutCors();
      primaryImg.src = url;
    },
    []
  );

  // Listen to external sample selection from Hero
  useEffect(() => {
    if (initialSample) {
      loadFromUrl(
        initialSample.url,
        initialSample.title,
        initialSample.recommendedPreset,
        initialSample.fallbackUrl
      );
    }
  }, [initialSample, loadFromUrl]);

  // Load file from File input / drag & drop
  const handleFileSelect = (file: File) => {
    setErrorMessage(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage(
        'Unsupported file format. Please upload a standard JPG, PNG, or WEBP image file.'
      );
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage(
        'Image is very large (>25MB). Consider using an image under 20MB for best performance.'
      );
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const isPng = file.type === 'image/png';
      setImageState({
        imageElement: img,
        sourceUrl: objectUrl,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: file.type,
        originalWidth: img.naturalWidth || img.width,
        originalHeight: img.naturalHeight || img.height,
        fileSizeBytes: file.size,
        isTransparentPng: isPng,
      });
      setPreset('original');
      setAdjustments(DEFAULT_ADJUSTMENTS);
      setRecolor(DEFAULT_RECOLOR);
      setBrushStrokes([]);
      setBrushHistory([]);
      setBrushHistoryIndex(-1);
      setToastMessage({
        text: `Successfully uploaded ${file.name} (${img.naturalWidth} × ${img.naturalHeight} px)`,
        type: 'success',
      });
    };
    img.onerror = () => {
      setErrorMessage('Could not decode image data. The file might be corrupted.');
    };
    img.src = objectUrl;
  };

  // Adjustments handlers
  const handleAdjustmentChange = (key: keyof ImageAdjustments, value: number) => {
    setAdjustments((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetAdjustment = (key: keyof ImageAdjustments) => {
    setAdjustments((prev) => ({ ...prev, [key]: DEFAULT_ADJUSTMENTS[key] }));
  };

  const handleResetAllAdjustments = () => {
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setToastMessage({ text: 'All color adjustments reset to default', type: 'info' });
  };

  const handleRecolorChange = (update: Partial<RecolorSettings>) => {
    setRecolor((prev) => ({ ...prev, ...update }));
  };

  const handleResetRecolor = () => {
    setRecolor(DEFAULT_RECOLOR);
  };

  // Brush stroke stack management
  const handleAddBrushStroke = (stroke: BrushStroke) => {
    const updated = [...brushStrokes, stroke];
    setBrushStrokes(updated);
    const newHistory = brushHistory.slice(0, brushHistoryIndex + 1);
    newHistory.push(updated);
    setBrushHistory(newHistory);
    setBrushHistoryIndex(newHistory.length - 1);
  };

  const handleUndoBrush = () => {
    if (brushHistoryIndex > 0) {
      const newIdx = brushHistoryIndex - 1;
      setBrushHistoryIndex(newIdx);
      setBrushStrokes(brushHistory[newIdx]);
    } else if (brushHistoryIndex === 0) {
      setBrushHistoryIndex(-1);
      setBrushStrokes([]);
    }
  };

  const handleRedoBrush = () => {
    if (brushHistoryIndex < brushHistory.length - 1) {
      const newIdx = brushHistoryIndex + 1;
      setBrushHistoryIndex(newIdx);
      setBrushStrokes(brushHistory[newIdx]);
    }
  };

  const handleClearBrush = () => {
    setBrushStrokes([]);
    setBrushHistory([]);
    setBrushHistoryIndex(-1);
    setToastMessage({ text: 'Cleared all brush strokes', type: 'info' });
  };

  const handleResetAll = () => {
    setPreset('original');
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setRecolor(DEFAULT_RECOLOR);
    setBrushStrokes([]);
    setBrushHistory([]);
    setBrushHistoryIndex(-1);
    setToastMessage({ text: 'Reset image to original state', type: 'info' });
  };

  const handleUploadNew = () => {
    setImageState(null);
    setErrorMessage(null);
    if (onClearInitialSample) {
      onClearInitialSample();
    }
  };

  const handleBrushToolChange = (tool: BrushTool) => {
    setBrushTool(tool);
    if (tool !== 'none' && viewMode === 'split') {
      setViewMode('edited');
    }
  };

  // High-Resolution Full Export Generator
  const handleDownload = (format: 'png' | 'jpeg' | 'webp', quality: number) => {
    if (!imageState) return;

    try {
      setToastMessage({ text: 'Rendering full-resolution export...', type: 'info' });

      // 1. Offscreen source canvas at native resolution
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = imageState.originalWidth;
      exportCanvas.height = imageState.originalHeight;
      const ctx = exportCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Could not create canvas context');

      // 2. Draw pristine original
      ctx.drawImage(imageState.imageElement, 0, 0);

      // 3. Process full pixels
      const srcData = ctx.getImageData(0, 0, exportCanvas.width, exportCanvas.height);
      const processedData = processImageData(srcData, preset, adjustments, recolor);
      ctx.putImageData(processedData, 0, 0);

      // 4. Draw brush strokes if any onto dedicated brush canvas layer
      if (brushStrokes.length > 0) {
        const brushCanvas = document.createElement('canvas');
        brushCanvas.width = imageState.originalWidth;
        brushCanvas.height = imageState.originalHeight;
        const bCtx = brushCanvas.getContext('2d');
        if (bCtx) {
          for (const stroke of brushStrokes) {
            if (stroke.points.length === 0) continue;
            bCtx.save();
            bCtx.lineCap = 'round';
            bCtx.lineJoin = 'round';
            bCtx.lineWidth = stroke.size;
            bCtx.globalAlpha = stroke.opacity / 100;

            if (stroke.blendMode === 'destination-out') {
              bCtx.globalCompositeOperation = 'destination-out';
              bCtx.strokeStyle = 'rgba(0,0,0,1)';
              bCtx.fillStyle = 'rgba(0,0,0,1)';
            } else {
              bCtx.globalCompositeOperation = 'source-over';
              bCtx.strokeStyle = stroke.color;
              bCtx.fillStyle = stroke.color;
            }

            if (stroke.points.length === 1) {
              bCtx.beginPath();
              bCtx.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2);
              bCtx.fill();
            } else {
              bCtx.beginPath();
              bCtx.moveTo(stroke.points[0].x, stroke.points[0].y);
              for (let i = 1; i < stroke.points.length; i++) {
                bCtx.lineTo(stroke.points[i].x, stroke.points[i].y);
              }
              bCtx.stroke();
            }
            bCtx.restore();
          }
          // Composite brush layer over the processed image
          ctx.drawImage(brushCanvas, 0, 0);
        }
      }

      // 5. If exporting as JPEG, composite onto white background so transparent pixels don't turn black
      let finalCanvas: HTMLCanvasElement = exportCanvas;
      if (format === 'jpeg') {
        const whiteCanvas = document.createElement('canvas');
        whiteCanvas.width = exportCanvas.width;
        whiteCanvas.height = exportCanvas.height;
        const whiteCtx = whiteCanvas.getContext('2d');
        if (whiteCtx) {
          whiteCtx.fillStyle = '#ffffff';
          whiteCtx.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height);
          whiteCtx.drawImage(exportCanvas, 0, 0);
          finalCanvas = whiteCanvas;
        }
      }

      // 6. Generate blob and trigger browser download
      const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
      finalCanvas.toBlob(
        (blob) => {
          if (!blob) {
            setErrorMessage('Export failed while encoding image.');
            return;
          }
          const downloadUrl = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          const cleanName = imageState.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
          anchor.download = `recolor-${cleanName}-${preset}.${format === 'jpeg' ? 'jpg' : format}`;
          anchor.href = downloadUrl;
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
          URL.revokeObjectURL(downloadUrl);

          setToastMessage({
            text: `Downloaded ${anchor.download} (${imageState.originalWidth}×${imageState.originalHeight}px)`,
            type: 'success',
          });
        },
        mimeType,
        quality
      );
    } catch (err) {
      console.error('Download error:', err);
      setErrorMessage('An unexpected error occurred while preparing download.');
    }
  };

  return (
    <div id="editor" className="scroll-mt-16">
      {/* Toast alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold transition-all ${
            toastMessage.type === 'success'
              ? 'bg-neutral-900 text-white border border-neutral-800'
              : 'bg-white text-neutral-900 border border-neutral-300'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-sky-500" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* View Mode: Unified Hero Cover (Upload + Color Difference) or Active Editing Studio */}
      {!imageState ? (
        <Hero
          onFileSelect={handleFileSelect}
          onSelectSample={(sample) =>
            loadFromUrl(sample.url, sample.title, sample.recommendedPreset)
          }
          errorMessage={errorMessage}
          onPrefetchStudio={prefetchStudioModules}
        />
      ) : (
        <section className="py-6 sm:py-10 bg-neutral-100/70 border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Active Workspace Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3.5 sm:p-4 rounded-2xl border border-neutral-200/90 shadow-2xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleUploadNew}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:scale-98 rounded-xl transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Upload Different Photo</span>
                </button>
                <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-neutral-900 truncate max-w-[200px] sm:max-w-md">
                    {imageState.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-500 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-200">
                  {imageState.originalWidth} × {imageState.originalHeight} px
                </span>
                <button
                  onClick={handleResetAll}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Edits</span>
                </button>
              </div>
            </div>

            {/* Canvas and Editor Controls with Suspense */}
            <Suspense
              fallback={
                <div className="min-h-[460px] flex flex-col items-center justify-center bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin mb-3" />
                  <div className="text-xs font-semibold text-neutral-800">
                    Initializing High-Resolution Canvas Studio...
                  </div>
                </div>
              }
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Canvas & Split Comparison View */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  <CanvasWorkspace
                    imageState={imageState}
                    preset={preset}
                    adjustments={adjustments}
                    recolor={recolor}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    brushTool={brushTool}
                    onBrushToolChange={handleBrushToolChange}
                    brushColor={brushColor}
                    brushSize={brushSize}
                    brushOpacity={brushOpacity}
                    brushStrokes={brushStrokes}
                    onAddBrushStroke={handleAddBrushStroke}
                    onUndoBrushStroke={handleUndoBrush}
                    onRedoBrushStroke={handleRedoBrush}
                    canUndoBrush={brushHistoryIndex >= 0}
                    canRedoBrush={brushHistoryIndex < brushHistory.length - 1}
                    onClearBrushStrokes={handleClearBrush}
                    onDownload={handleDownload}
                  />
                </div>

                {/* Right Column: Tabbed Control Panel */}
                <div className="lg:col-span-4">
                  <EditorControls
                    currentPreset={preset}
                    onPresetSelect={setPreset}
                    adjustments={adjustments}
                    onAdjustmentChange={handleAdjustmentChange}
                    onResetAdjustment={handleResetAdjustment}
                    onResetAllAdjustments={handleResetAllAdjustments}
                    recolor={recolor}
                    onRecolorChange={handleRecolorChange}
                    onResetRecolor={handleResetRecolor}
                    brushTool={brushTool}
                    onBrushToolChange={handleBrushToolChange}
                    brushColor={brushColor}
                    onBrushColorChange={setBrushColor}
                    brushSize={brushSize}
                    onBrushSizeChange={setBrushSize}
                    brushOpacity={brushOpacity}
                    onBrushOpacityChange={setBrushOpacity}
                    onUndoBrush={handleUndoBrush}
                    onRedoBrush={handleRedoBrush}
                    canUndoBrush={brushHistoryIndex >= 0}
                    canRedoBrush={brushHistoryIndex < brushHistory.length - 1}
                    onClearBrush={handleClearBrush}
                    onDownload={handleDownload}
                    onResetAll={handleResetAll}
                    onUploadNew={handleUploadNew}
                    originalWidth={imageState.originalWidth}
                    originalHeight={imageState.originalHeight}
                  />
                </div>
              </div>
            </Suspense>
          </div>
        </section>
      )}
    </div>
  );
};
