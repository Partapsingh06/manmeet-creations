import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  Send,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Clock,
  MessageCircle,
  HelpCircle,
  Palette,
  Image as ImageIcon,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const CustomOrderPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    phone: user ? user.phone : '',
    email: user ? user.email : '',
    whatWouldYouLike: '',
    category: 'Handmade Embroidery',
    customizationDetails: '',
    preferredSize: '',
    budget: '₹2,000 - ₹4,000',
    requiredDate: '',
    referenceImage: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const categories = [
    'Handmade Embroidery',
    'Resin Art',
    'Fabric Painting',
    'Portraits',
    'Handmade Gifts',
    'Customized Gifts',
    'Handmade Jewellery',
    'Decorative Crafts',
    'Other Bespoke Art',
  ];

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        addToast('Please upload an image smaller than 8MB', 'error');
        return;
      }

      // Create base64 preview & upload
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result;
        setImagePreview(base64Data);

        // Upload to server
        try {
          const uploadFormData = new FormData();
          uploadFormData.append('image', file);
          const uploadRes = await apiRequest('/upload', {
            method: 'POST',
            body: uploadFormData,
          });

          if (uploadRes.success) {
            setFormData((prev) => ({ ...prev, referenceImage: uploadRes.imageUrl }));
          } else {
            setFormData((prev) => ({ ...prev, referenceImage: base64Data }));
          }
        } catch {
          // Fallback to storing base64 string
          setFormData((prev) => ({ ...prev, referenceImage: base64Data }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.email || !formData.whatWouldYouLike || !formData.customizationDetails || !formData.requiredDate) {
      addToast('Please fill in all mandatory fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiRequest('/custom-orders', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (data.success) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D47376', '#C59A4E', '#8E7C93', '#FAF7F2'],
        });
        setSuccessData(data.customOrder);
        addToast('Custom Request Submitted! ✨', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit bespoke request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFastTrackWhatsApp = () => {
    if (!successData) return;
    const phone = import.meta.env.VITE_WHATSAPP_PHONE || '916239661708';
    const text = encodeURIComponent(
      `Hello Manmeet! I just submitted custom order request #${successData.requestId}.\n\nItem: ${successData.whatWouldYouLike}\nCategory: ${successData.category}\nRequired Date: ${successData.requiredDate}\nBudget: ${successData.budget}\n\nCould we discuss this on WhatsApp?`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-cream)', paddingBottom: '6rem' }}>
      
      {/* Header Banner */}
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
            <Sparkles size={14} /> Bespoke Commission Studio
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>
            Bring Your Dream Craft to Life
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Have a cherished photo, bridal garland, personalized wedding hoop, or unique canvas idea in mind? Tell us your specifications and we'll handcraft it with passion.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '900px' }}>
        {successData ? (
          /* Success Screen */
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-light)',
            }}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E8F7EE', color: '#28a745', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={44} />
            </div>

            <h2 style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>Custom Request Received! ✨</h2>
            
            <div style={{ display: 'inline-block', backgroundColor: 'var(--rose-light)', color: 'var(--rose-dark)', padding: '0.4rem 1.2rem', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Request ID: {successData.requestId}
            </div>

            <p style={{ color: 'var(--text-body)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
              Thank you, <strong>{successData.fullName}</strong>! Our lead artisan Manmeet will review your specifications for <em>"{successData.whatWouldYouLike}"</em> and reach out via WhatsApp/Email within 24 hours with design drafts and quotation.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={handleFastTrackWhatsApp} className="btn btn-lg" style={{ backgroundColor: '#25D366', color: '#FFF' }}>
                <MessageCircle size={20} /> Fast-Track on WhatsApp
              </button>
              <button onClick={() => setSuccessData(null)} className="btn btn-lg btn-secondary">
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          /* Commission Request Form */
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem 2.5rem',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-light)',
            }}
          >
            <form onSubmit={handleSubmit}>
              
              {/* Step 1: Customer Contact Info */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.6rem' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--rose-primary)', color: '#FFF', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                  Your Contact Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Jasleen Kaur"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. jasleen@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: What Would You Like */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.6rem' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--rose-primary)', color: '#FFF', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                  Bespoke Craft Specifications
                </h3>

                <div className="form-group">
                  <label className="form-label">What would you like crafted? (Headline) *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 12-inch Bridal Garland Varmala Preservation Resin Clock"
                    value={formData.whatWouldYouLike}
                    onChange={(e) => setFormData({ ...formData, whatWouldYouLike: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                  <div className="form-group">
                    <label className="form-label">Art Category *</label>
                    <select
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Size / Dimensions</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 10-inch hoop / A3 size / Custom"
                      value={formData.preferredSize}
                      onChange={(e) => setFormData({ ...formData, preferredSize: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Estimated Budget</label>
                    <select
                      className="form-control"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    >
                      <option value="Under ₹1,500">Under ₹1,500</option>
                      <option value="₹1,500 - ₹3,000">₹1,500 - ₹3,000</option>
                      <option value="₹3,000 - ₹5,000">₹3,000 - ₹5,000</option>
                      <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option>
                      <option value="Flexible / Artist Discretion">Flexible / Quote Required</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Required Delivery Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.requiredDate}
                      onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Customization Instructions *</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Describe your desired colors, text/names to be written, wedding dates, floral preferences, or any heartfelt personal notes..."
                    value={formData.customizationDetails}
                    onChange={(e) => setFormData({ ...formData, customizationDetails: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Step 3: Reference Image Upload */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.6rem' }}>
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--rose-primary)', color: '#FFF', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                  Upload Reference Image or Photo
                </h3>

                <div
                  style={{
                    border: '2px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-ivory)',
                    position: 'relative',
                  }}
                >
                  {imagePreview ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={imagePreview}
                        alt="Reference Preview"
                        style={{ maxHeight: '220px', borderRadius: 'var(--radius-md)', objectFit: 'contain' }}
                      />
                      <button
                        type="button"
                        onClick={() => { setImagePreview(''); setFormData({ ...formData, referenceImage: '' }); }}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: '#dc3545',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload size={36} color="var(--rose-primary)" style={{ margin: '0 auto 0.8rem', opacity: 0.8 }} />
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                        Drag & Drop or Browse Reference Photo
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        Couple photo for portraits, garland photos, color palette inspiration (JPG, PNG, WebP up to 8MB)
                      </p>
                      <label className="btn btn-sm btn-outline-rose" style={{ cursor: 'pointer' }}>
                        Choose File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-lg btn-primary btn-block"
                style={{ padding: '1rem' }}
              >
                <Sparkles size={20} /> {submitting ? 'Submitting Request...' : 'SUBMIT CUSTOM REQUEST'}
              </button>

            </form>
          </div>
        )}
      </div>

    </div>
  );
};
