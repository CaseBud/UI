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
        
        if (!message || !message.trim()) {
            throw new ApiError('Query is required', 400);
        }

        try {
            // Using the correct endpoint path
            const response = await fetchWithToken('/api/chat/standard-conversation', {
                method: 'POST',
                body: JSON.stringify({
                    query: message,
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

    getConversation: async (conversationId) => {
        try {
            const response = await fetchWithToken(`/api/chat/${conversationId}`);
            
            if (!response) {
                throw new Error('No data received from server');
            }
            
            return {
                messages: response.messages || [],
                title: response.title,
                id: response._id || response.id
            };
            
        } catch (error) {
            console.error('Error in getConversation:', error);
            throw error;
        }
    },
    deleteConversation: () => Promise.resolve(),
    updateConversationTitle: () => Promise.resolve(),
    uploadDocument: () => Promise.resolve({ id: Date.now() }),
    sendDocumentAnalysis: (query) => chatApi.sendMessage(query),

    sendDocumentAnalysis: async (query, documentIds, conversationId = null, language = 'en-US') => {
        try {
            const endpoint = '/api/chat/document-analysis';
            
            // Ensure documentIds is an array and contains valid values
            const validDocIds = Array.isArray(documentIds) 
                ? documentIds.filter(id => id && typeof id === 'string' || typeof id === 'number')
                : [];
            
            if (!validDocIds.length) {
                console.error('No valid document IDs provided:', documentIds);
                throw new ApiError('No valid documents selected. Please upload a document first.', 400);
            }

            console.log('Sending document analysis with IDs:', validDocIds);

            const requestBody = {
                query: query.trim(),
                documentIds: validDocIds
            };

            if (conversationId) {
                requestBody.conversationId = conversationId;
            }

            const response = await fetchWithToken(endpoint, {
                method: 'POST',
                body: JSON.stringify(requestBody)
            });
            
            if (!response || (!response.response && !response.message)) {
                throw new ApiError('Invalid response from server', 500);
            }

            return {
                response: response.response || response.message,
                conversationId: response.conversationId,
                documents: response.documents || []
            };
        } catch (error) {
            console.error('Document analysis error:', error);
            throw error;
        }
    },

    sendDocument: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('name', file.name);

            const response = await fetchWithToken('/api/documents', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`
                }
            }, true);

            // Ensure response format is handled correctly
            if (response?.status !== 'success' || !response?.data?.document) {
                console.error('Invalid response format:', response);
                throw new Error('No document ID in response');
            }

            const documentData = {
                _id: response.data.document._id,
                name: file.name,
                type: file.type,
                size: file.size
            };

            return {
                success: true,
                message: "Document uploaded successfully",
                data: {
                    document: documentData
                },
                conversationId: response.data.document.conversationId || null
            };

        } catch (error) {
            console.error('Document upload error details:', error);
            throw new ApiError(error.message || 'Failed to upload document', error.status || 500);
        }
    },

    // Add new OCR method
    performOCR: async (file) => {
        try {
            if (!file.type.startsWith('image/')) {
                throw new Error('File must be an image');
            }

            // Compress the image if it's too large
            if (file.size > 5000000) { // 5MB
                const compressedFile = await compressImage(file);
                file = compressedFile;
            }

            const text = await ocrService.extractText(file);
            
            if (!text.trim()) {
                throw new Error('No text could be extracted from the image');
            }

            return {
                success: true,
                text: text,
                file: {
                    name: file.name,
                    type: file.type,
                    size: file.size
                }
            };
        } catch (error) {
            console.error('OCR error:', error);
            throw new ApiError(error.message || 'Failed to perform OCR', 500);
        }
    }
};

export const documentsApi = {
    uploadDocument: async (file, name) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', name || file.name);

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

            return {
                success: true,
                data: {
                    document: {
                        _id: response.documentId || response._id,
                        name: name || file.name,
                        type: file.type,
                        size: file.size
                    }
                }
            };
        } catch (error) {
            console.error('Upload error details:', error);
            throw new ApiError('Failed to upload document. Please try again.', error.status || 500);
        }
    },
    
    // Document Editor API functions - using local storage until backend is ready
    saveDocument: async (document) => {
        try {
            // Validate document data
            if (!document.content) {
                throw new Error('Document content is required');
            }

            // When backend is ready, this will be replaced with an API call
            const savedDoc = documentService.saveDocument({
                ...document,
                title: document.title || 'Untitled Document',
                updatedAt: new Date().toISOString()
            });

            return {
                success: true,
                id: savedDoc.id,
                message: 'Document saved successfully'
            };
        } catch (error) {
            console.error('Error saving document:', error);
            throw new ApiError('Failed to save document: ' + error.message, 500);
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
