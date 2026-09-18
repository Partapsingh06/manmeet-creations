import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  ChevronDown,
  ShoppingBag,
  RotateCcw
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { apiRequest } from '../utils/api';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const ratingParam = searchParams.get('rating') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam || 6000);
  const [minRating, setMinRating] = useState(ratingParam || '');

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiRequest('/categories');
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Sync URL params to local state
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
    setSearchQuery(searchParams.get('search') || '');
    setSortBy(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.append('category', selectedCategory);
        }
        if (searchQuery.trim()) {
          queryParams.append('search', searchQuery.trim());
        }
        if (sortBy) {
          queryParams.append('sort', sortBy);
        }
        if (maxPrice && maxPrice < 6000) {
          queryParams.append('maxPrice', maxPrice);
        }
        if (minRating) {
          queryParams.append('rating', minRating);
        }

        const data = await apiRequest(`/products?${queryParams.toString()}`);
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Error fetching shop products:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy, maxPrice, minRating]);

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    const newParams = new URLSearchParams(searchParams);
    if (catName === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', catName);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set('search', searchQuery.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('newest');
    setMaxPrice(6000);
    setMinRating('');
    setSearchParams({});
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-cream)', minHeight: '80vh', paddingBottom: '5rem' }}>
      
      {/* Shop Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EAE8 100%)',
          padding: '3.5rem 0 2.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '2.5rem',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-subtitle">
            <Sparkles size={14} /> The Complete Collection
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>
            Artisan Shop & Keepsakes
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            Explore 24+ unique handcrafted embroidery hoops, ocean resin clocks, organza dupattas, charcoal portraits, and personalized explosion boxes.
          </p>

          {/* Quick Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '0.6rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              maxWidth: '900px',
              margin: '0 auto',
            }}
          >
            <button
              onClick={() => handleCategoryClick('All')}
              className={`btn btn-sm ${selectedCategory === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              All Creations
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id || cat.slug}
                onClick={() => handleCategoryClick(cat.name)}
                className={`btn btn-sm ${selectedCategory === cat.name ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Shop Container */}
      <div className="container">
        
        {/* Top Filter Bar & Search */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-light)',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1', minWidth: '240px', maxWidth: '380px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search art pieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '38px', fontSize: '0.9rem', padding: '0.55rem 0.8rem 0.55rem 38px' }}
              />
            </div>
            <button type="submit" className="btn btn-sm btn-primary">Search</button>
          </form>

          {/* Right Controls: Sort & Mobile Filter Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            
            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-control"
                style={{ padding: '0.5rem 1rem', fontSize: '0.88rem', width: 'auto', cursor: 'pointer' }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Popular & Top Rated</option>
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="btn btn-sm btn-secondary mobile-filter-btn"
              style={{ display: 'none', alignItems: 'center', gap: '0.4rem' }}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }} className="shop-layout">
          
          {/* Left Desktop Sidebar Filters */}
          <aside className="shop-sidebar">
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                position: 'sticky',
                top: '90px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.8rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Filter size={18} color="var(--rose-primary)" /> Filter Art
                </h3>
                <button
                  onClick={resetFilters}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                >
                  <RotateCcw size={13} /> Reset
                </button>
              </div>

              {/* Category Filter List */}
              <div style={{ marginBottom: '1.8rem' }}>
                <h4 style={{ fontSize: '0.92rem', marginBottom: '0.8rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Categories
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer', color: selectedCategory === 'All' ? 'var(--rose-primary)' : 'var(--text-body)', fontWeight: selectedCategory === 'All' ? 600 : 400 }}>
                    <input
                      type="radio"
                      name="cat"
                      checked={selectedCategory === 'All'}
                      onChange={() => handleCategoryClick('All')}
                    />
                    All Categories
                  </label>
                  {categories.map((cat) => (
                    <label key={cat._id || cat.slug} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer', color: selectedCategory === cat.name ? 'var(--rose-primary)' : 'var(--text-body)', fontWeight: selectedCategory === cat.name ? 600 : 400 }}>
                      <input
                        type="radio"
                        name="cat"
                        checked={selectedCategory === cat.name}
                        onChange={() => handleCategoryClick(cat.name)}
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div style={{ marginBottom: '1.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <h4 style={{ fontSize: '0.92rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Max Price
                  </h4>
                  <span style={{ fontWeight: 700, color: 'var(--rose-primary)', fontSize: '0.95rem' }}>
                    ₹{Number(maxPrice).toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="6000"
                  step="200"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--rose-primary)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span>₹500</span>
                  <span>₹6,000+</span>
                </div>
              </div>

              {/* Star Rating Filter */}
              <div>
                <h4 style={{ fontSize: '0.92rem', marginBottom: '0.8rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Minimum Rating
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { val: '', label: 'All Ratings' },
                    { val: '4.8', label: '4.8★ & Above' },
                    { val: '4.5', label: '4.5★ & Above' },
                  ].map((r) => (
                    <label key={r.val} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === r.val}
                        onChange={() => setMinRating(r.val)}
                      />
                      {r.label}
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Right Product Grid */}
          <main>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--rose-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
                <p style={{ color: 'var(--text-muted)' }}>Updating catalog results...</p>
              </div>
            ) : products.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  padding: '4rem 2rem',
                  textAlign: 'center',
                  border: '1px solid var(--border-light)',
                }}
              >
                <ShoppingBag size={48} color="var(--rose-primary)" style={{ margin: '0 auto 1.2rem', opacity: 0.8 }} />
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No creations found</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                  We couldn't find any artwork matching your current filters. Try resetting your search or price range.
                </p>
                <button onClick={resetFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Showing <strong>{products.length}</strong> handcrafted {products.length === 1 ? 'creation' : 'creations'}
                </div>

                <div className="grid-3">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id || product.slug}
                      product={product}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />
                  ))}
                </div>
              </div>
            )}
          </main>

        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            style={{
              width: '85%',
              maxWidth: '320px',
              backgroundColor: '#FFFFFF',
              height: '100%',
              padding: '1.5rem',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Filter Products</h3>
              <button onClick={() => setMobileFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.6rem' }}>Categories</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button onClick={() => { handleCategoryClick('All'); setMobileFilterOpen(false); }} className={`btn btn-sm ${selectedCategory === 'All' ? 'btn-primary' : 'btn-secondary'}`}>
                  All
                </button>
                {categories.map((c) => (
                  <button key={c._id} onClick={() => { handleCategoryClick(c.name); setMobileFilterOpen(false); }} className={`btn btn-sm ${selectedCategory === c.name ? 'btn-primary' : 'btn-secondary'}`}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setMobileFilterOpen(false)} className="btn btn-primary btn-block">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .shop-layout { grid-template-columns: 1fr !important; }
          .shop-sidebar { display: none !important; }
          .mobile-filter-btn { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
};
