import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './sidebarSlice';
import categoryReducer from './categorySlice';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import searchReducer from './searchSlice';
import signupModalReducer from './signupModalSlice';
import authReducer from './authSlice';
import orderReducer from './orderSlice';

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    category: categoryReducer,
    product: productReducer,
    cart: cartReducer,
    search: searchReducer,
    signupModal: signupModalReducer,
    auth: authReducer,
    orders: orderReducer,
  },
});

export default store;
