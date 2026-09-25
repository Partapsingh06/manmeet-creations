import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Heart,
  ShieldCheck,
  Palette,
  Scissors,
  Gift,
  Gem,
  Star,
  Quote,
  CheckCircle2,
  Truck,
  Layers,
  ChevronRight
} from 'lucide-react';
import { InstagramIcon } from '../components/InstagramIcon';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { apiRequest, getImageUrl } from '../utils/api';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          apiRequest('/products/featured'),
          apiRequest('/categories'),
        ]);

        if (prodData.success) {
          setFeaturedProducts(prodData.products);
        }
        if (catData.success) {
          setCategories(catData.categories);
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Category Icon Resolver
  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Scissors': return <Scissors size={24} color="var(--rose-primary)" />;
      case 'Palette': return <Palette size={24} color="var(--rose-primary)" />;
      case 'Gift': return <Gift size={24} color="var(--rose-primary)" />;
      case 'Gem': return <Gem size={24} color="var(--rose-primary)" />;
      case 'Layers': return <Layers size={24} color="var(--rose-primary)" />;
      default: return <Sparkles size={24} color="var(--rose-primary)" />;
    }
  };

  const instagramImages = [
    { url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80', tag: '#EmbroideryHoop' },
    { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', tag: '#OceanResin' },
    { url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80', tag: '#FabricPainting' },
    { url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80', tag: '#CustomPortraits' },
    { url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80', tag: '#HandmadeGifts' },
    { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', tag: '#ResinJewellery' },
  ];

  const testimonials = [
    {
      name: 'Dr. Simran Kaur',
      city: 'Chandigarh',
      text: 'The customized wedding embroidery hoop for my brother’s marriage was perfection itself. The intricate French knots and thread color matching were beyond compare. Thank you Manmeet!',
      rating: 5,
      product: 'Personalized Couple Wedding Hoop',
    },
    {
      name: 'Rohan & Ananya',
      city: 'Mumbai',
      text: 'We ordered an ocean wave resin clock for our new flat. The gloss, the crystals, and the silent sweep movement are stunning. Everyone visiting asks where we got it!',
      rating: 5,
      product: 'Ocean Wave Luxury Resin Clock',
    },
    {
      name: 'Meenakshi Iyer',
      city: 'Bengaluru',
      text: 'The hand-painted organza dupatta felt so luxurious and weightless. True boutique artisan craftsmanship you simply cannot find in mass-market stores.',
      rating: 5,
      product: 'Wild Lotus Organza Dupatta',
    },
  ];

  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 0 6rem',
          background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EAE8 50%, #FAF7F2 100%)',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            
            {/* Left Hero Text */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1.5rem',
                }}
              >
                <Sparkles size={16} color="var(--gold-accent)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', letterSpacing: '0.04em' }}>
                  Handcrafted Artisan Boutique & Bespoke Studio
                </span>
              </div>

              <h1 style={{ marginBottom: '1.2rem', lineHeight: '1.18', color: 'var(--text-main)' }}>
                Handcrafted with Love,<br />
                <span style={{ color: 'var(--rose-primary)', fontStyle: 'italic', fontFamily: 'var(--font-serif-elegant)' }}>
                  Made Just for You.
                </span>
              </h1>

              <p style={{ fontSize: '1.15rem', color: 'var(--text-body)', lineHeight: '1.6', marginBottom: '2.2rem', maxWidth: '520px' }}>
                Discover beautiful handmade creations, customized gifts and artistic pieces crafted with care.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2.5rem' }}>
                <Link to="/shop" className="btn btn-lg btn-primary">
                  SHOP COLLECTION <ArrowRight size={18} />
                </Link>
                <Link to="/custom-orders" className="btn btn-lg btn-secondary">
                  <Sparkles size={18} color="var(--rose-primary)" /> CUSTOM ORDER
                </Link>
              </div>

              {/* Trust Indicators */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.8rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.8rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.35rem', color: 'var(--text-main)', fontFamily: 'var(--font-serif-display)' }}>
                    2,500+
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bespoke Artworks Created</div>
                </div>
                <div style={{ borderLeft: '1px solid var(--border-subtle)' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.35rem', color: 'var(--text-main)', fontFamily: 'var(--font-serif-display)' }}>
                    4.9 ★
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From 600+ Reviews</div>
                </div>
                <div style={{ borderLeft: '1px solid var(--border-subtle)' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.35rem', color: 'var(--text-main)', fontFamily: 'var(--font-serif-display)' }}>
                    100%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pure Handcrafted Quality</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Mosaic */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '480px', margin: '0 auto' }}>
                
                {/* Main Hero Card */}
                <div
                  style={{
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lg)',
                    border: '8px solid #FFFFFF',
                    backgroundColor: 'var(--bg-subtle)',
                    aspectRatio: '4 / 5',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=80"
                    alt="Manmeet Creations Handcrafted Embroidery Art"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Floating Top Pill Badge */}
                <div
                  className="animate-float"
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-15px',
                    backgroundColor: '#FFFFFF',
                    padding: '0.8rem 1.2rem',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--rose-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Heart size={18} color="var(--rose-primary)" fill="var(--rose-primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Artisan Promise</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>100% Personalized</div>
                  </div>
                </div>

                {/* Floating Bottom Card */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-25px',
                    left: '-20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '1rem 1.4rem',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-hover)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    maxWidth: '280px',
                  }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={20} color="var(--gold-dark)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>Custom Orders Open ✨</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Wedding, Anniversary & Milestone gifts</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 1. FEATURED CATEGORIES ================= */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-cream)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">
              <Sparkles size={14} /> Curated Craftsmanship
            </span>
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-desc">
              From delicate thread needlework to high-gloss ocean resin, explore our signature handcrafted mediums.
            </p>
          </div>

          <div className="grid-4">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category._id || category.slug}
                to={`/shop?category=${encodeURIComponent(category.name)}`}
                className="craft-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ position: 'relative', width: '100%', paddingTop: '75%', overflow: 'hidden' }}>
                  <img
                    src={getImageUrl(category.image)}
                    alt={category.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
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
                      background: 'linear-gradient(to top, rgba(32, 26, 24, 0.6) 0%, transparent 60%)',
                    }}
                  />
                  <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px', color: '#FFFFFF' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
                      {category.itemCount || 3} Creations
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                      {category.name}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--rose-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      Explore Collection <ChevronRight size={14} />
                    </span>
                  </div>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getCategoryIcon(category.iconName)}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/categories" className="btn btn-secondary">
              View All 8 Craft Categories →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 2. FEATURED PRODUCTS ================= */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-subtitle">
                <Sparkles size={14} /> Handpicked Masterpieces
              </span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                Featured Creations
              </h2>
            </div>
            <Link to="/shop" className="btn btn-outline-rose" style={{ padding: '0.6rem 1.4rem' }}>
              View All ({featuredProducts.length}+) <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--rose-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>Loading handcrafted pieces...</p>
            </div>
          ) : (
            <div className="grid-4">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard
                  key={product._id || product.slug}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= 3. WHY CHOOSE MANMEET CREATIONS ================= */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-cream)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">
              <Sparkles size={14} /> The Boutique Difference
            </span>
            <h2 className="section-title">Why Choose Manmeet Creations</h2>
            <p className="section-desc">
              We believe every gift tells a story. Our creations are not factory produced; they are born from patient passion and high artistry.
            </p>
          </div>

          <div className="grid-4">
            
            <div className="craft-card" style={{ padding: '2rem 1.5rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--rose-light)', margin: '0 auto 1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={28} color="var(--rose-primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Handcrafted with Love</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Every single stitch, floral arrangement and resin pour is individually crafted by our master artisans with unmatched attention to detail.
              </p>
            </div>

            <div className="craft-card" style={{ padding: '2rem 1.5rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--lavender-light)', margin: '0 auto 1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Palette size={28} color="var(--lavender-primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Custom Designs</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Your vision is our blueprint. Customize colors, names, quotes, sizes, and reference photos to create a one-of-a-kind keepsake.
              </p>
            </div>

            <div className="craft-card" style={{ padding: '2rem 1.5rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--gold-light)', margin: '0 auto 1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={28} color="var(--gold-dark)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Premium Quality</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                We use imported DMC cotton threads, UV-resistant non-yellowing epoxy resins, Fabriano archival papers, and food-safe platters.
              </p>
            </div>

            <div className="craft-card" style={{ padding: '2rem 1.5rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--rose-light)', margin: '0 auto 1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Gift size={28} color="var(--rose-primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>Made Especially for You</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Arrives packaged in luxury gift boxes with personalized wax-sealed greeting cards, ready to present to your loved ones.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 4. BESPOKE CUSTOM ORDERS CTA ================= */}
      <section
        className="section-padding"
        style={{
          background: 'linear-gradient(135deg, #2A211E 0%, #1A1412 100%)',
          color: '#FAF7F2',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--rose-primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.8rem' }}>
                <Sparkles size={16} /> Bespoke Commission Service
              </span>

              <h2 style={{ color: '#FFFFFF', fontSize: '2.4rem', marginBottom: '1rem', lineHeight: '1.2' }}>
                Have Something Special in Mind?
              </h2>

              <p style={{ color: '#C5BCB6', fontSize: '1.15rem', lineHeight: '1.6', marginBottom: '1.8rem' }}>
                Tell us your idea and we'll turn it into a handmade creation. Whether it's wedding garland preservation, custom bridal dupattas, or a realism family portrait, our artisans bring your memory to life.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#EBE3DA', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} color="var(--rose-primary)" /> Share reference photos, color palettes & custom text
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#EBE3DA', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} color="var(--rose-primary)" /> Receive personalized consultation & design drafts
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#EBE3DA', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={18} color="var(--rose-primary)" /> Guaranteed safe delivery in luxury gift presentation
                </div>
              </div>

              <Link to="/custom-orders" className="btn btn-lg btn-primary" style={{ boxShadow: '0 8px 30px rgba(212, 115, 118, 0.4)' }}>
                REQUEST CUSTOM ORDER <ArrowRight size={18} />
              </Link>
            </div>

            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  border: '6px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  aspectRatio: '4 / 3',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80"
                  alt="Custom Order Artisan Process"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 5. INSTAGRAM-STYLE GALLERY ================= */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">
              <InstagramIcon size={16} /> @mc.___.26
            </span>
            <h2 className="section-title">Follow Our Artisan Journey</h2>
            <p className="section-desc">
              Behind the scenes, fresh studio dispatches, and work-in-progress snapshots straight from our workshop.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '1.25rem' }}>
            {instagramImages.map((item, idx) => (
              <a
                key={idx}
                href="https://www.instagram.com/mc.___.26/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: 'relative',
                  paddingTop: '100%',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-subtle)',
                  display: 'block',
                }}
                title="View on Instagram @mc.___.26"
              >
                <img
                  src={item.url}
                  alt="Artwork snippet"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '1rem',
                  }}
                >
                  <span style={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={14} color="var(--rose-primary)" /> {item.tag}
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.2rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <a
              href="https://www.instagram.com/mc.___.26/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                background: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)',
                color: '#FFFFFF',
                gap: '0.6rem',
                padding: '0.75rem 1.6rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 15px rgba(221, 42, 123, 0.25)',
              }}
            >
              <InstagramIcon size={18} /> Follow @mc.___.26 on Instagram
            </a>

            <Link to="/gallery" className="btn btn-secondary">
              View Full High-Res Masonry Gallery →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 6. CUSTOMER REVIEWS ================= */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-cream)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">
              <Sparkles size={14} /> Real Testimonials
            </span>
            <h2 className="section-title">Loved by Our Patrons</h2>
            <p className="section-desc">
              Here is what people across India are saying about their bespoke Manmeet Creations keepsakes.
            </p>
          </div>

          <div className="grid-3">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="craft-card"
                style={{
                  padding: '2.2rem 1.8rem',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                <Quote
                  size={42}
                  color="var(--rose-light)"
                  style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.8 }}
                />

                <div>
                  <div style={{ display: 'flex', color: '#F59E0B', gap: '2px', marginBottom: '1rem' }}>
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#F59E0B" />
                    ))}
                  </div>

                  <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: '1.6', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                    “{item.text}”
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.city} • Verified Buyer</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--rose-primary)', marginTop: '0.2rem', fontWeight: 600 }}>
                    Ordered: {item.product}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 7. FINAL CTA ================= */}
      <section
        style={{
          padding: '6rem 0',
          backgroundColor: '#FAF7F2',
          borderTop: '1px solid var(--border-light)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: '720px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--rose-light)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={28} color="var(--rose-primary)" />
          </div>

          <h2 style={{ fontSize: '2.6rem', marginBottom: '1rem', lineHeight: '1.2' }}>
            Create Something Beautiful.
          </h2>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2.2rem' }}>
            Whether it’s celebrating a wedding, an anniversary, a new home, or simply treating yourself to handcrafted luxury art.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn-lg btn-primary">
              SHOP NOW <ArrowRight size={18} />
            </Link>
            <Link to="/custom-orders" className="btn btn-lg btn-secondary">
              REQUEST CUSTOM ORDER
            </Link>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
