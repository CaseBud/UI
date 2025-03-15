import { authService } from './authService';

// Local storage keys
const DOCUMENTS_KEY = 'ai_document_editor_documents';
const REVISIONS_KEY = 'ai_document_editor_revisions';

// Helper function to get user ID
const getUserId = () => {
    const user = authService.getCurrentUser();
    return user?.id || 'anonymous';
};

// Helper function to get documents from local storage
const getDocumentsFromStorage = () => {
    const userId = getUserId();
    const storedData = localStorage.getItem(`${DOCUMENTS_KEY}_${userId}`);
    return storedData ? JSON.parse(storedData) : [];
};

// Helper function to save documents to local storage
const saveDocumentsToStorage = (documents) => {
    const userId = getUserId();
    localStorage.setItem(`${DOCUMENTS_KEY}_${userId}`, JSON.stringify(documents));
};

// Helper function to get revisions from local storage
const getRevisionsFromStorage = (documentId) => {
    const userId = getUserId();
    const storedData = localStorage.getItem(`${REVISIONS_KEY}_${userId}_${documentId}`);
    return storedData ? JSON.parse(storedData) : [];
};

// Helper function to save revisions to local storage
const saveRevisionsToStorage = (documentId, revisions) => {
    const userId = getUserId();
    localStorage.setItem(`${REVISIONS_KEY}_${userId}_${documentId}`, JSON.stringify(revisions));
};

export const documentService = {
    // Get all documents for the current user
    getDocuments: () => {
        return getDocumentsFromStorage();
    },
    
    // Get a specific document by ID
    getDocument: (documentId) => {
        const documents = getDocumentsFromStorage();
        return documents.find(doc => doc.id === documentId);
    },
    
    // Create a new document or update an existing one
    saveDocument: (document) => {
        const documents = getDocumentsFromStorage();
        const now = new Date().toISOString();
        
        if (document.id) {
            // Update existing document
            const index = documents.findIndex(doc => doc.id === document.id);
            
            if (index !== -1) {
                const updatedDocument = {
                    ...documents[index],
                    title: document.title,
                    content: document.content,
                    updatedAt: now
                };
                
                documents[index] = updatedDocument;
                saveDocumentsToStorage(documents);
                
                // Add revision
                const revisions = getRevisionsFromStorage(document.id);
                const newRevision = {
                    id: Date.now(),
                    documentId: document.id,
                    title: document.title,
                    content: document.content,
                    timestamp: now,
                    user: authService.getCurrentUser()?.fullName || 'User'
                };
                
                saveRevisionsToStorage(document.id, [newRevision, ...revisions]);
                
                return updatedDocument;
            }
        }
        
        // Create new document
        const newDocument = {
            id: document.id || `doc_${Date.now()}`,
            title: document.title,
            content: document.content,
            createdAt: now,
            updatedAt: now,
            userId: getUserId()
        };
        
        documents.push(newDocument);
        saveDocumentsToStorage(documents);
        
        // Create initial revision
        const initialRevision = {
            id: Date.now(),
            documentId: newDocument.id,
            title: newDocument.title,
            content: newDocument.content,
            timestamp: now,
            user: authService.getCurrentUser()?.fullName || 'User'
        };
        
        saveRevisionsToStorage(newDocument.id, [initialRevision]);
        
        return newDocument;
    },
    
    // Delete a document
    deleteDocument: (documentId) => {
        const documents = getDocumentsFromStorage();
        const updatedDocuments = documents.filter(doc => doc.id !== documentId);
        saveDocumentsToStorage(updatedDocuments);
        
        // Remove revisions
        localStorage.removeItem(`${REVISIONS_KEY}_${getUserId()}_${documentId}`);
        
        return { success: true };
    },
    
    // Get revisions for a document
    getRevisions: (documentId) => {
        return getRevisionsFromStorage(documentId);
    }
};

export default documentService; 