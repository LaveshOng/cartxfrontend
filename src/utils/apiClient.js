const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
import { getTokens, refreshAccessToken, clearTokens } from './tokenManager';

class ApiClient {
  constructor() {
    this.baseUrl = BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
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
        // Clear tokens and redirect to login
        clearTokens();
        window.location.href = '/login';
      }
      throw error;
    }
  }

  auth = {
    register: data =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    login: data =>
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    verifyEmail: token =>
      this.request('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      }),

    logout: () =>
      this.request('/auth/logout', {
        method: 'POST',
      }),

    logoutAll: () =>
      this.request('/auth/logout-all', {
        method: 'POST',
      }),

    // Social login URLs
    getGoogleAuthUrl: () => `${this.baseUrl}/auth/google`,
    getMicrosoftAuthUrl: () => `${this.baseUrl}/auth/microsoft`,
    getAppleAuthUrl: () => `${this.baseUrl}/auth/apple`,

    // Verify social login callback
    verifySocialLogin: token =>
      this.request('/auth/verify-social-token', {
        method: 'POST',
        body: JSON.stringify({ token }),
      }),
  };
}

export const apiClient = new ApiClient();
