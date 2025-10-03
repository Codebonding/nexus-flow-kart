import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  selectCartItems, 
  selectTotalAmount, 
  selectTotalItems,
  removeFromCart,
  updateQuantity,
  clearCart
} from '../store/slices/cartSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectTotalAmount);
  const totalItems = useSelector(selectTotalItems);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Please Login</h2>
          <p className="text-muted">You need to be logged in to view your cart.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="display-1 text-muted mb-4">🛒</div>
          <h2>Your cart is empty</h2>
          <p className="text-muted mb-4">Start shopping to add items to your cart</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Shopping Cart ({totalItems} items)</h1>
        </div>
      </div>

      <div className="row">
        {/* Cart Items */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Cart Items</h5>
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={() => dispatch(clearCart())}
              >
                Clear Cart
              </button>
            </div>
            <div className="card-body">
              {cartItems.map((item) => (
                <div key={item.id} className="row align-items-center mb-3 pb-3 border-bottom">
                  <div className="col-md-2">
                    <img 
                      src={item.images?.[0] || '/placeholder-image.jpg'} 
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-4">
                    <h6 className="mb-1">{item.name}</h6>
                    <p className="text-muted small mb-0">{item.description}</p>
                  </div>
                  <div className="col-md-2">
                    <span className="h6">₹{item.offerPrice || item.originalPrice}</span>
                  </div>
                  <div className="col-md-2">
                    <select 
                      className="form-select form-select-sm"
                      value={item.quantity}
                      onChange={(e) => dispatch(updateQuantity({
                        productId: item.id,
                        quantity: parseInt(e.target.value)
                      }))}
                    >
                      {[...Array(Math.min(item.stock, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <span className="h6">
                      ₹{(item.offerPrice || item.originalPrice) * item.quantity}
                    </span>
                    <button 
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({totalItems} items):</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span className="text-success">FREE</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>₹{(totalAmount * 0.18).toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>₹{(totalAmount * 1.18).toFixed(2)}</strong>
              </div>
              
              <div className="d-grid gap-2">
                <button className="btn btn-primary btn-lg">
                  Proceed to Checkout
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;