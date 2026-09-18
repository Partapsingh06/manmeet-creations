import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2
} from 'lucide-react';
import { InstagramIcon } from '../components/InstagramIcon';
import { apiRequest } from '../utils/api';
import { useToast } from '../context/ToastContext';

export const ContactPage = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill in your name, email and message', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (data.success) {
        setSubmitted(true);
        addToast('Message sent to workshop! ✨', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to send message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const phone = import.meta.env.VITE_WHATSAPP_PHONE || '916239661708';
    const text = encodeURIComponent('Hello Manmeet! I am reaching out through your website regarding a handcrafted order / custom art inquiry ✨');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const getDirectionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=VPO+Tughalwal,+Near+Harchowal,+Punjab+143527,+India';

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
            <Sparkles size={14} /> Get in Touch
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>
            We’d Love to Hear From You
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Have a question about a product, custom timelines, bulk bridal gifting, or studio visits? Our artisan team is always delighted to assist.
          </p>
        </div>
      </div>

      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', marginBottom: '4rem' }}>
          
          {/* Left: Contact Form */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem 2.5rem',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-light)',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#E8F7EE', color: '#28a745', margin: '0 auto 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Message Received! ✨</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.8rem', lineHeight: '1.6' }}>
                  Thank you for reaching out, <strong>{formData.name}</strong>. We have received your note and our lead artisan will reply via email/phone within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="btn btn-secondary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Send Us a Message</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                  Fill out the form below and we will get back to you promptly.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Gurpreet Singh"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="e.g. gurpreet@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="e.g. +91 62396 61708"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select
                      className="form-control"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Order Status & Delivery">Order Status & Delivery</option>
                      <option value="Custom Order Request">Custom Order Request</option>
                      <option value="Bulk / Corporate Gifting">Bulk / Corporate Gifting</option>
                      <option value="Collaboration / Media">Collaboration / Media</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Message *</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      placeholder="Write your thoughts, questions, or specific art requirements here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-lg btn-primary btn-block"
                  >
                    <Send size={18} /> {submitting ? 'Sending Message...' : 'SEND MESSAGE'}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right: Contact Information & Direct Action Channels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Studio Info Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
              }}
            >
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem' }}>
                Workshop & Studio Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--rose-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={20} color="var(--rose-primary)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Studio Location</h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 600, lineHeight: '1.5', marginBottom: '0.25rem' }}>
                      VPO Tughalwal, Near Harchowal,
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      Punjab, India – 143527
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--rose-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={20} color="var(--rose-primary)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Direct Helpline</h4>
                    <a href="tel:+916239661708" style={{ fontSize: '0.9rem', color: 'var(--rose-primary)', fontWeight: 600, textDecoration: 'none' }}>
                      +91 62396 61708
                    </a>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>(Mon - Sat)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--rose-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={20} color="var(--rose-primary)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Art Inquiries & Orders</h4>
                    <a href="mailto:kmeet7270@gmail.com" style={{ fontSize: '0.9rem', color: 'var(--rose-primary)', fontWeight: 600, textDecoration: 'none' }}>
                      kmeet7270@gmail.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--rose-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={20} color="var(--rose-primary)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Studio Hours</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>10:00 AM – 7:00 PM IST</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Instant Channels: WhatsApp & Instagram */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <button
                onClick={handleWhatsApp}
                className="btn"
                style={{ backgroundColor: '#25D366', color: '#FFF', padding: '1rem', gap: '0.6rem', fontWeight: 600, borderRadius: 'var(--radius-md)' }}
              >
                <MessageCircle size={20} /> Chat on WhatsApp
              </button>

              <a
                href="https://www.instagram.com/mc.___.26/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ background: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)', color: '#FFF', padding: '1rem', gap: '0.6rem', fontWeight: 600, borderRadius: 'var(--radius-md)' }}
                title="Follow @mc.___.26 on Instagram"
              >
                <InstagramIcon size={20} /> DM @mc.___.26
              </a>
            </div>

          </div>

        </div>

        {/* Location & Map Section */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-light)',
          }}
        >
          <div
            style={{
              padding: '2.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem',
              borderBottom: '1px solid var(--border-light)',
              backgroundColor: '#FAF7F2',
            }}
          >
            <div>
              <span className="section-subtitle" style={{ marginBottom: '0.3rem' }}>
                <MapPin size={14} /> Official Studio Location
              </span>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                Visit Manmeet Creations Studio
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                VPO Tughalwal, Near Harchowal, Punjab, India – 143527
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href={getDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ gap: '0.5rem', padding: '0.75rem 1.6rem' }}
              >
                <MapPin size={18} /> Get Directions
              </a>
              <a
                href="https://wa.me/916239661708"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ gap: '0.5rem', padding: '0.75rem 1.4rem' }}
              >
                <MessageCircle size={18} color="#25D366" /> WhatsApp Us
              </a>
            </div>
          </div>

          {/* Interactive Embedded Google Map */}
          <div style={{ width: '100%', height: '420px', position: 'relative' }}>
            <iframe
              title="Manmeet Creations Studio Location"
              src="https://maps.google.com/maps?q=VPO+Tughalwal,+Near+Harchowal,+Punjab+143527,+India&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>

    </div>
  );
};
