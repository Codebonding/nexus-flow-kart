// store/api/cartApi.js
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

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      const guestId = getGuestId();
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      } else {
        headers.set('x-guest-id', guestId);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    // Get cart
    getCart: builder.query({
      query: () => 'cart',
      providesTags: ['Cart'],
    }),
    
    // Add to cart
    addToCart: builder.mutation({
      query: (product) => ({
        url: 'cart/add',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Cart'],
    }),
    
    // Update cart item
    updateCartItem: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `cart/${id}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    
    // Remove from cart
    removeFromCart: builder.mutation({
      query: (id) => ({
        url: `cart/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    
    // Clear cart
    clearCart: builder.mutation({
      query: () => ({
        url: 'cart/clear',
        method: 'DELETE',
      }),
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