// components/Checkout.js - REAL-WORLD MODERN E-COMMERCE DESIGN
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  selectCartItems, 
  selectTotalAmount, 
  selectTotalItems 
} from '../store/slices/cartSlice';
import { usePlaceOrderMutation } from '../store/api/orderApi';

const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectTotalAmount);
  const totalItems = useSelector(selectTotalItems);
  
  const [placeOrder, { isLoading, error }] = usePlaceOrderMutation();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    saveCard: false
  });

  const [activeSection, setActiveSection] = useState('shipping');
  const shippingCost = totalAmount > 50 ? 0 : 9.99;
  const tax = totalAmount * 0.0825;
  const finalTotal = totalAmount + shippingCost + tax;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const orderData = {
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod,
        items: cartItems,
        totalAmount: finalTotal
      };
      
      const result = await placeOrder(orderData).unwrap();
      
      if (result.success) {
        navigate('/order-confirmation', { 
          state: { 
            orderId: result.orderId,
            total: finalTotal
          }
        });
      }
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\//g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty-state">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <i className="bi bi-bag-x"></i>
            </div>
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart to continue shopping</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Header */}
      <div className="checkout-header">
        <div className="container">
          <div className="checkout-brand">
            <button 
              className="back-button"
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <h2>Checkout</h2>
          </div>
          <div className="checkout-steps">
            <div className={`step ${activeSection === 'shipping' ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span>Shipping</span>
            </div>
            <div className="step-divider"></div>
            <div className={`step ${activeSection === 'payment' ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span>Payment</span>
            </div>
            <div className="step-divider"></div>
            <div className={`step ${activeSection === 'review' ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>Review</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="checkout-layout">
          {/* Main Checkout Form */}
          <div className="checkout-main">
            {/* Shipping Section */}
            <div className={`checkout-section ${activeSection === 'shipping' ? 'active' : ''}`}>
              <div className="section-header">
                <h3>Shipping Information</h3>
              </div>
              
              <div className="shipping-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Apartment, Suite, etc. (Optional)</label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="Apt 4B"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select State</option>
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>

                <button 
                  className="btn btn-primary btn-continue"
                  onClick={() => setActiveSection('payment')}
                >
                  Continue to Payment
                </button>
              </div>
            </div>

            {/* Payment Section */}
            <div className={`checkout-section ${activeSection === 'payment' ? 'active' : ''}`}>
              <div className="section-header">
                <h3>Payment Method</h3>
                <button 
                  className="btn-back"
                  onClick={() => setActiveSection('shipping')}
                >
                  <i className="bi bi-chevron-left"></i> Back to Shipping
                </button>
              </div>

              <div className="payment-methods">
                <div className="payment-tabs">
                  <button className={`payment-tab ${formData.paymentMethod === 'card' ? 'active' : ''}`}>
                    Credit Card
                  </button>
                  <button className={`payment-tab ${formData.paymentMethod === 'paypal' ? 'active' : ''}`}>
                    PayPal
                  </button>
                  <button className={`payment-tab ${formData.paymentMethod === 'applepay' ? 'active' : ''}`}>
                    Apple Pay
                  </button>
                </div>

                <div className="card-form">
                  <div className="form-group">
                    <label>Card Number *</label>
                    <div className="card-input">
                      <input
                        type="text"
                        name="cardNumber"
                        value={formatCardNumber(formData.cardNumber)}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                      />
                      <div className="card-icons">
                        <i className="bi bi-credit-card"></i>
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formatExpiryDate(formData.expiryDate)}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV *</label>
                      <div className="cvv-input">
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength="4"
                          required
                        />
                        <i className="bi bi-question-circle" title="3-digit security code"></i>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Name on Card *</label>
                    <input
                      type="text"
                      name="nameOnCard"
                      value={formData.nameOnCard}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="saveCard"
                      checked={formData.saveCard}
                      onChange={handleInputChange}
                      id="saveCard"
                    />
                    <label htmlFor="saveCard">Save card for future purchases</label>
                  </div>
                </div>

                <button 
                  className="btn btn-primary btn-continue"
                  onClick={() => setActiveSection('review')}
                >
                  Review Order
                </button>
              </div>
            </div>

            {/* Review Section */}
            <div className={`checkout-section ${activeSection === 'review' ? 'active' : ''}`}>
              <div className="section-header">
                <h3>Review Your Order</h3>
                <button 
                  className="btn-back"
                  onClick={() => setActiveSection('payment')}
                >
                  <i className="bi bi-chevron-left"></i> Back to Payment
                </button>
              </div>

              <div className="review-section">
                <div className="review-block">
                  <h4>Shipping Address</h4>
                  <p>{formData.firstName} {formData.lastName}<br />
                  {formData.address}<br />
                  {formData.city}, {formData.state} {formData.zipCode}<br />
                  {formData.phone}<br />
                  {formData.email}</p>
                  <button className="btn-edit" onClick={() => setActiveSection('shipping')}>
                    Edit
                  </button>
                </div>

                <div className="review-block">
                  <h4>Payment Method</h4>
                  <p>•••• •••• •••• {formData.cardNumber.slice(-4)}<br />
                  {formData.nameOnCard}</p>
                  <button className="btn-edit" onClick={() => setActiveSection('payment')}>
                    Edit
                  </button>
                </div>

                <div className="review-items">
                  <h4>Order Items ({totalItems})</h4>
                  {cartItems.map((item) => (
                    <div key={item.id} className="review-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <h5>{item.name}</h5>
                        <p>Qty: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="error-message">
                    <i className="bi bi-exclamation-triangle"></i>
                    Failed to process order. Please try again.
                  </div>
                )}

                <button 
                  className="btn btn-primary btn-place-order"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner"></div>
                      Processing Your Order...
                    </>
                  ) : (
                    `Place Order • $${finalTotal.toFixed(2)}`
                  )}
                </button>

                <div className="security-notice">
                  <i className="bi bi-shield-check"></i>
                  <span>Your payment is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Order Summary</h3>
              
              <div className="order-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                      <span className="item-quantity">{item.quantity}</span>
                    </div>
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'free' : ''}>
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="total-row">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="total-row final">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {totalAmount < 50 && (
                <div className="shipping-promo">
                  <i className="bi bi-truck"></i>
                  <span>Add ${(50 - totalAmount).toFixed(2)} more for FREE shipping!</span>
                </div>
              )}
            </div>

            <div className="support-info">
              <div className="support-item">
                <i className="bi bi-shield-check"></i>
                <div>
                  <strong>Secure Checkout</strong>
                  <span>256-bit SSL encryption</span>
                </div>
              </div>
              <div className="support-item">
                <i className="bi bi-arrow-left-right"></i>
                <div>
                  <strong>Easy Returns</strong>
                  <span>30-day return policy</span>
                </div>
              </div>
              <div className="support-item">
                <i className="bi bi-headset"></i>
                <div>
                  <strong>24/7 Support</strong>
                  <span>We're here to help</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-page {
          min-height: 100vh;
          background: #f8f9fa;
        }

        .checkout-header {
          background: white;
          border-bottom: 1px solid #e9ecef;
          padding: 1.5rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .checkout-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .back-button {
          background: none;
          border: none;
          font-size: 1.25rem;
          color: #6c757d;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: #f8f9fa;
          color: #495057;
        }

        .checkout-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6c757d;
          font-weight: 500;
        }

        .step.active {
          color: #007bff;
        }

        .step-number {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: #6c757d;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .step.active .step-number {
          background: #007bff;
        }

        .step-divider {
          width: 4rem;
          height: 2px;
          background: #dee2e6;
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
          padding: 2rem 0;
        }

        .checkout-main {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .checkout-sidebar {
          position: sticky;
          top: 120px;
          height: fit-content;
        }

        .checkout-section {
          display: none;
        }

        .checkout-section.active {
          display: block;
        }

        .section-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e9ecef;
        }

        .section-header h3 {
          margin: 0;
          color: #212529;
          font-weight: 600;
        }

        .btn-back {
          background: none;
          border: none;
          color: #6c757d;
          cursor: pointer;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #495057;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
        }

        .card-input,
        .cvv-input {
          position: relative;
        }

        .card-input input {
          padding-right: 3rem;
        }

        .card-icons,
        .cvv-input i {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
        }

        .payment-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .payment-tab {
          flex: 1;
          padding: 1rem;
          border: 2px solid #e9ecef;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .payment-tab.active {
          border-color: #007bff;
          background: #f8f9ff;
          color: #007bff;
        }

        .btn-continue,
        .btn-place-order {
          width: 100%;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 2rem;
        }

        .review-block {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          position: relative;
        }

        .review-block h4 {
          margin: 0 0 1rem 0;
          color: #495057;
          font-weight: 600;
        }

        .review-block p {
          margin: 0;
          color: #6c757d;
          line-height: 1.6;
        }

        .btn-edit {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: none;
          border: none;
          color: #007bff;
          cursor: pointer;
          font-weight: 500;
        }

        .review-item {
          display: flex;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #e9ecef;
        }

        .review-item img {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
        }

        .item-details {
          flex: 1;
        }

        .item-details h5 {
          margin: 0 0 0.5rem 0;
          color: #495057;
        }

        .item-price {
          font-weight: 600;
          color: #212529;
        }

        .order-summary {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 1rem;
        }

        .order-summary h3 {
          margin: 0 0 1.5rem 0;
          color: #212529;
          font-weight: 600;
        }

        .order-item {
          display: flex;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #f1f3f5;
        }

        .item-image {
          position: relative;
        }

        .item-image img {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
        }

        .item-quantity {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #007bff;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-info {
          flex: 1;
        }

        .item-info h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          color: #495057;
          font-weight: 500;
        }

        .item-info p {
          margin: 0;
          color: #6c757d;
          font-size: 0.875rem;
        }

        .order-totals {
          margin-top: 1.5rem;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          color: #6c757d;
        }

        .total-row.final {
          border-top: 2px solid #e9ecef;
          margin-top: 0.5rem;
          padding-top: 1rem;
          font-weight: 600;
          font-size: 1.1rem;
          color: #212529;
        }

        .total-row .free {
          color: #28a745;
          font-weight: 600;
        }

        .shipping-promo {
          background: #e7f3ff;
          border: 1px solid #b3d7ff;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #0066cc;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .support-info {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .support-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #f1f3f5;
        }

        .support-item:last-child {
          border-bottom: none;
        }

        .support-item i {
          font-size: 1.25rem;
          color: #007bff;
        }

        .support-item div {
          flex: 1;
        }

        .support-item strong {
          display: block;
          color: #495057;
          font-size: 0.9rem;
        }

        .support-item span {
          color: #6c757d;
          font-size: 0.8rem;
        }

        .security-notice {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          color: #28a745;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .error-message {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          padding: 1rem;
          border-radius: 8px;
          margin: 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .checkout-empty-state {
          padding: 4rem 0;
          text-align: center;
        }

        .empty-cart-icon {
          font-size: 4rem;
          color: #6c757d;
          margin-bottom: 2rem;
        }

        .empty-cart h2 {
          color: #495057;
          margin-bottom: 1rem;
        }

        .empty-cart p {
          color: #6c757d;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }
          
          .checkout-sidebar {
            order: -1;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;