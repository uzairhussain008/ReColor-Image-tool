import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  SlidersHorizontal,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Paintbrush,
  Eraser,
  Undo2,
  Redo2,
  RotateCcw,
  Eye,
  Columns,
  Download,
} from 'lucide-react';
import {
  PresetId,
  ImageAdjustments,
  RecolorSettings,
  processImageData,
} from '../../utils/imageProcessing';
import { ImageDataState, ViewMode, BrushTool, BrushStroke } from '../../types';

interface CanvasWorkspaceProps {
  imageState: ImageDataState;
  preset: PresetId;
  adjustments: ImageAdjustments;
  recolor: RecolorSettings;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  brushTool: BrushTool;
  onBrushToolChange: (tool: BrushTool) => void;
  brushColor: string;
  brushSize: number;
  brushOpacity: number;
  brushStrokes: BrushStroke[];
  onAddBrushStroke: (stroke: BrushStroke) => void;
  onUndoBrushStroke: () => void;
  onRedoBrushStroke: () => void;
  canUndoBrush: boolean;
  canRedoBrush: boolean;
  onClearBrushStrokes: () => void;
  onDownload: (format: 'png' | 'jpeg' | 'webp', quality: number) => void;
}

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  imageState,
  preset,
  adjustments,
  recolor,
  viewMode,
  onViewModeChange,
  brushTool,
  onBrushToolChange,
  brushColor,
  brushSize,
  brushOpacity,
  brushStrokes,
  onAddBrushStroke,
  onUndoBrushStroke,
  onRedoBrushStroke,
  canUndoBrush,
  canRedoBrush,
  onClearBrushStrokes,
  onDownload,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const brushCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [splitPos, setSplitPos] = useState<number>(50); // percentage 0 to 100
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const currentStrokeRef = useRef<{ x: number; y: number }[]>([]);

  // 1. Initialize original offscreen canvas whenever image changes
  useEffect(() => {
    const origCanvas = document.createElement('canvas');
    origCanvas.width = imageState.originalWidth;
    origCanvas.height = imageState.originalHeight;
    const ctx = origCanvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.drawImage(imageState.imageElement, 0, 0);
      originalCanvasRef.current = origCanvas;
    }

    const procCanvas = document.createElement('canvas');
    procCanvas.width = imageState.originalWidth;
    procCanvas.height = imageState.originalHeight;
    processedCanvasRef.current = procCanvas;

    const bCanvas = document.createElement('canvas');
    bCanvas.width = imageState.originalWidth;
    bCanvas.height = imageState.originalHeight;
    brushCanvasRef.current = bCanvas;

    // Reset zoom
    setZoomLevel(1);
  }, [imageState]);

  // 2. Redraw brush strokes on offscreen brushCanvas
  const redrawBrushCanvas = useCallback(() => {
    const bCanvas = brushCanvasRef.current;
    if (!bCanvas) return;
    const bCtx = bCanvas.getContext('2d');
    if (!bCtx) return;

    bCtx.clearRect(0, 0, bCanvas.width, bCanvas.height);

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
  }, [brushStrokes]);

  useEffect(() => {
    redrawBrushCanvas();
    renderDisplay();
  }, [redrawBrushCanvas]);

  // 3. Process image whenever preset, adjustments, or recolor settings change
  useEffect(() => {
    const origCanvas = originalCanvasRef.current;
    const procCanvas = processedCanvasRef.current;
    if (!origCanvas || !procCanvas) return;

    const origCtx = origCanvas.getContext('2d', { willReadFrequently: true });
    const procCtx = procCanvas.getContext('2d');
    if (!origCtx || !procCtx) return;

    setIsProcessing(true);

    // Use requestAnimationFrame so UI stays responsive
    const rafId = requestAnimationFrame(() => {
      try {
        const srcData = origCtx.getImageData(0, 0, origCanvas.width, origCanvas.height);
        const processedData = processImageData(srcData, preset, adjustments, recolor);
        procCtx.putImageData(processedData, 0, 0);
      } catch (err) {
        console.error('Image processing error:', err);
      } finally {
        setIsProcessing(false);
        renderDisplay();
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [preset, adjustments, recolor, imageState]);

  // 4. Render to display canvas based on viewMode ('split', 'side-by-side', 'edited')
  const renderDisplay = useCallback(() => {
    const displayCanvas = displayCanvasRef.current;
    const origCanvas = originalCanvasRef.current;
    const procCanvas = processedCanvasRef.current;
    const bCanvas = brushCanvasRef.current;
    if (!displayCanvas || !origCanvas || !procCanvas || !bCanvas) return;

    const ctx = displayCanvas.getContext('2d');
    if (!ctx) return;

    const imgW = imageState.originalWidth;
    const imgH = imageState.originalHeight;

    if (viewMode === 'side-by-side') {
      displayCanvas.width = imgW * 2 + 16;
      displayCanvas.height = imgH;
      ctx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);

      // Draw original on left
      ctx.drawImage(origCanvas, 0, 0);

      // Draw separator
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(imgW, 0, 16, imgH);

      // Draw edited on right + brush layer
      ctx.drawImage(procCanvas, imgW + 16, 0);
      ctx.drawImage(bCanvas, imgW + 16, 0);
    } else {
      displayCanvas.width = imgW;
      displayCanvas.height = imgH;
      ctx.clearRect(0, 0, imgW, imgH);

      if (viewMode === 'edited') {
        // Draw full edited + brush
        ctx.drawImage(procCanvas, 0, 0);
        ctx.drawImage(bCanvas, 0, 0);
      } else {
        // ViewMode === 'split': Left side Original, Right side Edited
        const splitX = Math.round((imgW * splitPos) / 100);

        // 1. Draw edited base on entire canvas
        ctx.drawImage(procCanvas, 0, 0);
        ctx.drawImage(bCanvas, 0, 0);

        // 2. Draw original on left portion
        if (splitX > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, splitX, imgH);
          ctx.clip();
          ctx.drawImage(origCanvas, 0, 0);
          ctx.restore();
        }

        // 3. Draw vertical divider bar
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 6;
        ctx.fillRect(splitX - 1.5, 0, 3, imgH);
        ctx.restore();
      }
    }
  }, [viewMode, splitPos, imageState]);

  useEffect(() => {
    renderDisplay();
  }, [renderDisplay, splitPos, viewMode]);

  // Handle pointer down on canvas workspace for Split drag or Brush painting
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const canvas = displayCanvasRef.current;
    if (!canvas) return;

    if (brushTool !== 'none') {
      // Start brush stroke
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      setIsDrawing(true);
      currentStrokeRef.current = [{ x, y }];

      // Immediate visual feedback on brush canvas on initial tap/click
      const bCanvas = brushCanvasRef.current;
      if (bCanvas) {
        const bCtx = bCanvas.getContext('2d');
        if (bCtx) {
          bCtx.save();
          bCtx.globalAlpha = brushOpacity / 100;
          if (brushTool === 'eraser') {
            bCtx.globalCompositeOperation = 'destination-out';
            bCtx.fillStyle = 'rgba(0,0,0,1)';
          } else {
            bCtx.globalCompositeOperation = 'source-over';
            bCtx.fillStyle = brushColor;
          }
          bCtx.beginPath();
          bCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
          bCtx.fill();
          bCtx.restore();
          renderDisplay();
        }
      }

      e.currentTarget.setPointerCapture(e.pointerId);
    } else if (viewMode === 'split') {
      // Split dragging
      setIsDraggingSplit(true);
      updateSplitFromPointer(e.clientX);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const updateSplitFromPointer = (clientX: number) => {
    const canvas = displayCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0) return;
    const relativeX = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
    setSplitPos(pct);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const canvas = displayCanvasRef.current;
    if (!canvas) return;

    if (isDrawing && brushTool !== 'none') {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      currentStrokeRef.current.push({ x, y });

      // Immediate visual feedback on brush canvas
      const bCanvas = brushCanvasRef.current;
      if (bCanvas) {
        const bCtx = bCanvas.getContext('2d');
        if (bCtx) {
          bCtx.save();
          bCtx.lineCap = 'round';
          bCtx.lineJoin = 'round';
          bCtx.lineWidth = brushSize;
          bCtx.globalAlpha = brushOpacity / 100;
          if (brushTool === 'eraser') {
            bCtx.globalCompositeOperation = 'destination-out';
            bCtx.strokeStyle = 'rgba(0,0,0,1)';
            bCtx.fillStyle = 'rgba(0,0,0,1)';
          } else {
            bCtx.globalCompositeOperation = 'source-over';
            bCtx.strokeStyle = brushColor;
            bCtx.fillStyle = brushColor;
          }
          const pts = currentStrokeRef.current;
          if (pts.length >= 2) {
            bCtx.beginPath();
            bCtx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
            bCtx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
            bCtx.stroke();
          }
          bCtx.restore();
          renderDisplay();
        }
      }
    } else if (isDraggingSplit && viewMode === 'split') {
      updateSplitFromPointer(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDrawing && brushTool !== 'none') {
      setIsDrawing(false);
      if (currentStrokeRef.current.length > 0) {
        onAddBrushStroke({
          color: brushColor,
          size: brushSize,
          opacity: brushOpacity,
          blendMode: brushTool === 'eraser' ? 'destination-out' : 'color',
          points: [...currentStrokeRef.current],
        });
      }
      currentStrokeRef.current = [];
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    }

    if (isDraggingSplit) {
      setIsDraggingSplit(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe ignore
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-lg">
      {/* Top Workspace Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 bg-neutral-950 border-b border-neutral-800 text-xs text-neutral-300">
        {/* Left: View Mode Toggles */}
        <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800 shrink-0">
          <button
            onClick={() => onViewModeChange('split')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors font-medium ${
              viewMode === 'split'
                ? 'bg-neutral-800 text-white shadow-2xs'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Split Slider View"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Split Slider</span>
          </button>
          <button
            onClick={() => onViewModeChange('side-by-side')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors font-medium ${
              viewMode === 'side-by-side'
                ? 'bg-neutral-800 text-white shadow-2xs'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Side-by-Side View"
          >
            <Columns className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Side by Side</span>
          </button>
          <button
            onClick={() => onViewModeChange('edited')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors font-medium ${
              viewMode === 'edited'
                ? 'bg-neutral-800 text-white shadow-2xs'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Edited Only"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Result</span>
          </button>
        </div>

        {/* Center: Dimensions & Processing Status */}
        <div className="flex items-center gap-3 text-neutral-400 font-mono text-[11px]">
          <span>
            {imageState.originalWidth} × {imageState.originalHeight} px
          </span>
          {isProcessing && (
            <span className="text-amber-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Processing...
            </span>
          )}
        </div>

        {/* Right: Brush Quick Controls & Zoom */}
        <div className="flex items-center gap-2">
          {/* Brush quick toggle */}
          <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800">
            <button
              onClick={() => onBrushToolChange(brushTool === 'brush' ? 'none' : 'brush')}
              className={`p-1.5 rounded-md transition-colors ${
                brushTool === 'brush'
                  ? 'bg-sky-600 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Selective Recolor Brush"
            >
              <Paintbrush className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onBrushToolChange(brushTool === 'eraser' ? 'none' : 'eraser')}
              className={`p-1.5 rounded-md transition-colors ${
                brushTool === 'eraser'
                  ? 'bg-rose-600 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Brush Eraser"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
            {brushStrokes.length > 0 && (
              <>
                <button
                  onClick={onUndoBrushStroke}
                  disabled={!canUndoBrush}
                  className="p-1.5 rounded-md text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400"
                  title="Undo Brush Stroke"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onRedoBrushStroke}
                  disabled={!canRedoBrush}
                  className="p-1.5 rounded-md text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400"
                  title="Redo Brush Stroke"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onClearBrushStrokes}
                  className="p-1.5 rounded-md text-neutral-400 hover:text-rose-400"
                  title="Clear All Brush Strokes"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
              className="p-1.5 text-neutral-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 text-[11px] font-mono text-neutral-400">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className="p-1.5 text-neutral-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-neutral-400 hover:text-white"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Prominent Instant Download Button */}
          <button
            onClick={() => onDownload('png', 0.95)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 via-fuchsia-600 to-sky-600 hover:from-violet-500 hover:to-sky-500 active:scale-98 rounded-lg shadow-sm cursor-pointer transition-all shrink-0"
            title="Download high-resolution image (PNG)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download HD</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport Area */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative flex-1 min-h-[380px] sm:min-h-[500px] flex items-center justify-center overflow-hidden p-4 select-none touch-none bg-neutral-950 ${
          brushTool !== 'none'
            ? 'cursor-crosshair'
            : viewMode === 'split'
            ? 'cursor-ew-resize'
            : 'cursor-default'
        }`}
      >
        {/* Transparent Checkerboard Pattern Background for transparent PNGs */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-75"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <div
            className="rounded-lg overflow-hidden shadow-2xl relative border border-neutral-800"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #18181b 25%, transparent 25%), linear-gradient(-45deg, #18181b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #18181b 75%), linear-gradient(-45deg, transparent 75%, #18181b 75%)',
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
              backgroundColor: '#09090b',
            }}
          >
            <canvas
              ref={displayCanvasRef}
              className="block max-w-full max-h-[65vh] object-contain w-auto h-auto"
            />
          </div>

          {/* Floating Labels in Split View */}
          {viewMode === 'split' && (
            <>
              <div
                className="absolute top-4 pointer-events-none transition-opacity"
                style={{
                  left: `${Math.max(16, (splitPos / 100) * 0.8 * 100)}px`,
                  opacity: splitPos > 15 ? 1 : 0,
                }}
              >
                <span className="bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-md border border-white/10">
                  Original
                </span>
              </div>
              <div
                className="absolute top-4 pointer-events-none transition-opacity"
                style={{
                  right: '16px',
                  opacity: splitPos < 85 ? 1 : 0,
                }}
              >
                <span className="bg-neutral-900/90 backdrop-blur-xs text-sky-400 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-md border border-neutral-700">
                  Recolored
                </span>
              </div>
            </>
          )}

          {/* Side by side labels */}
          {viewMode === 'side-by-side' && (
            <div className="absolute top-2 inset-x-4 flex justify-between pointer-events-none text-xs font-semibold">
              <span className="bg-black/80 text-white px-2.5 py-0.5 rounded-md">Original</span>
              <span className="bg-neutral-900/90 text-sky-400 px-2.5 py-0.5 rounded-md">
                Recolored
              </span>
            </div>
          )}
        </div>

        {/* Brush Tool Floating Overlay Status when active */}
        {brushTool !== 'none' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-900/90 backdrop-blur-md border border-neutral-700 text-white text-xs px-4 py-2 rounded-full shadow-xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: brushColor }} />
            <span>
              {brushTool === 'brush' ? 'Recolor Brush Active' : 'Eraser Active'} · Drag to paint on
              image
            </span>
            <button
              onClick={() => onBrushToolChange('none')}
              className="text-neutral-400 hover:text-white font-semibold underline text-[11px]"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
