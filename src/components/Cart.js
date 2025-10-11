// components/Cart.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  selectCartItems, 
  selectTotalAmount, 
  selectTotalItems,
  selectCartLoading,
  selectCartError,
  setCart,
  updateQuantity,
  removeFromCart,
  clearCart
} from '../store/slices/cartSlice';
import { 
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation 
} from '../store/api/cartApi';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Local state for guest cart
  const [localCart] = useState(() => {
    if (!isAuthenticated) {
      const savedCart = localStorage.getItem('guestCart');
      return savedCart ? JSON.parse(savedCart) : { items: [], totalAmount: 0, totalItems: 0 };
    }
    return null;
  });

  // API calls for authenticated users
  const { data: cartData, isLoading, error } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCartApi] = useRemoveFromCartMutation();
  const [clearCartApi] = useClearCartMutation();

  // Redux state
  const cartItems = useSelector(selectCartItems);
  const totalAmount = useSelector(selectTotalAmount);
  const totalItems = useSelector(selectTotalItems);
  const cartLoading = useSelector(selectCartLoading);

  // Sync cart data
  useEffect(() => {
    if (isAuthenticated && cartData) {
      dispatch(setCart(cartData));
    } else if (!isAuthenticated && localCart) {
      dispatch(setCart(localCart));
    }
  }, [cartData, localCart, isAuthenticated, dispatch]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('guestCart', JSON.stringify({
        items: cartItems,
        totalAmount,
        totalItems
      }));
    }
  }, [cartItems, totalAmount, totalItems, isAuthenticated]);

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity === 0) {
      await handleRemoveItem(id);
      return;
    }

    try {
      if (isAuthenticated) {
        await updateCartItem({ id, quantity: newQuantity }).unwrap();
      } else {
        dispatch(updateQuantity({ id, quantity: newQuantity }));
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      if (isAuthenticated) {
        await removeFromCartApi(id).unwrap();
      } else {
        dispatch(removeFromCart(id));
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      if (isAuthenticated) {
        await clearCartApi().unwrap();
      } else {
        dispatch(clearCart());
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (isLoading || cartLoading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h5>Failed to load cart</h5>
          <p>Please try again later</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#6c757d' }}>🛒</div>
          <h3 className="mb-3">Your cart is empty</h3>
          <p className="text-muted mb-4">Add some amazing products to get started!</p>
          <button 
            className="btn btn-primary btn-lg px-4"
            onClick={handleContinueShopping}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const shippingCost = totalAmount > 50 ? 0 : 5.99;
  const tax = totalAmount * 0.08;
  const finalTotal = totalAmount + shippingCost + tax;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
              Shopping Cart 
              <span className="text-muted fs-4 ms-2">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
            </h2>
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={handleClearCart}
              disabled={cartLoading}
            >
              <i className="bi bi-trash me-1"></i>
              Clear Cart
            </button>
          </div>
          
          {cartItems.map((item) => (
            <div key={item.id} className="card mb-3 border-0 shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{ height: '80px', width: '80px', objectFit: 'cover' }}
                    />
                  </div>
                  
                  <div className="col-md-4">
                    <h6 className="mb-1 fw-bold">{item.name}</h6>
                    <p className="text-muted mb-0 small">
                      <i className="bi bi-box me-1"></i>
                      In Stock: {item.stock}
                    </p>
                    {item.originalPrice > item.price && (
                      <small className="text-success">
                        <i className="bi bi-tag me-1"></i>
                        Save ${(item.originalPrice - item.price).toFixed(2)}
                      </small>
                    )}
                  </div>
                  
                  <div className="col-md-2">
                    <div className="d-flex align-items-center justify-content-center">
                      <button 
                        className="btn btn-outline-secondary btn-sm rounded-circle"
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || cartLoading}
                      >
                        -
                      </button>
                      <span className="mx-3 fw-bold">{item.quantity}</span>
                      <button 
                        className="btn btn-outline-secondary btn-sm rounded-circle"
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock || cartLoading}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-md-2 text-center">
                    <div className="fw-bold text-primary fs-5">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    {item.originalPrice > item.price && (
                      <small className="text-muted text-decoration-line-through">
                        ${(item.originalPrice * item.quantity).toFixed(2)}
                      </small>
                    )}
                  </div>
                  
                  <div className="col-md-2 text-end">
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={cartLoading}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card sticky-top" style={{ top: '100px' }}>
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-receipt me-2"></i>
                Order Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({totalItems} items):</span>
                <span className="fw-bold">${totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span className={shippingCost === 0 ? "text-success" : ""}>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              
              <div className="d-flex justify-content-between mb-3">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              {totalAmount < 50 && (
                <div className="alert alert-info py-2 small mb-3">
                  <i className="bi bi-info-circle me-1"></i>
                  Add ${(50 - totalAmount).toFixed(2)} more for free shipping!
                </div>
              )}
              
              <hr />
              
              <div className="d-flex justify-content-between mb-4">
                <strong className="fs-5">Total:</strong>
                <strong className="fs-5 text-primary">${finalTotal.toFixed(2)}</strong>
              </div>
              
              <button 
                className="btn btn-primary w-100 mb-2 py-2 fw-bold"
                onClick={handleCheckout}
                disabled={cartLoading}
              >
                <i className="bi bi-shield-check me-2"></i>
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
              
              <button 
                className="btn btn-outline-secondary w-100 py-2"
                onClick={handleContinueShopping}
                disabled={cartLoading}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;