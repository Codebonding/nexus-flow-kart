import { createSlice } from '@reduxjs/toolkit';

const getInitialCartState = () => {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    try {
      return JSON.parse(storedCart);
    } catch (error) {
      console.error('Error parsing stored cart data:', error);
      localStorage.removeItem('cart');
    }
  }
  return {
    items: [],
    totalAmount: 0,
    totalItems: 0,
  };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: getInitialCartState(),
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      
      state.totalItems += 1;
      state.totalAmount += product.offerPrice || product.originalPrice;
      
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      const existingItem = state.items.find(item => item.id === productId);
      
      if (existingItem) {
        state.totalItems -= existingItem.quantity;
        state.totalAmount -= (existingItem.offerPrice || existingItem.originalPrice) * existingItem.quantity;
        state.items = state.items.filter(item => item.id !== productId);
      }
      
      localStorage.setItem('cart', JSON.stringify(state));
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === productId);
      
      if (existingItem && quantity > 0) {
        const price = existingItem.offerPrice || existingItem.originalPrice;
        state.totalAmount -= price * existingItem.quantity;
        state.totalItems -= existingItem.quantity;
        
        existingItem.quantity = quantity;
        
        state.totalAmount += price * quantity;
        state.totalItems += quantity;
      }
      
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectTotalAmount = (state) => state.cart.totalAmount;
export const selectTotalItems = (state) => state.cart.totalItems;