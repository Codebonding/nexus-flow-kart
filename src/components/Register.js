// components/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../store/api/authApi';
import Swal from 'sweetalert2';

const Register = () => {
  const navigate = useNavigate();
  
  const [register, { isLoading }] = useRegisterMutation();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For phone field, only allow numbers and limit to 10 digits
    if (name === 'phone') {
      const numbersOnly = value.replace(/\D/g, '');
      if (numbersOnly.length <= 10) {
        setFormData({
          ...formData,
          [name]: numbersOnly
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    
    if (!formData.gender) {
      setError('Please select your gender');
      return false;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        password: formData.password,
        role: 'customer'
      }).unwrap();

      console.log('Registration response:', result);

      if (result.success) {
        // Show success alert
        await Swal.fire({
          title: 'Success!',
          text: 'User registered successfully! Please check your email for OTP verification.',
          icon: 'success',
          confirmButtonColor: '#6FBC2E',
          confirmButtonText: 'Verify OTP',
          timer: 3000,
          timerProgressBar: true,
        });

        // Redirect to OTP verification page
        navigate('/verify-otp', { 
          state: { email: formData.email },
          replace: true 
        });
      }
    } catch (error) {
      console.error('Registration error details:', error);
      if (error.data) {
        setError(error.data.message || 'Registration failed');
      } else if (error.error) {
        setError(error.error);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-xl-5 col-lg-6 col-md-8">
            {/* Back to Home */}
            <div className="text-start mb-4">
              <Link 
                to="/" 
                className="btn btn-outline-primary btn-sm rounded-pill px-3"
                style={{ 
                  borderColor: '#1A237E',
                  color: '#1A237E'
                }}
              >
                <i className="bi bi-arrow-left me-1"></i>
                Back to Home
              </Link>
            </div>

            {/* Register Card */}
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
                      width: '50px',
                      height: '50px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <i className="bi bi-person-plus-fill fs-5"></i>
                  </div>
                </div>
                <h3 className="fw-bold mb-1">Join ShopEasy</h3>
                <p className="mb-0 opacity-75">Create your account in seconds</p>
              </div>

              <div className="card-body p-4 p-md-5">
                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center rounded-2 border-0 shadow-sm" 
                       style={{ backgroundColor: '#FFF5F5' }}
                       role="alert">
                    <i className="bi bi-exclamation-circle-fill text-danger me-2"></i>
                    <small className="fw-medium">{error}</small>
                  </div>
                )}

                {/* Register Form */}
                <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                  <div className="row g-3">
                    {/* Username */}
                    <div className="col-12">
                      <label htmlFor="username" className="form-label fw-semibold small text-uppercase text-muted">
                        Username
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-person text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0 ps-0"
                          id="username"
                          name="username"
                          placeholder="Choose a username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-12">
                      <label htmlFor="email" className="form-label fw-semibold small text-uppercase text-muted">
                        Email Address
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-envelope text-muted"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control border-start-0 ps-0"
                          id="email"
                          name="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="col-12">
                      <label htmlFor="phone" className="form-label fw-semibold small text-uppercase text-muted">
                        Phone Number
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-phone text-muted"></i>
                        </span>
                        <input
                          type="tel"
                          className="form-control border-start-0 ps-0"
                          id="phone"
                          name="phone"
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={handleInputChange}
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
                      <label htmlFor="gender" className="form-label fw-semibold small text-uppercase text-muted">
                        Gender
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-gender-ambiguous text-muted"></i>
                        </span>
                        <select
                          className="form-select border-start-0 ps-0"
                          id="gender"
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
                        </select>
                      </div>
                    </div>

                    {/* Password */}
                    <div className="col-12">
                      <label htmlFor="password" className="form-label fw-semibold small text-uppercase text-muted">
                        Password
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-lock text-muted"></i>
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control border-start-0 ps-0"
                          id="password"
                          name="password"
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                        <button
                          type="button"
                          className="btn bg-light border-start-0"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ borderColor: '#e0e0e0' }}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                        </button>
                      </div>
                      <div className="form-text text-end">
                        <small>Min. 6 characters</small>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="col-12">
                      <label htmlFor="confirmPassword" className="form-label fw-semibold small text-uppercase text-muted">
                        Confirm Password
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-lock-fill text-muted"></i>
                        </span>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control border-start-0 ps-0"
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                        <button
                          type="button"
                          className="btn bg-light border-start-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{ borderColor: '#e0e0e0' }}
                        >
                          <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4">
                    <button 
                      type="submit" 
                      className="btn w-100 py-3 fw-bold rounded-2 border-0"
                      disabled={isLoading}
                      style={{
                        background: 'linear-gradient(135deg, #1A237E 0%, #283593 100%)',
                        color: 'white',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 25px rgba(26, 35, 126, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Create Account
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="text-center my-4">
                  <div className="d-flex align-items-center">
                    <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }}></div>
                    
                  </div>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <p className="mb-2 text-muted" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                    Already have an account?
                  </p>
                  <Link 
                    to="/login" 
                    className="btn btn-outline-primary rounded-2 px-4"
                    style={{ 
                      borderColor: '#6FBC2E',
                      color: '#6FBC2E',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </Link>
                </div>

                {/* Terms */}
                <div className="text-center mt-4 pt-3 border-top">
                  <small className="text-muted">
                    By creating an account, you agree to our{' '}
                    <a href="/terms" className="text-decoration-none" style={{ color: '#1A237E' }}>
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-decoration-none" style={{ color: '#1A237E' }}>
                      Privacy Policy
                    </a>
                  </small>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="row mt-4 g-3 text-center">
              {[
                { icon: 'bi-truck', text: 'Free Shipping' },
                { icon: 'bi-shield-check', text: 'Secure Payment' },
                { icon: 'bi-arrow-left-right', text: 'Easy Returns' },
                { icon: 'bi-award', text: 'Quality Guarantee' }
              ].map((feature, index) => (
                <div key={index} className="col-6 col-md-3">
                  <div className="d-flex flex-column align-items-center">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center mb-1"
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: 'rgba(111, 188, 46, 0.1)',
                        color: '#6FBC2E'
                      }}
                    >
                      <i className={`bi ${feature.icon}`}></i>
                    </div>
                    <small className="text-muted fw-medium">{feature.text}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;