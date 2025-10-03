import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice';
import { selectTotalItems } from '../store/slices/cartSlice';

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const totalCartItems = useSelector(selectTotalItems);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🛍️ ShopEasy
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
              >
                Home
              </Link>
            </li>
            
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`} 
                    to="/products"
                  >
                    Products
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} 
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          <div className="navbar-nav ms-auto align-items-center">
            {isAuthenticated && (
              <>
                <Link 
                  className={`nav-link position-relative ${location.pathname === '/cart' ? 'active' : ''}`} 
                  to="/cart"
                >
                  🛒 Cart
                  {totalCartItems > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {totalCartItems}
                    </span>
                  )}
                </Link>
                
                <span className="navbar-text me-3">
                  Welcome, <strong>{user?.username}</strong>!
                </span>
                <button 
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
            
            {!isAuthenticated && (
              <Link 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`} 
                to="/login"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;