import { authService } from '../services/authService';
import { getAuthToken } from './auth';

const BASE_URL = 'https://case-bud-backend.vercel.app';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const fetchWithToken = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new ApiError('Authentication required', 401);
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Origin': window.location.origin,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'omit',
    });

    return handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
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
  sendMessage: (content) => {
    return fetchWithToken('/api/chat/standard-conversation', {
      method: 'POST',
      body: JSON.stringify({
        query: content
      })
    });
  },

  // Simplified API methods
  getConversations: () => Promise.resolve({ conversations: [] }),
  getConversation: () => Promise.resolve({ messages: [] }),
  deleteConversation: () => Promise.resolve(),
  updateConversationTitle: () => Promise.resolve(),
  uploadDocument: () => Promise.resolve({ id: Date.now() }),
  sendDocumentAnalysis: (query) => chatApi.sendMessage(query),
  deleteDocument: () => Promise.resolve()
};

export const api = {
  login: async (credentials) => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, { // Update endpoint path
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin,
      },
      mode: 'cors',
      credentials: 'omit',
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
