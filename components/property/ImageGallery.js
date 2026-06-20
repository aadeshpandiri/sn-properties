'use client';

import { useState } from 'react';

export default function ImageGallery({ images = [], title }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-surface to-border flex items-center justify-center">
        <div className="text-center text-muted">
          <svg className="w-16 h-16 mx-auto mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18v14.25A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25V3z" />
          </svg>
          <p className="text-sm">No photos uploaded</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div className="aspect-[16/9] rounded-xl overflow-hidden bg-surface">
        <img
          key={activeIndex}
          src={images[activeIndex].image_url}
          alt={`${title} — photo ${activeIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === activeIndex ? 'border-accent opacity-100' : 'border-transparent opacity-60 hover:opacity-90'
              }`}
            >
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {images.length > 1 && (
        <p className="text-xs text-muted mt-1">
          {activeIndex + 1} / {images.length} photos
        </p>
      )}
    </div>
  );
}
