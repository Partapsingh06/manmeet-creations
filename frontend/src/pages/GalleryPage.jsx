import React, { useState } from 'react';
import { Sparkles, Eye, Maximize2 } from 'lucide-react';
import { LightboxModal } from '../components/LightboxModal';

export const GalleryPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const galleryItems = [
    {
      id: 1,
      title: 'Bridal Floral Couple Wedding Hoop',
      category: 'Embroidery',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80',
      aspect: 'tall',
    },
    {
      id: 2,
      title: 'Ocean Wave Resin Wall Clock with Real Crystals',
      category: 'Resin',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      aspect: 'wide',
    },
    {
      id: 3,
      title: 'Wild Lotus Watercolor on Pure Silk Organza',
      category: 'Painting',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      aspect: 'square',
    },
    {
      id: 4,
      title: 'Charcoal Realism Couple Portrait Drawing',
      category: 'Painting',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
      aspect: 'tall',
    },
    {
      id: 5,
      title: 'Handcrafted 4-Layer Photo Explosion Box',
      category: 'Gifts',
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=80',
      aspect: 'square',
    },
    {
      id: 6,
      title: 'Real Pressed Daisy Resin Botanical Pendant',
      category: 'Jewellery',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
      aspect: 'square',
    },
    {
      id: 7,
      title: 'Custom Wooden Photo Album Keepsake',
      category: 'Gifts',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
      aspect: 'wide',
    },
    {
      id: 8,
      title: 'Traditional Lippan Mud & Glass Mirror Wall Art',
      category: 'Gifts',
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1200&q=80',
      aspect: 'tall',
    },
    {
      id: 9,
      title: 'Botanical Pastel Meadow French Knot Embroidery',
      category: 'Embroidery',
      image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80',
      aspect: 'square',
    },
  ];

  const filteredItems = selectedFilter === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedFilter);

  return (
    <div style={{ backgroundColor: 'var(--bg-cream)', paddingBottom: '6rem' }}>
      
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EAE8 100%)',
          padding: '3.5rem 0 2.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '3rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '700px' }}>
          <span className="section-subtitle">
            <Sparkles size={14} /> Artisan Showcase
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>
            Handcrafted Art Gallery
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            A visual exhibition of custom commissions, bridal keepsakes, ocean resin art, and fine thread embroidery. Click any image to view in full resolution.
          </p>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.8rem' }}>
            {['All', 'Embroidery', 'Resin', 'Painting', 'Gifts', 'Jewellery'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`btn btn-sm ${selectedFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.45rem 1.2rem', fontSize: '0.85rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="container">
        <div
          style={{
            columnCount: 3,
            columnGap: '1.5rem',
          }}
          className="gallery-masonry"
        >
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              style={{
                breakInside: 'avoid',
                marginBottom: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
                cursor: 'pointer',
                position: 'relative',
              }}
              className="gallery-card"
            >
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  style={{ width: '100%', display: 'block', transition: 'transform 0.5s ease' }}
                  className="gallery-img"
                />

                {/* Hover overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(32, 26, 24, 0.55)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                  className="gallery-overlay"
                >
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                      <Maximize2 size={16} />
                    </div>
                  </div>

                  <div>
                    <span className="badge badge-rose" style={{ marginBottom: '0.4rem' }}>{item.category}</span>
                    <h4 style={{ color: '#FFF', fontSize: '1.05rem', fontFamily: 'var(--font-serif-display)' }}>{item.title}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <LightboxModal
          images={filteredItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1))}
          onNext={() => setLightboxIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0))}
        />
      )}

      <style>{`
        .gallery-card:hover .gallery-img { transform: scale(1.06); }
        .gallery-card:hover .gallery-overlay { opacity: 1 !important; }
        @media (max-width: 900px) {
          .gallery-masonry { column-count: 2 !important; }
        }
        @media (max-width: 550px) {
          .gallery-masonry { column-count: 1 !important; }
        }
      `}</style>
    </div>
  );
};
