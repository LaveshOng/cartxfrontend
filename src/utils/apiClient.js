const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
import { getTokens, refreshAccessToken, clearTokens, setTokens } from './tokenManager';
import axios from 'axios';

const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const { accessToken } = getTokens();

  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle token expiration
    if (response.status === 401) {
      const error = await response.json();
      if (error.code === 'TOKEN_EXPIRED') {
        // Try to refresh the token
        const newAccessToken = await refreshAccessToken();
        if (!newAccessToken) {
          clearTokens();
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }

        // Retry the original request with new token
        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        const retryResponse = await fetch(url, {
          ...options,
          headers: retryHeaders,
        });

        if (!retryResponse.ok) {
          throw new Error(await retryResponse.json());
        }

        return await retryResponse.json();
      }
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    return await response.json();
  } catch (error) {
    if (error.message.includes('Failed to refresh token')) {
      clearTokens();
      window.location.href = '/login';
    }
    throw error;
  }
};

export const apiClient = {
  auth: {
    register: data =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    login: data =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    verifyEmail: token =>
      request('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      }),

    logout: () => {
      clearTokens();
      window.location.href = '/';
    },

    logoutAll: () =>
      request('/auth/logout-all', {
        method: 'POST',
      }),

    // Social login URLs
    getGoogleAuthUrl: () => `${BASE_URL}/auth/google`,
    getMicrosoftAuthUrl: () => `${BASE_URL}/auth/microsoft`,
    getAppleAuthUrl: () => `${BASE_URL}/auth/apple`,

    // Handle social login callback
    handleSocialLoginCallback: async token => {
      try {
        const response = await request('/auth/verify-social-token', {
          method: 'POST',
          body: JSON.stringify({ token }),
        });

        if (response.accessToken && response.refreshToken) {
          setTokens(response.accessToken, response.refreshToken);
          return { success: true, user: response.user };
        }
        return { success: false, error: 'Invalid token response' };
      } catch (error) {
        console.error('Social login error:', error);
        return { success: false, error: error.message };
      }
    },

    checkAuth: async () => {
      try {
        const { accessToken } = getTokens();
        if (!accessToken) {
          return { isAuthenticated: false };
        }

        const response = await request('/auth/verify');
        return {
          isAuthenticated: true,
          user: response.user,
        };
      } catch (error) {
        if (error.message.includes('TOKEN_EXPIRED')) {
          try {
            await refreshAccessToken();
            const retryResponse = await request('/auth/verify');
            return {
              isAuthenticated: true,
              user: retryResponse.user,
            };
          } catch (refreshError) {
            clearTokens();
            return { isAuthenticated: false };
          }
        }
        clearTokens();
        return { isAuthenticated: false };
      }
    },
  },

  address: {
    // Get all addresses for the current user
    getAll: async () => {
      try {
        const response = await request('/address', {
          method: 'GET',
        });

        if (response.status === 'success' && Array.isArray(response.data)) {
          return response.data;
        }
        throw new Error('Invalid response format from server');
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
        throw error;
      }
    },

    // Add a new address
    add: async addressData => {
      try {
        // Validate required fields
        const requiredFields = [
          'fullName',
          'phoneNumber',
          'addressLine1',
          'city',
          'state',
          'postalCode',
        ];
        const missingFields = requiredFields.filter(field => !addressData[field]);

        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        const response = await request('/address', {
          method: 'POST',
          body: JSON.stringify(addressData),
        });

        if (response.status === 'success' && response.data) {
          return response.data;
        }
        throw new Error('Failed to add address');
      } catch (error) {
        console.error('Failed to add address:', error);
        throw error;
      }
    },

    // Update an existing address
    update: async (addressId, addressData) => {
      try {
        if (!addressId) {
          throw new Error('Address ID is required');
        }

        const response = await request(`/address/${addressId}`, {
          method: 'PUT',
          body: JSON.stringify(addressData),
        });

        if (response.status === 'success' && response.data) {
          return response.data;
        }
        throw new Error('Failed to update address');
      } catch (error) {
        console.error('Failed to update address:', error);
        throw error;
      }
    },

    // Delete an address
    delete: async addressId => {
      try {
        if (!addressId) {
          throw new Error('Address ID is required');
        }

        const response = await request(`/address/${addressId}`, {
          method: 'DELETE',
        });

        if (response.status === 'success') {
          return true;
        }
        throw new Error('Failed to delete address');
      } catch (error) {
        console.error('Failed to delete address:', error);
        throw error;
      }
    },

    // Set an address as default
    setDefault: async addressId => {
      try {
        if (!addressId) {
          throw new Error('Address ID is required');
        }

        const response = await request(`/address/${addressId}/set-default`, {
          method: 'PATCH',
        });

        if (response.status === 'success' && response.data) {
          return response.data;
        }
        throw new Error('Failed to set address as default');
      } catch (error) {
        console.error('Failed to set default address:', error);
        throw error;
      }
    },
  },

  payment: {
    // Create a checkout session with Stripe
    createCheckoutSession: data =>
      request('/payment/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
