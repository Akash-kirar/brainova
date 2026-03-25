import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface GameCarouselProps {
  children: React.ReactNode;
  className?: string;
}

export default function GameCarousel({ children, className = '' }: GameCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    setIsScrollable(scrollWidth > clientWidth);

    if (scrollLeft > 20 && !hasScrolled) {
      setHasScrolled(true);
    }
  };

  useEffect(() => {
    checkScroll();
    // Re-check after a short delay to ensure layout is complete
    const timeout = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', checkScroll);
    };
  }, [children]);

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className={`overflow-x-auto hide-scrollbar snap-x snap-mandatory ${className}`}
        style={{ scrollBehavior: 'smooth' }}
      >
        {children}
      </div>

      {isScrollable && !hasScrolled && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <ArrowRight 
            className="w-10 h-10 text-orange-500 animate-bounce-x drop-shadow-[0_0_12px_rgba(249,115,22,0.9)]" 
            strokeWidth={2.5} 
          />
        </div>
      )}
    </div>
  );
}
