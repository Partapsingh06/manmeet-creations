import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Scissors, Palette, Gift, Gem, Layers, ChevronRight } from 'lucide-react';
import { apiRequest, getImageUrl } from '../utils/api';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await apiRequest('/categories');
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-cream)', paddingBottom: '6rem' }}>
      
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EAE8 100%)',
          padding: '3.5rem 0 2.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '3.5rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '700px' }}>
          <span className="section-subtitle">
            <Sparkles size={14} /> Artisan Mediums
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>
            Explore Our Craft Categories
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Discover our spectrum of handcrafted artistry — from delicate needle embroidery and crystal epoxy resin to hand-painted fabrics and realism portraits.
          </p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--rose-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading craft categories...</p>
          </div>
        ) : (
          <div className="grid-3" style={{ gap: '2.5rem' }}>
            {categories.map((cat) => (
              <Link
                key={cat._id || cat.slug}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="craft-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ position: 'relative', width: '100%', paddingTop: '80%', overflow: 'hidden' }}>
                  <img
                    src={getImageUrl(cat.image)}
                    alt={cat.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80';
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(32, 26, 24, 0.65) 0%, transparent 55%)',
                    }}
                  />
                  <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px', color: '#FFFFFF' }}>
                    <span className="badge badge-rose" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF', backdropFilter: 'blur(4px)', marginBottom: '0.4rem' }}>
                      {cat.itemCount || 3} Pieces in Collection
                    </span>
                    <h3 style={{ fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 600 }}>
                      {cat.name}
                    </h3>
                  </div>
                </div>

                <div style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                  <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                    {cat.description || 'Artisan handcrafted collection made with premium materials.'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--rose-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      Shop This Category <ChevronRight size={16} />
                    </span>
                    <span className="btn btn-sm btn-outline-rose" style={{ padding: '0.4rem 0.9rem' }}>
                      Browse →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
