// components/ProductDetail.js - MODERN UI/UX DESIGN
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductByIdQuery } from '../store/api/productApi';
import { useAddToCartMutation } from '../store/api/cartApi';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { addToCart as addToCartLocal } from '../store/slices/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const { data: product, error, isLoading } = useGetProductByIdQuery(id);
  const [addToCartApi, { isLoading: isAddingToCart }] = useAddToCartMutation();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Get guest ID for guest users
  const getGuestId = () => {
    return localStorage.getItem('guestId') || 'guest_' + Math.random().toString(36).substr(2, 9);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // For guest users, use local storage cart
      const guestId = getGuestId();
      localStorage.setItem('guestId', guestId);
      
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.offerPrice || product.originalPrice,
        originalPrice: product.originalPrice,
        image: product.images?.[0] || '',
        quantity: quantity,
        stock: product.stock,
        productId: product.id
      };
      
      dispatch(addToCartLocal(cartItem));
      
      // Also add to server for guest
      try {
        await addToCartApi({
          guestId,
          productId: product.id,
          quantity: quantity
        }).unwrap();
      } catch (error) {
        console.error('Failed to add to cart on server:', error);
      }
      
    } else {
      // For authenticated users
      try {
        await addToCartApi({
          productId: product.id,
          quantity: quantity
        }).unwrap();
        
        // Also update local state
        const cartItem = {
          id: product.id,
          name: product.name,
          price: product.offerPrice || product.originalPrice,
          originalPrice: product.originalPrice,
          image: product.images?.[0] || '',
          quantity: quantity,
          stock: product.stock,
          productId: product.id
        };
        
        dispatch(addToCartLocal(cartItem));
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  const discount = product?.originalPrice && product.offerPrice ? 
    Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100) : 0;

  // Render star ratings
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

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="error-state bg-light rounded-3 p-5">
            <i className="bi bi-exclamation-triangle text-danger display-4 mb-3"></i>
            <h3 className="text-dark mb-3">Product Not Found</h3>
            <p className="text-muted mb-4">The product you're looking for doesn't exist or failed to load.</p>
            <button 
              className="btn btn-primary px-4 py-2 rounded-pill"
              onClick={() => navigate('/products')}
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Modern Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb bg-transparent px-0">
          <li className="breadcrumb-item">
            <button 
              className="btn btn-link text-decoration-none p-0 text-muted hover-text-primary transition-all"
              onClick={() => navigate('/')}
            >
              <i className="bi bi-house me-1"></i>
              Home
            </button>
          </li>
          <li className="breadcrumb-item">
            <button 
              className="btn btn-link text-decoration-none p-0 text-muted hover-text-primary transition-all"
              onClick={() => navigate('/products')}
            >
              Products
            </button>
          </li>
          <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* Product Images - Modern Design */}
        <div className="col-lg-6">
          <div className="card border-0 bg-transparent">
            <div className="card-body p-0">
              {/* Main Image */}
              <div className="main-image-container bg-white rounded-3 shadow-sm p-4 mb-3">
                <div className="position-relative text-center">
                  {discount > 0 && (
                    <div className="position-absolute top-0 start-0">
                      <span className="badge bg-danger fs-6 px-3 py-2 rounded-end">
                        -{discount}%
                      </span>
                    </div>
                  )}
                  <img 
                    src={product.images?.[selectedImage] || '/placeholder-image.jpg'} 
                    className="img-fluid rounded-2"
                    alt={product.name}
                    style={{ 
                      maxHeight: '450px', 
                      width: 'auto',
                      objectFit: 'contain' 
                    }}
                  />
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="thumbnail-gallery d-flex justify-content-start gap-3 overflow-auto py-2">
                  {product.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`thumbnail-container rounded-2 border cursor-pointer transition-all ${
                        selectedImage === index ? 'border-primary border-2' : 'border-light'
                      }`}
                      style={{ 
                        minWidth: '80px',
                        height: '80px',
                        flexShrink: 0
                      }}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image}
                        className="img-fluid rounded-2"
                        alt={`${product.name} ${index + 1}`}
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Info - Modern Design */}
        <div className="col-lg-6">
          <div className="product-info-container">
            {/* Product Header */}
            <div className="mb-4">
              <h1 className="h2 fw-bold text-dark mb-3 lh-sm">{product.name}</h1>
              
              {/* Rating and Reviews */}
              <div className="d-flex align-items-center mb-3">
                <div className="rating-display d-flex align-items-center bg-light rounded-pill px-3 py-1">
                  <div className="me-2 fs-6">
                    {renderStarRating(product.averageRating || 0)}
                  </div>
                  <span className="text-primary fw-bold me-1">
                    {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-muted fs-7 ms-1">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="price-section mb-4 p-3 bg-light rounded-3">
              {product.offerPrice && product.offerPrice !== product.originalPrice ? (
                <div className="d-flex align-items-baseline flex-wrap">
                  <span className="h2 text-primary fw-bold me-3">${product.offerPrice}</span>
                  <span className="text-muted text-decoration-line-through h5 me-3">
                    ${product.originalPrice}
                  </span>
                  <span className="badge bg-success fs-6">
                    Save ${(product.originalPrice - product.offerPrice).toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="h2 text-primary fw-bold">${product.originalPrice}</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="stock-status mb-4">
              <div className="d-flex align-items-center">
                <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'} fs-6 px-3 py-2 rounded-pill me-3`}>
                  {product.stock > 0 ? (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      {product.stock} in stock
                    </>
                  ) : (
                    <>
                      <i className="bi bi-x-circle me-2"></i>
                      Out of stock
                    </>
                  )}
                </span>
                <small className="text-muted">
                  {product.stock > 10 ? 'Plenty available' : 
                   product.stock > 0 ? 'Limited stock' : 'Check back later'}
                </small>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-selector mb-4">
              <label className="form-label fw-semibold text-dark mb-3">Quantity</label>
              <div className="d-flex align-items-center">
                <div className="quantity-controls d-flex align-items-center border rounded-3 bg-white me-4">
                  <button 
                    className="btn btn-link text-decoration-none px-3 py-2 text-dark"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stock === 0 || quantity <= 1}
                  >
                    <i className="bi bi-dash-lg"></i>
                  </button>
                  <span className="quantity-display px-3 py-2 fw-bold text-dark">
                    {quantity}
                  </span>
                  <button 
                    className="btn btn-link text-decoration-none px-3 py-2 text-dark"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={product.stock === 0 || quantity >= product.stock}
                  >
                    <i className="bi bi-plus-lg"></i>
                  </button>
                </div>
                <small className="text-muted">
                  Max: {product.stock} units available
                </small>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons mb-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <button 
                    className="btn btn-primary w-100 py-3 rounded-3 fw-semibold transition-all"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || isAddingToCart}
                    style={{ fontSize: '1.1rem' }}
                  >
                    {isAddingToCart ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cart-plus me-2"></i>
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
                <div className="col-md-6">
                  <button 
                    className="btn btn-success w-100 py-3 rounded-3 fw-semibold transition-all"
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    style={{ fontSize: '1.1rem' }}
                  >
                    <i className="bi bi-lightning me-2"></i>
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="features-grid bg-light rounded-3 p-4 mb-4">
              <div className="row g-3 text-center">
                <div className="col-4">
                  <div className="feature-icon bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                       style={{ width: '50px', height: '50px' }}>
                    <i className="bi bi-truck text-primary fs-5"></i>
                  </div>
                  <div>
                    <small className="fw-semibold text-dark d-block">Free Shipping</small>
                    <small className="text-muted">Over $50</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="feature-icon bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                       style={{ width: '50px', height: '50px' }}>
                    <i className="bi bi-arrow-left-right text-primary fs-5"></i>
                  </div>
                  <div>
                    <small className="fw-semibold text-dark d-block">Easy Returns</small>
                    <small className="text-muted">30 Days</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="feature-icon bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                       style={{ width: '50px', height: '50px' }}>
                    <i className="bi bi-shield-check text-primary fs-5"></i>
                  </div>
                  <div>
                    <small className="fw-semibold text-dark d-block">Secure</small>
                    <small className="text-muted">Payment</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              {/* Tab Navigation */}
              <div className="border-bottom">
                <ul className="nav nav-tabs border-0 px-4 pt-3" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'description' ? 'active text-primary border-primary' : 'text-muted'} border-0 py-3 px-4 fw-semibold`}
                      onClick={() => setActiveTab('description')}
                    >
                      <i className="bi bi-file-text me-2"></i>
                      Description
                    </button>
                  </li>
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 'specifications' ? 'active text-primary border-primary' : 'text-muted'} border-0 py-3 px-4 fw-semibold`}
                        onClick={() => setActiveTab('specifications')}
                      >
                        <i className="bi bi-list-check me-2"></i>
                        Specifications
                      </button>
                    </li>
                  )}
                  {product.reviews && product.reviews.length > 0 && (
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 'reviews' ? 'active text-primary border-primary' : 'text-muted'} border-0 py-3 px-4 fw-semibold`}
                        onClick={() => setActiveTab('reviews')}
                      >
                        <i className="bi bi-chat-square-text me-2"></i>
                        Reviews ({product.reviews.length})
                      </button>
                    </li>
                  )}
                </ul>
              </div>

              {/* Tab Content */}
              <div className="tab-content p-4">
                {/* Description Tab */}
                {activeTab === 'description' && (
                  <div className="tab-pane fade show active">
                    <div className="row">
                      <div className="col-lg-8">
                        <h5 className="text-dark mb-3">Product Description</h5>
                        <p className="text-muted lead mb-4">{product.description}</p>
                        
                        {/* Categories */}
                        {product.categories && product.categories.length > 0 && (
                          <div className="mt-4">
                            <h6 className="text-dark mb-3">Categories</h6>
                            <div className="d-flex flex-wrap gap-2">
                              {product.categories.map(category => (
                                <span 
                                  key={category} 
                                  className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill cursor-pointer transition-all"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => navigate(`/products?category=${category}`)}
                                >
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Specifications Tab */}
                {activeTab === 'specifications' && product.specifications && (
                  <div className="tab-pane fade show active">
                    <h5 className="text-dark mb-4">Technical Specifications</h5>
                    <div className="row">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="col-md-6 mb-3">
                          <div className="d-flex justify-content-between border-bottom pb-2">
                            <span className="text-dark fw-semibold">{key}:</span>
                            <span className="text-muted">{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && product.reviews && (
                  <div className="tab-pane fade show active">
                    <h5 className="text-dark mb-4">Customer Reviews ({product.reviews.length})</h5>
                    <div className="row">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="col-12 mb-4">
                          <div className="review-card bg-light rounded-3 p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div className="d-flex align-items-center">
                                <div className="user-avatar bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                                     style={{ width: '40px', height: '40px' }}>
                                  <i className="bi bi-person text-primary"></i>
                                </div>
                                <div>
                                  <strong className="text-dark d-block">{review.user?.username || 'Anonymous'}</strong>
                                  <div className="text-warning small">
                                    {renderStarRating(review.rating)}
                                  </div>
                                </div>
                              </div>
                              <small className="text-muted">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </small>
                            </div>
                            <p className="mb-0 text-dark">{review.review}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;