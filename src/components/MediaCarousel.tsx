import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaItem } from './HeroCarousel';

interface MediaCarouselProps {
  items: MediaItem[];
  interval?: number;
  className?: string;
}

export function MediaCarousel({ items, interval = 5000, className = '' }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // If current index is out of bounds, reset to 0
    if (currentIndex >= items.length) {
      setCurrentIndex(0);
    }
  }, [items?.length, currentIndex]);

  useEffect(() => {
    if (!items || items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [items, interval]);

  if (!items || items.length === 0) return null;

  const safeIndex = currentIndex < items.length ? currentIndex : 0;
  const currentItem = items[safeIndex];

  if (!currentItem) return null;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentItem.id || currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
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
              alt={currentItem.alt || 'Media content'}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Carousel Indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'bg-brand-pink w-6' 
                  : 'bg-white/70 w-3 hover:bg-white'
              } shadow-sm`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
