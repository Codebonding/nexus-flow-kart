// components/CartBadge.js - UPDATED
import React from 'react';
import { useSelector } from 'react-redux';
import { useGetCartQuery } from '../store/api/cartApi';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const CartBadge = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: cartItems = [], isLoading } = useGetCartQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Calculate total items count
  const getCartItemCount = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const itemCount = getCartItemCount();

  if (isLoading) {
    return (
      <span className="position-relative">
        <i className="bi bi-cart3 fs-5"></i>
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
          ...
        </span>
      </span>
    );
  }

  return (
    <span className="position-relative">
      <i className="bi bi-cart3 fs-5"></i>
      {itemCount > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </span>
  );
};

export default CartBadge;