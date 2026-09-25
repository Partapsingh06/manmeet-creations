import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, Trash2, Star, Loader2, RefreshCw } from 'lucide-react';
import { uploadImageFile, getImageUrl, deleteImageFile } from '../utils/api';
import { useToast } from '../context/ToastContext';

/**
 * Single Image Uploader Component (Ideal for Categories, Featured Product Image)
 */
export const SingleImageUploader = ({
  value,
  onChange,
  label = 'Category Image',
  recommendedSize = 'Square or 4:3 (e.g., 800x800px)',
  required = false,
}) => {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUpload(file);
    // Reset input so same file can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processUpload = async (file) => {
    // Validate format
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type) && !/\.(jpe?g|png|webp|gif)$/i.test(file.name)) {
      addToast('Invalid image type. Please upload JPG, PNG, WEBP, or GIF.', 'error');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      addToast('Image is too large. Max file size is 12MB.', 'error');
      return;
    }

    setUploading(true);
    try {
      const res = await uploadImageFile(file);
      if (res.success && res.imageUrl) {
        onChange(res.imageUrl);
        addToast('Image uploaded successfully! ✨', 'success');
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err) {
      addToast(err.message || 'Failed to upload image. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDelete = async () => {
    if (!value) return;
    if (window.confirm('Are you sure you want to remove this image?')) {
      const oldUrl = value;
      onChange('');
      addToast('Image removed', 'info');
      // Background cleanup from storage if applicable
      deleteImageFile(oldUrl).catch(() => {});
    }
  };

  return (
    <div style={{ marginBottom: '1.2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
        <label className="form-label" style={{ marginBottom: 0 }}>
          {label} {required && '*'}
        </label>
        {recommendedSize && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {recommendedSize}
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {value ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            padding: '0.9rem',
            backgroundColor: 'var(--bg-cream)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              flexShrink: 0,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <img
              src={getImageUrl(value)}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=300&q=80';
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-main)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginBottom: '0.5rem',
              }}
              title={value}
            >
              {value.startsWith('http') ? value.split('/').pop() : value}
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="btn btn-sm btn-secondary"
                style={{
                  fontSize: '0.8rem',
                  padding: '0.35rem 0.75rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                {uploading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                {uploading ? 'Uploading...' : 'Replace Image'}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={uploading}
                className="btn btn-sm"
                style={{
                  fontSize: '0.8rem',
                  padding: '0.35rem 0.75rem',
                  color: '#dc3545',
                  backgroundColor: '#FFF1F0',
                  border: '1px solid #FFCCC7',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={13} /> Delete Image
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragActive ? 'var(--rose-primary)' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '1.8rem 1.5rem',
            textAlign: 'center',
            backgroundColor: dragActive ? 'var(--rose-light)' : '#FAFAF8',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {uploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
              <Loader2 size={28} className="animate-spin" color="var(--rose-primary)" />
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--rose-primary)' }}>
                Uploading image to storage...
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--rose-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--rose-primary)',
                  marginBottom: '0.2rem',
                }}
              >
                <Upload size={20} />
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Click to Upload Image from Gallery / Computer
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Supports JPG, PNG, WEBP, GIF (Max 12MB)
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-rose"
                style={{ marginTop: '0.5rem', pointerEvents: 'none' }}
              >
                <Upload size={14} /> Select File
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Multi Image Uploader Component (Ideal for Products Gallery)
 */
export const MultiImageUploader = ({
  images = [],
  onChange,
  label = 'Product Images',
  required = false,
}) => {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const imageList = Array.isArray(images)
    ? images.filter(Boolean)
    : typeof images === 'string' && images.trim() !== ''
    ? images.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowed.includes(file.type) && !/\.(jpe?g|png|webp|gif)$/i.test(file.name)) {
        addToast(`Skipped "${file.name}": unsupported format`, 'error');
        continue;
      }
      if (file.size > 12 * 1024 * 1024) {
        addToast(`Skipped "${file.name}": exceeds 12MB limit`, 'error');
        continue;
      }

      try {
        const res = await uploadImageFile(file);
        if (res.success && res.imageUrl) {
          newUrls.push(res.imageUrl);
        }
      } catch (err) {
        addToast(`Failed to upload ${file.name}: ${err.message}`, 'error');
      }
    }

    if (newUrls.length > 0) {
      onChange([...imageList, ...newUrls]);
      addToast(`Added ${newUrls.length} image(s)! ✨`, 'success');
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDeleteImage = (indexToDelete) => {
    const targetUrl = imageList[indexToDelete];
    if (window.confirm('Are you sure you want to delete this image?')) {
      const updated = imageList.filter((_, idx) => idx !== indexToDelete);
      onChange(updated);
      addToast('Image removed from product', 'info');
      if (targetUrl) {
        deleteImageFile(targetUrl).catch(() => {});
      }
    }
  };

  const handleSetPrimary = (indexToMakePrimary) => {
    if (indexToMakePrimary === 0) return;
    const selected = imageList[indexToMakePrimary];
    const rest = imageList.filter((_, idx) => idx !== indexToMakePrimary);
    onChange([selected, ...rest]);
    addToast('Primary featured image updated! ✨', 'success');
  };

  return (
    <div style={{ marginBottom: '1.4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <label className="form-label" style={{ marginBottom: 0 }}>
          {label} {required && '*'}
        </label>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {imageList.length} {imageList.length === 1 ? 'image' : 'images'} added
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Image Gallery Grid */}
      {imageList.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: '0.8rem',
            marginBottom: '1rem',
          }}
        >
          {imageList.map((imgUrl, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#FFFFFF',
                border: idx === 0 ? '2px solid var(--rose-primary)' : '1px solid var(--border-light)',
                aspectRatio: '1 / 1',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={getImageUrl(imgUrl)}
                alt={`Product ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=300&q=80';
                }}
              />

              {/* Primary Image Badge */}
              {idx === 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    backgroundColor: 'var(--rose-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  Primary
                </div>
              )}

              {/* Action Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  opacity: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
              >
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    title="Make Primary Image"
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--gold-dark)',
                    }}
                  >
                    <Star size={14} fill="var(--gold-dark)" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteImage(idx)}
                  title="Delete Image"
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#dc3545',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dropzone / Button */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onClick={() => !uploading && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? 'var(--rose-primary)' : 'var(--border-subtle)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '1.4rem 1rem',
          textAlign: 'center',
          backgroundColor: dragActive ? 'var(--rose-light)' : '#FAFAF8',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        {uploading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
            <Loader2 size={20} className="animate-spin" color="var(--rose-primary)" />
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--rose-primary)' }}>
              Uploading to secure storage...
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
              <Upload size={16} color="var(--rose-primary)" />
              <span>{imageList.length === 0 ? 'Upload Product Images' : 'Add More Photos'}</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Select photos from gallery or computer (JPG, PNG, WEBP, GIF up to 12MB)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
