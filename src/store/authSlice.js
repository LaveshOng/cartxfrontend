import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../utils/apiClient';
import { getTokens, setTokens, clearTokens } from '../utils/tokenManager';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ✅ Async thunk for checking authentication
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  console.log('🚀 Checking user authentication...');
  try {
    const { accessToken } = getTokens();
    if (!accessToken) {
      console.log('🔴 No access token found.');
      return rejectWithValue('No access token');
    }

    const response = await apiClient.auth.checkAuth();
    console.log('✅ Auth check response:', response);

    if (response.isAuthenticated) {
      return response.user; // Pass user data to Redux state
    } else {
      clearTokens();
      return rejectWithValue('Not authenticated');
    }
  } catch (error) {
    console.error('⚠️ Auth check failed:', error);
    clearTokens();
    return rejectWithValue(error.message || 'Authentication failed');
  }
});

// ✅ Async thunk for logging in
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    console.log('🟢 Logging in with credentials:', credentials);
    const response = await apiClient.auth.login(credentials);

    if (response.status === 'success') {
      setTokens(response.data.accessToken, response.data.refreshToken);
      return response.data; // Store user data in Redux
    } else {
      return rejectWithValue(response.message);
    }
  } catch (error) {
    return rejectWithValue(error.message || 'Login failed');
  }
});

// ✅ Async thunk for signing up
export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    console.log('🟢 Signing up user:', userData);
    const response = await apiClient.auth.signup(userData);

    if (response.status === 'success') {
      setTokens(response.data.accessToken, response.data.refreshToken);
      return response.data;
    } else {
      return rejectWithValue(response.message);
    }
  } catch (error) {
    return rejectWithValue(error.message || 'Signup failed');
  }
});

// ✅ Async thunk for logging out
export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await apiClient.auth.logout();
    clearTokens();
    return true;
  } catch (error) {
    return rejectWithValue(error.message || 'Logout failed');
  }
});

// ✅ Redux Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // 🔹 Check Auth
      .addCase(checkAuth.pending, state => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // 🔹 Login
      .addCase(login.pending, state => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // 🔹 Signup
      .addCase(signup.pending, state => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // 🔹 Logout
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { setError } = authSlice.actions;
export default authSlice.reducer;
