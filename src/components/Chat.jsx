import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatApi } from '../utils/api';

const Chat = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const chatContainerRef = useRef(null);
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [deletingChat, setDeletingChat] = useState(null);
  const [deletingDocument, setDeletingDocument] = useState(null);

  // Add user initialization
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Use token directly from localStorage for API calls
  const token = localStorage.getItem('token');

  useEffect(() => {
    setMessages([{
      type: 'assistant',
      content: `Hello ${user?.fullName || 'there'}! I am CaseBud, your legal assistant. How can I help you today?`
    }]);

    // Retrieve conversation ID from localStorage if it exists
    const storedConversationId = localStorage.getItem('conversationId');
    if (storedConversationId) {
      setConversationId(storedConversationId);
    }
  }, [user]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Add conversation fetch effect
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const data = await chatApi.getConversations();
      setConversations(data.conversations);
    } catch (error) {
      if (error.status === 401) {
        handleLogout();
      }
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);
    
    const validFiles = uploadedFiles.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      const maxSize = 10 * 1024 * 1024; // 10MB limit
      
      if (!validTypes.includes(file.type)) {
        setMessages(prev => [...prev, {
          type: 'error',
          content: `${file.name} is not a supported file type. Please upload PDF, DOC, DOCX, or TXT files.`
        }]);
        return false;
      }
      
      if (file.size > maxSize) {
        setMessages(prev => [...prev, {
          type: 'error',
          content: `${file.name} is too large. Maximum file size is 10MB.`
        }]);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      if (!token) throw new Error('Please log in to upload documents');

      // Upload files one by one
      const uploadedDocs = await Promise.all(validFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name);

        const response = await fetch('https://case-bud-backend.onrender.com/api/documents', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to upload ${file.name}`);
        }

        const data = await response.json();
        return {
          id: data.id,
          name: file.name,
          size: file.size,
          type: file.type
        };
      }));

      setFiles(prev => [...prev, ...uploadedDocs]);

      setMessages(prev => [...prev, {
        type: 'assistant',
        content: `Successfully uploaded ${uploadedDocs.length} document(s). You can now ask questions about them.`
      }]);

    } catch (error) {
      console.error('Upload error:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: error.message || 'Failed to upload documents. Please try again.'
      }]);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleTokenError = (error) => {
    if (error.message.includes('token') || error.message.includes('unauthorized')) {
      handleLogout();
      return true;
    }
    return false;
  };

  const sendMessage = async (content) => {
    if (!content.trim() || isAnalyzing) return;

    try {
      setIsAnalyzing(true);
      setMessages(prev => [...prev, { type: 'user', content }]);

      const data = await chatApi.sendMessage(
        content,
        files.length > 0 ? files.map(file => file.id) : null
      );

      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
        localStorage.setItem('conversationId', data.conversationId);
      }

      setMessages(prev => [...prev, {
        type: 'assistant',
        content: data.response || data.message
      }]);
      
      setMessage('');
    } catch (error) {
      if (error.status === 401) {
        handleLogout();
      } else {
        setMessages(prev => [...prev, {
          type: 'error',
          content: error.message
        }]);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setConversationId(conversation.id);
    // Load conversation messages here if needed
  };

  const startNewChat = () => {
    setSelectedConversation(null);
    setConversationId(null);
    setMessages([{
      type: 'assistant',
      content: `Hello ${user?.fullName || 'there'}! I am CaseBud, your legal assistant. How can I help you today?`
    }]);
  };

  const handleDeleteChat = async (conversationId) => {
    try {
      if (!token) {
        handleLogout();
        return;
      }

      const response = await fetch(`https://case-bud-backend.onrender.com/api/chat/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error('Failed to delete conversation');

      // Remove from conversations list
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      // If the deleted conversation was selected, start a new chat
      if (selectedConversation?.id === conversationId) {
        startNewChat();
      }

      setDeletingChat(null);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      if (!token) {
        handleLogout();
        return;
      }

      const response = await fetch(`https://case-bud-backend.onrender.com/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error('Failed to delete document');

      // Remove from files list
      setFiles(prev => prev.filter(file => file.id !== documentId));
      setDeletingDocument(null);

      setMessages(prev => [...prev, {
        type: 'assistant',
        content: 'Document deleted successfully.'
      }]);
    } catch (error) {
      console.error('Failed to delete document:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Failed to delete document. Please try again.'
      }]);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 border-r border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex h-full flex-col">
          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={startNewChat}
              className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>New Chat</span>
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-4">
            {loadingHistory ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center text-sm text-slate-400">
                No previous conversations
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <div key={conv.id} className="relative group">
                    <button
                      onClick={() => handleConversationSelect(conv)}
                      className={`w-full rounded-lg p-3 text-left transition-colors ${
                        selectedConversation?.id === conv.id
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <div className="text-sm font-medium truncate">
                        {conv.title || 'Chat ' + conv.id}
                      </div>
                      <div className="mt-1 text-xs truncate opacity-75">
                        {new Date(conv.createdAt).toLocaleDateString()}
                      </div>
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingChat(conv.id);
                      }}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full
                        ${selectedConversation?.id === conv.id ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-slate-200'}
                        opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="border-t border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.fullName?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-slate-300">{user?.fullName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header with user info */}
        <div className="bg-slate-800/50 backdrop-blur-sm px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="animate-slideIn">
                <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-slate-100 tracking-tight">
                CaseBud Legal Assistant
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-300">{user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-slate-700 p-2 text-slate-300 hover:bg-slate-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mode Indicator */}
        <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-slate-400">
              {files.length > 0 ? 'Document Analysis Mode' : 'General Legal Chat'}
            </span>
            {files.length > 0 && (
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            )}
          </div>
        </div>

        {/* Add Document List */}
        {files.length > 0 && (
          <div className="animate-fadeUp bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50">
            <div className="px-4 py-2">
              <h3 className="text-sm font-medium text-slate-300">Uploaded Documents</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="group flex items-center rounded-lg bg-slate-700 px-3 py-1"
                  >
                    <span className="text-sm text-slate-300">{file.name}</span>
                    <button
                      onClick={() => setDeletingDocument(file)}
                      className="ml-2 rounded-full p-1 text-slate-400 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-slate-900/50 to-slate-800/50">
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} message-bubble`}>
                <div className={`max-w-2xl rounded-2xl px-6 py-3 shadow-lg ${
                  msg.type === 'user' ? 'bg-blue-600 shadow-blue-500/20' : 
                  msg.type === 'error' ? 'bg-red-500 shadow-red-500/20' : 
                  'bg-slate-700/50 backdrop-blur-sm shadow-slate-900/20'
                }`}>
                  <p className="text-slate-100 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isAnalyzing && (
              <div className="flex justify-start animate-fadeUp">
                <div className="flex items-center space-x-2 rounded-2xl bg-slate-700/50 backdrop-blur-sm px-6 py-3 shadow-lg">
                  <div className="flex space-x-1">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                  <span className="text-sm text-slate-300">Analyzing...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="flex-1 space-y-4">
                {/* File Upload */}
                <div className="flex items-center space-x-2">
                  <label className="hover-scale flex items-center space-x-2 cursor-pointer">
                    <span className="rounded-lg bg-slate-700 p-2 text-slate-300 hover:bg-slate-600 transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </span>
                    <span className="text-sm text-slate-400">Upload Documents</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.txt"
                      disabled={uploading || isAnalyzing}
                    />
                  </label>
                  {uploading && (
                    <span className="text-sm text-slate-400 flex items-center">
                      <svg className="animate-spin h-4 w-4 mr-2 text-blue-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Uploading...
                    </span>
                  )}
                </div>

                {/* Message Input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={files.length > 0 
                      ? "Ask about your documents..."
                      : "Ask any legal question..."}
                    className="flex-1 rounded-2xl border border-slate-600/50 bg-slate-700/50 backdrop-blur-sm px-6 py-3 
                      text-slate-100 placeholder-slate-400 transition-all duration-200
                      focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    disabled={isAnalyzing || uploading}
                  />
                  <button 
                    type="submit"
                    disabled={isAnalyzing || uploading || !message.trim()}
                    className="hover-scale rounded-full bg-blue-600 p-3 text-white transition-all duration-200 
                      hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="animate-fadeUp w-full max-w-sm rounded-2xl bg-slate-800 p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-medium text-slate-100">Delete Conversation?</h3>
            <p className="mb-6 text-sm text-slate-400">
              This action cannot be undone. Are you sure you want to delete this conversation?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingChat(null)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteChat(deletingChat)}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Delete Confirmation Modal */}
      {deletingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="animate-fadeUp w-full max-w-sm rounded-2xl bg-slate-800 p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-medium text-slate-100">Delete Document?</h3>
            <p className="mb-2 text-sm text-slate-400">
              Are you sure you want to delete this document?
            </p>
            <p className="mb-6 text-sm font-medium text-slate-300">
              {deletingDocument.name}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingDocument(null)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteDocument(deletingDocument.id)}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;