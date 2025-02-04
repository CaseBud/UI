import React, { useState, useRef, useEffect } from 'react';
import { chatApi } from '../utils/api';
import { authService } from '../services/authService';
import Sidebar from './Sidebar';
import ChatHistory from './ChatHistory';
import TypingAnimation from './TypingAnimation';  // Ensure this import is correct
import DocumentUploader from './DocumentUploader';
import DocumentPreview from './DocumentPreview';
import VoiceChat from './VoiceChat';
import { useLocation, useNavigate } from 'react-router-dom';
import MobileNav from './MobileNav';
import MobileBottomBar from './MobileBottomBar';  // Ensure this import is correct

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
  ),
  Globe: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
};


const Chat = () => {
  const user = authService.getCurrentUser();
  // Create greeting with user's name - update this line
  const defaultGreeting = `Hello ${user?.fullName || user?.name || 'there'}! How can I help you today?`;
  const location = useLocation();
  const navigate = useNavigate();
  const isTempUser = location.state?.tempUser || false;

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
  const [isDocumentAnalysis, setIsDocumentAnalysis] = useState(false);
  const [documentAnalysisId, setDocumentAnalysisId] = useState(null);
  const [isIncognito, setIsIncognito] = useState(false); // Add incognito mode state
  const [activeDocuments, setActiveDocuments] = useState([]); // Add this new state
  const [isWebMode, setIsWebMode] = useState(false); // Add new state for web browsing mode
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isIncognito && isHistoryOpen) {
      fetchConversations();
      // Set up periodic refresh every 30 seconds
      const refreshInterval = setInterval(fetchConversations, 30000);
      return () => clearInterval(refreshInterval);
    }
  }, [isIncognito, isHistoryOpen]);

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
      if (conversation.type === 'document-analysis') {
        setDocumentAnalysisId(conversation._id);
        setIsDocumentAnalysis(true);
      } else {
        setDocumentAnalysisId(null);
        setIsDocumentAnalysis(false);
        setCurrentconversationId(conversation._id);
      }
      setMessages(conversation.messages);
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
    const charDelay = 7; // Decrease for faster typing
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

  const handleUploadComplete = (response) => {
    if (isIncognito) return;
    const document = response.data.document;
    console.log('Uploaded document details:', {
      id: document._id,
      name: document.name,
      type: document.type,
      size: document.size
    });

    setUploadedDocuments(prev => [...prev, document]);
    setActiveDocuments(prev => {
      const newActiveDocuments = [...prev, document._id];
      console.log('Active document IDs:', JSON.stringify(newActiveDocuments));
      return newActiveDocuments;
    });
    setIsDocumentAnalysis(true);

    setMessages(prev => [...prev, {
      type: 'system',
      content: 'Document uploaded and ready for analysis. You can now ask questions about this document.',
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
    
    // Get last message for context
    const lastMessage = messages[messages.length - 1];
    const contextMessages = messages.slice(-3);
  
    try {
      setMessages(prev => [...prev, newUserMessage]);
      setMessage('');
      setIsTyping(true);
  
      let response;
  
      if (isDocumentAnalysis) {
        response = await chatApi.sendDocumentAnalysis(content.trim(), activeDocuments, documentAnalysisId);
        // Add empty assistant message for document analysis
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: '',
          timestamp: new Date()
        }]);
      } else {
        // Regular chat with optional web search
        response = await chatApi.sendMessage(content.trim(), { 
          conversationId: currentconversationId,
          webSearch: isWebMode,
          context: {
            lastMessage: lastMessage?.content,
            recentMessages: contextMessages.map(msg => ({
              role: msg.type,
              content: msg.content
            }))
          }
        });
  
        // Add empty assistant message with web sources for regular chat
        setMessages(prev => [...prev, {
          type: 'assistant',
          content: '',
          webSources: response.webSources,
          context: response.context,
          timestamp: new Date()
        }]);
      }
  
      await showResponseGradually(response.response || response.message || 'No response received');
  
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        type: 'error',
        content: error.message || 'Failed to process your request.',
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
      setDocumentAnalysisId(null);
      setIsDocumentAnalysis(false);
    }
  };

  const clearActiveDocuments = () => {
    setActiveDocuments([]);
    setMessages(prev => [...prev, {
      type: 'system',
      content: 'Switched to general conversation mode',
      timestamp: new Date()
    }]);
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const isMobile = () => window.innerWidth < 768;

  const MessageBubble = ({ message }) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef(null);
  
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(message.content);
        setIsCopied(true);
        
        // Reset the "Copied!" message after 2 seconds
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };
  
    const isUser = message.type === 'user';
    const isError = message.type === 'error';
    const isSystem = message.type === 'system';
  
    // Updated message type classes
    const messageTypeClasses = isUser 
      ? 'bg-blue-600 text-white ml-auto rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl'
      : isError
      ? 'bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl'
      : isSystem
      ? 'bg-slate-600/50 text-slate-200 rounded-2xl mx-auto max-w-md'
      : 'bg-slate-700/50 backdrop-blur-sm text-slate-100 mr-auto rounded-tr-2xl rounded-br-2xl rounded-tl-2xl';
  
    return (
      <div className={`group flex items-end gap-2 px-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {/* Assistant Avatar - Only show on first message or after user message */}
        {!isUser && (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center mb-1">
            <IconComponents.MessageCircle className="w-4 h-4 text-white" />
          </div>
        )}
        
        <div className="flex flex-col max-w-[75%] md:max-w-[65%] space-y-1">
          <div className={`px-3 py-2 ${messageTypeClasses}`}>
            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            
            {/* Document Preview */}
            {message.document && <DocumentPreview document={message.document} />}
            
            {/* Web Sources */}
            {message.webSources && message.webSources.length > 0 && (
              <div className="mt-2 border-t border-slate-600/50 pt-2">
                <p className="text-xs text-slate-400 mb-1">Sources:</p>
                <div className="space-y-1">
                  {message.webSources.map((source, index) => (
                    <a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-blue-400 hover:text-blue-300 truncate"
                    >
                      {source.title || source.url}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
  
          {/* Timestamp and Copy Button Row */}
          <div className={`flex items-center gap-2 text-xs text-slate-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="opacity-60">
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit'
              })}
            </span>
            
            {/* Copy button for assistant messages */}
            {!isUser && !isError && !isSystem && (
              <button
                onClick={handleCopy}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-700/50 rounded"
              >
                {isCopied ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
  
        {/* User Avatar */}
        {isUser && (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center mb-1">
            <IconComponents.User className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    );
  };
  

  // Add toggle function for history
  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  // Add new function to handle textarea height
  const adjustTextareaHeight = (element) => {
    element.style.height = 'auto'; // Reset height to recalculate
    const newHeight = Math.min(element.scrollHeight, 120); // Max height of 120px
    element.style.height = !element.value ? '44px' : `${newHeight}px`; // Default height when empty
  };

  // Update message state handler to include height adjustment
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    adjustTextareaHeight(e.target);
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Left Sidebar - Fixed width */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar 
          user={user} 
          onSelectPrompt={handleSelectPrompt}
          isTempUser={isTempUser}
        />
      </div>

      {/* Main Chat Area - More compact and fixed */}
      <div className={`flex-1 flex flex-col h-full min-w-0 transition-all duration-300
                    ${isHistoryOpen ? 'md:mr-72' : 'md:mr-0'}`}>
        {/* Header - More compact */}
        <div className="flex items-center h-14 px-4 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button - Made visible */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-slate-700/50 rounded-lg"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 
                           flex items-center justify-center">
                <IconComponents.MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-semibold text-white leading-none">Legal Assistant</h1>
                <p className="text-xs text-slate-400 mt-0.5">AI-powered legal research</p>
              </div>
            </div>
          </div>

          {/* Right side controls - Updated for mobile */}
          <div className="flex-1 flex justify-end items-center space-x-2">
            <button
              onClick={toggleHistory}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              title={isHistoryOpen ? "Hide history" : "Show history"}
            >
              <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={isHistoryOpen ? "M19 9l-7 7-7-7" : "M19 9l-7 7-7-7"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Container - Updated padding and spacing */}
        <div className="flex-1 overflow-y-auto bg-slate-900">
          <div className="max-w-3xl mx-auto py-4 space-y-3">
            {messages.map((msg, index) => (
              <MessageBubble 
                key={`${msg.type}-${index}`}
                message={msg}
                isMobile={isMobile()}
              />
            ))}
            {isTyping && (
              <div className="flex items-start gap-2 px-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <IconComponents.MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div className="rounded-2xl bg-slate-700/50 backdrop-blur-sm px-3 py-2 max-w-[75%] md:max-w-[65%]">
                  <TypingAnimation />
                </div>
              </div>
            )}
            <div ref={chatContainerRef} />
          </div>
        </div>

        {/* Input Area - Added padding bottom for mobile */}
        <div className="border-t border-slate-700/50 bg-slate-800/95 backdrop-blur-sm pb-16 md:pb-4">
          <div className="max-w-2xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="relative">
              <textarea
                ref={inputRef}
                value={message}
                onChange={handleMessageChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                    // Reset height after sending
                    e.target.style.height = '44px';
                  }
                }}
                placeholder={isTempUser ? "Register to chat..." : 
                           isWebMode ? "Search the web..." : 
                           "Ask any legal question..."}
                className="w-full rounded-lg pl-3 pr-28 py-2 
                         bg-slate-700/50 border border-slate-600/50 
                         text-white placeholder-slate-400 text-sm
                         resize-none overflow-hidden
                         leading-normal transition-all duration-200"
                disabled={isTyping || isTempUser}
                rows="1"
                style={{ height: '44px' }} // Default height
              />
              
              {/* Action buttons container with adjusted spacing */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 
                            flex items-center gap-2 md:gap-3"> {/* Increased gap */}
                <button
                  type="button"
                  onClick={() => setIsWebMode(!isWebMode)}
                  className={`p-1.5 md:p-2 rounded-lg transition-all duration-200
                           ${isWebMode ? 'bg-blue-500 text-white' : 
                             'text-slate-400 hover:text-white'}`}
                  disabled={isTempUser}
                >
                  <IconComponents.Globe className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                <DocumentUploader 
                  onDocumentSelect={handleDocumentSelect} 
                  onUploadComplete={handleUploadComplete}
                  className="w-6 h-6 md:w-8 md:h-8 p-1 md:p-1.5"
                  disabled={isTempUser}
                />
                
                <button 
                  type="submit"
                  disabled={isTyping || !message.trim() || isTempUser}
                  className="p-1.5 md:p-2 rounded-lg text-slate-400 hover:text-white 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IconComponents.Send className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Single Chat History component for both mobile and desktop */}
      <div className={`
        fixed inset-y-0 right-0 
        md:block 
        transition-transform duration-300 ease-in-out
        ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'}
        ${isMobile() ? 'w-full md:w-72' : 'hidden w-72'}
        z-50
      `}>
        <ChatHistory
          conversations={conversations}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onEditTitle={handleEditTitle}
          onNewChat={handleNewChat}
          isOpen={isHistoryOpen}
          currentconversationId={currentconversationId}
          onClose={toggleHistory}
        />
      </div>
          
      {/* Mobile Navigation */}
      <MobileNav
        user={user}
        onSelectPrompt={handleSelectPrompt}
        isTempUser={isTempUser}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Bottom Bar - Added top border and spacing */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700/50">
        <div className="flex items-center justify-around p-3">
          <button
            onClick={handleNewChat}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <button
            onClick={() => setIsWebMode(!isWebMode)}
            className={`p-2 rounded-lg transition-colors ${
              isWebMode ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            <IconComponents.Globe className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className={`p-2 rounded-lg transition-colors ${
              isHistoryOpen ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;