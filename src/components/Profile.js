import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '../store/slices/authSlice';

const Profile = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h2 className="card-title text-center mb-0">User Profile</h2>
            </div>
            <div className="card-body">
              {user ? (
                <div>
                  <div className="text-center mb-4">
                    <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white" 
                         style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="mt-3">{user.username}</h3>
                    <span className="badge bg-success fs-6">{user.role}</span>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card mb-3">
                        <div className="card-header">
                          <h5 className="card-title mb-0">Personal Information</h5>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <label className="form-label"><strong>Username:</strong></label>
                            <p className="form-control-plaintext border-bottom pb-2">{user.username}</p>
                          </div>
                          
                          <div className="mb-3">
                            <label className="form-label"><strong>Email:</strong></label>
                            <p className="form-control-plaintext border-bottom pb-2">{user.email}</p>
                          </div>
                          
                          <div className="mb-3">
                            <label className="form-label"><strong>Role:</strong></label>
                            <p className="form-control-plaintext border-bottom pb-2">
                              <span className="badge bg-info">{user.role}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="card mb-3">
                        <div className="card-header">
                          <h5 className="card-title mb-0">Account Details</h5>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <label className="form-label"><strong>User ID:</strong></label>
                            <p className="form-control-plaintext border-bottom pb-2">{user.id}</p>
                          </div>
                          
                          <div className="mb-3">
                            <label className="form-label"><strong>Account Status:</strong></label>
                            <p className="form-control-plaintext border-bottom pb-2">
                              <span className="badge bg-success">Active</span>
                            </p>
                          </div>
                          
                          <div className="mb-3">
                            <label className="form-label"><strong>Member Since:</strong></label>
                            <p className="form-control-plaintext border-bottom pb-2">January 2024</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-4">
                    <button 
                      className="btn btn-primary me-2"
                      onClick={() => navigate('/dashboard')}
                    >
                      Back to Dashboard
                    </button>
                    <button className="btn btn-outline-secondary" disabled>
                      Edit Profile (Coming Soon)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p>No user data available.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/login')}
                  >
                    Please Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;