import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/users/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Registration OTP Flow
    register: builder.mutation({
      query: (userData) => ({
        url: 'register',
        method: 'POST',
        body: userData,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (otpData) => ({
        url: 'verify-otp',
        method: 'POST',
        body: otpData,
      }),
    }),

    // Login OTP Flow
    sendLoginOtp: builder.mutation({
      query: (credentials) => ({
        url: 'login/send-otp',
        method: 'POST',
        body: credentials,
      }),
    }),
    verifyLoginOtp: builder.mutation({
      query: (otpData) => ({
        url: 'login/verify-otp',
        method: 'POST',
        body: otpData,
      }),
    }),

    // Traditional Login (if needed)
    login: builder.mutation({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Forgot Password Flow
    forgotPassword: builder.mutation({
      query: (emailOrPhone) => ({
        url: 'forgot-password',
        method: 'POST',
        body: emailOrPhone,
      }),
    }),
    resetPassword: builder.mutation({
      query: (resetData) => ({
        url: 'reset-password',
        method: 'POST',
        body: resetData,
      }),
    }),

    // User Management
    getUser: builder.query({
      query: (userId) => ({
        url: `${userId}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: `${userId}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { 
  useRegisterMutation, 
  useVerifyOtpMutation, 
  useLoginMutation,
  useSendLoginOtpMutation,
  useVerifyLoginOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserQuery,
  useUpdateUserMutation
} = authApi;