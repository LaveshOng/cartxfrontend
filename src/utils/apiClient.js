import axios from 'axios';
import { getTokens, refreshAccessToken, clearTokens, setTokens } from './tokenManager';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// API request function with automatic token handling
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  let { accessToken } = getTokens();

  let headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    let response = await fetch(url, { ...options, headers });

    // Handle token expiration (401)
    if (response.status === 401) {
      const error = await response.json();
      if (error.code === 'TOKEN_EXPIRED') {
        try {
          const newAccessToken = await refreshAccessToken();
          if (!newAccessToken) {
            clearTokens();
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
          }

          // Retry the request with the new token
          headers.Authorization = `Bearer ${newAccessToken}`;
          response = await fetch(url, { ...options, headers });

          if (!response.ok) {
            throw new Error(await response.json());
          }
        } catch (refreshError) {
          clearTokens();
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Failed to refresh token. Please login again.');
        }
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
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw error;
  }
};

// API Client with categorized endpoints
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
        console.log(response, 'response=====');
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

  orders: {
    fetchUserOrders: async userId => {
      try {
        const { accessToken } = getTokens();
        if (!accessToken) throw new Error('User not authenticated');
        if (!userId) throw new Error('User ID is required');

        return await request('/orders/user/' + userId, {
          method: 'GET',
        });
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        throw error;
      }
    },

    fetchOrderDetails: orderId => {
      if (!orderId) throw new Error('Order ID is required');
      return request(`/orders/${orderId}`, {
        method: 'GET',
      });
    },

    cancelOrder: async orderId => {
      try {
        if (!orderId) throw new Error('Order ID is required');
        return await request(`/orders/${orderId}/cancel`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Failed to cancel order:', error);
        throw error;
      }
    },
  },

  address: {
    getAll: async () => {
      try {
        const response = await request('/address', {
          method: 'GET',
        });

        if (response.status === 'success' && Array.isArray(response.data)) {
          return {
            status: response.status,
            data: response.data,
          };
        }
        throw new Error('Invalid response format from server');
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
        throw error;
      }
    },
    add: async addressData =>
      request('/address', {
        method: 'POST',
        body: JSON.stringify(addressData),
      }),

    update: async (addressId, addressData) =>
      request(`/address/${addressId}`, {
        method: 'PUT',
        body: JSON.stringify(addressData),
      }),

    delete: async addressId =>
      request(`/address/${addressId}`, {
        method: 'DELETE',
      }),

    setDefault: async addressId =>
      request(`/address/${addressId}/set-default`, {
        method: 'PATCH',
      }),
  },

  payment: {
    createCheckoutSession: data =>
      request('/stripe/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
