import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { documentsApi, chatApi } from '../utils/api';
import DocumentToolbar from './DocumentToolbar';
import RichTextEditor from './RichTextEditor';
import AIPromptPanel from './AIPromptPanel';
import RevisionHistory from './RevisionHistory';
import TypingAnimation from './TypingAnimation'; // Import TypingAnimation component
import debounce from 'lodash/debounce'; // Correct lodash import
import AICommentPanel from './AICommentPanel';

const DocumentEditor = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getCurrentUser();
    const [documentId, setDocumentId] = useState(null);
    const [documentContent, setDocumentContent] = useState('');
    const [documentTitle, setDocumentTitle] = useState('Untitled Document');
    const [selectedText, setSelectedText] = useState('');
    const [selectionRange, setSelectionRange] = useState(null);
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showRevisionHistory, setShowRevisionHistory] = useState(false);
    const [revisions, setRevisions] = useState([]);
    const [isSaved, setIsSaved] = useState(true);
    const editorRef = useRef(null);
    const lastSavedRef = useRef(documentContent);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [aiComments, setAiComments] = useState([]);
    const [wsConnection, setWsConnection] = useState(null);
    const [aiMode, setAiMode] = useState('realtime'); // 'realtime' or 'manual'

    // Load document if ID is provided in URL or use initial content from navigation state
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        
        if (id) {
            setDocumentId(id);
            loadDocument(id);
            loadRevisions(id);
        } else if (location.state?.initialContent) {
            initializeContent(location.state.initialContent);
            if (location.state.initialTitle) {
                setDocumentTitle(location.state.initialTitle);
            }
        }
    }, [location]);

    // Auto-save timer
    useEffect(() => {
        let autoSaveTimer;
        
        if (documentContent !== lastSavedRef.current) {
            autoSaveTimer = setTimeout(() => {
                saveDocument();
            }, 30000); // Auto-save after 30 seconds of no changes
        }
        
        return () => {
            if (autoSaveTimer) {
                clearTimeout(autoSaveTimer);
            }
        };
    }, [documentContent, documentId, documentTitle]);

    // Track changes for the "saved" indicator
    useEffect(() => {
        setIsSaved(documentContent === lastSavedRef.current);
    }, [documentContent]);

    const loadDocument = async (id) => {
        setIsProcessing(true);
        try {
            const document = await documentsApi.getDocument(id);
            setDocumentTitle(document.title);
            setDocumentContent(document.content);
            lastSavedRef.current = document.content;
            setIsSaved(true);
        } catch (error) {
            console.error('Failed to load document:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const loadRevisions = async (id) => {
        try {
            const revisionsList = await documentsApi.getRevisions(id);
            setRevisions(revisionsList);
        } catch (error) {
            console.error('Failed to load revisions:', error);
        }
    };

    const handleContentChange = (newContent) => {
        setDocumentContent(newContent);
        debouncedAIAnalysis(newContent);
    };

    const handleTitleChange = (e) => {
        setDocumentTitle(e.target.value);
        setIsSaved(false);
    };

    const handleTextSelection = (text, range) => {
        // Only update selection if there's actually text selected
        if (text && text.trim()) {
            setSelectedText(text);
            setSelectionRange(range);
        } else {
            setSelectedText('');
            setSelectionRange(null);
        }
    };

    const saveDocument = async () => {
        if (!documentContent.trim()) {
            return; // Don't save empty documents
        }
        
        setIsProcessing(true);
        try {
            const response = await documentsApi.saveDocument({
                id: documentId,
                title: documentTitle || 'Untitled Document',
                content: documentContent
            });
            
            // Update document ID if this is a new document
            if (!documentId && response?.id) {
                setDocumentId(response.id);
                // Update URL with the new document ID
                navigate(`/document-editor?id=${response.id}`, { replace: true });
            }
            
            lastSavedRef.current = documentContent;
            setIsSaved(true);
            
            // Reload revisions after saving
            if (response?.id) {
                await loadRevisions(response.id);
            }
        } catch (error) {
            console.error('Failed to save document:', error);
            // TODO: Add error notification to user
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAIPrompt = async (prompt) => {
        setIsProcessing(true);
        try {
            const response = await chatApi.sendMessage(prompt);
            setAiSuggestion(response.response);
        } catch (error) {
            console.error('Failed to process AI prompt:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const applyAISuggestion = () => {
        if (!aiSuggestion) return;
        
        try {
            if (selectedText && selectionRange) {
                // Get current content from editor
                const currentContent = editorRef.current.getContent();
                
                // Apply suggestion to selected text only
                const beforeSelection = currentContent.substring(0, selectionRange.start);
                const afterSelection = currentContent.substring(selectionRange.end);
                const newContent = beforeSelection + aiSuggestion + afterSelection;
                
                // Update editor content
                editorRef.current.setContent(newContent);
                setDocumentContent(newContent);
            } else {
                // Apply suggestion to entire document
                editorRef.current.setContent(aiSuggestion);
                setDocumentContent(aiSuggestion);
            }
            
            // Clear the suggestion after applying
            setAiSuggestion('');
            setIsSaved(false);
        } catch (error) {
            console.error('Failed to apply AI suggestion:', error);
        }
    };

    const exportDocument = (format) => {
        // This is a placeholder for document export functionality
        const element = document.createElement('a');
        
        if (format === 'txt') {
            const file = new Blob([documentContent.replace(/<[^>]*>/g, '')], {type: 'text/plain'});
            element.href = URL.createObjectURL(file);
            element.download = `${documentTitle}.txt`;
        } else if (format === 'html') {
            const file = new Blob([`<html><head><title>${documentTitle}</title></head><body>${documentContent}</body></html>`], {type: 'text/html'});
            element.href = URL.createObjectURL(file);
            element.download = `${documentTitle}.html`;
        }
        
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const restoreRevision = (revision) => {
        setDocumentContent(revision.content);
        setDocumentTitle(revision.title);
        setIsSaved(false);
        setShowRevisionHistory(false);
    };

    // Add this function to handle content initialization
    const initializeContent = (content) => {
        if (!content) return;
        
        try {
            // Update editor content
            if (editorRef.current) {
                editorRef.current.setContent(content);
            }
            setDocumentContent(content);
            lastSavedRef.current = content;
            setIsSaved(true);
        } catch (error) {
            console.error('Failed to initialize content:', error);
        }
    };

    // Initialize WebSocket connection
    useEffect(() => {
        const ws = new WebSocket('your_websocket_url');
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'suggestion') {
                handleRealtimeAISuggestion(data.content);
            } else if (data.type === 'comment') {
                setAiComments(prev => [...prev, data.content]);
            }
        };
        
        setWsConnection(ws);
        return () => ws.close();
    }, []);

    // Debounced function for sending content to AI
    const debouncedAIAnalysis = useRef(
        debounce((content) => {
            if (aiMode === 'realtime' && wsConnection?.readyState === WebSocket.OPEN) {
                wsConnection.send(JSON.stringify({
                    type: 'analyze',
                    content: content
                }));
            }
        }, 1000)
    ).current;

    const handleRealtimeAISuggestion = (suggestion) => {
        setAiSuggestions(prev => [...prev, {
            id: Date.now(),
            content: suggestion,
            applied: false
        }]);
    };

    const applySuggestion = (suggestionId) => {
        const suggestion = aiSuggestions.find(s => s.id === suggestionId);
        if (suggestion && editorRef.current) {
            // Apply the suggestion to the editor
            editorRef.current.applySuggestion(suggestion.content);
            // Mark suggestion as applied
            setAiSuggestions(prev => 
                prev.map(s => s.id === suggestionId ? { ...s, applied: true } : s)
            );
        }
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

                    <button
                        onClick={() => navigate('/documents')}
                        className="p-2 hover:bg-slate-700/50 rounded-lg"
                        title="My Documents"
                    >
                        <svg
                            className="w-5 h-5 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <path d="M14 2v6h6" />
                            <path d="M16 13H8" />
                            <path d="M16 17H8" />
                            <path d="M10 9H8" />
                        </svg>
                    </button>

                    <div className="flex items-center">
                        <input
                            type="text"
                            value={documentTitle}
                            onChange={handleTitleChange}
                            className="bg-transparent text-white border-b border-transparent hover:border-slate-600 focus:border-blue-500 focus:outline-none px-2 py-1 text-lg font-medium"
                        />
                        <span className="ml-2 text-xs text-slate-400">
                            {isSaved ? 'Saved' : 'Unsaved'}
                        </span>
                    </div>
                </div>

                <div className="flex-1 flex justify-end items-center space-x-2">
                    <DocumentToolbar 
                        onSave={saveDocument}
                        onExport={exportDocument}
                        onViewHistory={() => setShowRevisionHistory(true)}
                        isSaving={isProcessing}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Document Editor - Left Side */}
                <div className="flex-1 overflow-auto bg-slate-900 p-4">
                    <div className="max-w-4xl mx-auto bg-slate-800 rounded-lg shadow-lg border border-slate-700/50 min-h-full">
                        <RichTextEditor
                            ref={editorRef}
                            content={documentContent}
                            onChange={handleContentChange}
                            onSelect={handleTextSelection}
                            aiSuggestions={aiSuggestions}
                        />
                    </div>
                </div>

                {/* AI Panels - Right Side */}
                <div className="w-80 border-l border-slate-700/50 bg-slate-800/50 backdrop-blur-sm overflow-y-auto">
                    <div className="flex flex-col h-full">
                        <AIPromptPanel
                            onSubmitPrompt={handleAIPrompt}
                            aiSuggestion={aiSuggestion}
                            onApplySuggestion={applyAISuggestion}
                            isProcessing={isProcessing}
                            selectedText={selectedText}
                            aiMode={aiMode}
                            onAIModeChange={setAiMode}
                        />
                        
                        {/* AI Suggestions Panel */}
                        <div className="border-t border-slate-700/50 p-4">
                            <h3 className="text-slate-200 font-medium mb-2">AI Suggestions</h3>
                            {aiSuggestions.map(suggestion => (
                                <div 
                                    key={suggestion.id}
                                    className="mb-2 p-2 bg-slate-700/30 rounded"
                                >
                                    <p className="text-sm text-slate-300">{suggestion.content}</p>
                                    {!suggestion.applied && (
                                        <button
                                            onClick={() => applySuggestion(suggestion.id)}
                                            className="mt-1 text-xs text-blue-400 hover:text-blue-300"
                                        >
                                            Apply Suggestion
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* AI Comments Panel */}
                        <AICommentPanel comments={aiComments} />
                    </div>
                </div>
            </div>

            {/* Revision History Modal */}
            {showRevisionHistory && (
                <RevisionHistory
                    revisions={revisions}
                    onClose={() => setShowRevisionHistory(false)}
                    onRestore={restoreRevision}
                />
            )}
        </div>
    );
};

export default DocumentEditor;