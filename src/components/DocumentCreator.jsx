import React, { useState } from 'react';

const DocumentCreator = ({ onDocumentCreate, onCancel }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [documentType, setDocumentType] = useState('text');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const documentTypes = [
        { id: 'text', label: 'Text Document' },
        { id: 'report', label: 'Report' },
        { id: 'summary', label: 'Summary' },
        { id: 'letter', label: 'Letter' },
        { id: 'email', label: 'Email Template' }
    ];
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim()) {
            alert('Please enter a document title');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // In a real implementation, this would send the document to the backend
            // For now, we'll simulate a response
            setTimeout(() => {
                const newDocument = {
                    id: `doc-${Date.now()}`,
                    title,
                    content,
                    type: documentType,
                    createdAt: new Date().toISOString()
                };
                
                onDocumentCreate(newDocument);
                setIsSubmitting(false);
            }, 1000);
            
            // The real implementation would look like this:
            /*
            const response = await fetchWithToken('/api/documents', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    content,
                    type: documentType
                })
            });
            
            if (response.status === 'success' && response.data) {
                onDocumentCreate(response.data);
            }
            */
        } catch (error) {
            console.error('Error creating document:', error);
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Create New Document</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
                        Document Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter document title"
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="documentType" className="block text-sm font-medium text-slate-300 mb-1">
                        Document Type
                    </label>
                    <select
                        id="documentType"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {documentTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-1">
                        Content
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
                        placeholder="Enter document content"
                    />
                </div>
                
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors flex items-center space-x-2 ${
                            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="animate-spin h-4 w-4 text-white"
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
                                <span>Creating...</span>
                            </>
                        ) : (
                            <span>Create Document</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DocumentCreator; 