import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Sparkles } from 'lucide-react';

export const LightboxModal = ({ images = [], currentIndex = 0, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  const currentItem = images[currentIndex];
  if (!currentItem) return null;

  const imageUrl = typeof currentItem === 'string' ? currentItem : (currentItem.url || currentItem.image);
  const title = typeof currentItem === 'object' ? currentItem.title : 'Handcrafted Artwork';
  const category = typeof currentItem === 'object' ? currentItem.category : '';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 12, 11, 0.94)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={onClose}
    >
      {/* Top Controls */}
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '2rem',
          right: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#FFF',
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {category && (
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--rose-primary)', fontWeight: 700 }}>
              {category}
            </span>
          )}
          <h4 style={{ color: '#FFF', fontSize: '1.1rem', marginTop: '0.1rem', fontFamily: 'var(--font-serif-display)' }}>
            {title}
          </h4>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            cursor: 'pointer',
          }}
        >
          <X size={24} />
        </button>
      </div>

      {/* Prev Navigation Button */}
      {images.length > 1 && onPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          style={{
            position: 'absolute',
            left: '1.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'background 0.2s ease',
          }}
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Main Full-Size Artwork Image */}
      <div
        style={{
          maxWidth: '90vw',
          maxHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title}
          style={{
            maxWidth: '100%',
            maxHeight: '80vh',
            objectFit: 'contain',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          }}
        />
      </div>

      {/* Next Navigation Button */}
      {images.length > 1 && onNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{
            position: 'absolute',
            right: '1.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'background 0.2s ease',
          }}
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Bottom Counter */}
      {images.length > 1 && (
        <div style={{ position: 'absolute', bottom: '1.5rem', color: '#B3AAA4', fontSize: '0.88rem' }}>
          {currentIndex + 1} of {images.length}
        </div>
      )}
    </div>
  );
};
