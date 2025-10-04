import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../store/api/productApi';
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice';
import { selectTotalItems } from '../store/slices/cartSlice';
import ProductCard from './ProductCard';
import cart from '../assets/cart.png';

const Home = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const totalCartItems = useSelector(selectTotalItems);
  const navigate = useNavigate();
  
  const { data: productsResponse, error, isLoading } = useGetProductsQuery();

  // Extract products array from response - handle both array and object responses
  const products = Array.isArray(productsResponse) 
    ? productsResponse 
    : productsResponse?.data || productsResponse?.products || [];

  // Color theme
  const colors = {
    primary: '#28329B',
    secondary: '#73BC3E',
    white: '#FFFFFF',
    lightGray: '#f8f9fa',
    dark: '#2d3748'
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* Enhanced Hero Section with gradient */}
      <section 
        className="text-white py-5"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, #1a237e 100%)`,
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="mb-4">
                <span 
                  className="badge mb-3"
                  style={{
                    background: colors.secondary,
                    color: colors.white,
                    padding: '10px 20px',
                    fontSize: '0.9rem',
                    borderRadius: '50px'
                  }}
                >
                  🎉 Welcome to ShopEasy
                </span>
                <h1 className="display-4 fw-bold mb-4" style={{ lineHeight: '1.2' }}>
                  Discover Amazing 
                  <span style={{ color: colors.secondary }}> Products</span> 
                  With Great Deals
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.25rem', opacity: 0.9 }}>
                  Shop the latest trends with exclusive discounts. Quality products delivered to your doorstep with premium service.
                </p>
              </div>
              
              <div className="d-flex flex-wrap gap-3 mb-4">
                {!isAuthenticated ? (
                  <>
                    <button 
                      className="btn btn-lg px-4 py-3 fw-semibold"
                      style={{
                        background: colors.secondary,
                        color: colors.white,
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(115, 188, 62, 0.3)'
                      }}
                      onClick={() => navigate('/login')}
                    >
                      🛍️ Start Shopping Now
                    </button>
                    <button 
                      className="btn btn-outline-light btn-lg px-4 py-3 fw-semibold"
                      style={{
                        borderRadius: '12px',
                        border: '2px solid rgba(255,255,255,0.3)'
                      }}
                      onClick={() => navigate('/products')}
                    >
                      Browse Products
                    </button>
                  </>
                ) : (
                  <button 
                    className="btn btn-lg px-4 py-3 fw-semibold"
                    style={{
                      background: colors.secondary,
                      color: colors.white,
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(115, 188, 62, 0.3)'
                    }}
                    onClick={() => navigate('/products')}
                  >
                    Continue Shopping
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="d-flex flex-wrap gap-4 mt-4">
                <div className="d-flex align-items-center">
                  <div className="me-2" style={{ fontSize: '1.5rem' }}>⭐</div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>4.9/5</div>
                    <small style={{ opacity: 0.8 }}>Customer Rating</small>
                  </div>
                </div>
                <div className="">
                  <div className="me-2" style={{ fontSize: '1.5rem' }}>🚚</div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Free</div>
                    <small style={{ opacity: 0.8 }}>Shipping Over $50</small>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-2" style={{ fontSize: '1.5rem' }}>🛡️</div>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Secure</div>
                    <small style={{ opacity: 0.8 }}>Checkout</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <div 
                className="position-relative"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '30px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div 
                  className="bg-white rounded-4 d-inline-flex align-items-center justify-content-center position-relative"
                  style={{ 
                    width: '280px', 
                    height: '280px',
                    background: `radial-gradient(circle, ${colors.white} 0%, #e2e8f0 100%)`,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }}
                >
                 <div 
  style={{ 
    width: '200px',
    height: '200px',
    transform: 'rotate(-10deg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}
>
  <img 
    src={cart} 
    alt="Shopping Cart"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
    }}
  />
</div>
                  <div 
                    className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '60px',
                      height: '60px',
                      background: colors.secondary,
                      top: '-20px',
                      right: '-20px',
                      fontSize: '1.5rem',
                      boxShadow: '0 10px 20px rgba(115, 188, 62, 0.3)'
                    }}
                  >
                    🔥
                  </div>
                  <div 
                    className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '50px',
                      height: '50px',
                      background: colors.primary,
                      bottom: '-15px',
                      left: '-15px',
                      fontSize: '1.2rem',
                      boxShadow: '0 10px 20px rgba(40, 50, 155, 0.3)'
                    }}
                  >
                    💎
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-5" style={{ background: colors.lightGray }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{ color: colors.primary }}>
              Why Choose ShopEasy?
            </h2>
            <p className="lead" style={{ color: colors.dark, maxWidth: '600px', margin: '0 auto' }}>
              We're committed to providing the best shopping experience with premium services
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                icon: '🚚',
                title: 'Free Shipping',
                desc: 'Free delivery on all orders over $50. Fast and reliable shipping.',
                gradient: `linear-gradient(135deg, ${colors.primary} 0%, #3949ab 100%)`
              },
              {
                icon: '💳',
                title: 'Secure Payment',
                desc: '100% secure payment processing with encrypted transactions.',
                gradient: `linear-gradient(135deg, ${colors.secondary} 0%, #8bc34a 100%)`
              },
              {
                icon: '↩️',
                title: 'Easy Returns',
                desc: '30-day hassle-free return policy. Your satisfaction guaranteed.',
                gradient: `linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)`
              },
              {
                icon: '📞',
                title: '24/7 Support',
                desc: 'Round-the-clock customer support to help you anytime.',
                gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
              },
              {
                icon: '⭐',
                title: 'Premium Quality',
                desc: 'Carefully curated products with quality assurance.',
                gradient: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`
              },
              {
                icon: '💰',
                title: 'Best Prices',
                desc: 'Competitive pricing with regular discounts and offers.',
                gradient: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`
              }
            ].map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div 
                  className="card border-0 h-100 shadow-sm"
                  style={{
                    borderRadius: '15px',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                  }}
                >
                  <div className="card-body text-center p-4">
                    <div 
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                      style={{
                        width: '80px',
                        height: '80px',
                        background: feature.gradient,
                        fontSize: '2rem'
                      }}
                    >
                      {feature.icon}
                    </div>
                    <h5 className="fw-bold mb-3" style={{ color: colors.primary }}>
                      {feature.title}
                    </h5>
                    <p className="text-muted mb-0" style={{ lineHeight: '1.6' }}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Products Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-end mb-5">
            <div className="col-md-8">
              <h2 className="fw-bold mb-2" style={{ color: colors.primary }}>
                Featured Products
              </h2>
              <p className="text-muted mb-0">
                Handpicked selection of our most popular items
              </p>
            </div>
            {isAuthenticated && products.length > 0 && (
              <div className="col-md-4 text-md-end">
                <button 
                  className="btn px-4 py-2 fw-semibold"
                  style={{
                    background: 'transparent',
                    color: colors.primary,
                    border: `2px solid ${colors.primary}`,
                    borderRadius: '10px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = colors.primary;
                    e.target.style.color = colors.white;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = colors.primary;
                  }}
                  onClick={() => navigate('/products')}
                >
                  View All Products →
                </button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <div 
                className="spinner-border"
                style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  color: colors.primary 
                }} 
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 fw-semibold" style={{ color: colors.primary }}>
                Loading amazing products...
              </p>
            </div>
          ) : error ? (
            <div 
              className="alert text-center py-4"
              style={{
                background: 'rgba(255,0,0,0.05)',
                border: '1px solid rgba(255,0,0,0.1)',
                borderRadius: '15px',
                color: '#d32f2f'
              }}
            >
              <div className="mb-2" style={{ fontSize: '3rem' }}>😞</div>
              <h5>Failed to load products</h5>
              <p className="mb-0">Please check your connection and try again</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3" style={{ fontSize: '4rem' }}>📦</div>
              <h5 style={{ color: colors.primary }}>No products available</h5>
              <p className="text-muted">We're restocking our inventory. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {products.slice(0, 6).map((product) => (
                  <div key={product.id} className="col-xl-4 col-lg-6">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              {products.length > 6 && isAuthenticated && (
                <div className="text-center mt-5">
                  <button 
                    className="btn px-5 py-3 fw-semibold"
                    style={{
                      background: colors.primary,
                      color: colors.white,
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(40, 50, 155, 0.3)'
                    }}
                    onClick={() => navigate('/products')}
                  >
                    Load More Products
                  </button>
                </div>
              )}
            </>
          )}

          {!isAuthenticated && (
            <div 
              className="text-center mt-5 p-5 rounded-4"
              style={{
                background: `linear-gradient(135deg, ${colors.lightGray} 0%, #e2e8f0 100%)`,
                border: `2px dashed ${colors.primary}20`
              }}
            >
              <div className="mb-4" style={{ fontSize: '4rem' }}>🔒</div>
              <h4 style={{ color: colors.primary }}>Unlock Full Shopping Experience</h4>
              <p className="mb-4" style={{ maxWidth: '500px', margin: '0 auto', color: colors.dark }}>
                Login to browse our complete catalog, save your favorite items, and enjoy personalized recommendations
              </p>
              <button 
                className="btn px-5 py-3 fw-semibold me-3"
                style={{
                  background: colors.primary,
                  color: colors.white,
                  border: 'none',
                  borderRadius: '12px'
                }}
                onClick={() => navigate('/login')}
              >
                Login Now
              </button>
              <button 
                className="btn px-5 py-3 fw-semibold"
                style={{
                  background: 'transparent',
                  color: colors.primary,
                  border: `2px solid ${colors.primary}`,
                  borderRadius: '12px'
                }}
                onClick={() => navigate('/register')}
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section 
        className="py-5 text-white"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, #1a237e 100%)`
        }}
      >
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h3 className="fw-bold mb-3">Stay Updated</h3>
              <p className="mb-4 opacity-75">
                Subscribe to our newsletter for exclusive deals and new product launches
              </p>
              <div className="row g-2 justify-content-center">
                <div className="col-md-8">
                  <div className="input-group">
                    <input 
                      type="email" 
                      className="form-control form-control-lg" 
                      placeholder="Enter your email"
                      style={{
                        border: 'none',
                        borderRadius: '10px 0 0 10px',
                        padding: '15px'
                      }}
                    />
                    <button 
                      className="btn btn-lg px-4"
                      style={{
                        background: colors.secondary,
                        color: colors.white,
                        border: 'none',
                        borderRadius: '0 10px 10px 0'
                      }}
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;