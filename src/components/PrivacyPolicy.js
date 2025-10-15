// components/PrivacyPolicy.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: 'Your privacy is important to us. This Privacy Policy explains how NexusFlowKart collects, uses, and protects your information when you use our website.'
    },
    {
      id: 'information-collected',
      title: 'Information We Collect',
      personalInfo: ['Name', 'Email', 'Phone number', 'Address', 'Payment details'],
      nonPersonalInfo: ['Browser type', 'IP address', 'Device information', 'Website usage']
    },
    {
      id: 'information-usage',
      title: 'How We Use Your Information',
      points: [
        'To process orders and payments.',
        'To communicate updates, offers, and notifications.',
        'To improve website functionality and user experience.',
        'For legal compliance and fraud prevention.'
      ]
    },
    {
      id: 'information-sharing',
      title: 'Sharing of Information',
      points: [
        'We do not sell your personal information to third parties.',
        'We may share information with trusted service providers to process your order.',
        'We may disclose information if required by law or to protect our legal rights.'
      ]
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies and Tracking',
      points: [
        'We use cookies and similar technologies to enhance user experience.',
        'Cookies help with site navigation, analytics, and personalized offers.',
        'You can disable cookies in your browser settings, but some features may not work.'
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      points: [
        'We use industry-standard security measures to protect your information.',
        'No data transmission over the internet is 100% secure.'
      ]
    },
    {
      id: 'user-rights',
      title: 'User Rights',
      points: [
        'You can request access to, correction, or deletion of your personal information.',
        'Contact us at support@nexusflowkart.com for any privacy concerns.'
      ]
    },
    {
      id: 'third-party-links',
      title: 'Third-Party Links',
      points: [
        'Our website may contain links to other websites.',
        'We are not responsible for the privacy practices of third-party sites.'
      ]
    },
    {
      id: 'policy-updates',
      title: 'Policy Updates',
      points: [
        'NexusFlowKart may update this policy periodically.',
        'Continued use of the website indicates acceptance of changes.'
      ]
    }
  ];

  return (
    <div className="min-vh-100 bg-gradient" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%)' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-xxl-10">
            {/* Header Section */}
            <div className="text-center mb-5">
              <Link 
                to="/" 
                className="btn btn-light rounded-pill px-4 py-2 shadow-sm mb-4 d-inline-flex align-items-center"
                style={{ 
                  border: '1px solid #e2e8f0',
                  color: '#26309F',
                  fontWeight: '600'
                }}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Home
              </Link>
              
              <div className="mb-4">
                <div 
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: '70px',
                    height: '70px',
                    background: 'linear-gradient(135deg, #68AF39 0%, #4c8c2a 100%)',
                    boxShadow: '0 8px 25px rgba(104, 175, 57, 0.3)'
                  }}
                >
                  <i className="bi bi-shield-lock fs-4 text-white"></i>
                </div>
                <h1 className="fw-bold mb-3" style={{ color: '#26309F' }}>
                  Privacy Policy
                </h1>
                <p className="lead text-muted mb-0">
                  Last updated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="row g-4">
              {/* Sidebar Navigation */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-lg rounded-3 sticky-top" style={{ top: '100px' }}>
                  <div className="card-header border-0 py-4" style={{ 
                    background: 'linear-gradient(135deg, #68AF39 0%, #4c8c2a 100%)',
                    borderRadius: '0.75rem 0.75rem 0 0'
                  }}>
                    <h5 className="text-white mb-0 fw-semibold">
                      <i className="bi bi-shield-check me-2"></i>
                      Policy Sections
                    </h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                      {sections.map((section, index) => (
                        <button
                          key={section.id}
                          className={`list-group-item list-group-item-action border-0 py-3 px-4 d-flex align-items-center ${
                            activeSection === index ? 'active' : ''
                          }`}
                          onClick={() => setActiveSection(index)}
                          style={{
                            background: activeSection === index ? '#26309F' : 'transparent',
                            color: activeSection === index ? 'white' : '#64748b',
                            borderLeft: activeSection === index ? '4px solid #68AF39' : '4px solid transparent',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <i className={`bi bi-${activeSection === index ? 'shield-check' : 'shield'} me-3`}></i>
                          <span className="fw-medium">{section.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-lg-8">
                <div className="card border-0 shadow-lg rounded-3">
                  <div className="card-body p-4 p-md-5">
                    <div className="content-section">
                      <div className="section-header mb-4">
                        <div className="d-flex align-items-center mb-3">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{
                              width: '50px',
                              height: '50px',
                              background: 'linear-gradient(135deg, #26309F 0%, #1a237e 100%)',
                              color: 'white'
                            }}
                          >
                            <span className="fw-bold fs-5">{activeSection + 1}</span>
                          </div>
                          <h2 className="fw-bold mb-0" style={{ color: '#68AF39' }}>
                            {sections[activeSection].title}
                          </h2>
                        </div>
                      </div>

                      <div className="section-content">
                        {sections[activeSection].content && (
                          <p className="text-muted fs-6 lh-lg mb-4">
                            {sections[activeSection].content}
                          </p>
                        )}

                        {sections[activeSection].personalInfo && (
                          <div className="row g-4 mb-4">
                            <div className="col-md-6">
                              <div className="card border-0 rounded-3 h-100" style={{ background: '#f8f9ff' }}>
                                <div className="card-body p-4">
                                  <h6 className="fw-semibold mb-3 d-flex align-items-center" style={{ color: '#26309F' }}>
                                    <i className="bi bi-person-circle me-2"></i>
                                    Personal Information
                                  </h6>
                                  <ul className="list-unstyled mb-0">
                                    {sections[activeSection].personalInfo.map((info, index) => (
                                      <li key={index} className="mb-2 d-flex align-items-center">
                                        <i className="bi bi-dot me-2" style={{ color: '#68AF39' }}></i>
                                        <small className="text-muted">{info}</small>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="card border-0 rounded-3 h-100" style={{ background: '#f8f9ff' }}>
                                <div className="card-body p-4">
                                  <h6 className="fw-semibold mb-3 d-flex align-items-center" style={{ color: '#26309F' }}>
                                    <i className="bi bi-laptop me-2"></i>
                                    Non-Personal Information
                                  </h6>
                                  <ul className="list-unstyled mb-0">
                                    {sections[activeSection].nonPersonalInfo.map((info, index) => (
                                      <li key={index} className="mb-2 d-flex align-items-center">
                                        <i className="bi bi-dot me-2" style={{ color: '#68AF39' }}></i>
                                        <small className="text-muted">{info}</small>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {sections[activeSection].points && (
                          <ul className="list-unstyled">
                            {sections[activeSection].points.map((point, index) => (
                              <li key={index} className="mb-3 d-flex align-items-start">
                                <i 
                                  className="bi bi-shield-check me-3 mt-1 flex-shrink-0"
                                  style={{ color: '#68AF39', fontSize: '1.1em' }}
                                ></i>
                                <span className="text-muted lh-lg">{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Navigation Buttons */}
                      <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                        <button
                          className="btn btn-outline-primary rounded-pill px-4 py-2 d-flex align-items-center"
                          onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                          disabled={activeSection === 0}
                          style={{
                            borderColor: '#68AF39',
                            color: '#68AF39'
                          }}
                        >
                          <i className="bi bi-chevron-left me-2"></i>
                          Previous
                        </button>
                        
                        <button
                          className="btn rounded-pill px-4 py-2 d-flex align-items-center"
                          onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
                          disabled={activeSection === sections.length - 1}
                          style={{
                            background: 'linear-gradient(135deg, #26309F 0%, #1a237e 100%)',
                            color: 'white',
                            border: 'none'
                          }}
                        >
                          Next
                          <i className="bi bi-chevron-right ms-2"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="card border-0 shadow-lg rounded-3 mt-4">
                  <div className="card-body p-4 text-center">
                    <div 
                      className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #68AF39 0%, #4c8c2a 100%)',
                        color: 'white'
                      }}
                    >
                      <i className="bi bi-lock fs-5"></i>
                    </div>
                    <h5 className="fw-bold mb-2" style={{ color: '#26309F' }}>Privacy Concerns?</h5>
                    <p className="text-muted mb-3">
                      We take your privacy seriously. Contact us with any questions.
                    </p>
                    <a 
                      href="mailto:privacy@nexusflowkart.com"
                      className="btn rounded-pill px-4 py-2 me-3"
                      style={{
                        background: 'linear-gradient(135deg, #26309F 0%, #1a237e 100%)',
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      <i className="bi bi-envelope me-2"></i>
                      Email Privacy Team
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;