import React from 'react';

interface AdPlaceholderProps {
  slotId: string;
  slotName: string;
  sizeLabel?: string;
  className?: string;
}

/**
 * Responsive advertisement placeholder container prepared for future monetization (e.g. Adsterra banner or native ads).
 *
 * HOW TO INTEGRATE OFFICIAL AD NETWORK SCRIPT:
 * Replace the interior placeholder block with your network snippet (e.g. Adsterra script tag).
 * Example:
 * <script type="text/javascript">
 *   atOptions = { 'key' : 'YOUR_ADSTERRA_KEY', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };
 * </script>
 * <script type="text/javascript" src="//www.topcreativeformat.com/YOUR_KEY/invoke.js"></script>
 */
export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  slotId,
  slotName,
  sizeLabel = 'Responsive Leaderboard (728x90 / 320x50 / 300x250)',
  className = '',
}) => {
  return (
    <div
      id={`ad-slot-${slotId}`}
      className={`my-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${className}`}
      aria-label={`Advertisement Slot - ${slotName}`}
    >
      <div className="w-full max-w-4xl mx-auto py-4 px-6 rounded-xl border border-dashed border-neutral-300 bg-neutral-100/60 min-h-[90px] flex flex-col items-center justify-center transition-all">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
          Advertisement Space
        </span>
        <span className="text-xs font-medium text-neutral-500 mt-1">
          {slotName}
        </span>
        <span className="text-[11px] text-neutral-400 font-mono mt-0.5">
          {sizeLabel}
        </span>
      </div>
    </div>
  );
};
