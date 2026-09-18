import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  PackageCheck,
  Palette
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, logout, isAdmin } = useAuth();
  const { itemsCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Boutique Announcement Bar */}
      <div
        style={{
          backgroundColor: '#201A18',
          color: '#FAF7F2',
          fontSize: '0.8rem',
          padding: '0.45rem 1rem',
          textAlign: 'center',
          letterSpacing: '0.04em',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <Sparkles size={13} color="var(--rose-primary)" />
        <span>Crafting memories with art & love ✨ Enjoy Free Express Shipping on orders over ₹999</span>
        <Sparkles size={13} color="var(--rose-primary)" />
      </div>

      {/* Main Sticky Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'all 0.3s ease',
          backgroundColor: isScrolled ? 'rgba(255, 253, 249, 0.95)' : 'rgba(250, 247, 242, 0.98)',
          backdropFilter: 'blur(10px)',
          borderBottom: isScrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
          boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.5rem' }}>
          
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-main)',
              padding: '0.3rem',
            }}
            className="mobile-nav-toggle"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif-display)',
                fontSize: '1.55rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Manmeet Creations
            </span>
            <span
              style={{
                fontFamily: 'var(--font-serif-elegant)',
                fontStyle: 'italic',
                fontSize: '0.85rem',
                color: 'var(--rose-primary)',
                letterSpacing: '0.04em',
              }}
            >
              art & handcrafted memories ✨
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }}>
            {[
              { to: '/', label: 'Home' },
              { to: '/shop', label: 'Shop' },
              { to: '/categories', label: 'Categories' },
              { to: '/custom-orders', label: 'Custom Orders', badge: 'Popular' },
              { to: '/gallery', label: 'Gallery' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  fontSize: '0.93rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--rose-primary)' : 'var(--text-main)',
                  position: 'relative',
                  padding: '0.3rem 0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                })}
              >
                {item.label}
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--rose-light)',
                      color: 'var(--rose-dark)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
            
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
              title="Search handmade art"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/profile?tab=wishlist"
              style={{ position: 'relative', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    backgroundColor: 'var(--rose-primary)',
                    color: '#FFF',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: '17px',
                    height: '17px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {itemsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    backgroundColor: 'var(--rose-primary)',
                    color: '#FFF',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: '17px',
                    height: '17px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {itemsCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Dropdown */}
            <div style={{ position: 'relative' }}>
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                    }}
                  >
                    <User size={16} color="var(--rose-primary)" />
                    <span>{user.name.split(' ')[0]}</span>
                    <ChevronDown size={14} />
                  </button>

                  {userDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 8px)',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--border-subtle)',
                        width: '210px',
                        padding: '0.6rem 0',
                        zIndex: 110,
                        animation: 'fadeIn 0.2s ease',
                      }}
                    >
                      <div style={{ padding: '0.4rem 1rem', borderBottom: '1px solid var(--border-light)', marginBottom: '0.3rem' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.5rem 1rem',
                            fontSize: '0.88rem',
                            color: 'var(--gold-dark)',
                            fontWeight: 600,
                          }}
                        >
                          <LayoutDashboard size={16} />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.5rem 1rem',
                          fontSize: '0.88rem',
                          color: 'var(--text-main)',
                        }}
                      >
                        <User size={16} />
                        <span>My Account</span>
                      </Link>

                      <Link
                        to="/profile?tab=orders"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.5rem 1rem',
                          fontSize: '0.88rem',
                          color: 'var(--text-main)',
                        }}
                      >
                        <PackageCheck size={16} />
                        <span>Order History</span>
                      </Link>

                      <Link
                        to="/custom-orders"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.5rem 1rem',
                          fontSize: '0.88rem',
                          color: 'var(--text-main)',
                        }}
                      >
                        <Palette size={16} />
                        <span>Request Custom Art</span>
                      </Link>

                      <div style={{ borderTop: '1px solid var(--border-light)', margin: '0.4rem 0' }} />

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.5rem 1rem',
                          fontSize: '0.88rem',
                          color: '#dc3545',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-sm btn-outline-rose"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                >
                  <User size={15} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '0.9rem 1.5rem',
              animation: 'fadeIn 0.25s ease',
            }}
          >
            <div className="container">
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Search size={20} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search for embroidery hoops, ocean resin clocks, organza dupattas, portraits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '1rem',
                    backgroundColor: 'transparent',
                    color: 'var(--text-main)',
                  }}
                />
                <button type="submit" className="btn btn-sm btn-primary">
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={20} />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: 'flex',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '80%',
              maxWidth: '320px',
              backgroundColor: '#FFFDF9',
              height: '100%',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-lg)',
              animation: 'fadeIn 0.3s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <span style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.3rem', fontWeight: 700 }}>
                  Manmeet Creations
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={24} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { to: '/', label: 'Home' },
                  { to: '/shop', label: 'Shop All Products' },
                  { to: '/categories', label: 'Explore Categories' },
                  { to: '/custom-orders', label: 'Bespoke Custom Orders ✨' },
                  { to: '/gallery', label: 'Artisan Gallery' },
                  { to: '/about', label: 'Our Brand Story' },
                  { to: '/contact', label: 'Contact Workshop' },
                ].map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    style={({ isActive }) => ({
                      fontSize: '1.05rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--rose-primary)' : 'var(--text-main)',
                    })}
                  >
                    {item.label}
                  </NavLink>
                ))}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: 'var(--gold-dark)', fontWeight: 700, fontSize: '1.05rem' }}
                  >
                    👑 Admin Dashboard
                  </Link>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Signed in as <strong>{user.name}</strong></div>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="btn btn-sm btn-secondary btn-block">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-block">
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Responsive CSS for Navbar */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
        }
      `}</style>
    </>
  );
};
