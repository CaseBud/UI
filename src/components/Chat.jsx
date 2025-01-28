import React, { useState, useRef, useEffect } from 'react';
import { chatApi } from '../utils/api';
import { authService } from '../services/authService';
import Sidebar from './Sidebar';  // Update import statement

// Replace lucide-react imports with SVG components
const IconComponents = {
  MessageCircle: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
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
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([{
    type: 'assistant',
    content: 'Hello! How can I help you today?'
  }]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const user = authService.getCurrentUser();

  useEffect(() => {
    // Scroll to bottom when messages update
    if (chatContainerRef.current) {
      const scrollOptions = {
        behavior: 'smooth',
        block: 'end'
      };
      chatContainerRef.current.scrollIntoView(scrollOptions);
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (content) => {
    if (!content.trim() || isAnalyzing) return;

    const newUserMessage = { type: 'user', content, timestamp: new Date() };

    try {
      setIsAnalyzing(true);
      setMessages(prev => [...prev, newUserMessage]);
      setMessage(''); // Clear input immediately for better UX

      const response = await chatApi.sendMessage(content);

      setMessages(prev => [...prev, {
        type: 'assistant',
        content: response.response || response.message,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Failed to send message. Please try again.',
        timestamp: new Date()
      }]);
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

  const handleSelectPrompt = (promptText) => {
    setMessage(promptText);
    inputRef.current?.focus();
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.type === 'user';
    const isError = message.type === 'error';

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
            : 'bg-slate-700/50 backdrop-blur-sm text-slate-100'
        }`}>
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
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
              <IconComponents.MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Legal Assistant</h1>
              <p className="text-sm text-slate-400">AI-powered legal research and analysis</p>
            </div>
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
            <div ref={chatContainerRef} /> {/* Scroll anchor */}
            {isAnalyzing && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <IconComponents.Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
                <div className="rounded-2xl bg-slate-700/50 backdrop-blur-sm px-4 py-2">
                  <p className="text-slate-300">Analyzing...</p>
                </div>
              </div>
            )}
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
                    className="w-full rounded-lg pl-4 pr-12 py-3 bg-slate-700/50 border border-slate-600/50 
                             text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 
                             focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    disabled={isAnalyzing}
                  />
                  <button 
                    type="submit"
                    disabled={isAnalyzing || !message.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2
                             text-slate-400 hover:text-white disabled:opacity-50
                             disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <IconComponents.Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;