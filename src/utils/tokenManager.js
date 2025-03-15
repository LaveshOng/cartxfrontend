const TOKEN_KEY = 'auth_tokens';

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify({ accessToken, refreshToken }));
};

export const getTokens = () => {
  const tokens = localStorage.getItem(TOKEN_KEY);
  return tokens ? JSON.parse(tokens) : { accessToken: null, refreshToken: null };
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  const { accessToken } = getTokens();
  return !!accessToken;
};

export const refreshAccessToken = async () => {
  try {
    const { refreshToken } = getTokens();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    setTokens(data.accessToken, refreshToken);
    return data.accessToken;
  } catch (error) {
    clearTokens();
    throw error;
  }
};
