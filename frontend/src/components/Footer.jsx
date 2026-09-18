import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Mail, Phone, MapPin, MessageCircle, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: '#201A18', color: '#EBE3DA', paddingTop: '4.5rem', paddingBottom: '2rem' }}>
      
      {/* Top Value Propositions Banner */}
      <div className="container" style={{ borderBottom: '1px solid rgba(235, 227, 218, 0.12)', paddingBottom: '3.5rem', marginBottom: '3.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(212, 115, 118, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Heart size={22} color="var(--rose-primary)" />
            </div>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '0.2rem' }}>100% Handcrafted</h4>
              <p style={{ color: '#9E948E', fontSize: '0.85rem' }}>Every stitch & brush stroke made with pure love</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(212, 115, 118, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={22} color="var(--rose-primary)" />
            </div>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '0.2rem' }}>Bespoke Customization</h4>
              <p style={{ color: '#9E948E', fontSize: '0.85rem' }}>Personalized names, dates & custom color themes</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(212, 115, 118, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Truck size={22} color="var(--rose-primary)" />
            </div>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '0.2rem' }}>Safe Pan-India Delivery</h4>
              <p style={{ color: '#9E948E', fontSize: '0.85rem' }}>Multi-layer protective luxury gift packaging</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(212, 115, 118, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={22} color="var(--rose-primary)" />
            </div>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '0.2rem' }}>Authentic Craft Guarantee</h4>
              <p style={{ color: '#9E948E', fontSize: '0.85rem' }}>Premium non-yellowing resins & DMC threads</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>
          
          {/* Brand Col */}
          <div style={{ maxWidth: '320px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif-display)', color: '#FFFFFF', fontSize: '1.6rem', marginBottom: '0.5rem' }}>
              Manmeet Creations
            </h3>
            <p style={{ fontFamily: 'var(--font-serif-elegant)', fontStyle: 'italic', color: 'var(--rose-primary)', fontSize: '1.05rem', marginBottom: '1.2rem' }}>
              “Crafting memories with art & love ✨”
            </p>
            <p style={{ color: '#A89E98', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              A boutique handmade studio specializing in timeless embroidery hoop art, ocean resin masterpieces, hand-painted fabrics, realism portraits, and heartfelt customized gifts.
            </p>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <a
                href="https://www.instagram.com/mc.___.26/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', transition: 'all 0.2s ease' }}
                aria-label="Instagram"
                title="Follow @mc.___.26 on Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://wa.me/916239661708"
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', transition: 'all 0.2s ease' }}
                aria-label="WhatsApp"
                title="Chat on WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="mailto:kmeet7270@gmail.com"
                style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', transition: 'all 0.2s ease' }}
                aria-label="Email"
                title="Email Us"
              >
                <Mail size={18} />
              </a>
              <a
                href="tel:+916239661708"
                style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', transition: 'all 0.2s ease' }}
                aria-label="Phone"
                title="Call Studio"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '1.2rem', fontFamily: 'var(--font-serif-display)' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ color: '#A89E98' }}>Home</Link></li>
              <li><Link to="/shop" style={{ color: '#A89E98' }}>Shop All Creations</Link></li>
              <li><Link to="/categories" style={{ color: '#A89E98' }}>Explore Categories</Link></li>
              <li><Link to="/custom-orders" style={{ color: '#A89E98' }}>Bespoke Custom Orders</Link></li>
              <li><Link to="/gallery" style={{ color: '#A89E98' }}>Artisan Gallery</Link></li>
              <li><Link to="/about" style={{ color: '#A89E98' }}>Our Brand Story</Link></li>
              <li><Link to="/contact" style={{ color: '#A89E98' }}>Contact Workshop</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '1.2rem', fontFamily: 'var(--font-serif-display)' }}>
              Signature Crafts
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/shop?category=Handmade+Embroidery" style={{ color: '#A89E98' }}>Handmade Embroidery</Link></li>
              <li><Link to="/shop?category=Resin+Art" style={{ color: '#A89E98' }}>Ocean Resin Art</Link></li>
              <li><Link to="/shop?category=Fabric+Painting" style={{ color: '#A89E98' }}>Fabric Painting</Link></li>
              <li><Link to="/shop?category=Portraits" style={{ color: '#A89E98' }}>Charcoal & Watercolor Portraits</Link></li>
              <li><Link to="/shop?category=Handmade+Gifts" style={{ color: '#A89E98' }}>Explosion & Memory Boxes</Link></li>
              <li><Link to="/shop?category=Handmade+Jewellery" style={{ color: '#A89E98' }}>Botanical Resin Jewellery</Link></li>
            </ul>
          </div>

          {/* Contact & Workshop */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', marginBottom: '1.2rem', fontFamily: 'var(--font-serif-display)' }}>
              Workshop & Studio
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: '#A89E98' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--rose-primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>VPO Tughalwal, Near Harchowal, Punjab, India – 143527</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={18} color="var(--rose-primary)" style={{ flexShrink: 0 }} />
                <a href="tel:+916239661708" style={{ color: '#A89E98', textDecoration: 'none' }}>+91 62396 61708</a>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={18} color="var(--rose-primary)" style={{ flexShrink: 0 }} />
                <a href="mailto:kmeet7270@gmail.com" style={{ color: '#A89E98', textDecoration: 'none' }}>kmeet7270@gmail.com</a>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <InstagramIcon size={18} color="#E1306C" style={{ flexShrink: 0 }} />
                <a href="https://www.instagram.com/mc.___.26/" target="_blank" rel="noopener noreferrer" style={{ color: '#A89E98', textDecoration: 'none' }}>Instagram: @mc.___.26</a>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <MessageCircle size={18} color="#25D366" style={{ flexShrink: 0 }} />
                <a href="https://wa.me/916239661708" target="_blank" rel="noopener noreferrer" style={{ color: '#A89E98', textDecoration: 'none' }}>WhatsApp: +91 62396 61708</a>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <Link to="/custom-orders" className="btn btn-sm btn-outline-rose" style={{ color: '#FFF', borderColor: 'var(--rose-primary)' }}>
                  Request Custom Art ✨
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div style={{ borderTop: '1px solid rgba(235, 227, 218, 0.1)', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: '#857B76' }}>
          <div>
            Copyright © {currentYear} <strong>Manmeet Creations</strong>. All rights reserved. Handcrafted with love in India.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/about" style={{ color: '#857B76' }}>Privacy Policy</Link>
            <Link to="/about" style={{ color: '#857B76' }}>Terms of Service</Link>
            <Link to="/contact" style={{ color: '#857B76' }}>Shipping & Delivery</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
