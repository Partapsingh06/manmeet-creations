import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Palette, Scissors, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--bg-cream)', paddingBottom: '6rem' }}>
      
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EAE8 100%)',
          padding: '4rem 0 3rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '4rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '750px' }}>
          <span className="section-subtitle">
            <Sparkles size={14} /> Our Soul & Story
          </span>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem', lineHeight: '1.2' }}>
            Crafting Memories with Art & Love ✨
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.6' }}>
            Every creation at Manmeet Creations begins with a story — your milestone, your wedding, your love. We exist to preserve those precious moments into timeless tangible art.
          </p>
        </div>
      </div>

      <div className="container">
        
        {/* Section 1: Who We Are */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
          <div>
            <span className="section-subtitle">The Artisan Heritage</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1.2rem', lineHeight: '1.25' }}>
              Who We Are
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: '1.7', marginBottom: '1.2rem' }}>
              Founded in Punjab by artist <strong>Manmeet Kaur</strong>, Manmeet Creations began as an intimate pursuit of tactile craft. In a world overrun by mass automated manufacturing, we felt that the human soul, the warmth of fingers on fabric, and the patience of slow craftsmanship were becoming rare treasures.
            </p>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: '1.7', marginBottom: '1.8rem' }}>
              Today, our dedicated studio transforms delicate threads, pure organza silk, crystal resins, botanical flowers, and charcoal into personalized heirlooms cherished by over 2,500 families across India and worldwide.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--rose-primary)', fontFamily: 'var(--font-serif-display)' }}>100%</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Handmade Process</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)' }} />
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--rose-primary)', fontFamily: 'var(--font-serif-display)' }}>2,500+</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Happy Customers</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)' }} />
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--rose-primary)', fontFamily: 'var(--font-serif-display)' }}>4.9★</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Average Rating</div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '8px solid #FFFFFF',
                aspectRatio: '4 / 3',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=80"
                alt="Manmeet Studio Embroidery"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: What We Create */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-xl)', padding: '4rem 3rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)', marginBottom: '6rem' }}>
          <div className="section-header" style={{ marginBottom: '3rem' }}>
            <span className="section-subtitle"><Sparkles size={14} /> Our Mediums</span>
            <h2 className="section-title">What We Create</h2>
            <p className="section-desc">
              We specialize across 8 distinct artisanal craft categories, each mastered over years of dedicated practice.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '2rem' }}>
            <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-cream)' }}>
              <Scissors size={28} color="var(--rose-primary)" style={{ marginBottom: '0.8rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Handmade Embroidery</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                Bridal couple wedding hoops, baby birth announcement hoops, and 3D botanical French knot hoops made with French DMC cotton floss.
              </p>
            </div>

            <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-cream)' }}>
              <Sparkles size={28} color="var(--rose-primary)" style={{ marginBottom: '0.8rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Resin Art & Preservation</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                Ocean wave silent wall clocks, varmala wedding flower preservation blocks, 24K gold leaf resin trays, and matching geode coaster sets.
              </p>
            </div>

            <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-cream)' }}>
              <Palette size={28} color="var(--rose-primary)" style={{ marginBottom: '0.8rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Fabric Painting</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                Pure organza watercolor dupattas, custom-painted vintage denim jackets, and aesthetic eco-friendly heavy canvas tote bags.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Our 4-Stage Handcrafted Process */}
        <div style={{ marginBottom: '6rem' }}>
          <div className="section-header">
            <span className="section-subtitle"><Sparkles size={14} /> From Vision to Keepsake</span>
            <h2 className="section-title">Our Handmade Process</h2>
            <p className="section-desc">
              How a custom thought is transformed into a luxury handcrafted art piece.
            </p>
          </div>

          <div className="grid-4" style={{ gap: '1.8rem' }}>
            
            <div className="craft-card" style={{ padding: '2rem 1.5rem', backgroundColor: '#FFFFFF' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--rose-primary)', color: '#FFFFFF', fontWeight: 700, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', fontFamily: 'var(--font-serif-display)' }}>
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Design Consultation</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                We understand your idea, names, color motifs, and reference photos to draft a personalized design composition.
              </p>
            </div>

            <div className="craft-card" style={{ padding: '2rem 1.5rem', backgroundColor: '#FFFFFF' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--rose-primary)', color: '#FFFFFF', fontWeight: 700, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', fontFamily: 'var(--font-serif-display)' }}>
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Material Selection</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                We handpick natural beechwood hoops, archival cotton canvas, UV-resistant non-yellowing epoxy resins, and silk threads.
              </p>
            </div>

            <div className="craft-card" style={{ padding: '2rem 1.5rem', backgroundColor: '#FFFFFF' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--rose-primary)', color: '#FFFFFF', fontWeight: 700, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', fontFamily: 'var(--font-serif-display)' }}>
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Artisan Crafting</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Thousands of precision stitches, multi-layered resin cell foaming, or meticulous watercolor brushwork done by hand.
              </p>
            </div>

            <div className="craft-card" style={{ padding: '2rem 1.5rem', backgroundColor: '#FFFFFF' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--rose-primary)', color: '#FFFFFF', fontWeight: 700, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', fontFamily: 'var(--font-serif-display)' }}>
                4
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Luxury Packaging</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Packaged in sturdy protective gift boxes with custom ribbons, wax-sealed greeting cards, and tracked courier dispatch.
              </p>
            </div>

          </div>
        </div>

        {/* Section 4: Why Customization Matters & Quality Commitment */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '6rem' }}>
          <div>
            <span className="section-subtitle">The Meaning Behind Art</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1.2rem' }}>
              Why Customization Matters
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: '1.6', marginBottom: '1rem' }}>
              A mass-produced item can be pretty, but a customized piece carries emotional resonance. When your wedding date is embroidered in golden thread or your favorite song's soundwave is etched into optical acrylic, that object becomes an heirloom that outlives trends.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={18} color="var(--rose-primary)" /> Personalized names, dates, quotes & anniversary motifs
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={18} color="var(--rose-primary)" /> Preserving real wedding flowers for a lifetime
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={18} color="var(--rose-primary)" /> Sustainable, ethical small-batch production
              </div>
            </div>
            <Link to="/custom-orders" className="btn btn-primary">
              Commission Your Bespoke Art <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              backgroundColor: 'var(--rose-light)',
              padding: '3rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(212, 115, 118, 0.2)',
              position: 'relative',
            }}
          >
            <Heart size={36} color="var(--rose-primary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '0.8rem' }}>
              Our Quality Commitment
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: '1.6' }}>
              "We treat every single order as if it were a gift for our own family. If any stitch isn't aligned or any pigment isn't harmonious, we start over. That is the promise of Manmeet Creations."
            </p>
            <div style={{ marginTop: '1.5rem', fontWeight: 700, color: 'var(--rose-dark)' }}>
              — Manmeet Kaur, Founder & Lead Artisan
            </div>
          </div>
        </div>

        {/* Section 5: Visit Our Studio & Workshop */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '2.5rem',
          }}
        >
          <div style={{ maxWidth: '600px' }}>
            <span className="section-subtitle"><Sparkles size={14} /> Our Workshop</span>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>Visit Our Studio & Workshop</h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: '1.6', marginBottom: '1rem' }}>
              Experience the craftsmanship in person or consult directly for high-value bridal keepsakes, large ocean wall clocks, and customized gifting collections.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', fontWeight: 600 }}>
              📍 Official Address: VPO Tughalwal, Near Harchowal, Punjab, India – 143527
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="https://www.instagram.com/mc.___.26/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                background: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)',
                color: '#FFFFFF',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
              }}
            >
              Instagram @mc.___.26
            </a>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=VPO+Tughalwal,+Near+Harchowal,+Punjab+143527,+India"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Get Directions 📍
            </a>
            <Link to="/contact" className="btn btn-secondary">
              Contact Studio
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
