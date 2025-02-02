import React, { useState, useRef, useEffect } from 'react';
import { chatApi } from '../utils/api';
import { authService } from '../services/authService';
import Sidebar from './Sidebar';
import ChatHistory from './ChatHistory';
import TypingAnimation from './TypingAnimation';  // Ensure this import is correct
import DocumentUploader from './DocumentUploader';
import DocumentPreview from './DocumentPreview';
import VoiceChat from './VoiceChat';

// Replace lucide-react imports with SVG components
const IconComponents = {
  MessageCircle: (props) => (
    <svg className="h-6 w-6 text-black-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
  ),
  Send: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
    </svg>
  ),
  User: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Loader2: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  )
};


const Chat = () => {
  const user = authService.getCurrentUser();
  const defaultGreeting = `Hello ${user?.name || ''}! How can I help you today?`;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([{
    type: 'assistant',
    content: defaultGreeting
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentconversationId, setCurrentconversationId] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isNewConversation, setIsNewConversation] = useState(true);
  const [isIncognito, setIsIncognito] = useState(false); // Add incognito mode state

  useEffect(() => {
    if (!isIncognito) {
      fetchConversations();
      // Set up periodic refresh every 30 seconds
      const refreshInterval = setInterval(fetchConversations, 30000);
      return () => clearInterval(refreshInterval);
    }
  }, [isIncognito]);

  const fetchConversations = async () => {
    try {
      const conversations = await chatApi.getConversations();
      setConversations(conversations);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      // Optionally show error notification to user
    }
  };

  const handleSelectChat = async (conversationId) => {
    if (isIncognito) return; // Disable chat selection in incognito mode

    try {
      const conversation = await chatApi.getConversationById(conversationId);
      setMessages(conversation.messages);
      setCurrentconversationId(conversationId);
      setIsNewConversation(false);
    } catch (error) {
      console.error('Failed to fetch chat:', error);
      // Show error message to user
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Failed to load conversation. Please try again.',
        timestamp: new Date()
      }]);
    }
  };

  const handleDeleteChat = async (conversationId) => {
    if (isIncognito) return; // Disable chat deletion in incognito mode

    try {
      await fetch(`https://case-bud-backend-bzgqfka6daeracaj.centralus-01.azurewebsites.net/api/chat/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`
        }
      });
      setConversations(prev => prev.filter(chat => chat.id !== conversationId));
      if (currentconversationId === conversationId) {
        setMessages([]);
        setCurrentconversationId(null);
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const handleEditTitle = async (conversationId, newTitle) => {
    if (isIncognito) return; // Disable chat title editing in incognito mode

    try {
      await fetch(`https://case-bud-backend-bzgqfka6daeracaj.centralus-01.azurewebsites.net/api/chat/${conversationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authService.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle })
      });
      setConversations(prev => prev.map(chat => 
        chat.id === conversationId ? { ...chat, title: newTitle } : chat
      ));
    } catch (error) {
      console.error('Failed to update chat title:', error);
    }
  };

  // Helper function to simulate typing and show response gradually
  const showResponseGradually = async (response) => {
    setIsTyping(true);
    const characters = response.split('');
    let currentText = '';
    const charDelay = 15; // Decrease for faster typing
    const variation = 10; // Decrease for less variation in typing speed
    
    try {
      for (let i = 0; i < characters.length; i++) {
        await new Promise(resolve => setTimeout(resolve, charDelay));
        await new Promise(resolve => setTimeout(resolve, Math.random() * variation));
        
        currentText += characters[i];
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: currentText,
            timestamp: new Date()
          };
          return newMessages;
        });

        // Add slight pause at punctuation marks
        if (['.', '?', '!', ',', ';'].includes(characters[i])) {
          await new Promise(resolve => setTimeout(resolve, 75)); // Decrease pause duration
        }
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleDocumentSelect = (docId) => {
    if (isIncognito) return; // Disable document selection in incognito mode

    setSelectedDocuments(prev => {
      const isSelected = prev.includes(docId);
      return isSelected ? prev.filter(id => id !== docId) : [...prev, docId];
    });
  };

  const handleUploadComplete = (document) => {
    if (isIncognito) return;

    setUploadedDocuments(prev => [...prev, document]);
    // Add a system message with the uploaded document
    setMessages(prev => [...prev, {
      type: 'system',
      content: `Document uploaded successfully`,
      document: document,
      timestamp: new Date()
    }]);
  };

  // Ensure document analysis chat sets conversationId to null when starting a new document chat
  const handleDocumentAnalysis = async (query, documentIds) => {
    if (isIncognito) return; // Disable document analysis in incognito mode

    try {
      setCurrentconversationId(null); // Reset conversationId for new document chat
      const response = await chatApi.sendDocumentAnalysis(query, documentIds);
      await showResponseGradually(response.response || 'No response received');
    } catch (error) {
      console.error('Document analysis error:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: error.message || 'Failed to analyze document. Please try again.',
        timestamp: new Date()
      }]);
    }
  };

  const sendMessage = async (content) => {
    if (!content?.trim() || isTyping) return;

    const newUserMessage = { type: 'user', content, timestamp: new Date() };

    try {
      setMessages(prev => [...prev, newUserMessage]);
      setMessage('');
      setIsTyping(true); // Start typing animation immediately

      // Add empty assistant message that will be filled gradually
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: '',
        timestamp: new Date()
      }]);

      const response = await chatApi.sendMessage(content.trim(), { 
        conversationId: currentconversationId 
      });

      if (isNewConversation && response.conversationId) {
        setCurrentconversationId(response.conversationId);
        setIsNewConversation(false);
      }

      await showResponseGradually(response.response || 'No response received');

    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false); // Ensure typing animation stops on error
      setMessages(prev => [...prev, {
        type: 'error',
        content: error.message || 'Failed to send message. Please try again.',
        timestamp: new Date()
      }]);
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

  const handleSelectPrompt = (promptText) => {
    setMessage(promptText);
    inputRef.current?.focus();
  };

  const createNewChat = async () => {
    if (isIncognito) return; // Disable new chat creation in incognito mode

    try {
      // First, save the current chat if it exists and has messages
      if (messages.length > 1) { // More than just the initial greeting
        const title = messages.find(m => m.type === 'user')?.content?.slice(0, 40) + '...' || 'New Chat';
        
        await chatApi.createNewChat(title, messages);
        await fetchConversations(); // Refresh the conversation list
      }

      // Reset current chat state
      setMessages([{
        type: 'assistant',
        content: defaultGreeting,
        timestamp: new Date()
      }]);
      setCurrentconversationId(null);
      setIsNewConversation(true);
      setMessage('');
      setSelectedDocuments([]);
      
      if (window.innerWidth < 768) {
        setIsHistoryOpen(false);
      }
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  // Replace the existing handleNewChat with createNewChat
  const handleNewChat = createNewChat;

  const handleVoiceInput = (text) => {
    // This will be implemented when the backend is ready
    setMessage(text);
  };

  const toggleIncognitoMode = () => {
    setIsIncognito(!isIncognito);
    if (!isIncognito) {
      // Clear current chat state when entering incognito mode
      setMessages([{
        type: 'assistant',
        content: defaultGreeting,
        timestamp: new Date()
      }]);
      setCurrentconversationId(null);
      setIsNewConversation(true);
      setMessage('');
      setSelectedDocuments([]);
      setUploadedDocuments([]);
    }
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.type === 'user';
    const isError = message.type === 'error';
    const isSystem = message.type === 'system';

    return (
      <div className={`flex items-end space-x-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <IconComponents.MessageCircle className="w-5 h-5 text-white" />
          </div>
        )}
        
        <div className={`max-w-2xl rounded-2xl px-4 py-2 ${
          isUser 
            ? 'bg-blue-600 text-white ml-12'
            : isError
            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
            : isSystem
            ? 'bg-slate-600/50 text-slate-200'
            : 'bg-slate-700/50 backdrop-blur-sm text-slate-100'
        }`}>
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          
          {/* Document Preview */}
          {message.document && (
            <DocumentPreview document={message.document} />
          )}
          
          {message.timestamp && (
            <p className="text-xs opacity-70 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </p>
          )}
        </div>

        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
            <IconComponents.User className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Import Sidebar */}
      <Sidebar 
        user={user} 
        onSelectPrompt={handleSelectPrompt}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <svg className="h-6 w-6 text-black-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Legal Assistant</h1>
              <p className="text-sm text-slate-400">AI-powered legal research and analysis</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleIncognitoMode}
              className={`ml-4 p-2 rounded-lg ${isIncognito ? 'bg-red-600' : 'bg-slate-700/50'} hover:bg-slate-600/50 transition-colors`}
            >
              {isIncognito ? 'Exit Incognito' : 'Incognito Mode'}
            </button>
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="ml-4 p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, index) => (
              <MessageBubble 
                key={`${msg.type}-${index}-${msg.timestamp?.getTime()}`}
                message={msg}
              />
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <IconComponents.MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="rounded-2xl bg-slate-700/50 backdrop-blur-sm px-4 py-2">
                  <TypingAnimation />
                </div>
              </div>
            )}
            <div ref={chatContainerRef} /> {/* Scroll anchor */}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask any legal question..."
                    className="w-full rounded-lg pl-4 pr-24 py-3 bg-slate-700/50 border border-slate-600/50 
                             text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 
                             focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    disabled={isTyping}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                    <VoiceChat 
                      onVoiceInput={handleVoiceInput}
                      disabled={isTyping}
                    />
                    <DocumentUploader 
                      onDocumentSelect={handleDocumentSelect} 
                      onUploadComplete={handleUploadComplete}
                    />
                    <button 
                      type="submit"
                      disabled={isTyping || !message.trim()}
                      className="rounded-md p-2 text-slate-400 hover:text-white disabled:opacity-50
                                disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <IconComponents.Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ChatHistory
        conversations={conversations}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onEditTitle={handleEditTitle}
        onNewChat={handleNewChat}
        isOpen={isHistoryOpen}
        currentconversationId={currentconversationId}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
};

export default Chat;