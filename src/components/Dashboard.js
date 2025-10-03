import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, selectCurrentUser } from '../store/slices/authSlice';
import { selectTotalItems, selectTotalAmount } from '../store/slices/cartSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const totalCartItems = useSelector(selectTotalItems);
  const totalAmount = useSelector(selectTotalAmount);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Dashboard</h1>
        </div>
      </div>

      <div className="row">
        {/* User Info */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h2 className="card-title mb-0">Welcome, {user?.username}!</h2>
            </div>
            <div className="card-body">
              {user && (
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label"><strong>Username:</strong></label>
                      <p className="form-control-plaintext">{user.username}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label"><strong>Email:</strong></label>
                      <p className="form-control-plaintext">{user.email}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label"><strong>Role:</strong></label>
                      <p className="form-control-plaintext">
                        <span className="badge bg-info">{user.role}</span>
                      </p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label"><strong>User ID:</strong></label>
                      <p className="form-control-plaintext">{user.id}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body text-center">
              <div className="text-primary mb-2" style={{ fontSize: '2rem' }}>🛒</div>
              <h3>{totalCartItems}</h3>
              <p className="text-muted mb-0">Items in Cart</p>
            </div>
          </div>
          
          <div className="card mb-3">
            <div className="card-body text-center">
              <div className="text-success mb-2" style={{ fontSize: '2rem' }}>💰</div>
              <h3>₹{totalAmount}</h3>
              <p className="text-muted mb-0">Cart Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <h4 className="mb-3">Quick Actions</h4>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="text-primary mb-3" style={{ fontSize: '2.5rem' }}>📱</div>
              <h5>Browse Products</h5>
              <p className="card-text">Explore our product catalog</p>
              <button 
                className="btn btn-outline-primary"
                onClick={() => navigate('/products')}
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="text-success mb-3" style={{ fontSize: '2.5rem' }}>🛒</div>
              <h5>View Cart</h5>
              <p className="card-text">Review your shopping cart</p>
              <button 
                className="btn btn-outline-success"
                onClick={() => navigate('/cart')}
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="text-info mb-3" style={{ fontSize: '2.5rem' }}>👤</div>
              <h5>Profile</h5>
              <p className="card-text">Manage your account</p>
              <button 
                className="btn btn-outline-info"
                onClick={() => navigate('/profile')}
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <div className="text-warning mb-3" style={{ fontSize: '2.5rem' }}>⚙️</div>
              <h5>Settings</h5>
              <p className="card-text">Account settings</p>
              <button className="btn btn-outline-warning" disabled>
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button 
          onClick={handleLogout}
          className="btn btn-danger"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;