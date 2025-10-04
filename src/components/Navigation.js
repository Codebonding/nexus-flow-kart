import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice';
import { selectTotalItems } from '../store/slices/cartSlice';
import logo from '../assets/logo.png';

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const totalCartItems = useSelector(selectTotalItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    closeAllMenus();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      closeAllMenus();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsMobileMenuOpen(false);
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleNavLinkClick = () => {
    closeAllMenus();
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close mobile menu if clicked outside
      if (isMobileMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) &&
          mobileMenuButtonRef.current &&
          !mobileMenuButtonRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }

      // Close user menu if clicked outside
      if (isUserMenuOpen && 
          userMenuRef.current && 
          !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobileMenuOpen, isUserMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    closeAllMenus();
  }, [location]);

  return (
    <nav 
      style={{
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        padding: '12px 0',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', zIndex: 1001 }}>
          <Link 
            to="/" 
            onClick={handleNavLinkClick}
            style={{ 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center' 
            }}
          >
            <img 
              src={logo} 
              alt="NexusFlowKart" 
              style={{
                width: '45px',
                height: '45px',
                objectFit: 'contain',
                marginRight: '12px'
              }}
            />
            <div>
              <span style={{
                fontSize: '28px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #6FBC2E 0%, #26309F 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                NexusFlowKart
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation - Always visible on desktop */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            flex: 1,
            justifyContent: 'flex-end'
          }}
          className="desktop-nav"
        >
          {/* Navigation Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Link 
              to="/"
              onClick={handleNavLinkClick}
              style={{
                color: location.pathname === '/' ? '#26309F' : '#64748b',
                fontWeight: location.pathname === '/' ? '600' : '400',
                padding: '12px 20px',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                backgroundColor: location.pathname === '/' ? '#f0f4ff' : 'transparent',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/') {
                  e.target.style.color = '#26309F';
                  e.target.style.backgroundColor = '#f8fafc';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/') {
                  e.target.style.color = '#64748b';
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <i className="bi bi-house" style={{ marginRight: '8px' }}></i>
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/products"
                  onClick={handleNavLinkClick}
                  style={{
                    color: location.pathname === '/products' ? '#26309F' : '#64748b',
                    fontWeight: location.pathname === '/products' ? '600' : '400',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    backgroundColor: location.pathname === '/products' ? '#f0f4ff' : 'transparent',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== '/products') {
                      e.target.style.color = '#26309F';
                      e.target.style.backgroundColor = '#f8fafc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== '/products') {
                      e.target.style.color = '#64748b';
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <i className="bi bi-grid" style={{ marginRight: '8px' }}></i>
                  Products
                </Link>
                <Link 
                  to="/dashboard"
                  onClick={handleNavLinkClick}
                  style={{
                    color: location.pathname === '/dashboard' ? '#26309F' : '#64748b',
                    fontWeight: location.pathname === '/dashboard' ? '600' : '400',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    backgroundColor: location.pathname === '/dashboard' ? '#f0f4ff' : 'transparent',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== '/dashboard') {
                      e.target.style.color = '#26309F';
                      e.target.style.backgroundColor = '#f8fafc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== '/dashboard') {
                      e.target.style.color = '#64748b';
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <i className="bi bi-speedometer2" style={{ marginRight: '8px' }}></i>
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            style={{ 
              minWidth: '300px'
            }}
          >
            <div style={{ 
              display: 'flex', 
              borderRadius: '25px', 
              overflow: 'hidden', 
              border: '2px solid #e2e8f0',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#26309F';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(38, 48, 159, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  padding: '12px 20px',
                  fontSize: '16px',
                  backgroundColor: '#ffffff',
                  flex: '1',
                  outline: 'none'
                }}
              />
              <button 
                type="submit"
                style={{
                  backgroundColor: '#26309F',
                  border: 'none',
                  color: 'white',
                  padding: '12px 24px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1a237e';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#26309F';
                }}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          {/* User Actions */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px'
          }}>
            {isAuthenticated ? (
              <>
                {/* Cart Icon */}
                <Link 
                  to="/cart"
                  onClick={handleNavLinkClick}
                  style={{
                    padding: '12px',
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                    color: '#64748b',
                    textDecoration: 'none',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#26309F';
                    e.target.style.backgroundColor = '#f0f4ff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#64748b';
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <i className="bi bi-cart3" style={{ fontSize: '20px' }}></i>
                  {totalCartItems > 0 && (
                    <span 
                      style={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        backgroundColor: '#6FBC2E',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600'
                      }}
                    >
                      {totalCartItems}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                <div ref={userMenuRef} style={{ position: 'relative' }}>
                  <button
                    onClick={toggleUserMenu}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '25px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f1f5f9';
                      e.target.style.borderColor = '#cbd5e1';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <div 
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6FBC2E 0%, #26309F 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}
                    >
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ 
                      fontWeight: '500', 
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      {user?.username}
                    </span>
                    <i 
                      className="bi bi-chevron-down" 
                      style={{ 
                        fontSize: '12px', 
                        color: '#64748b',
                        transition: 'transform 0.3s ease',
                        transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    ></i>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: '0',
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      padding: '8px',
                      minWidth: '200px',
                      zIndex: 1000,
                      marginTop: '8px'
                    }}>
                      <Link 
                        to="/profile"
                        onClick={handleNavLinkClick}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          color: '#374151',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f0f4ff';
                          e.target.style.color = '#26309F';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#374151';
                        }}
                      >
                        <i className="bi bi-person" style={{ marginRight: '8px' }}></i>
                        Profile
                      </Link>
                      <Link 
                        to="/dashboard"
                        onClick={handleNavLinkClick}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          color: '#374151',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f0f4ff';
                          e.target.style.color = '#26309F';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#374151';
                        }}
                      >
                        <i className="bi bi-speedometer2" style={{ marginRight: '8px' }}></i>
                        Dashboard
                      </Link>
                      <div style={{ 
                        height: '1px', 
                        backgroundColor: '#e2e8f0', 
                        margin: '8px 0' 
                      }}></div>
                      <button 
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          color: '#ef4444',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#fef2f2';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        <i className="bi bi-box-arrow-right" style={{ marginRight: '8px' }}></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link 
                  to="/login"
                  onClick={handleNavLinkClick}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '25px',
                    border: '2px solid #26309F',
                    color: '#26309F',
                    backgroundColor: 'transparent',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#26309F';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#26309F';
                  }}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  onClick={handleNavLinkClick}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '25px',
                    backgroundColor: '#6FBC2E',
                    color: 'white',
                    border: 'none',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#5aa02c';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#6FBC2E';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button - Only visible on mobile/tablet */}
        <button 
          ref={mobileMenuButtonRef}
          onClick={toggleMobileMenu}
          style={{
            display: 'none',
            border: 'none',
            background: 'none',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '40px',
            height: '40px',
            zIndex: 1001
          }}
          className="mobile-menu-btn"
        >
          <div style={{
            width: '25px',
            height: '2px',
            backgroundColor: '#26309F',
            margin: '3px 0',
            transition: '0.3s',
            transform: isMobileMenuOpen ? 'rotate(-45deg) translate(-5px, 6px)' : 'none'
          }}></div>
          <div style={{
            width: '25px',
            height: '2px',
            backgroundColor: '#26309F',
            margin: '3px 0',
            transition: '0.3s',
            opacity: isMobileMenuOpen ? '0' : '1'
          }}></div>
          <div style={{
            width: '25px',
            height: '2px',
            backgroundColor: '#26309F',
            margin: '3px 0',
            transition: '0.3s',
            transform: isMobileMenuOpen ? 'rotate(45deg) translate(-5px, -6px)' : 'none'
          }}></div>
        </button>

        {/* Mobile Navigation - Only visible when menu is open */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              right: '0',
              backgroundColor: 'white',
              flexDirection: 'column',
              padding: '20px',
              gap: '16px',
              zIndex: 999,
              borderTop: '1px solid #e2e8f0',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
            }}
            className="mobile-nav"
          >
            {/* Mobile Navigation Links */}
            <Link 
              to="/"
              onClick={handleNavLinkClick}
              style={{
                color: location.pathname === '/' ? '#26309F' : '#64748b',
                fontWeight: location.pathname === '/' ? '600' : '400',
                padding: '16px 20px',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                backgroundColor: location.pathname === '/' ? '#f0f4ff' : 'transparent',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                fontSize: '18px'
              }}
            >
              <i className="bi bi-house" style={{ marginRight: '12px' }}></i>
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/products"
                  onClick={handleNavLinkClick}
                  style={{
                    color: location.pathname === '/products' ? '#26309F' : '#64748b',
                    fontWeight: location.pathname === '/products' ? '600' : '400',
                    padding: '16px 20px',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    backgroundColor: location.pathname === '/products' ? '#f0f4ff' : 'transparent',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '18px'
                  }}
                >
                  <i className="bi bi-grid" style={{ marginRight: '12px' }}></i>
                  Products
                </Link>
                <Link 
                  to="/dashboard"
                  onClick={handleNavLinkClick}
                  style={{
                    color: location.pathname === '/dashboard' ? '#26309F' : '#64748b',
                    fontWeight: location.pathname === '/dashboard' ? '600' : '400',
                    padding: '16px 20px',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease',
                    backgroundColor: location.pathname === '/dashboard' ? '#f0f4ff' : 'transparent',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '18px'
                  }}
                >
                  <i className="bi bi-speedometer2" style={{ marginRight: '12px' }}></i>
                  Dashboard
                </Link>
              </>
            )}

            {/* Mobile Search Bar */}
            <form 
              onSubmit={handleSearch}
              style={{ width: '100%' }}
            >
              <div style={{ 
                display: 'flex', 
                borderRadius: '25px', 
                overflow: 'hidden', 
                border: '2px solid #e2e8f0',
                width: '100%'
              }}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: 'none',
                    padding: '16px 20px',
                    fontSize: '16px',
                    backgroundColor: '#ffffff',
                    flex: '1',
                    outline: 'none'
                  }}
                />
                <button 
                  type="submit"
                  style={{
                    backgroundColor: '#26309F',
                    border: 'none',
                    color: 'white',
                    padding: '16px 24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>

            {/* Mobile User Actions */}
            {isAuthenticated ? (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '12px',
                width: '100%'
              }}>
                <Link 
                  to="/cart"
                  onClick={handleNavLinkClick}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '10px',
                    color: '#64748b',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#f8fafc',
                    fontSize: '18px'
                  }}
                >
                  <i className="bi bi-cart3" style={{ marginRight: '12px' }}></i>
                  Cart {totalCartItems > 0 && `(${totalCartItems})`}
                </Link>
                
                <Link 
                  to="/profile"
                  onClick={handleNavLinkClick}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '10px',
                    color: '#64748b',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#f8fafc',
                    fontSize: '18px'
                  }}
                >
                  <i className="bi bi-person" style={{ marginRight: '12px' }}></i>
                  Profile
                </Link>

                <button 
                  onClick={handleLogout}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '10px',
                    color: '#ef4444',
                    border: 'none',
                    backgroundColor: '#fef2f2',
                    cursor: 'pointer',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <i className="bi bi-box-arrow-right" style={{ marginRight: '12px' }}></i>
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '12px',
                width: '100%'
              }}>
                <Link 
                  to="/login"
                  onClick={handleNavLinkClick}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '25px',
                    border: '2px solid #26309F',
                    color: '#26309F',
                    backgroundColor: 'transparent',
                    fontWeight: '500',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontSize: '18px'
                  }}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  onClick={handleNavLinkClick}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '25px',
                    backgroundColor: '#6FBC2E',
                    color: 'white',
                    border: 'none',
                    fontWeight: '500',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontSize: '18px'
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .desktop-nav {
            display: none !important;
          }
          
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        
        @media (min-width: 1025px) {
          .desktop-nav {
            display: flex !important;
          }
          
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;