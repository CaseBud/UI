const TOKEN_REFRESH_URL = 'https://case-bud-backend.onrender.com/api/auth/refresh';

export const refreshToken = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(TOKEN_REFRESH_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data.token;
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
};
