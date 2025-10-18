// components/Cart.js - UPDATED
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  useGetCartQuery, 
  useUpdateCartItemMutation, 
  useRemoveFromCartMutation, 
  useClearCartMutation 
} from '../store/api/cartApi';
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice';

const Cart = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  
  const { 
    data: cartItems = [], 
    isLoading, 
    error, 
    refetch 
  } = useGetCartQuery();

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await updateCartItem({ id: itemId, quantity: newQuantity }).unwrap();
      await Swal.fire({
        icon: 'success',
        title: 'Quantity updated!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Failed to update quantity:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to update quantity',
        text: error.data?.message || 'Please try again',
      });
    }
  };

  const handleRemoveItem = async (itemId) => {
    const result = await Swal.fire({
      title: 'Remove item?',
      text: 'Are you sure you want to remove this item from your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
    });

    if (result.isConfirmed) {
      try {
        await removeCartItem(itemId).unwrap();
        await Swal.fire({
          icon: 'success',
          title: 'Item removed!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.error('Failed to remove item:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to remove item',
          text: error.data?.message || 'Please try again',
        });
      }
    }
  };

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: 'Clear cart?',
      text: 'Are you sure you want to clear your entire cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, clear it!',
    });

    if (result.isConfirmed) {
      try {
        await clearCart().unwrap();
        await Swal.fire({
          icon: 'success',
          title: 'Cart cleared!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.error('Failed to clear cart:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to clear cart',
          text: error.data?.message || 'Please try again',
        });
      }
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!cartItems || cartItems.length === 0) {
      return { totalItems: 0, totalAmount: 0 };
    }

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);

    return { totalItems, totalAmount };
  };

  const { totalItems, totalAmount } = calculateTotals();
  const shippingCost = totalAmount > 50 ? 0 : 5.99;
  const tax = totalAmount * 0.08;
  const finalTotal = totalAmount + shippingCost + tax;

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4>Failed to load cart</h4>
          <p className="mb-3">{error.data?.message || 'There was an error loading your cart items.'}</p>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-primary"
              onClick={() => refetch()}
            >
              Try Again
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
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">
            <i className="bi bi-cart3 me-2"></i>
            Shopping Cart
            {totalItems > 0 && (
              <span className="badge bg-primary ms-2">{totalItems} items</span>
            )}
          </h1>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4" style={{ fontSize: '4rem' }}>🛒</div>
          <h4 className="text-dark mb-3">Your cart is empty</h4>
          <p className="text-muted mb-4">
            {!isAuthenticated ? "Add some products to your cart to see them here!" : "Start adding some products to your cart"}
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/products')}
            >
              <i className="bi bi-bag me-2"></i>
              Continue Shopping
            </button>
            {!isAuthenticated && (
              <button 
                className="btn btn-outline-primary"
                onClick={() => navigate('/login')}
              >
                <i className="bi bi-person me-2"></i>
                Login to View Saved Cart
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Cart Items</h5>
                {(['admin', 'employee', 'cash_counter'].includes(currentUser?.role) || isAuthenticated) && (
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleClearCart}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Clear Cart
                  </button>
                )}
              </div>
              <div className="card-body p-0">
                {cartItems.map((item) => {
                  const product = item.product || {};
                  const price = product.price || 0;
                  const image = product.imageUrl || product.images?.[0] || '/placeholder-image.jpg';
                  
                  return (
                    <div key={item.id} className="border-bottom p-4">
                      <div className="row align-items-center">
                        <div className="col-md-2">
                          <img 
                            src={image} 
                            alt={product.name}
                            className="img-fluid rounded"
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik00MCA0MEM0Mi43NjE0IDQwIDQ1IDM3Ljc2MTQgNDUgMzVDNDUgMzIuMjM4NiA0Mi43NjE0IDMwIDQwIDMwQzM3LjIzODYgMzAgMzUgMzIuMjM4NiAzNSAzNUMzNSAzNy43NjE0IDM3LjIzODYgNDAgNDAgNDBaIiBmaWxsPSIjQ0RDRkRGIi8+CjxwYXRoIGQ9Ik00OC41IDMxLjVMMzUuNSA0NC41IiBzdHJva2U9IiNDRENGREYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0zNS41IDMxLjVMNDguNSA0NC41IiBzdHJva2U9IiNDRENGREYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
                            }}
                          />
                        </div>
                        <div className="col-md-4">
                          <h6 className="mb-1">{product.name}</h6>
                          <p className="text-muted small mb-0">SKU: {product.id}</p>
                          {product.stock !== undefined && (
                            <small className={product.stock > 0 ? "text-success" : "text-danger"}>
                              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </small>
                          )}
                        </div>
                        <div className="col-md-2">
                          <span className="fw-bold text-primary">
                            ${price.toFixed(2)}
                          </span>
                        </div>
                        <div className="col-md-2">
                          <div className="input-group input-group-sm" style={{ width: '120px' }}>
                            <button 
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              className="form-control text-center"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                              min="1"
                              max={product.stock || 99}
                            />
                            <button 
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={product.stock && item.quantity >= product.stock}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="col-md-2 text-end">
                          <span className="fw-bold h6">
                            ${(price * item.quantity).toFixed(2)}
                          </span>
                          <div>
                            {(['admin', 'employee', 'cash_counter'].includes(currentUser?.role)) && (
                              <button 
                                className="btn btn-link text-danger p-0 small"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <i className="bi bi-trash"></i> Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
              <div className="card-header bg-light">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({totalItems} items):</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span className={shippingCost === 0 ? "text-success" : ""}>
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong className="text-primary h5">
                    ${finalTotal.toFixed(2)}
                  </strong>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate('/checkout')}
                    disabled={cartItems.length === 0}
                  >
                    <i className="bi bi-credit-card me-2"></i>
                    Proceed to Checkout
                  </button>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/products')}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Continue Shopping
                  </button>
                </div>

                {!isAuthenticated && (
                  <div className="alert alert-warning mt-3 mb-0">
                    <small>
                      <i className="bi bi-info-circle me-1"></i>
                      Login to save your cart and access it from any device
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;