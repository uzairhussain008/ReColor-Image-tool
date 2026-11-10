import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface DeferredSectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  className?: string;
  sectionId?: string;
}

/**
 * DeferredSection: Defers mounting and network fetching of below-the-fold components
 * until the user scrolls within proximity or clicks an anchor nav link, saving valuable mobile CPU & bandwidth.
 * Automatically renders immediately for search crawlers to preserve 100% SEO parity.
 */
export const DeferredSection: React.FC<DeferredSectionProps> = ({
  children,
  fallback = <div className="min-h-[160px]" />,
  rootMargin = '350px 0px',
  className = '',
  sectionId,
}) => {
  // Always render immediately for crawlers/spiders for full SEO and schema indexing
  const isCrawler =
    typeof navigator !== 'undefined' &&
    /bot|googlebot|bingbot|crawler|spider|robot|crawling/i.test(navigator.userAgent || '');

  const hasMatchingHash =
    typeof window !== 'undefined' &&
    sectionId &&
    window.location.hash.toLowerCase() === `#${sectionId.toLowerCase()}`;

  const [isVisible, setIsVisible] = useState(isCrawler || Boolean(hasMatchingHash));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) return;
    if (typeof window === 'undefined') return;

    // Listen to hash changes (e.g. user clicked navigation menu link)
    const handleHash = () => {
      if (sectionId && window.location.hash.toLowerCase() === `#${sectionId.toLowerCase()}`) {
        setIsVisible(true);
      }
    };
    window.addEventListener('hashchange', handleHash);

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', handleHash);
    };
  }, [isVisible, rootMargin, sectionId]);

  return (
    <div ref={containerRef} id={sectionId} className={`content-visibility-auto ${className}`.trim()}>
      {isVisible ? children : fallback}
    </div>
  );
};
