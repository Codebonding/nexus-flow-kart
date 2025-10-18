// components/Products.js - UPDATED
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGetProductsQuery, useGetCategoriesQuery } from '../store/api/productApi';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Get initial values from URL params
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialMinRating = searchParams.get('minRating') || '';

  // State for filters
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [minRating, setMinRating] = useState(initialMinRating);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Construct query parameters
  const queryParams = {};
  if (searchTerm) queryParams.search = searchTerm;
  if (selectedCategory) queryParams.category = selectedCategory;
  if (minPrice) queryParams.minPrice = minPrice;
  if (maxPrice) queryParams.maxPrice = maxPrice;
  if (minRating) queryParams.minRating = minRating;
  if (sortBy) queryParams.sortBy = sortBy;
  if (sortOrder) queryParams.sortOrder = sortOrder;

  const { data: products, error, isLoading } = useGetProductsQuery(queryParams);
  const { data: categoriesResponse } = useGetCategoriesQuery();

  const categories = categoriesResponse?.categories || categoriesResponse?.data || [];

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minRating) params.set('minRating', minRating);
    
    setSearchParams(params);
  }, [searchTerm, selectedCategory, minPrice, maxPrice, minRating, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled automatically by the useEffect
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setSortBy('name');
    setSortOrder('asc');
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} style={{ color: '#FFD700' }}>★</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} style={{ color: '#E0E0E0' }}>★</span>);
    }
    
    return stars;
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Add to cart logic here
    console.log('Add to cart:', product.name);
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 fw-bold text-dark">All Products</h1>
            <div className="text-muted">
              Showing {products?.length || 0} products
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="row g-3">
                  {/* Search */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Search Products</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Category */}
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Category</label>
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Min Price</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label fw-semibold">Max Price</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>

                  {/* Rating */}
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Min Rating</label>
                    <select
                      className="form-select"
                      value={minRating}
                      onChange={(e) => setMinRating(e.target.value)}
                    >
                      <option value="">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                      <option value="2">2+ Stars</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Sort By</label>
                    <div className="row g-2">
                      <div className="col-6">
                        <select
                          className="form-select"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                          <option value="name">Name</option>
                          <option value="price">Price</option>
                          <option value="rating">Rating</option>
                          <option value="createdAt">Date</option>
                        </select>
                      </div>
                      <div className="col-6">
                        <select
                          className="form-select"
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                        >
                          <option value="asc">Ascending</option>
                          <option value="desc">Descending</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-md-2 d-flex align-items-end">
                    <div className="d-flex gap-2 w-100">
                      <button type="submit" className="btn btn-primary flex-fill">
                        <i className="bi bi-search me-2"></i>
                        Apply
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={clearFilters}
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Active Filters */}
              {(searchTerm || selectedCategory || minPrice || maxPrice || minRating) && (
                <div className="mt-3">
                  <small className="text-muted me-2">Active filters:</small>
                  {searchTerm && (
                    <span className="badge bg-primary me-2">
                      Search: {searchTerm}
                      <button 
                        className="btn-close btn-close-white ms-1"
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => setSearchTerm('')}
                      ></button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="badge bg-success me-2">
                      Category: {selectedCategory}
                      <button 
                        className="btn-close btn-close-white ms-1"
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => setSelectedCategory('')}
                      ></button>
                    </span>
                  )}
                  {(minPrice || maxPrice) && (
                    <span className="badge bg-info me-2">
                      Price: ${minPrice || '0'} - ${maxPrice || '∞'}
                      <button 
                        className="btn-close btn-close-white ms-1"
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                      ></button>
                    </span>
                  )}
                  {minRating && (
                    <span className="badge bg-warning me-2">
                      Rating: {minRating}+
                      <button 
                        className="btn-close btn-close-white ms-1"
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => setMinRating('')}
                      ></button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading products...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">
          <h5>Failed to load products</h5>
          <p className="mb-0">Please check your connection and try again.</p>
        </div>
      ) : (
        <>
          {products?.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4" style={{ fontSize: '4rem' }}>🔍</div>
              <h4 className="text-dark">No products found</h4>
              <p className="text-muted mb-4">
                {searchTerm || selectedCategory || minPrice || maxPrice || minRating
                  ? "Try adjusting your search or filter criteria"
                  : "No products available at the moment"
                }
              </p>
              {(searchTerm || selectedCategory || minPrice || maxPrice || minRating) && (
                <button 
                  className="btn btn-primary"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="row">
              {products?.map((product) => (
                <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                  <div 
                    className="card h-100 border-0 shadow-sm product-card"
                    style={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                    }}
                    onClick={() => handleProductClick(product.id)}
                  >
                    {/* Product Image */}
                    <div 
                      style={{
                        height: '200px',
                        background: '#f8f9fa',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        />
                      ) : (
                        <div 
                          className="d-flex align-items-center justify-content-center text-muted"
                          style={{
                            width: '100%',
                            height: '100%',
                            background: '#e9ecef'
                          }}
                        >
                          <i className="bi bi-image fs-1"></i>
                        </div>
                      )}
                    </div>

                    <div className="card-body">
                      {/* Product Name */}
                      <h6 
                        className="card-title fw-bold text-dark mb-2"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '48px'
                        }}
                      >
                        {product.name}
                      </h6>

                      {/* Rating */}
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center">
                          <div className="me-1" style={{ fontSize: '0.8rem' }}>
                            {renderStarRating(product.averageRating || 0)}
                          </div>
                          <small className="text-primary fw-semibold">
                            {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
                          </small>
                        </div>
                        <small className="text-muted">
                          ({product.reviewCount || 0})
                        </small>
                      </div>

                      {/* Price */}
                      <div className="mb-3">
                        {product.offerPrice && product.offerPrice < product.originalPrice ? (
                          <div>
                            <span className="h5 text-primary fw-bold">${product.offerPrice}</span>
                            <span className="text-muted text-decoration-line-through small ms-2">
                              ${product.originalPrice}
                            </span>
                            <div className="text-success small fw-semibold">
                              Save ${(product.originalPrice - product.offerPrice).toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <span className="h5 text-primary fw-bold">${product.originalPrice}</span>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="mb-3">
                        <small className={product.stock > 0 ? "text-success" : "text-danger"}>
                          {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✗ Out of Stock'}
                        </small>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-primary btn-sm flex-fill"
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={product.stock === 0}
                        >
                          <i className="bi bi-cart-plus me-1"></i>
                          Add to Cart
                        </button>
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product.id);
                          }}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Guest User Message */}
      {!isAuthenticated && products && products.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div 
              className="alert alert-info text-center"
              style={{ background: 'rgba(13, 110, 253, 0.1)', border: '1px solid rgba(13, 110, 253, 0.2)' }}
            >
              <h6 className="alert-heading mb-2">
                <i className="bi bi-info-circle me-2"></i>
                Want to add items to cart?
              </h6>
              <p className="mb-2 small">
                Login to add products to your cart and enjoy personalized shopping experience
              </p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/login')}
              >
                Login Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;