// components/VerifyOtp.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useVerifyOtpMutation, useRegisterMutation } from '../store/api/authApi';
import Swal from 'sweetalert2';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useRegisterMutation(); // Using register to resend OTP
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    otp: ''
  });
  
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await verifyOtp(formData).unwrap();

      if (result.success) {
        await Swal.fire({
          title: 'Success!',
          text: result.message || 'OTP verified successfully!',
          icon: 'success',
          confirmButtonColor: '#6FBC2E',
          confirmButtonText: 'Continue to Login'
        });

        navigate('/login', { replace: true });
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
      // Resend OTP by calling register API again with the same email
      const result = await resendOtp({
        username: 'temp', // Temporary username since API requires it
        email: formData.email,
        password: 'temp123', // Temporary password since API requires it
        phone: '0000000000', // Temporary phone since API requires it
        role: 'customer'
      }).unwrap();

      if (result.success) {
        await Swal.fire({
          title: 'OTP Sent!',
          text: 'A new OTP has been sent to your email address.',
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
                <h3 className="fw-bold mb-1">Verify OTP</h3>
                <p className="mb-0 opacity-75">Enter the code sent to your email</p>
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

                {/* OTP Form */}
                <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                  <div className="row g-3">
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

                    {/* OTP */}
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
                        transition: 'all 0.3s ease',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
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
                          Verify OTP
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
                  <p className="mb-2 text-muted" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                    Already verified your account?
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
                    Back to Login
                  </Link>
                </div>

                {/* Help Text */}
                <div className="text-center mt-4 pt-3 border-top">
                  <small className="text-muted">
                    Didn't receive the OTP? Check your spam folder or{' '}
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
                { icon: 'bi-clock', text: 'OTP Expires in 10 min' },
                { icon: 'bi-envelope', text: 'Check Email' },
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

export default VerifyOtp;