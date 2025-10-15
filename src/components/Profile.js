import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, updateUser } from '../store/slices/authSlice';
import { useGetUserQuery, useUpdateUserMutation } from '../store/api/authApi';
import Swal from 'sweetalert2';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    gender: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  // Your Brand Color Theme
  const theme = {
    primary: '#30418F',    // Deep blue
    secondary: '#69B236',  // Fresh green
    accent: '#69B236',     // Using green as accent
    background: '#F8FAFC', // Light slate
    surface: '#FFFFFF',    // White
    text: {
      primary: '#1E293B',  // Slate 800
      secondary: '#64748B', // Slate 500
      muted: '#94A3B8'     // Slate 400
    },
    gradient: {
      primary: 'linear-gradient(135deg, #30418F 0%, #4056B8 100%)',
      secondary: 'linear-gradient(135deg, #69B236 0%, #8BC34A 100%)',
      blueToGreen: 'linear-gradient(135deg, #30418F 0%, #69B236 100%)'
    }
  };

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
        gender: userData.user.gender || ''
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      if (userData?.user) {
        setFormData({
          username: userData.user.username || '',
          email: userData.user.email || '',
          phone: userData.user.phone || '',
          gender: userData.user.gender || ''
        });
      }
      setPasswordData({
        currentPassword: '',
        newPassword: ''
      });
      setActiveTab('profile');
    }
    setIsEditing(!isEditing);
  };

  const validateProfileForm = () => {
    if (!formData.username.trim()) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Username is required',
        icon: 'error',
        confirmButtonColor: theme.primary
      });
      return false;
    }

    if (!formData.email.trim()) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Email is required',
        icon: 'error',
        confirmButtonColor: theme.primary
      });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please enter a valid email address',
        icon: 'error',
        confirmButtonColor: theme.primary
      });
      return false;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please enter a valid 10-digit phone number',
        icon: 'error',
        confirmButtonColor: theme.primary
      });
      return false;
    }
    
    return true;
  };

  const validatePasswordForm = () => {
    if (!passwordData.currentPassword) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Current password is required',
        icon: 'error',
        confirmButtonColor: theme.primary
      });
      return false;
    }

    if (!passwordData.newPassword) {
      Swal.fire({
        title: 'Validation Error',
        text: 'New password is required',
        icon: 'error',
        confirmButtonColor: theme.primary
      });
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      Swal.fire({
        title: 'Password Requirements',
        html: `
          Password must contain:<br>
          • At least 8 characters<br>
          • One uppercase letter<br>
          • One lowercase letter<br>
          • One number<br>
          • One special character (@$!%*?&)
        `,
        icon: 'warning',
        confirmButtonColor: theme.primary
      });
      return false;
    }

    return true;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    try {
      const updateData = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender
      };

      const result = await updateUserMutation({
        userId: currentUser.id,
        userData: updateData
      }).unwrap();

      if (result.success) {
        dispatch(updateUser(result.user));
        await refetch();
        
        await Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully!',
          icon: 'success',
          confirmButtonColor: theme.primary,
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
        confirmButtonColor: theme.primary
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    try {
      const updateData = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      };

      const result = await updateUserMutation({
        userId: currentUser.id,
        userData: updateData
      }).unwrap();

      if (result.success) {
        await Swal.fire({
          title: 'Success!',
          text: 'Password updated successfully!',
          icon: 'success',
          confirmButtonColor: theme.primary,
          timer: 3000,
          timerProgressBar: true,
        });

        setPasswordData({
          currentPassword: '',
          newPassword: ''
        });
        setActiveTab('profile');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update password error:', error);
      let errorMessage = 'Failed to update password. Please try again.';
      
      if (error.data?.message) {
        if (error.data.message.includes('Current password is incorrect')) {
          errorMessage = 'Current password is incorrect';
        } else if (error.data.message.includes('Both currentPassword and newPassword are required')) {
          errorMessage = 'Both current password and new password are required';
        } else if (error.data.message.includes('cannot be same')) {
          errorMessage = 'New password cannot be same as current password';
        } else {
          errorMessage = error.data.message;
        }
      }
      
      Swal.fire({
        title: 'Update Failed!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: theme.primary
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
      <div className="container mt-5" style={{ background: theme.background, minHeight: '100vh' }}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card border-0 shadow-lg rounded-3" style={{ background: theme.surface }}>
              <div className="card-body text-center py-5">
                <div className="spinner-border" style={{ color: theme.primary }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3" style={{ color: theme.text.secondary }}>Loading profile...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5" style={{ background: theme.background, minHeight: '100vh' }}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card border-0 shadow-lg rounded-3" style={{ background: theme.surface }}>
              <div className="card-body text-center py-5">
                <div className="mb-4">
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: theme.gradient.primary,
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: 'white'
                  }}>
                    <i className="bi bi-exclamation-triangle"></i>
                  </div>
                </div>
                <h4 style={{ color: theme.text.primary }}>Error Loading Profile</h4>
                <p style={{ color: theme.text.secondary }}>Failed to load user profile. Please try again.</p>
                <button 
                  className="btn rounded-2 px-4 py-2 fw-semibold"
                  onClick={() => refetch()}
                  style={{ 
                    background: theme.gradient.primary, 
                    color: 'white',
                    border: 'none'
                  }}
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
      <div className="container mt-5" style={{ background: theme.background, minHeight: '100vh' }}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card border-0 shadow-lg rounded-3" style={{ background: theme.surface }}>
              <div className="card-body text-center py-5">
                <div className="mb-4">
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: theme.gradient.primary,
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: 'white'
                  }}>
                    <i className="bi bi-person-x"></i>
                  </div>
                </div>
                <h4 style={{ color: theme.text.primary }}>No User Data</h4>
                <p style={{ color: theme.text.secondary }}>Please log in to view your profile.</p>
                <button 
                  className="btn rounded-2 px-4 py-2 fw-semibold"
                  onClick={() => navigate('/login')}
                  style={{ 
                    background: theme.gradient.primary, 
                    color: 'white',
                    border: 'none'
                  }}
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
    <div className="container mt-4" style={{ background: theme.background, minHeight: '100vh', paddingBottom: '2rem' }}>
      <div className="row justify-content-center">
        <div className="col-xl-8 col-lg-10">
          {/* Back Button */}
          <div className="text-start mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="btn rounded-pill px-4 py-2 fw-semibold"
              style={{ 
                background: 'transparent',
                border: `2px solid ${theme.primary}`,
                color: theme.primary,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = theme.primary;
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = theme.primary;
              }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back
            </button>
          </div>

          {/* Profile Card */}
          <div className="card border-0 shadow-lg rounded-3 overflow-hidden" style={{ background: theme.surface }}>
            {/* Gradient Header */}
            <div 
              className="text-white text-center py-5 position-relative"
              style={{ background: theme.gradient.primary }}
            >
              <div className="position-absolute top-0 end-0 m-3">
                <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                  {user.role}
                </span>
              </div>
              
              <div className="mb-3">
                <div 
                  className="rounded-circle d-inline-flex align-items-center justify-content-center position-relative"
                  style={{
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '3px solid rgba(255,255,255,0.3)',
                    fontSize: '2.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  {user.username?.charAt(0).toUpperCase()}
                  <div className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-3 border-white" style={{ width: '20px', height: '20px' }}></div>
                </div>
              </div>
              <h2 className="fw-bold mb-2">{user.username}</h2>
              <p className="mb-0 opacity-90">{user.email}</p>
            </div>

            <div className="card-body p-4 p-md-5">
              {isEditing ? (
                /* Edit Mode with Tabs */
                <div>
                  {/* Modern Tabs */}
                  <div className="mb-5">
                    <div className="nav nav-pills nav-justified bg-light rounded-3 p-2" role="tablist" style={{ background: `${theme.background} !important` }}>
                      <button
                        className={`nav-link rounded-2 py-3 fw-semibold border-0 ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                        style={{
                          background: activeTab === 'profile' ? theme.gradient.primary : 'transparent',
                          color: activeTab === 'profile' ? 'white' : theme.text.secondary,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className="bi bi-person-gear me-2"></i>
                        Profile Settings
                      </button>
                      <button
                        className={`nav-link rounded-2 py-3 fw-semibold border-0 ${activeTab === 'password' ? 'active' : ''}`}
                        onClick={() => setActiveTab('password')}
                        style={{
                          background: activeTab === 'password' ? theme.gradient.primary : 'transparent',
                          color: activeTab === 'password' ? 'white' : theme.text.secondary,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className="bi bi-shield-lock me-2"></i>
                        Security
                      </button>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="tab-content">
                    {/* Profile Info Tab */}
                    {activeTab === 'profile' && (
                      <form onSubmit={handleProfileSubmit}>
                        <div className="row g-4">
                          <div className="col-12">
                            <label className="form-label fw-semibold small text-uppercase mb-3" style={{ color: theme.text.secondary, letterSpacing: '0.5px' }}>
                              Personal Information
                            </label>
                          </div>

                          {/* Username */}
                          <div className="col-md-6">
                            <label className="form-label fw-semibold" style={{ color: theme.text.primary }}>
                              Username <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-transparent border-end-0" style={{ color: theme.primary }}>
                                <i className="bi bi-person"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control border-start-0 ps-0"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Enter username"
                                required
                                style={{ 
                                  borderColor: '#E2E8F0',
                                  color: theme.text.primary
                                }}
                              />
                            </div>
                          </div>

                          {/* Email */}
                          <div className="col-md-6">
                            <label className="form-label fw-semibold" style={{ color: theme.text.primary }}>
                              Email Address <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-transparent border-end-0" style={{ color: theme.primary }}>
                                <i className="bi bi-envelope"></i>
                              </span>
                              <input
                                type="email"
                                className="form-control border-start-0 ps-0"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                                required
                                style={{ 
                                  borderColor: '#E2E8F0',
                                  color: theme.text.primary
                                }}
                              />
                            </div>
                          </div>

                          {/* Phone Number */}
                          <div className="col-md-6">
                            <label className="form-label fw-semibold" style={{ color: theme.text.primary }}>
                              Phone Number
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-transparent border-end-0" style={{ color: theme.primary }}>
                                <i className="bi bi-phone"></i>
                              </span>
                              <input
                                type="tel"
                                className="form-control border-start-0 ps-0"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="9876543210"
                                maxLength="10"
                                style={{ 
                                  borderColor: '#E2E8F0',
                                  color: theme.text.primary
                                }}
                              />
                            </div>
                            <div className="form-text" style={{ color: theme.text.muted }}>
                              10-digit mobile number
                            </div>
                          </div>

                          {/* Gender */}
                          <div className="col-md-6">
                            <label className="form-label fw-semibold" style={{ color: theme.text.primary }}>
                              Gender
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-transparent border-end-0" style={{ color: theme.primary }}>
                                <i className="bi bi-gender-ambiguous"></i>
                              </span>
                              <select
                                className="form-select border-start-0 ps-0"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                style={{ 
                                  borderColor: '#E2E8F0',
                                  color: theme.text.primary,
                                  appearance: 'none',
                                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='${theme.primary.replace('#', '%23')}' viewBox='0 0 20 20'%3e%3cpath stroke='%2330418F' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                  backgroundPosition: 'right 0.75rem center',
                                  backgroundRepeat: 'no-repeat',
                                  backgroundSize: '16px 12px'
                                }}
                              >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="row mt-5 pt-4 border-top" style={{ borderColor: '#E2E8F0' }}>
                          <div className="col-6">
                            <button 
                              type="button"
                              className="btn w-100 py-3 rounded-2 fw-semibold border-0"
                              onClick={handleEditToggle}
                              disabled={isUpdating}
                              style={{ 
                                background: 'transparent',
                                border: `2px solid ${theme.text.muted} !important`,
                                color: theme.text.secondary,
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = theme.text.muted;
                                e.target.style.color = 'white';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = theme.text.secondary;
                              }}
                            >
                              <i className="bi bi-x-circle me-2"></i>
                              Cancel
                            </button>
                          </div>
                          <div className="col-6">
                            <button 
                              type="submit"
                              className="btn w-100 py-3 fw-semibold rounded-2 border-0"
                              disabled={isUpdating}
                              style={{
                                background: theme.gradient.primary,
                                color: 'white',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                transform: 'translateY(0)'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(48, 65, 143, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
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
                    )}

                    {/* Password Change Tab */}
                    {activeTab === 'password' && (
                      <form onSubmit={handlePasswordSubmit}>
                        <div className="row g-4">
                          <div className="col-12">
                            <label className="form-label fw-semibold small text-uppercase mb-3" style={{ color: theme.text.secondary, letterSpacing: '0.5px' }}>
                              Change Password
                            </label>
                          </div>

                          {/* Current Password */}
                          <div className="col-12">
                            <label className="form-label fw-semibold" style={{ color: theme.text.primary }}>
                              Current Password <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-transparent border-end-0" style={{ color: theme.primary }}>
                                <i className="bi bi-lock"></i>
                              </span>
                              <input
                                type="password"
                                className="form-control border-start-0 ps-0"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="Enter current password"
                                required
                                style={{ 
                                  borderColor: '#E2E8F0',
                                  color: theme.text.primary
                                }}
                              />
                            </div>
                          </div>

                          {/* New Password */}
                          <div className="col-12">
                            <label className="form-label fw-semibold" style={{ color: theme.text.primary }}>
                              New Password <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-transparent border-end-0" style={{ color: theme.primary }}>
                                <i className="bi bi-key"></i>
                              </span>
                              <input
                                type="password"
                                className="form-control border-start-0 ps-0"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="Enter new password"
                                required
                                style={{ 
                                  borderColor: '#E2E8F0',
                                  color: theme.text.primary
                                }}
                              />
                            </div>
                            <div className="form-text mt-2" style={{ color: theme.text.muted }}>
                              <small>
                                Password must contain at least 8 characters with uppercase, lowercase, number, and special character
                              </small>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="row mt-5 pt-4 border-top" style={{ borderColor: '#E2E8F0' }}>
                          <div className="col-6">
                            <button 
                              type="button"
                              className="btn w-100 py-3 rounded-2 fw-semibold border-0"
                              onClick={() => setActiveTab('profile')}
                              disabled={isUpdating}
                              style={{ 
                                background: 'transparent',
                                border: `2px solid ${theme.text.muted} !important`,
                                color: theme.text.secondary,
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = theme.text.muted;
                                e.target.style.color = 'white';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = theme.text.secondary;
                              }}
                            >
                              <i className="bi bi-arrow-left me-2"></i>
                              Back to Profile
                            </button>
                          </div>
                          <div className="col-6">
                            <button 
                              type="submit" 
                              className="btn w-100 py-3 fw-semibold rounded-2 border-0"
                              disabled={isUpdating}
                              style={{
                                background: theme.gradient.primary,
                                color: 'white',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                transform: 'translateY(0)'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(48, 65, 143, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                              }}
                            >
                              {isUpdating ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2"></span>
                                  Updating...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-shield-check me-2"></i>
                                  Change Password
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              ) : (
                /* View Mode - Modern Design */
                <div className="row g-4">
                  {/* Quick Stats */}
                  <div className="col-12">
                    <div className="row g-3">
                      <div className="col-md-3 col-6">
                        <div className="card border-0 rounded-3 text-center p-3 hover-lift" style={{ background: theme.background, transition: 'all 0.3s ease' }}>
                          <div style={{ color: theme.primary, fontSize: '1.5rem' }}>
                            <i className="bi bi-person-check"></i>
                          </div>
                          <div className="mt-2">
                            <div style={{ color: theme.text.primary, fontWeight: '600' }}>Active</div>
                            <small style={{ color: theme.text.muted }}>Status</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="card border-0 rounded-3 text-center p-3 hover-lift" style={{ background: theme.background, transition: 'all 0.3s ease' }}>
                          <div style={{ color: theme.secondary, fontSize: '1.5rem' }}>
                            <i className="bi bi-calendar-check"></i>
                          </div>
                          <div className="mt-2">
                            <div style={{ color: theme.text.primary, fontWeight: '600' }}>{formatDate(user.createdAt)}</div>
                            <small style={{ color: theme.text.muted }}>Member Since</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="card border-0 rounded-3 text-center p-3 hover-lift" style={{ background: theme.background, transition: 'all 0.3s ease' }}>
                          <div style={{ color: theme.primary, fontSize: '1.5rem' }}>
                            <i className="bi bi-shield-check"></i>
                          </div>
                          <div className="mt-2">
                            <div style={{ color: theme.text.primary, fontWeight: '600' }}>Verified</div>
                            <small style={{ color: theme.text.muted }}>Account</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-6">
                        <div className="card border-0 rounded-3 text-center p-3 hover-lift" style={{ background: theme.background, transition: 'all 0.3s ease' }}>
                          <div style={{ color: theme.secondary, fontSize: '1.5rem' }}>
                            <i className="bi bi-star"></i>
                          </div>
                          <div className="mt-2">
                            <div style={{ color: theme.text.primary, fontWeight: '600' }}>{user.role}</div>
                            <small style={{ color: theme.text.muted }}>Role</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="col-12">
                    <div className="card border-0 rounded-3" style={{ background: theme.background }}>
                      <div className="card-header bg-transparent border-0 py-4">
                        <h5 className="card-title mb-0 fw-bold" style={{ color: theme.text.primary }}>
                          <i className="bi bi-person-badge me-3" style={{ color: theme.primary }}></i>
                          Personal Information
                        </h5>
                      </div>
                      <div className="card-body">
                        <div className="row g-4">
                          <div className="col-md-6">
                            <div className="d-flex align-items-center p-3 rounded-3 hover-lift" style={{ background: theme.surface, transition: 'all 0.3s ease' }}>
                              <div className="me-3" style={{ color: theme.primary, fontSize: '1.25rem' }}>
                                <i className="bi bi-person"></i>
                              </div>
                              <div>
                                <div style={{ color: theme.text.muted, fontSize: '0.875rem' }}>Username</div>
                                <div style={{ color: theme.text.primary, fontWeight: '600' }}>{user.username}</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="d-flex align-items-center p-3 rounded-3 hover-lift" style={{ background: theme.surface, transition: 'all 0.3s ease' }}>
                              <div className="me-3" style={{ color: theme.primary, fontSize: '1.25rem' }}>
                                <i className="bi bi-envelope"></i>
                              </div>
                              <div>
                                <div style={{ color: theme.text.muted, fontSize: '0.875rem' }}>Email</div>
                                <div style={{ color: theme.text.primary, fontWeight: '600' }}>{user.email}</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="d-flex align-items-center p-3 rounded-3 hover-lift" style={{ background: theme.surface, transition: 'all 0.3s ease' }}>
                              <div className="me-3" style={{ color: theme.primary, fontSize: '1.25rem' }}>
                                <i className="bi bi-phone"></i>
                              </div>
                              <div>
                                <div style={{ color: theme.text.muted, fontSize: '0.875rem' }}>Phone</div>
                                <div style={{ color: theme.text.primary, fontWeight: '600' }}>{user.phone || 'Not provided'}</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="d-flex align-items-center p-3 rounded-3 hover-lift" style={{ background: theme.surface, transition: 'all 0.3s ease' }}>
                              <div className="me-3" style={{ color: theme.primary, fontSize: '1.25rem' }}>
                                <i className="bi bi-gender-ambiguous"></i>
                              </div>
                              <div>
                                <div style={{ color: theme.text.muted, fontSize: '0.875rem' }}>Gender</div>
                                <div style={{ color: theme.text.primary, fontWeight: '600', textTransform: 'capitalize' }}>{user.gender || 'Not specified'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-12 text-center mt-4">
                    <button 
                      className="btn me-3 py-3 px-5 fw-semibold rounded-2 border-0"
                      onClick={handleEditToggle}
                      style={{
                        background: theme.gradient.primary,
                        color: 'white',
                        transition: 'all 0.3s ease',
                        transform: 'translateY(0)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(48, 65, 143, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      Edit Profile
                    </button>
                    <button 
                      className="btn py-3 px-5 rounded-2 fw-semibold"
                      onClick={() => navigate('/dashboard')}
                      style={{ 
                        background: 'transparent',
                        border: `2px solid ${theme.primary}`,
                        color: theme.primary,
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = theme.primary;
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = theme.primary;
                      }}
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

      {/* Add hover lift effect for cards */}
      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default Profile;