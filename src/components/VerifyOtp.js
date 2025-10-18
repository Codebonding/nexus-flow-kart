// components/VerifyOtp.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useVerifyOtpMutation, useResendOtpMutation } from '../store/api/authApi';
import Swal from 'sweetalert2';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    otp: ''
  });
  
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(true);
  const [otpExpired, setOtpExpired] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !otpExpired) {
      setOtpExpired(true);
      Swal.fire({
        title: 'Code Expired',
        text: 'Your verification code has expired. Please request a new one to continue.',
        icon: 'info',
        confirmButtonColor: '#6FBC2E',
        confirmButtonText: 'Request New Code'
      });
    }
    return () => clearTimeout(timer);
  }, [countdown, otpExpired]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-format OTP (numbers only, max 6 digits)
    if (name === 'otp') {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({
        ...prev,
        [name]: numbersOnly
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!formData.otp.trim()) {
      setError('Please enter the verification code');
      return false;
    }
    
    if (formData.otp.length !== 6) {
      setError('Verification code must be 6 digits');
      return false;
    }
    
    if (otpExpired) {
      setError('This code has expired. Please request a new one.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await verifyOtp({
        email: formData.email,
        otp: formData.otp
      }).unwrap();

      if (result.success) {
        await Swal.fire({
          title: 'Verification Complete!',
          text: 'Your account has been successfully verified. You can now sign in to your account.',
          icon: 'success',
          confirmButtonColor: '#6FBC2E',
          confirmButtonText: 'Continue to Sign In'
        });

        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      let userMessage = 'We were unable to verify your code. Please check the code and try again.';
      
      if (error.data) {
        // Transform backend errors into user-friendly messages
        const backendMessage = error.data.message || '';
        
        if (backendMessage.includes('Invalid OTP')) {
          userMessage = 'The code you entered is incorrect. Please check and try again.';
        } else if (backendMessage.includes('OTP expired')) {
          userMessage = 'This verification code has expired. Please request a new one.';
          setOtpExpired(true);
        } else if (backendMessage.includes('User not found')) {
          userMessage = 'We couldn\'t find an account with this email. Please check your email address.';
        } else if (backendMessage.includes('User already verified')) {
          userMessage = 'Your account is already verified. Please proceed to sign in.';
          setTimeout(() => navigate('/login'), 2000);
        } else {
          userMessage = backendMessage;
        }
      }
      
      setError(userMessage);
    }
  };

  const handleResendOtp = async () => {
    if (isResending) return;

    try {
      const result = await resendOtp({ email: formData.email }).unwrap();

      if (result.success) {
        // Reset countdown and expired status
        setCountdown(300);
        setOtpExpired(false);
        setCanResend(true);
        
        await Swal.fire({
          title: 'New Code Sent',
          text: 'A new verification code has been sent to your email and phone.',
          icon: 'success',
          confirmButtonColor: '#6FBC2E',
          timer: 3000,
          timerProgressBar: true,
        });

        setError('');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      let userMessage = 'We\'re unable to send a new code at the moment. Please try again shortly.';
      
      if (error.data) {
        const backendMessage = error.data.message || '';
        
        if (backendMessage.includes('Please wait')) {
          // Extract time from message or use generic
          const timeMatch = backendMessage.match(/(\d+)\s+minute/);
          const time = timeMatch ? timeMatch[1] : 'a few';
          userMessage = `Please wait ${time} minutes before requesting another code. This helps us maintain security.`;
        } else if (backendMessage.includes('User already verified')) {
          userMessage = 'Your account is already verified. Please proceed to sign in.';
          setTimeout(() => navigate('/login'), 2000);
        } else if (backendMessage.includes('User not found')) {
          userMessage = 'We couldn\'t find an account with this email. Please check your email address.';
        } else {
          userMessage = backendMessage;
        }
      }
      
      await Swal.fire({
        title: 'Unable to Send Code',
        text: userMessage,
        icon: 'info',
        confirmButtonColor: '#6FBC2E',
        confirmButtonText: 'Understood'
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
                <h3 className="fw-bold mb-1">Verify Your Account</h3>
                <p className="mb-0 opacity-75">Enter the verification code sent to your email</p>
              </div>

              <div className="card-body p-4 p-md-5">
                {/* Error Message */}
                {error && (
                  <div className="alert alert-warning d-flex align-items-center rounded-2 border-0 shadow-sm" 
                       style={{ backgroundColor: '#FFFBF0', border: '1px solid #FFEaa7' }}
                       role="alert">
                    <i className="bi bi-info-circle-fill text-warning me-2"></i>
                    <small className="fw-medium">{error}</small>
                  </div>
                )}

                {/* OTP Expired Notice */}
                {otpExpired && !error && (
                  <div className="alert alert-info d-flex align-items-center rounded-2 border-0 shadow-sm" 
                       style={{ backgroundColor: '#E8F4FD', border: '1px solid #B6D7F9' }}
                       role="alert">
                    <i className="bi bi-clock-fill text-info me-2"></i>
                    <small className="fw-medium">Your verification code has expired. Please request a new one.</small>
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
                        Verification Code
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-shield-check text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0 ps-0 text-center"
                          id="otp"
                          name="otp"
                          value={formData.otp}
                          onChange={handleInputChange}
                          placeholder="Enter 6-digit code"
                          maxLength="6"
                          required
                          style={{ 
                            letterSpacing: '0.5em', 
                            fontWeight: '600',
                            fontSize: '1.1rem'
                          }}
                        />
                      </div>
                      <div className="form-text text-end">
                        <small>Check your email for the 6-digit code</small>
                      </div>
                    </div>
                  </div>

                  {/* Timer and Resend Section */}
                  <div className="text-center mt-4">
                    <div className="mb-3">
                      <div className="d-flex justify-content-center align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center me-2"
                          style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: otpExpired ? '#6c757d' : '#6FBC2E',
                            color: 'white'
                          }}
                        >
                          <i className="bi bi-clock"></i>
                        </div>
                        <div>
                          <small className={otpExpired ? "text-muted" : "text-success fw-medium"}>
                            {otpExpired ? 'Code Expired' : `Time remaining: ${formatTime(countdown)}`}
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Resend button */}
                    <button
                      type="button"
                      className="btn btn-outline-primary rounded-2 px-4"
                      onClick={handleResendOtp}
                      disabled={isResending}
                      style={{ 
                        borderColor: '#6FBC2E',
                        color: '#6FBC2E',
                        fontSize: '0.9rem'
                      }}
                    >
                      {isResending ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Sending New Code...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-arrow-clockwise me-2"></i>
                          Send New Code
                        </>
                      )}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4">
                    <button 
                      type="submit" 
                      className="btn w-100 py-3 fw-bold rounded-2 border-0"
                      disabled={isVerifying || otpExpired}
                      style={{
                        background: otpExpired 
                          ? 'linear-gradient(135deg, #6c757d 0%, #868e96 100%)' 
                          : 'linear-gradient(135deg, #1A237E 0%, #283593 100%)',
                        color: 'white',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        cursor: otpExpired ? 'not-allowed' : 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (!isVerifying && !otpExpired) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 25px rgba(26, 35, 126, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isVerifying && !otpExpired) {
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
                      ) : otpExpired ? (
                        <>
                          <i className="bi bi-clock me-2"></i>
                          Code Expired
                        </>
                                              ) : (
                        <>
                          <i className="bi bi-shield-check me-2"></i>
                          Verify Account
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
                    Sign In to Your Account
                  </Link>
                </div>

                {/* Help Text */}
                <div className="text-center mt-4 pt-3 border-top">
                  <small className="text-muted">
                    Having trouble? Check your spam folder or contact our support team for assistance.
                  </small>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="row mt-4 g-3 text-center">
              {[
                { icon: 'bi-shield-check', text: 'Secure Verification' },
                { icon: 'bi-clock', text: 'Code Expires in 5 min' },
                { icon: 'bi-envelope', text: 'Delivered to Email' },
                { icon: 'bi-phone', text: 'Sent to Mobile' }
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