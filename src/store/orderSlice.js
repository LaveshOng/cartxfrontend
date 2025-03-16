import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../utils/apiClient';

// Async thunks
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.isAuthenticated || !auth.user?.id) {
        console.warn('⚠️ User not authenticated, skipping fetchUserOrders');
        return rejectWithValue('User not authenticated');
      }

      console.log('📦 Fetching orders for user:', auth.user.id);
      const response = await apiClient.orders.fetchUserOrders(auth.user.id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (orderId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.user?.id) {
        throw new Error('User not authenticated');
      }
      const response = await apiClient.orders.fetchOrderDetails(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch order details');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.user?.id) {
        throw new Error('User not authenticated');
      }
      const response = await apiClient.orders.cancelOrder(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to cancel order');
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  cancellingOrder: false,
  cancelError: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: state => {
      state.error = null;
      state.cancelError = null;
    },
    clearCurrentOrder: state => {
      state.currentOrder = null;
    },
  },
  extraReducers: builder => {
    // Fetch User Orders
    builder
      .addCase(fetchUserOrders.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Order Details
      .addCase(fetchOrderDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel Order
      .addCase(cancelOrder.pending, state => {
        state.cancellingOrder = true;
        state.cancelError = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.cancellingOrder = false;
        // Update the order in the orders list
        const index = state.orders.findIndex(
          order => order.orderId === action.payload.order.orderId
        );
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
        // Update current order if it's the same one
        if (state.currentOrder?.orderId === action.payload.order.orderId) {
          state.currentOrder = action.payload.order;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.cancellingOrder = false;
        state.cancelError = action.payload;
      });
  },
});

// Selectors
export const getAllOrders = state => state.orders.orders;
export const getCurrentOrder = state => state.orders.currentOrder;
export const getOrdersLoading = state => state.orders.loading;
export const getOrdersError = state => state.orders.error;
export const getCancellingOrder = state => state.orders.cancellingOrder;
export const getCancelError = state => state.orders.cancelError;

export const { clearOrderError, clearCurrentOrder } = orderSlice.actions;

export default orderSlice.reducer;
