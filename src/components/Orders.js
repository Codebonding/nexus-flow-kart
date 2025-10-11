// components/Orders.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const Orders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  // Show success message if redirected from checkout
  useEffect(() => {
    if (location.state?.message) {
      const timer = setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  // Update orders 

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-warning', text: 'Pending' },
      confirmed: { class: 'bg-info', text: 'Confirmed' },
      shipped: { class: 'bg-primary', text: 'Shipped' },
      delivered: { class: 'bg-success', text: 'Delivered' },
      cancelled: { class: 'bg-danger', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateOrderTotal = (order) => {
    return order.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h4>Authentication Required</h4>
          <p>Please log in to view your orders.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold" style={{ color: '#28329B' }}>My Orders</h1>
              <p className="text-muted">Track and manage your purchases</p>
            </div>
            <button 
              className="btn btn-outline-primary"
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {location.state?.message && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {location.state.message}
          {location.state.orderId && (
            <span> Order ID: <strong>{location.state.orderId}</strong></span>
          )}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => navigate(location.pathname, { replace: true, state: {} })}
          ></button>
        </div>
      )}

      {/* Order Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center gap-3">
                <span className="fw-semibold">Filter by status:</span>
                <div className="btn-group">
                  <button
                    type="button"
                    className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilterStatus('all')}
                  >
                    All Orders
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${filterStatus === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => setFilterStatus('pending')}
                  >
                    Pending
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${filterStatus === 'confirmed' ? 'btn-info' : 'btn-outline-info'}`}
                    onClick={() => setFilterStatus('confirmed')}
                  >
                    Confirmed
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${filterStatus === 'shipped' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilterStatus('shipped')}
                  >
                    Shipped
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${filterStatus === 'delivered' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setFilterStatus('delivered')}
                  >
                    Delivered
                  </button>
                </div>
                <span className="text-muted small">
                  Showing {filteredOrders.length} of {orders.length} orders
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#6c757d' }}>📦</div>
          <h3 className="mb-3">
            {filterStatus === 'all' ? 'No orders found' : `No ${filterStatus} orders`}
          </h3>
          <p className="text-muted mb-4">
            {filterStatus === 'all' 
              ? "You haven't placed any orders yet. Start shopping to see your orders here!"
              : `You don't have any ${filterStatus} orders at the moment.`
            }
          </p>
          {filterStatus === 'all' && (
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/products')}
            >
              <i className="bi bi-bag me-2"></i>
              Start Shopping
            </button>
          )}
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            {filteredOrders.map((order) => (
              <div key={order.id} className="card mb-4 shadow-sm">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0 fw-bold">Order #{order.id}</h6>
                    <small className="text-muted">
                      Placed on {formatDate(order.createdAt)}
                    </small>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="fw-bold text-primary">
                      ${calculateOrderTotal(order).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="card-body">
                  {/* Order Items */}
                  <div className="mb-3">
                    <h6 className="fw-semibold mb-3">Items:</h6>
                    <div className="row">
                      {order.items?.map((item, index) => (
                        <div key={index} className="col-md-6 mb-2">
                          <div className="d-flex align-items-center">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="rounded me-3"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow-1">
                              <h6 className="mb-0 small fw-bold">{item.name}</h6>
                              <small className="text-muted">
                                Qty: {item.quantity} × ${item.price}
                              </small>
                              <div className="fw-semibold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="fw-semibold mb-2">Shipping Address:</h6>
                      <address className="small">
                        {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}<br/>
                        {order.shippingAddress?.address}<br/>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br/>
                        {order.shippingAddress?.country}
                      </address>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-semibold mb-2">Payment Information:</h6>
                      <div className="small">
                        <div><strong>Method:</strong> {order.paymentMethod}</div>
                        <div><strong>Status:</strong> 
                          <span className={`badge ms-2 ${
                            order.paymentStatus === 'paid' ? 'bg-success' : 
                            order.paymentStatus === 'pending' ? 'bg-warning' : 'bg-danger'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        {order.trackingNumber && (
                          <div>
                            <strong>Tracking:</strong> {order.trackingNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="mt-3 pt-3 border-top">
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-primary btn-sm">
                        <i className="bi bi-eye me-1"></i>
                        View Details
                      </button>
                      {order.status === 'delivered' && (
                        <button className="btn btn-outline-success btn-sm">
                          <i className="bi bi-star me-1"></i>
                          Rate Products
                        </button>
                      )}
                      {order.status === 'pending' && (
                        <button className="btn btn-outline-danger btn-sm">
                          <i className="bi bi-x-circle me-1"></i>
                          Cancel Order
                        </button>
                      )}
                      <button className="btn btn-outline-secondary btn-sm">
                        <i className="bi bi-printer me-1"></i>
                        Print Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;