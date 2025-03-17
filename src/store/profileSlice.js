import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../utils/apiClient';
import { updateUser } from './authSlice';

// Async thunks
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.patch('/api/profile/update', profileData);
      dispatch(updateUser(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/profile/change-password', passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

export const updateNotificationPreferences = createAsyncThunk(
  'profile/updateNotificationPreferences',
  async (preferences, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.patch('/api/profile/notifications', preferences);
      dispatch(updateUser({ notificationPreferences: response.data.notificationPreferences }));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update notification preferences'
      );
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'profile/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete('/api/profile/delete');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete account');
    }
  }
);

// Slice
const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    isLoading: false,
    error: null,
    isPasswordChangeSuccess: false,
    isNotificationUpdateSuccess: false,
  },
  reducers: {
    clearProfileErrors: state => {
      state.error = null;
    },
    resetProfileState: state => {
      state.isPasswordChangeSuccess = false;
      state.isNotificationUpdateSuccess = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Update Profile
      .addCase(updateProfile.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, state => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Change Password
      .addCase(changePassword.pending, state => {
        state.isLoading = true;
        state.error = null;
        state.isPasswordChangeSuccess = false;
      })
      .addCase(changePassword.fulfilled, state => {
        state.isLoading = false;
        state.error = null;
        state.isPasswordChangeSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isPasswordChangeSuccess = false;
      })

      // Update Notification Preferences
      .addCase(updateNotificationPreferences.pending, state => {
        state.isLoading = true;
        state.error = null;
        state.isNotificationUpdateSuccess = false;
      })
      .addCase(updateNotificationPreferences.fulfilled, state => {
        state.isLoading = false;
        state.error = null;
        state.isNotificationUpdateSuccess = true;
      })
      .addCase(updateNotificationPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isNotificationUpdateSuccess = false;
      })

      // Delete Account
      .addCase(deleteAccount.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, state => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileErrors, resetProfileState } = profileSlice.actions;

export default profileSlice.reducer;
