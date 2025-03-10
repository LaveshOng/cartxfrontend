const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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
  };
}

export const apiClient = new ApiClient();
