// components/Login.js
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setCredentials } from '../store/slices/authSlice';
import { useLoginMutation, useSendLoginOtpMutation } from '../store/api/authApi';
import Swal from 'sweetalert2';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [login, { isLoading }] = useLoginMutation();
  const [sendLoginOtp, { isLoading: isSendingOtp }] = useSendLoginOtpMutation();
  
  const [loginState, setLoginState] = useState({
    email: '',
    password: '',
    loginMethod: 'password', // 'password' or 'otp'
    otpIdentifier: '', // For OTP login - can be email or phone
  });
  
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Memoized input handler
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setLoginState(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  }, [error]);

  // Memoized login method handler
  const handleLoginMethodChange = useCallback((method) => {
    setLoginState(prev => ({
      ...prev,
      loginMethod: method,
      // Reset fields when switching methods
      email: method === 'password' ? prev.email : '',
      password: method === 'password' ? prev.password : '',
      otpIdentifier: method === 'otp' ? prev.otpIdentifier : ''
    }));
    setError('');
  }, []);

  // Detect identifier type (email or phone)
  const detectIdentifierType = useCallback((identifier) => {
    if (!identifier) return null;
    
    // Check if it's a phone number (only digits, 10 characters)
    const cleanedPhone = identifier.replace(/\D/g, '');
    if (/^\d{10}$/.test(cleanedPhone)) {
      return 'phone';
    }
    
    // Check if it's an email
    if (/\S+@\S+\.\S+/.test(identifier)) {
      return 'email';
    }
    
    return null;
  }, []);

  // Centralized validation for password login
  const validatePasswordLogin = useCallback(() => {
    const { email, password } = loginState;

    if (!email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!password) {
      setError('Password is required');
      return false;
    }

    return true;
  }, [loginState]);

  // Centralized validation for OTP login
  const validateOtpLogin = useCallback(() => {
    const { otpIdentifier } = loginState;

    if (!otpIdentifier.trim()) {
      setError('Email or phone number is required');
      return false;
    }

    const identifierType = detectIdentifierType(otpIdentifier);
    
    if (!identifierType) {
      setError('Please enter a valid email address or 10-digit phone number');
      return false;
    }

    return true;
  }, [loginState, detectIdentifierType]);

  // Handle password login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordLogin()) return;

    try {
      const result = await login({
        email: loginState.email,
        password: loginState.password
      }).unwrap();

      if (result.success) {
        dispatch(setCredentials({
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        }));

        await Swal.fire({
          title: 'Welcome Back!',
          text: `Successfully logged in as ${result.user.username}`,
          icon: 'success',
          confirmButtonColor: '#6FBC2E',
          confirmButtonText: 'Continue Shopping',
          timer: 3000,
          timerProgressBar: true,
        });

        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.data?.message || error.error || 'Login failed. Please check your credentials.');
    }
  };

  // Handle OTP login
  const handleOtpLogin = async (e) => {
    e.preventDefault();
    
    if (!validateOtpLogin()) return;

    try {
      const identifierType = detectIdentifierType(loginState.otpIdentifier);
      const formattedIdentifier = identifierType === 'phone' 
        ? loginState.otpIdentifier.replace(/\D/g, '')
        : loginState.otpIdentifier;

      // Send OTP based on detected type
      const payload = identifierType === 'email' 
        ? { email: formattedIdentifier }
        : { phone: formattedIdentifier };

      console.log('Sending OTP with payload:', payload);

      const result = await sendLoginOtp(payload).unwrap();

      if (result.success) {
        // Navigate directly to OTP verification page with all data
        navigate('/verify-login-otp', { 
          state: { 
            identifier: formattedIdentifier,
            identifierType: identifierType,
            action: 'login' // This tells the OTP page it's for login
          } 
        });
        
        // Don't show success message here - let OTP page handle it
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setError(error.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  // Handle form submission based on login method
  const handleSubmit = useCallback((e) => {
    loginState.loginMethod === 'password' 
      ? handlePasswordLogin(e)
      : handleOtpLogin(e);
  }, [loginState.loginMethod, handlePasswordLogin, handleOtpLogin]);

  // Forgot password handler (only for password login)
  const handleForgotPassword = async () => {
    const { value: identifier } = await Swal.fire({
      title: 'Forgot Password?',
      text: 'Enter your email or phone number to receive password reset OTP',
      input: 'text',
      inputPlaceholder: 'your@email.com or 9876543210',
      showCancelButton: true,
      confirmButtonColor: '#1A237E',
      cancelButtonColor: '#6FBC2E',
      confirmButtonText: 'Send OTP',
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('Please enter your email or phone number');
          return false;
        }
        
        const identifierType = detectIdentifierType(value);
        if (!identifierType) {
          Swal.showValidationMessage('Please enter a valid email address or 10-digit phone number');
          return false;
        }
        
        return identifierType === 'phone' ? value.replace(/\D/g, '') : value;
      }
    });

    if (identifier) {
      const identifierType = detectIdentifierType(identifier);
      const formattedIdentifier = identifierType === 'phone' 
        ? identifier.replace(/\D/g, '')
        : identifier;

      await sendForgotPasswordOtp(
        identifierType === 'email' ? { email: formattedIdentifier } : { phone: formattedIdentifier },
        identifierType
      );
    }
  };

  const sendForgotPasswordOtp = async (payload, type) => {
    try {
      const result = await sendLoginOtp(payload).unwrap();

      if (result.success) {
        // Navigate directly to OTP verification for password reset
        navigate('/verify-login-otp', { 
          state: { 
            identifier: type === 'email' ? payload.email : payload.phone,
            identifierType: type,
            action: 'password_reset'
          } 
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.data?.message || 'Failed to send OTP. Please try again.',
        icon: 'error',
        confirmButtonColor: '#6FBC2E'
      });
    }
  };

  const { email, password, loginMethod, otpIdentifier } = loginState;
  const isLoadingState = isLoading || isSendingOtp;

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

            {/* Login Card */}
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
                    <i className="bi bi-box-arrow-in-right fs-5"></i>
                  </div>
                </div>
                <h3 className="fw-bold mb-1">Welcome Back</h3>
                <p className="mb-0 opacity-75">Sign in to your ShopEasy account</p>
              </div>

              <div className="card-body p-4 p-md-5">
                {/* Login Method Toggle */}
                <div className="row g-2 mb-4">
                  {[
                    { value: 'password', icon: 'bi-key', label: 'Password' },
                    { value: 'otp', icon: 'bi-shield-check', label: 'OTP Login' }
                  ].map((method) => (
                    <div key={method.value} className="col-6">
                      <button
                        type="button"
                        className={`btn w-100 py-2 rounded-2 ${loginMethod === method.value ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleLoginMethodChange(method.value)}
                        style={{
                          fontSize: '0.9rem',
                          borderColor: '#1A237E',
                          backgroundColor: loginMethod === method.value ? '#1A237E' : 'transparent',
                          color: loginMethod === method.value ? 'white' : '#1A237E'
                        }}
                      >
                        <i className={`${method.icon} me-2`}></i>
                        {method.label}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center rounded-2 border-0 shadow-sm" 
                       style={{ backgroundColor: '#FFF5F5' }}
                       role="alert">
                    <i className="bi bi-exclamation-circle-fill text-danger me-2"></i>
                    <small className="fw-medium">{error}</small>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                  <div className="row g-3">
                    
                    {/* Password Login Fields */}
                    {loginMethod === 'password' && (
                      <>
                        {/* Email Input */}
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
                              value={email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        {/* Password Field */}
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <label htmlFor="password" className="form-label fw-semibold small text-uppercase text-muted mb-0">
                              Password
                            </label>
                            <button
                              type="button"
                              className="btn btn-link p-0 text-decoration-none"
                              onClick={handleForgotPassword}
                              style={{ 
                                color: '#6FBC2E',
                                fontSize: '0.8rem',
                                fontWeight: '500'
                              }}
                            >
                              Forgot Password?
                            </button>
                          </div>
                          <div className="input-group input-group-lg">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-lock text-muted"></i>
                            </span>
                            <input
                              type={showPassword ? "text" : "password"}
                              className="form-control border-start-0 ps-0"
                              id="password"
                              name="password"
                              placeholder="Enter your password"
                              value={password}
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
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="rememberMe"
                              style={{ 
                                backgroundColor: '#1A237E',
                                borderColor: '#1A237E'
                              }}
                            />
                            <label 
                              className="form-check-label text-muted small" 
                              htmlFor="rememberMe"
                            >
                              Remember me for 30 days
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    {/* OTP Login Field */}
                    {loginMethod === 'otp' && (
                      <div className="col-12">
                        <label htmlFor="otpIdentifier" className="form-label fw-semibold small text-uppercase text-muted">
                          Email or Phone Number
                        </label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-person text-muted"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0 ps-0"
                            id="otpIdentifier"
                            name="otpIdentifier"
                            placeholder="your@email.com or 9876543210"
                            value={otpIdentifier}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <small className="text-muted">
                          Enter your email address or 10-digit phone number to receive OTP
                        </small>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4">
                    <button 
                      type="submit" 
                      className="btn w-100 py-3 fw-bold rounded-2 border-0"
                      disabled={isLoadingState}
                      style={{
                        background: 'linear-gradient(135deg, #1A237E 0%, #283593 100%)',
                        color: 'white',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoadingState) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 25px rgba(26, 35, 126, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoadingState) {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {isLoadingState ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          {loginMethod === 'password' ? 'Signing In...' : 'Sending OTP...'}
                        </>
                      ) : (
                        <>
                          <i className={`bi ${loginMethod === 'password' ? 'bi-box-arrow-in-right' : 'bi-shield-check'} me-2`}></i>
                          {loginMethod === 'password' ? 'Sign In' : 'Send OTP'}
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Register Link */}
                <div className="text-center mt-4 pt-3 border-top">
                  <p className="mb-2 text-muted">
                    Don't have an account?
                  </p>
                  <Link 
                    to="/register" 
                    className="btn btn-outline-primary rounded-2 px-4"
                    style={{ 
                      borderColor: '#6FBC2E',
                      color: '#6FBC2E'
                    }}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Create Account
                  </Link>
                </div>

                {/* Terms */}
                <div className="text-center mt-4 pt-3 border-top">
                  <small className="text-muted">
                    By signing in, you agree to our{' '}
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
                { icon: 'bi-shield-check', text: 'Secure Login' },
                { icon: 'bi-clock', text: '24/7 Support' },
                { icon: 'bi-phone', text: 'Mobile Friendly' },
                { icon: 'bi-graph-up', text: 'Order Tracking' }
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

export default Login;