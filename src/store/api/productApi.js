// store/api/productApi.js - UPDATED
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/',
  }),
  tagTypes: ['Product', 'Products'],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params = {}) => {
        const { search, minRating, category, minPrice, maxPrice, sortBy, sortOrder } = params;
        const queryParams = new URLSearchParams();
        
        if (search) queryParams.append('search', search);
        if (minRating) queryParams.append('minRating', minRating);
        if (category) queryParams.append('category', category);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (sortBy) queryParams.append('sortBy', sortBy);
        if (sortOrder) queryParams.append('sortOrder', sortOrder);
        
        return `products?${queryParams.toString()}`;
      },
      providesTags: ['Products'],
      transformResponse: (response) => {
        return response.products || response.data || response;
      }
    }),
    
    getProductById: builder.query({
      query: (id) => `products/${id}`,
      providesTags: ['Product'],
      transformResponse: (response) => {
        return response.product || response.data || response;
      }
    }),
    
    getCategories: builder.query({
      query: () => 'categories',
      providesTags: ['Products'],
    }),
  }),
});

export const { 
  useGetProductsQuery, 
  useGetProductByIdQuery, 
  useGetCategoriesQuery,
  useLazyGetProductsQuery 
} = productsApi;