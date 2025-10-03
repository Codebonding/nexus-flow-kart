import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductByIdQuery } from '../store/api/productApi';
import { addToCart } from '../store/slices/cartSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const { data: product, error, isLoading } = useGetProductByIdQuery(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
  };

  const discount = product?.originalPrice ? 
    Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100) : 0;

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          Product not found or failed to load.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <button 
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="row">
        {/* Product Images */}
        <div className="col-md-6">
          <div className="mb-3">
            <img 
              src={product.images?.[selectedImage] || '/placeholder-image.jpg'} 
              className="img-fluid rounded"
              alt={product.name}
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          </div>
          <div className="d-flex gap-2">
            {product.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                className={`img-thumbnail ${selectedImage === index ? 'border-primary' : ''}`}
                alt={`${product.name} ${index + 1}`}
                style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          {discount > 0 && (
            <span className="badge bg-danger mb-2">{discount}% OFF</span>
          )}
          <h1 className="h2">{product.name}</h1>
          <p className="text-muted lead">{product.description}</p>

          <div className="mb-3">
            {product.offerPrice && product.offerPrice !== product.originalPrice ? (
              <div>
                <span className="h3 text-primary">₹{product.offerPrice}</span>
                <span className="text-muted text-decoration-line-through h5 ms-2">₹{product.originalPrice}</span>
                <span className="text-success ms-2">Save ₹{product.originalPrice - product.offerPrice}</span>
              </div>
            ) : (
              <span className="h3 text-primary">₹{product.originalPrice}</span>
            )}
          </div>

          <div className="mb-3">
            <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="row mb-4">
            <div className="col-auto">
              <label htmlFor="quantity" className="form-label">Quantity:</label>
              <select 
                id="quantity"
                className="form-select" 
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                disabled={product.stock === 0}
              >
                {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-grid gap-2 d-md-flex">
            <button 
              className="btn btn-primary btn-lg flex-fill"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart ({quantity})
            </button>
            <button className="btn btn-outline-secondary btn-lg" disabled>
              Buy Now
            </button>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <div className="mt-4">
              <h5>Specifications</h5>
              <div className="row">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="col-6">
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          <div className="mt-3">
            <strong>Categories:</strong>{' '}
            {product.categories?.map(category => (
              <span key={category} className="badge bg-light text-dark me-1">
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;