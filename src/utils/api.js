import { authService } from '../services/authService';

const BASE_URL = 'http://case-bud-backend.vercel.app';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const fetchWithToken = async (endpoint, options = {}) => {
  const token = authService.getToken();
  
  if (!token) {
    throw new Error('No authentication token');
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
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
      authService.logout();
      window.location.href = '/login';
      throw new Error('Session expired');
    }

    return handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Network error', 0);
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

export const api = {
  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  // Add other API methods here...
};
