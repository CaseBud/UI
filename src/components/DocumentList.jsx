import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentsApi } from '../utils/api';

const DocumentList = () => {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        setIsLoading(true);
        try {
            const response = await documentsApi.getDocuments();
            setDocuments(response.documents || []);
        } catch (error) {
            console.error('Failed to load documents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateNew = () => {
        navigate('/document-editor', {
            state: {
                initialContent: '<h1>New Document</h1><p>Start writing here...</p>',
                initialTitle: 'New Document'
            }
        });
    };

    const handleOpenDocument = (documentId) => {
        navigate(`/document-editor?id=${documentId}`);
    };

    const handleDeleteDocument = async (documentId) => {
        try {
            await documentsApi.deleteDocument(documentId);
            setDocuments(documents.filter(doc => doc.id !== documentId));
            setShowDeleteConfirm(null);
        } catch (error) {
            console.error('Failed to delete document:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-slate-900 to-slate-800">
            {/* Header */}
            <div className="flex items-center h-14 px-4 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/chat')}
                        className="p-2 hover:bg-slate-700/50 rounded-lg"
                        title="Back to Chat"
                    >
                        <svg
                            className="w-5 h-5 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                    </button>

                    <h1 className="text-lg font-semibold text-white">My Documents</h1>
                </div>

                <div className="flex-1 flex justify-end">
                    <button
                        onClick={handleCreateNew}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                    >
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        <span>New Document</span>
                    </button>
                </div>
            </div>

            {/* Document List */}
            <div className="flex-1 overflow-auto p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <svg
                            className="animate-spin h-8 w-8 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-20 h-20 mb-4 text-slate-600">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M9 17h6" />
                                <path d="M9 13h6" />
                                <path d="M9 9h6" />
                                <path d="M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">No documents yet</h2>
                        <p className="text-slate-400 max-w-md mb-6">
                            Create your first document to start using the AI-assisted document editor.
                        </p>
                        <button
                            onClick={handleCreateNew}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Create New Document
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documents.map((document) => (
                            <div
                                key={document.id}
                                className="bg-slate-800 border border-slate-700/50 rounded-lg overflow-hidden hover:border-slate-600/50 transition-colors"
                            >
                                <div
                                    className="p-4 cursor-pointer"
                                    onClick={() => handleOpenDocument(document.id)}
                                >
                                    <h3 className="text-lg font-medium text-white mb-2 truncate">
                                        {document.title || 'Untitled Document'}
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                        {document.content
                                            ? document.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
                                            : 'No content'}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>Created: {formatDate(document.createdAt)}</span>
                                        <span>Updated: {formatDate(document.updatedAt)}</span>
                                    </div>
                                </div>
                                <div className="flex border-t border-slate-700/50">
                                    <button
                                        onClick={() => handleOpenDocument(document.id)}
                                        className="flex-1 py-2 text-center text-slate-300 hover:bg-slate-700/50 transition-colors text-sm"
                                    >
                                        Open
                                    </button>
                                    <div className="w-px bg-slate-700/50"></div>
                                    <button
                                        onClick={() => setShowDeleteConfirm(document.id)}
                                        className="flex-1 py-2 text-center text-red-400 hover:bg-slate-700/50 transition-colors text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                                
                                {/* Delete Confirmation */}
                                {showDeleteConfirm === document.id && (
                                    <div className="p-3 bg-red-900/20 border-t border-red-500/30">
                                        <p className="text-sm text-red-300 mb-2">
                                            Are you sure you want to delete this document?
                                        </p>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleDeleteDocument(document.id)}
                                                className="flex-1 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(null)}
                                                className="flex-1 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-xs"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentList; 