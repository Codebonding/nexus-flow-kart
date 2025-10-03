import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../store/api/productApi';
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice';
import { selectTotalItems } from '../store/slices/cartSlice';
import ProductCard from './ProductCard';

const Home = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const totalCartItems = useSelector(selectTotalItems);
  const navigate = useNavigate();
  
  const { data: products, error, isLoading } = useGetProductsQuery();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold">Welcome to ShopEasy</h1>
              <p className="lead">Discover amazing products at great prices</p>
              {!isAuthenticated && (
                <button 
                  className="btn btn-light btn-lg mt-3"
                  onClick={() => navigate('/login')}
                >
                  Login to Shop
                </button>
              )}
            </div>
            <div className="col-md-6 text-center">
              <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center text-primary" 
                   style={{ width: '200px', height: '200px', fontSize: '3rem' }}>
                🛒
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="text-primary mb-3" style={{ fontSize: '3rem' }}>🚚</div>
                <h5>Free Shipping</h5>
                <p className="text-muted">Free delivery on orders over $50</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="text-primary mb-3" style={{ fontSize: '3rem' }}>💳</div>
                <h5>Secure Payment</h5>
                <p className="text-muted">100% secure payment processing</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="text-primary mb-3" style={{ fontSize: '3rem' }}>↩️</div>
                <h5>Easy Returns</h5>
                <p className="text-muted">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Featured Products</h2>
          {isAuthenticated && (
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigate('/products')}
            >
              View All Products
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading products...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">
            Failed to load products. Please try again later.
          </div>
        ) : (
          <div className="row">
            {products?.slice(0, 6).map((product) => (
              <div key={product.id} className="col-lg-4 col-md-6 mb-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {!isAuthenticated && (
          <div className="text-center mt-5">
            <div className="card bg-light">
              <div className="card-body">
                <h5>Want to see more products?</h5>
                <p>Login to browse our complete catalog and start shopping!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/login')}
                >
                  Login Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;