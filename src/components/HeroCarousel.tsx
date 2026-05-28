import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type MediaItem = {
  id: number;
  type: 'image' | 'video';
  src: string;
  alt?: string;
  poster?: string;
};

interface HeroCarouselProps {
  items: MediaItem[];
  interval?: number;
}

export function HeroCarousel({ items, interval = 5000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // If current index is out of bounds, reset to 0
    if (currentIndex >= items.length) {
      setCurrentIndex(0);
    }
  }, [items?.length, currentIndex]);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval]);

  if (!items || items.length === 0) {
    return (
      <div className="absolute inset-0 z-0 bg-black">
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>
    );
  }

  const safeIndex = currentIndex < items.length ? currentIndex : 0;
  const currentItem = items[safeIndex];

  if (!currentItem) {
    return (
      <div className="absolute inset-0 z-0 bg-black">
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
          
          {currentItem.type === 'video' ? (
            <video
              src={currentItem.src || undefined}
              poster={currentItem.poster || undefined}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={currentItem.src || undefined}
              alt={currentItem.alt || 'Hero background'}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Carousel Indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 w-4 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
