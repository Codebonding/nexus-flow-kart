import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(addToCart(product));
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const discount = product.originalPrice ? 
    Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100) : 0;

  return (
    <div className="card h-100 product-card shadow-sm" onClick={handleProductClick} style={{ cursor: 'pointer' }}>
      {discount > 0 && (
        <span className="badge bg-danger position-absolute top-0 start-0 m-2">
          {discount}% OFF
        </span>
      )}
      <img 
        src={product.images?.[0] || '/placeholder-image.jpg'} 
        className="card-img-top" 
        alt={product.name}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted small flex-grow-1">{product.description}</p>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              {product.offerPrice && product.offerPrice !== product.originalPrice ? (
                <>
                  <span className="h5 text-primary mb-0">₹{product.offerPrice}</span>
                  <span className="text-muted text-decoration-line-through ms-2">₹{product.originalPrice}</span>
                </>
              ) : (
                <span className="h5 text-primary mb-0">₹{product.originalPrice}</span>
              )}
            </div>
            <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          
          <button 
            className="btn btn-primary w-100"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;