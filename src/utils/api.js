import { refreshToken } from './auth';

const BASE_URL = 'https://case-bud-backend.onrender.com/api';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const fetchWithToken = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token expired
      try {
        const newToken = await refreshToken();
        // Retry the original request with new token
        const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            ...defaultHeaders,
            Authorization: `Bearer ${newToken}`,
            ...options.headers,
          },
        });
        return handleResponse(retryResponse);
      } catch (error) {
        // Refresh token failed
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new ApiError('Session expired. Please login again.', 401);
      }
    }

    return handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error. Please check your connection.', 0);
  }
};

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(
      data.message || 'Something went wrong',
      response.status
    );
  }
  
  return data;
};

export const chatApi = {
  sendMessage: (content, documentIds = null) => {
    const endpoint = documentIds ? '/chat/document-analysis' : '/chat/standard-conversation';
    return fetchWithToken(endpoint, {
      method: 'POST',
      body: JSON.stringify(documentIds ? {
        message: content,
        documentIds
      } : {
        query: content
      })
    });
  },

  getConversations: () => fetchWithToken('/chat/'),

  deleteConversation: (id) => fetchWithToken(`/chat/${id}`, {
    method: 'DELETE'
  }),

  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);

    return fetchWithToken('/documents', {
      method: 'POST',
      headers: {
        // Remove Content-Type to let browser set it with boundary
        'Content-Type': undefined,
      },
      body: formData
    });
  },

  deleteDocument: (id) => fetchWithToken(`/documents/${id}`, {
    method: 'DELETE'
  })
};
