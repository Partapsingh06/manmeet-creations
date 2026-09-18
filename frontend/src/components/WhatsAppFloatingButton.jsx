import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const WhatsAppFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('Hello Manmeet! I am exploring your handcrafted creations and would like to inquire about a custom order.');
  const location = useLocation();

  const phone = import.meta.env.VITE_WHATSAPP_PHONE || '916239661708';

  const handleSend = () => {
    const encoded = encodeURIComponent(`${message}\n\n(Page: ${window.location.origin}${location.pathname})`);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 990,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
      >
        {/* Expanded Quick Chat Popup */}
        {isOpen && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-subtle)',
              width: '320px',
              padding: '1.25rem',
              marginBottom: '1rem',
              animation: 'fadeIn 0.25s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#25D366' }} />
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>Chat with Artisan</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', marginBottom: '0.75rem', lineHeight: '1.4' }}>
              Need urgent customization, custom portrait quotes, or bridal orders? Message lead artisan <strong>Manmeet</strong> directly on WhatsApp! ✨
            </p>

            <textarea
              className="form-control"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ fontSize: '0.85rem', marginBottom: '0.75rem', minHeight: '70px' }}
            />

            <button
              onClick={handleSend}
              className="btn btn-sm btn-block"
              style={{ backgroundColor: '#25D366', color: '#FFF', gap: '0.4rem', fontWeight: 600 }}
            >
              <Send size={15} /> Start WhatsApp Chat
            </button>
          </div>
        )}

        {/* The Round Floating WhatsApp Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)',
            transition: 'var(--transition-smooth)',
            position: 'relative',
          }}
          aria-label="Contact on WhatsApp"
        >
          {isOpen ? <X size={26} /> : <MessageCircle size={28} />}
          
          {/* Subtle pulse animation indicator */}
          <span
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: '#FF3B30',
              border: '2px solid #FFFFFF',
            }}
          />
        </button>
      </div>
    </>
  );
};
