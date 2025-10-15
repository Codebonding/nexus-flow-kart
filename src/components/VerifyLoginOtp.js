// components/VerifyLoginOtp.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { useVerifyLoginOtpMutation, useSendLoginOtpMutation } from '../store/api/authApi';
import Swal from 'sweetalert2';

const VerifyLoginOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [verifyLoginOtp, { isLoading: isVerifying }] = useVerifyLoginOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useSendLoginOtpMutation();
  
  // Get data from navigation state
  const { identifier, identifierType, action } = location.state || {};
  
  const [formData, setFormData] = useState({
    otp: ''
  });
  
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Determine verification type based on action
  const verificationType = action === 'password_reset' ? 'password_reset' : 'login';

  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  // Redirect if no identifier is provided
  useEffect(() => {
    if (!identifier || !identifierType) {
      Swal.fire({
        title: 'Error!',
        text: 'Invalid verification request. Please try again.',
        icon: 'error',
        confirmButtonColor: '#6FBC2E'
      }).then(() => {
        navigate('/login');
      });
    }
  }, [identifier, identifierType, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.otp.trim()) {
      setError('OTP is required');
      return false;
    }
    
    if (formData.otp.length !== 6) {
      setError('OTP must be 6 digits');
      return false;
    }
    
    return true;
  };

  const getPayload = () => {
    const payload = { otp: formData.otp };
    if (identifierType === 'email') {
      payload.email = identifier;
    } else {
      payload.phone = identifier;
    }
    return payload;
  };

  const getResendPayload = () => {
    if (identifierType === 'email') {
      return { email: identifier };
    } else {
      return { phone: identifier };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const payload = getPayload();
      const result = await verifyLoginOtp(payload).unwrap();

      if (result.success) {
        if (verificationType === 'login') {
          // Login OTP verification successful
          dispatch(setCredentials({
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
          }));

          await Swal.fire({
            title: 'Success!',
            text: `Welcome back ${result.user.username}!`,
            icon: 'success',
            confirmButtonColor: '#6FBC2E',
            confirmButtonText: 'Continue Shopping'
          });

          navigate('/', { replace: true });
        } else {
          // Password reset OTP verification successful - navigate to reset password
          await Swal.fire({
            title: 'OTP Verified!',
            text: 'Please set your new password.',
            icon: 'success',
            confirmButtonColor: '#6FBC2E'
          });

          navigate('/reset-password', { 
            state: { 
              identifier: identifier,
              identifierType: identifierType
            } 
          });
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error.data) {
        setError(error.data.message || 'OTP verification failed');
      } else {
        setError('OTP verification failed. Please try again.');
      }
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;

    try {
      const payload = getResendPayload();
      const result = await resendOtp(payload).unwrap();

      if (result.success) {
        await Swal.fire({
          title: 'OTP Sent!',
          text: `A new OTP has been sent to your ${identifierType}.`,
          icon: 'success',
          confirmButtonColor: '#6FBC2E',
          timer: 3000,
          timerProgressBar: true,
        });

        // Reset countdown
        setCountdown(60);
        setCanResend(false);
        
        // Clear any previous errors
        setError('');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to resend OTP. Please try again.',
        icon: 'error',
        confirmButtonColor: '#6FBC2E'
      });
    }
  };

  // Don't render if no identifier
  if (!identifier || !identifierType) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Redirecting...</p>
        </div>
      </div>
    );
  }

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

            {/* OTP Verification Card */}
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
                    <i className="bi bi-shield-check fs-5"></i>
                  </div>
                </div>
                <h3 className="fw-bold mb-1">
                  {verificationType === 'login' ? 'Verify Login OTP' : 'Verify Reset OTP'}
                </h3>
                <p className="mb-0 opacity-75">
                  Enter the code sent to your {identifierType}
                </p>
              </div>

              <div className="card-body p-4 p-md-5">
                {/* Identifier Display */}
                <div className="alert alert-info d-flex align-items-center rounded-2 border-0 shadow-sm mb-4" 
                     style={{ backgroundColor: '#F0F7FF' }}
                     role="alert">
                  <i className={`bi ${identifierType === 'email' ? 'bi-envelope' : 'bi-phone'} text-primary me-2`}></i>
                  <small className="fw-medium">
                    Code sent to: <strong>{identifier}</strong>
                  </small>
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

                {/* OTP Form */}
                <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                  <div className="row g-3">
                    {/* OTP Input */}
                    <div className="col-12">
                      <label htmlFor="otp" className="form-label fw-semibold small text-uppercase text-muted">
                        OTP Code
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-key text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0 ps-0 text-center"
                          id="otp"
                          name="otp"
                          value={formData.otp}
                          onChange={handleInputChange}
                          placeholder="Enter 6-digit OTP"
                          maxLength="6"
                          required
                          style={{ letterSpacing: '0.5em', fontWeight: '600' }}
                        />
                      </div>
                      <small className="text-muted">
                        Enter the 6-digit OTP sent to your {identifierType}
                      </small>
                    </div>
                  </div>

                  {/* Resend OTP Section */}
                  <div className="text-center mt-4">
                    {canResend ? (
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none p-0 fw-medium"
                        onClick={handleResendOtp}
                        disabled={isResending}
                        style={{ 
                          color: '#6FBC2E',
                          fontSize: '0.9rem'
                        }}
                      >
                        {isResending ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Resend OTP
                          </>
                        )}
                      </button>
                    ) : (
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        Resend OTP in {countdown} seconds
                      </small>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4">
                    <button 
                      type="submit" 
                      className="btn w-100 py-3 fw-bold rounded-2 border-0"
                      disabled={isVerifying}
                      style={{
                        background: 'linear-gradient(135deg, #1A237E 0%, #283593 100%)',
                        color: 'white',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isVerifying) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 25px rgba(26, 35, 126, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isVerifying) {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {isVerifying ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-shield-check me-2"></i>
                          {verificationType === 'login' ? 'Login with OTP' : 'Verify OTP'}
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="text-center my-4">
                  <div className="d-flex align-items-center">
                    <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }}></div>
                    <div className="px-3 text-muted small">OR</div>
                    <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }}></div>
                  </div>
                </div>

                {/* Back to Login */}
                <div className="text-center">
                  <p className="mb-2 text-muted">
                    Changed your mind?
                  </p>
                  <Link 
                    to="/login" 
                    className="btn btn-outline-primary rounded-2 px-4"
                    style={{ 
                      borderColor: '#6FBC2E',
                      color: '#6FBC2E'
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Back to Login
                  </Link>
                </div>

                {/* Help Text */}
                <div className="text-center mt-4 pt-3 border-top">
                  <small className="text-muted">
                    Didn't receive the OTP? Check your {identifierType === 'email' ? 'spam folder' : 'messages'} or{' '}
                    <button
                      type="button"
                      className="btn btn-link p-0 text-decoration-none"
                      onClick={handleResendOtp}
                      disabled={!canResend || isResending}
                      style={{ 
                        color: '#1A237E',
                        fontSize: 'inherit'
                      }}
                    >
                      resend
                    </button>
                  </small>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="row mt-4 g-3 text-center">
              {[
                { icon: 'bi-shield-check', text: 'Secure Verification' },
                { icon: 'bi-clock', text: 'OTP Expires in 5 min' },
                { icon: identifierType === 'email' ? 'bi-envelope' : 'bi-phone', text: identifierType === 'email' ? 'Check Email' : 'Check SMS' },
                { icon: 'bi-phone', text: 'Mobile Friendly' }
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

export default VerifyLoginOtp;