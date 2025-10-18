// store/api/cartApi.js - UPDATED
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Get guest ID from localStorage or generate one
const getGuestId = () => {
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token') || '';
};

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/',
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    // Get cart items
    getCart: builder.query({
      query: () => {
        const guestId = getGuestId();
        const token = getToken();
        
        let url = 'cart';
        
        if (!token) {
          // For guest users, use query parameter
          url += `?guestId=${guestId}`;
        }
        
        console.log('Fetching cart from:', url);
        return url;
      },
      providesTags: ['Cart'],
      transformResponse: (response) => {
        console.log('Cart API Response:', response);
        return response.cartItems || [];
      },
    }),
    
    // Add to cart
    addToCart: builder.mutation({
      query: ({ productId, quantity }) => {
        const guestId = getGuestId();
        const token = getToken();
        
        const body = token 
          ? { productId, quantity }
          : { guestId, productId, quantity };
          
        console.log('Adding to cart:', body);
        return {
          url: 'cart/add',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Cart'],
    }),
    
    // Update cart item quantity
    updateCartItem: builder.mutation({
      query: ({ id, quantity }) => {
        console.log('Updating cart item:', id, 'quantity:', quantity);
        return {
          url: `cart/${id}`,
          method: 'PUT',
          body: { quantity },
        };
      },
      invalidatesTags: ['Cart'],
    }),
    
    // Remove cart item
    removeFromCart: builder.mutation({
      query: (id) => {
        console.log('Removing cart item:', id);
        return {
          url: `cart/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Cart'],
    }),
    
    // Clear cart
    clearCart: builder.mutation({
      query: () => {
        const guestId = getGuestId();
        const token = getToken();
        
        const body = token ? {} : { guestId };
        
        console.log('Clearing cart for:', token ? 'user' : 'guest');
        return {
          url: 'cart/clear',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;