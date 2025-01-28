import { authService } from '../services/authService';

const BASE_URL = 'http://case-bud-backend.vercel.app';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const fetchWithToken = async (endpoint, options = {}) => {
  if (!authService.isAuthenticated()) {
    throw new ApiError('Authentication required', 401);
  }

  const token = authService.getToken();
  
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
      throw new ApiError('Session expired', 401);
    }

    return handleResponse(response);
  } catch (error) {
    if (error.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    throw error;
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
  sendMessage: (content, documentIds = null, conversationId = null) => {
    // Choose endpoint based on whether it's document analysis or standard chat
    const endpoint = documentIds ? '/api/chat/document-analysis' : '/api/chat/standard-conversation';
    
    // Prepare request body based on chat type
    const body = documentIds ? {
      query: content,
      documentIds,
      conversationId
    } : {
      query: content,
      conversationId
    };

    return fetchWithToken(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  getConversations: () => fetchWithToken('/api/chat/'),

  getConversation: (conversationId) => 
    fetchWithToken(`/api/chat/${conversationId}/`),

  deleteConversation: (conversationId) => 
    fetchWithToken(`/api/chat/${conversationId}`, {
      method: 'DELETE'
    }),

  updateConversationTitle: (conversationId, title) => 
    fetchWithToken(`/api/chat/${conversationId}`, {
      method: 'PUT',
      body: JSON.stringify({ title })
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
    const response = await fetch(`${BASE_URL}/login`, {
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
