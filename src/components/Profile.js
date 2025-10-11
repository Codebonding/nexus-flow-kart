import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, selectAccessToken, updateUser } from '../store/slices/authSlice';
import { useGetUserQuery, useUpdateUserMutation } from '../store/api/authApi';
import Swal from 'sweetalert2';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const accessToken = useSelector(selectAccessToken);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    gender: '',
    status: ''
  });

  // Fetch latest user data
  const { 
    data: userData, 
    isLoading, 
    error, 
    refetch 
  } = useGetUserQuery(currentUser?.id, {
    skip: !currentUser?.id,
  });

  const [updateUserMutation, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Update form data when user data is fetched
  useEffect(() => {
    if (userData?.user) {
      setFormData({
        username: userData.user.username || '',
        email: userData.user.email || '',
        phone: userData.user.phone || '',
        gender: userData.user.gender || '',
        status: userData.user.status || 'active'
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For phone field, only allow numbers and limit to 10 digits
    if (name === 'phone') {
      const numbersOnly = value.replace(/\D/g, '');
      if (numbersOnly.length <= 10) {
        setFormData(prev => ({
          ...prev,
          [name]: numbersOnly
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data when canceling edit
      if (userData?.user) {
        setFormData({
          username: userData.user.username || '',
          email: userData.user.email || '',
          phone: userData.user.phone || '',
          gender: userData.user.gender || '',
          status: userData.user.status || 'active'
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const validateForm = () => {
    if (!formData.phone.trim()) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Phone number is required',
        icon: 'error',
        confirmButtonColor: '#6FBC2E'
      });
      return false;
    }
    
    if (!/^\d{10}$/.test(formData.phone)) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please enter a valid 10-digit phone number',
        icon: 'error',
        confirmButtonColor: '#6FBC2E'
      });
      return false;
    }
    
    if (!formData.gender) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please select your gender',
        icon: 'error',
        confirmButtonColor: '#6FBC2E'
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const updateData = {
        phone: formData.phone,
        gender: formData.gender,
        status: formData.status
      };

      const result = await updateUserMutation({
        userId: currentUser.id,
        userData: updateData
      }).unwrap();

      if (result.success) {
        // Update Redux store with new user data
        dispatch(updateUser(result.user));
        
        // Refetch user data to ensure we have the latest
        await refetch();
        
        await Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully!',
          icon: 'success',
          confirmButtonColor: '#6FBC2E',
          timer: 3000,
          timerProgressBar: true,
        });

        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Swal.fire({
        title: 'Update Failed!',
        text: error.data?.message || 'Failed to update profile. Please try again.',
        icon: 'error',
        confirmButtonColor: '#6FBC2E'
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="bi bi-exclamation-triangle text-warning fs-1"></i>
                <h4 className="mt-3">Error Loading Profile</h4>
                <p className="text-muted">Failed to load user profile. Please try again.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => refetch()}
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const user = userData?.user || currentUser;

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="bi bi-person-x text-muted fs-1"></i>
                <h4 className="mt-3">No User Data</h4>
                <p className="text-muted">Please log in to view your profile.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-xl-8 col-lg-10">
          {/* Back Button */}
          <div className="text-start mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-outline-primary btn-sm rounded-pill px-3"
              style={{ 
                borderColor: '#1A237E',
                color: '#1A237E'
              }}
            >
              <i className="bi bi-arrow-left me-1"></i>
              Back
            </button>
          </div>

          {/* Profile Card */}
          <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
            {/* Gradient Header */}
            <div 
              className="bg-primary text-white text-center py-4"
              style={{ background: 'linear-gradient(135deg, #1A237E 0%, #283593 100%)' }}
            >
              <div className="mb-2">
                <div 
                  className="rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {user.username?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h2 className="fw-bold mb-1">{user.username}</h2>
              <span className="badge bg-light text-primary fs-6">{user.role}</span>
            </div>

            <div className="card-body p-4 p-md-5">
              {isEditing ? (
                /* Edit Form */
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    {/* Username (Read-only) */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-uppercase text-muted">
                        Username
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-person text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0 ps-0 bg-light"
                          value={formData.username}
                          readOnly
                          disabled
                        />
                      </div>
                      <div className="form-text">
                        <small>Username cannot be changed</small>
                      </div>
                    </div>

                    {/* Email (Read-only) */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-uppercase text-muted">
                        Email Address
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-envelope text-muted"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control border-start-0 ps-0 bg-light"
                          value={formData.email}
                          readOnly
                          disabled
                        />
                      </div>
                      <div className="form-text">
                        <small>Email cannot be changed</small>
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-uppercase text-muted">
                        Phone Number
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-phone text-muted"></i>
                        </span>
                        <input
                          type="tel"
                          className="form-control border-start-0 ps-0"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="9876543210"
                          maxLength="10"
                          required
                        />
                      </div>
                      <div className="form-text text-end">
                        <small>10-digit mobile number</small>
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-uppercase text-muted">
                        Gender
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-gender-ambiguous text-muted"></i>
                        </span>
                        <select
                          className="form-select border-start-0 ps-0"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                          style={{ 
                            appearance: 'none',
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.75rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '16px 12px'
                          }}
                        >
                          <option value="">Select your gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>

                    {/* Status */}
                  </div>

                  {/* Action Buttons */}
                  <div className="row mt-4">
                    <div className="col-6">
                      <button 
                        type="button"
                        className="btn btn-outline-secondary w-100 py-3 rounded-2"
                        onClick={handleEditToggle}
                        disabled={isUpdating}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Cancel
                      </button>
                    </div>
                    <div className="col-6">
                      <button 
                        type="submit" 
                        className="btn w-100 py-3 fw-bold rounded-2 border-0"
                        disabled={isUpdating}
                        style={{
                          background: 'linear-gradient(135deg, #1A237E 0%, #283593 100%)',
                          color: 'white',
                          fontSize: '1rem'
                        }}
                      >
                        {isUpdating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* View Mode */
                <div className="row g-4">
                  {/* Personal Information */}
                  <div className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-transparent border-0">
                        <h5 className="card-title mb-0 text-primary">
                          <i className="bi bi-person-badge me-2"></i>
                          Personal Information
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">Username</label>
                            <p className="fs-6">{user.username}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">Email</label>
                            <p className="fs-6">{user.email}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">Phone</label>
                            <p className="fs-6">{user.phone || 'Not provided'}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">Gender</label>
                            <p className="fs-6 text-capitalize">{user.gender || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-transparent border-0">
                        <h5 className="card-title mb-0 text-primary">
                          <i className="bi bi-info-circle me-2"></i>
                          Account Details
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">User ID</label>
                            <p className="fs-6 font-monospace small">{user.id}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">Role</label>
                            <p className="fs-6">
                              <span className="badge bg-primary">{user.role}</span>
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">Status</label>
                            <p className="fs-6">
                              <span className={`badge ${
                                user.status === 'active' ? 'bg-success' : 
                                user.status === 'inactive' ? 'bg-warning' : 'bg-danger'
                              }`}>
                                {user.status || 'active'}
                              </span>
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted">Member Since</label>
                            <p className="fs-6">{formatDate(user.createdAt)}</p>
                          </div>
                          {user.updatedAt && user.updatedAt !== user.createdAt && (
                            <div className="col-12">
                              <label className="form-label fw-semibold text-muted">Last Updated</label>
                              <p className="fs-6">{formatDate(user.updatedAt)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-12 text-center mt-4">
                    <button 
                      className="btn me-3 py-2 px-4 fw-bold rounded-2 border-0"
                      onClick={handleEditToggle}
                      style={{
                        background: 'linear-gradient(135deg, #1A237E 0%, #283593 100%)',
                        color: 'white'
                      }}
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      Edit Profile
                    </button>
                    <button 
                      className="btn btn-outline-primary py-2 px-4 rounded-2"
                      onClick={() => navigate('/dashboard')}
                    >
                      <i className="bi bi-house me-2"></i>
                      Back to Dashboard
                    </button>
                  </div>
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