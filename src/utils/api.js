import { authService } from '../services/authService';
import { getAuthToken } from './auth';
import { documentService } from '../services/documentService';

const BASE_URL =
    'https://case-bud-backend-1.onrender.com'; // Ensure this URL is correct

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchWithToken = async (
    endpoint,
    options = {},
    docUpload = false
) => {
    const token = getAuthToken();

    if (!token) {
        throw new ApiError('Authentication required', 401);
    }

    const defaultHeaders = {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
    };

    if (!docUpload) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            },
            mode: 'cors', // Ensure this is set to 'cors'
            credentials: 'omit' // Changed from 'include' to 'omit'
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
    let data;
    try {
        data = await response.json();
    } catch (error) {
        throw new ApiError('Invalid JSON response from server', 500);
    }

    if (!response.ok) {
        const errorMessage =
            data?.message || data?.error || 'Something went wrong';
        const error = new ApiError(errorMessage, response.status);
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
    sendMessage: async (message, options = {}) => {
        const { conversationId = null, webSearch = false, language = 'en-US', detailedMode = false } = options;
        
        try {
            const endpoint = '/api/chat';
            const response = await fetchWithToken(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    message,
                    conversationId,
                    webSearch,
                    language,
                    detailedMode
                })
            });
            
            return response;
        } catch (error) {
            console.error('Chat error:', error);
            throw error;
        }
    },

    getConversations: async () => {
        try {
            const response = await fetchWithToken('/api/chat/');

            // Check if response exists
            if (!response?.conversations) {
                console.warn('No data in response');
                return [];
            }

            return response;
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
            throw error;
        }
    },

    getConversationById: async (conversationId) => {
        try {
            const response = await fetchWithToken(
                `/api/chat/${conversationId}/`
            );

            if (!response?.conversation) {
                throw new Error('No conversation data found');
            }

            return {
                ...response.conversation,
                messages: response.messages.map((msg) => ({
                    id: msg._id,
                    content: {
                        query: msg.query,
                        response: msg.response
                    },
                    documents:
                        msg.documentIds && msg.documentIds.length > 0
                            ? msg.documentIds.map((doc) => ({
                                  name: doc.name,
                                  type: doc.type
                              }))
                            : [],
                    isWebSearch: msg.webSearch,
                    // {
                    //   query: msg.query,
                    //   response: msg.response
                    // },
                    timestamp: msg.createdAt
                }))
            };
        } catch (error) {
            console.error(
                `Failed to fetch conversation ${conversationId}:`,
                error
            );
            throw error;
        }
    },

    getConversation: () => Promise.resolve({ messages: [] }),
    deleteConversation: () => Promise.resolve(),
    updateConversationTitle: () => Promise.resolve(),
    uploadDocument: () => Promise.resolve({ id: Date.now() }),
    sendDocumentAnalysis: (query) => chatApi.sendMessage(query),

    sendDocumentAnalysis: async (query, documentIds, conversationId = null, language = 'en-US') => {
        try {
            const endpoint = '/api/chat/document-analysis';
            const response = await fetchWithToken(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    query,
                    documentIds,
                    conversationId,
                    language
                })
            });
            
            return response;
        } catch (error) {
            console.error('Document analysis error:', error);
            throw error;
        }
    },

    sendDocument: async (file) => {
        // If you don't have an actual upload endpoint, you can simulate success
        // or use a different endpoint that can process the document content
        
        // For now, just return a success response
        return {
            success: true,
            message: "Document processed successfully"
        };
        
        // If you do have an endpoint that can analyze documents without storing them:
        /*
        const formData = new FormData();
        formData.append('document', file);
        
        const response = await fetch('https://your-api-endpoint/analyze-document', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authService.getToken()}`
            },
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to process document');
        }
        
        return await response.json();
        */
    }
    //this endpoint doesn't even exist 💀
};

export const documentsApi = {
    uploadDocument: async (file, name) => {
        // Log request details for debugging
        console.log('Uploading document:', {
            fileName: name,
            fileSize: file.size,
            fileType: file.type
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);

        try {
            const response = await fetchWithToken(
                '/api/documents',
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`
                    }
                },
                true
            );

            // Log successful response
            console.log('Upload response:', response);
            return response;
        } catch (error) {
            // Log error details
            console.error('Upload error details:', {
                status: error.status,
                message: error.message,
                response: error.response
            });
            throw error;
        }
    },
    
    // Document Editor API functions - using local storage until backend is ready
    saveDocument: async (document) => {
        try {
            // When backend is ready, this will be replaced with an API call
            // For now, use local storage via documentService
            return documentService.saveDocument(document);
        } catch (error) {
            console.error('Error saving document:', error);
            throw error;
        }
    },
    
    getDocument: async (documentId) => {
        try {
            // When backend is ready, this will be replaced with an API call
            // For now, use local storage via documentService
            const document = documentService.getDocument(documentId);
            
            if (!document) {
                throw new Error('Document not found');
            }
            
            return document;
        } catch (error) {
            console.error('Error getting document:', error);
            throw error;
        }
    },
    
    getDocuments: async () => {
        try {
            // When backend is ready, this will be replaced with an API call
            // For now, use local storage via documentService
            const documents = documentService.getDocuments();
            return { documents };
        } catch (error) {
            console.error('Error getting documents:', error);
            throw error;
        }
    },
    
    deleteDocument: async (documentId) => {
        try {
            // When backend is ready, this will be replaced with an API call
            // For now, use local storage via documentService
            return documentService.deleteDocument(documentId);
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    },
    
    getRevisions: async (documentId) => {
        try {
            // When backend is ready, this will be replaced with an API call
            // For now, use local storage via documentService
            return documentService.getRevisions(documentId);
        } catch (error) {
            console.error('Error getting revisions:', error);
            throw error;
        }
    },
    
    // AI Document Assistance API - placeholder until backend is ready
    getAIAssistance: async (prompt, content, selectedText = null) => {
        console.log('Getting AI assistance:', { prompt, selectedText });
        
        // Mock AI response with a delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (selectedText) {
            // If text is selected, return enhanced version of that text
            return {
                suggestion: `${selectedText} [AI-enhanced based on prompt: "${prompt}"]`
            };
        } else {
            // If no text is selected, return enhanced version of the entire content
            return {
                suggestion: `${content}\n\n[AI-enhanced based on prompt: "${prompt}"]`
            };
        }
    }
};

export const api = {
    login: async (credentials) => {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            // Update endpoint path
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Origin: window.location.origin
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
    }

    // Add other API methods here...
};
