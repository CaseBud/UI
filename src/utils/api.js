import { authService } from '../services/authService';
import { getAuthToken } from './auth';

 
const BASE_URL = 'https://case-bud-backend.vercel.app';  // Ensure this URL is correct

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchWithToken = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new ApiError('Authentication required', 401);
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      mode: 'cors',  // Ensure this is set to 'cors'
      credentials: 'omit',  // Changed from 'include' to 'omit'
    });

    // Handle preflight response
    if (response.status === 204) {
      return null;
    }

    return handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = new ApiError(
      data.message || 'Something went wrong',
      response.status
    );
    error.data = data;
    throw error;
  }
  
  return data;
};

const retryWithDelay = async (fn, retries = MAX_RETRIES) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (error.status === 502 || error.status === 504)) {
      await wait(RETRY_DELAY);
      return retryWithDelay(fn, retries - 1);
    }
    throw error;
  }
};

export const chatApi = {
  sendMessage: async (content, options = {}) => {
    const makeRequest = async () => {
      const response = await fetchWithToken('/api/chat/standard-conversation', {
        method: 'POST',
        body: JSON.stringify({
          conversationId: options.conversationId || null,
          query: content
        })
      });

      if (!response) {
        throw new ApiError('No response from server', 500);
      }

      return response;
    };

    try {
      const response = await retryWithDelay(makeRequest);
      
      return {
        response: response.response,
        message: response.message,
        conversationId: response.conversationId,
        responseId: response.responseId,
        title: response.title
      };
    } catch (error) {
      console.error('Send message failed:', {
        status: error.status,
        message: error.message,
        data: error.data
      });
      throw error;
    }
  },

  // Simplified API methods
  getConversations: () => Promise.resolve({ conversations: [] }),
  getConversation: () => Promise.resolve({ messages: [] }),
  deleteConversation: () => Promise.resolve(),
  updateConversationTitle: () => Promise.resolve(),
  uploadDocument: () => Promise.resolve({ id: Date.now() }),
  sendDocumentAnalysis: (query) => chatApi.sendMessage(query),
  deleteDocument: () => Promise.resolve(),

  sendDocumentAnalysis: async (query, documentIds, conversationId = null) => {
    const response = await fetchWithToken('/api/chat/document-analysis', {
      method: 'POST',
      body: JSON.stringify({
        query,
        documentIds,
        conversationId
      })
    });

    return response;
  },
};

export const documentsApi = {
  uploadDocument: async (file, name) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    const response = await fetchWithToken('/api/documents', {
      method: 'POST',
      body: formData,
      headers: {
        // Remove Content-Type to let browser set it with boundary
        'Accept': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return response;
  }
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
