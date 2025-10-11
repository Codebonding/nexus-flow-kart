// store/api/orderApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    // Buy now / Place order
    placeOrder: builder.mutation({
      query: (orderData) => ({
        url: 'orders/buy',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Orders', 'Cart'],
    }),
    
    // Get orders
    getOrders: builder.query({
      query: () => 'orders',
      providesTags: ['Orders'],
    }),
    
    // Get order by ID
    getOrderById: builder.query({
      query: (id) => `orders/${id}`,
      providesTags: ['Orders'],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
} = orderApi;