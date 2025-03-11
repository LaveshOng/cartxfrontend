const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

class ApiClient {
  constructor() {
    this.baseUrl = BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    return await response.json();
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }), // Send token in correct format
      }),
  };
}

export const apiClient = new ApiClient();
