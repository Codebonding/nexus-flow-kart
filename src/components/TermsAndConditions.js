// components/TermsAndConditions.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: 'Welcome to NexusFlowKart. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. If you do not agree, please do not use our website.'
    },
    {
      id: 'website-usage',
      title: 'Website Usage',
      points: [
        'Users must be at least 18 years old to use our services.',
        'You agree to use the website only for lawful purposes and not for any illegal or unauthorized activities.',
        'You are responsible for maintaining the confidentiality of your account and password.'
      ]
    },
    {
      id: 'products-services',
      title: 'Products and Services',
      points: [
        'All products are described to the best of our knowledge.',
        'Prices, availability, and offers are subject to change without prior notice.',
        'We reserve the right to cancel any order at our discretion.'
      ]
    },
    {
      id: 'orders-payments',
      title: 'Orders and Payments',
      points: [
        'Payments are accepted via authorized payment gateways only.',
        'By placing an order, you confirm that all details provided are accurate and truthful.',
        'Orders will be processed once payment is confirmed.'
      ]
    },
    {
      id: 'shipping-delivery',
      title: 'Shipping and Delivery',
      points: [
        'Delivery timelines are estimated and may vary.',
        'NexusFlowKart is not responsible for delays caused by courier services.',
        'Risk of loss for products transfers to the customer once delivered.'
      ]
    },
    {
      id: 'returns-refunds',
      title: 'Returns and Refunds',
      points: [
        'Returns and refunds are subject to our Return Policy.',
        'Defective or incorrect products must be reported within 7 days of delivery.'
      ]
    },
    {
      id: 'user-conduct',
      title: 'User Conduct',
      subheading: 'You agree not to:',
      points: [
        'Use the website to post false or misleading information.',
        'Engage in spam, phishing, or hacking.',
        'Violate any applicable law or regulation.'
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      points: [
        'All content on NexusFlowKart, including logos, images, text, and designs, is our property.',
        'You may not copy, reproduce, or distribute without written permission.'
      ]
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      points: [
        'NexusFlowKart is not liable for any indirect, incidental, or consequential damages.',
        'We do not guarantee that the website is error-free or uninterrupted.'
      ]
    },
    {
      id: 'changes',
      title: 'Changes to Terms',
      points: [
        'NexusFlowKart may update these terms at any time.',
        'Continued use indicates your acceptance of updated terms.'
      ]
    },
    {
      id: 'governing-law',
      title: 'Governing Law',
      points: [
        'These terms are governed by the laws of India.',
        'Any disputes will be subject to the exclusive jurisdiction of courts in India.'
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
                    background: 'linear-gradient(135deg, #26309F 0%, #1a237e 100%)',
                    boxShadow: '0 8px 25px rgba(38, 48, 159, 0.3)'
                  }}
                >
                  <i className="bi bi-file-text fs-4 text-white"></i>
                </div>
                <h1 className="fw-bold mb-3" style={{ color: '#26309F' }}>
                  Terms & Conditions
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
                    background: 'linear-gradient(135deg, #26309F 0%, #1a237e 100%)',
                    borderRadius: '0.75rem 0.75rem 0 0'
                  }}>
                    <h5 className="text-white mb-0 fw-semibold">
                      <i className="bi bi-list-ul me-2"></i>
                      Contents
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
                            background: activeSection === index ? '#68AF39' : 'transparent',
                            color: activeSection === index ? 'white' : '#64748b',
                            borderLeft: activeSection === index ? '4px solid #26309F' : '4px solid transparent',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <i className={`bi bi-${activeSection === index ? 'check-circle-fill' : 'circle'} me-3`}></i>
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
                              background: 'linear-gradient(135deg, #68AF39 0%, #4c8c2a 100%)',
                              color: 'white'
                            }}
                          >
                            <span className="fw-bold fs-5">{activeSection + 1}</span>
                          </div>
                          <h2 className="fw-bold mb-0" style={{ color: '#26309F' }}>
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

                        {sections[activeSection].subheading && (
                          <p className="fw-semibold text-dark mb-3">
                            {sections[activeSection].subheading}
                          </p>
                        )}

                        {sections[activeSection].points && (
                          <ul className="list-unstyled">
                            {sections[activeSection].points.map((point, index) => (
                              <li key={index} className="mb-3 d-flex align-items-start">
                                <i 
                                  className="bi bi-check-circle-fill me-3 mt-1 flex-shrink-0"
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
                            borderColor: '#26309F',
                            color: '#26309F'
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
                            background: 'linear-gradient(135deg, #68AF39 0%, #4c8c2a 100%)',
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
                        background: 'linear-gradient(135deg, #26309F 0%, #1a237e 100%)',
                        color: 'white'
                      }}
                    >
                      <i className="bi bi-headset fs-5"></i>
                    </div>
                    <h5 className="fw-bold mb-2" style={{ color: '#26309F' }}>Need Help?</h5>
                    <p className="text-muted mb-3">
                      Have questions about our terms? We're here to help.
                    </p>
                    <a 
                      href="mailto:support@nexusflowkart.com"
                      className="btn rounded-pill px-4 py-2"
                      style={{
                        background: 'linear-gradient(135deg, #68AF39 0%, #4c8c2a 100%)',
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      <i className="bi bi-envelope me-2"></i>
                      Contact Support
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

export default TermsAndConditions;