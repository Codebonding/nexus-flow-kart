// components/ResetPassword.js
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useResetPasswordMutation, useVerifyLoginOtpMutation } from '../store/api/authApi';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyLoginOtpMutation();
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    phone: location.state?.phone || '',
    otp: location.state?.otp || '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const loginType = location.state?.loginType || 'email';
  const identifier = loginType === 'email' ? location.state?.email : location.state?.phone;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateOtp = () => {
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

  const validatePassword = () => {
    if (!formData.newPassword) {
      setError('New password is required');
      return false;
    }
    
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const getOtpPayload = () => {
    const payload = { otp: formData.otp };
    if (loginType === 'email') {
      payload.email = formData.email;
    } else {
      payload.phone = formData.phone;
    }
    return payload;
  };

  const getResetPayload = () => {
    const payload = {
      otp: formData.otp,
      newPassword: formData.newPassword
    };
    
    if (loginType === 'email') {
      payload.email = formData.email;
    } else {
      payload.phone = formData.phone;
    }
    
    return payload;
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!validateOtp()) return;

    try {
      const payload = getOtpPayload();
      const result = await verifyOtp(payload).unwrap();

      if (result.success) {
        setIsOtpVerified(true);
        setError('');
        await Swal.fire({
          title: 'OTP Verified!',
          text: 'Please set your new password.',
          icon: 'success',
          confirmButtonColor: '#6FBC2E',
          timer: 3000
        });
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error.data) {
        setError(error.data.message || 'Invalid OTP');
      } else {
        setError('OTP verification failed. Please try again.');
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    try {
      const payload = getResetPayload();
      const result = await resetPassword(payload).unwrap();

      if (result.success) {
        await Swal.fire({
          title: 'Success!',
          text: 'Password reset successful. You can now login with your new password.',
          icon: 'success',
          confirmButtonColor: '#6FBC2E',
          confirmButtonText: 'Login Now'
        });

        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.data) {
        setError(error.data.message || 'Password reset failed');
      } else {
        setError('Password reset failed. Please try again.');
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

            {/* Reset Password Card */}
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
                    <i className="bi bi-key fs-5"></i>
                  </div>
                </div>
                <h3 className="fw-bold mb-1">Reset Password</h3>
                <p className="mb-0 opacity-75">
                  {isOtpVerified ? 'Set your new password' : 'Verify OTP first'}
                </p>
              </div>

              <div className="card-body p-4 p-md-5">
                {/* Identifier Display */}
                <div className="alert alert-info d-flex align-items-center rounded-2 border-0 shadow-sm mb-4" 
                     style={{ backgroundColor: '#F0F7FF' }}
                     role="alert">
                  <i className={`bi ${loginType === 'email' ? 'bi-envelope' : 'bi-phone'} text-primary me-2`}></i>
                  <small className="fw-medium">
                    Resetting password for: <strong>{identifier}</strong>
                  </small>
                </div>

                {/* OTP Verification Status */}
                {isOtpVerified && (
                  <div className="alert alert-success d-flex align-items-center rounded-2 border-0 shadow-sm mb-4" 
                       style={{ backgroundColor: '#F0FFF4' }}
                       role="alert">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    <small className="fw-medium">OTP verified successfully!</small>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center rounded-2 border-0 shadow-sm" 
                       style={{ backgroundColor: '#FFF5F5' }}
                       role="alert">
                    <i className="bi bi-exclamation-circle-fill text-danger me-2"></i>
                    <small className="fw-medium">{error}</small>
                  </div>
                )}

                {/* Reset Password Form */}
                <form onSubmit={isOtpVerified ? handleResetPassword : handleVerifyOtp} className="needs-validation" noValidate>
                  <div className="row g-3">
                    {/* Email or Phone Input */}
                    <div className="col-12">
                      <label htmlFor={loginType} className="form-label fw-semibold small text-uppercase text-muted">
                        {loginType === 'email' ? 'Email Address' : 'Phone Number'}
                      </label>
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-end-0">
                          <i className={`bi ${loginType === 'email' ? 'bi-envelope' : 'bi-phone'} text-muted`}></i>
                        </span>
                        <input
                          type={loginType === 'email' ? 'email' : 'tel'}
                          className="form-control border-start-0 ps-0"
                          id={loginType}
                          name={loginType}
                          value={formData[loginType]}
                          onChange={handleInputChange}
                          placeholder={loginType === 'email' ? 'your@email.com' : '9876543210'}
                          required
                          readOnly
                        />
                      </div>
                    </div>

                    {/* OTP Input */}
                    {!isOtpVerified && (
                      <div className="col-12">
                        <label htmlFor="otp" className="form-label fw-semibold small text-uppercase text-muted">
                          OTP Code
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
                            placeholder="Enter 6-digit OTP"
                            maxLength="6"
                            required
                            style={{ letterSpacing: '0.5em', fontWeight: '600' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Password Fields (only show after OTP verification) */}
                    {isOtpVerified && (
                      <>
                        {/* New Password */}
                        <div className="col-12">
                          <label htmlFor="newPassword" className="form-label fw-semibold small text-uppercase text-muted">
                            New Password
                          </label>
                          <div className="input-group input-group-lg">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-lock text-muted"></i>
                            </span>
                            <input
                              type={showPassword ? "text" : "password"}
                              className="form-control border-start-0 ps-0"
                              id="newPassword"
                              name="newPassword"
                              placeholder="Enter new password"
                              value={formData.newPassword}
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
                              placeholder="Confirm new password"
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
                      </>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4">
                    <button 
                      type="submit" 
                      className="btn w-100 py-3 fw-bold rounded-2 border-0"
                      disabled={isVerifying || isResetting}
                      style={{
                        background: 'linear-gradient(135deg, #1A237E 0%, #283593 100%)',
                        color: 'white',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}
                      onMouseEnter={(e) => {
                        if (!isVerifying && !isResetting) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 25px rgba(26, 35, 126, 0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isVerifying && !isResetting) {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {isVerifying ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Verifying OTP...
                        </>
                      ) : isResetting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Resetting...
                        </>
                      ) : (
                        <>
                          <i className={`bi ${isOtpVerified ? 'bi-key' : 'bi-shield-check'} me-2`}></i>
                          {isOtpVerified ? 'Reset Password' : 'Verify OTP'}
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Back Button for OTP Verification */}
                {!isOtpVerified && (
                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none"
                      onClick={() => navigate('/login')}
                      style={{ 
                        color: '#6FBC2E',
                        fontSize: '0.9rem'
                      }}
                    >
                      <i className="bi bi-arrow-left me-1"></i>
                      Back to Login
                    </button>
                  </div>
                )}

                {/* Divider */}
                {isOtpVerified && (
                  <div className="text-center my-4">
                    <div className="d-flex align-items-center">
                      <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }}></div>
                      <div className="px-3 text-muted small">OR</div>
                      <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }}></div>
                    </div>
                  </div>
                )}

                {/* Back to Login (after OTP verification) */}
                {isOtpVerified && (
                  <div className="text-center">
                    <p className="mb-2 text-muted" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                      Remember your password?
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
                )}

                {/* Help Text */}
                <div className="text-center mt-4 pt-3 border-top">
                  <small className="text-muted">
                    {isOtpVerified 
                      ? 'Make sure your new password is strong and unique.'
                      : 'Enter the OTP sent to your email/phone to verify your identity.'
                    }
                  </small>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="row mt-4 g-3 text-center">
              {[
                { icon: 'bi-shield-check', text: 'Secure Reset' },
                { icon: 'bi-clock', text: 'Quick Process' },
                { icon: loginType === 'email' ? 'bi-envelope' : 'bi-phone', text: loginType === 'email' ? 'Email Verified' : 'Phone Verified' },
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

export default ResetPassword;