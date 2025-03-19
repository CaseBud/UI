import React from 'react';
import { IconComponents } from './IconComponents';
import TypingAnimation from './TypingAnimation';

const ChatContainer = ({
 messages,
 isTyping,
 chatContainerRef,
 inputRef,
 message,
 setMessage,
 handleSubmit,
 handleKeyPress,
 darkMode,
 MessageBubble,
 isWebMode,
 setIsWebMode,
 isDetailedMode,
 setIsDetailedMode,
 isVoiceMode,
 isToolsOpen,
 setIsToolsOpen,
}) => {
 const handleSendMessage = () => {
 if (message.trim()) handleSubmit({ preventDefault: () => {} });
 };

 return (
 <div className="flex-1 flex flex-col h-full overflow-hidden">
 <div className={`flex-1 overflow-y-auto px-3 py-4 space-y-4 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`} style={{ paddingBottom: '80px' }}>
 {messages.length === 0 ? (
 <div className="h-full flex items-center justify-center">
 <div className="text-center max-w-md mx-auto px-4">
 <div className={`w-14 h-14 mx-auto mb-3 rounded-full ${darkMode ? 'bg-blue-600/20' : 'bg-blue-100'} flex items-center justify-center`}>
 <svg className={`w-7 h-7 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
 <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
 </svg>
 </div>
 <h2 className={`text-xl font-semibold mb-2 tracking-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>Hello Murewa Ajala!</h2>
 <p className={`${darkMode ? 'text-slate-300' : 'text-gray-600'} mb-5 text-sm`}>How can I help you with your legal questions today?</p>
 <div className="space-y-2">
 {['What are my rights in a criminal case?', 'Help with tenant rights', 'How do I file for divorce?'].map((suggestion, index) => (
 <button
 key={index}
 onClick={() => {
 setMessage(suggestion);
 setTimeout(() => inputRef.current?.focus(), 100);
 }}
 className={`w-full py-2.5 px-3 rounded-lg text-left text-sm ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'} transition-colors`}
 >
 {suggestion}
 </button>
 ))}
 </div>
 </div>
 </div>
 ) : (
 messages.map((msg, index) => (
 <MessageBubble key={index} message={msg} darkMode={darkMode} />
 ))
 )}
 {isTyping && (
 <div className="flex justify-start">
 <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 mr-2 mt-1 flex items-center justify-center">
 <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
 </svg>
 </div>
 <div className={`max-w-[85%] md:max-w-[75%] rounded-lg p-3 rounded-tl-none ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-gray-800 border border-gray-200'} shadow-sm`}>
 <TypingAnimation />
 </div>
 </div>
 )}
 <div ref={chatContainerRef} />
 </div>
 <div className={`border-t ${darkMode ? 'border-slate-700/50 bg-slate-800' : 'border-gray-200 bg-white'} p-3 relative`}>
 <div className="max-w-3xl mx-auto">
 <div className="flex items-center space-x-1.5">
 <div className="flex space-x-1">
 <button
 onClick={() => setIsWebMode(!isWebMode)}
 className={`p-1.5 rounded-full transition-colors ${isWebMode ? (darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600') : (darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-gray-500 hover:text-gray-700')}`}
 title={isWebMode ? "Web search enabled" : "Enable web search"}
 >
 <IconComponents.Globe className="w-4 h-4" />
 </button>
 <button
 onClick={() => setIsDetailedMode(!isDetailedMode)}
 className={`p-1.5 rounded-full transition-colors ${isDetailedMode ? (darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600') : (darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-gray-500 hover:text-gray-700')}`}
 title={isDetailedMode ? "Detailed reasoning enabled" : "Enable detailed reasoning"}
 >
 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
 <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
 </svg>
 </button>
 </div>
 <div className="flex-1 relative">
 <textarea
 ref={inputRef}
 value={message}
 onChange={(e) => setMessage(e.target.value)}
 onKeyDown={handleKeyPress}
 placeholder="Type your message..."
 className={`w-full ${darkMode ? 'bg-slate-700 text-white focus:ring-blue-500' : 'bg-gray-100 text-gray-900 focus:ring-blue-500'} rounded-full pl-3 pr-10 py-2 focus:outline-none focus:ring-1 resize-none text-sm font-medium`}
 rows={1}
 style={{ minHeight: '40px', maxHeight: '120px' }}
 />
 <button
 onClick={handleSendMessage}
 disabled={!message.trim() || isTyping}
 className={`absolute right-1.5 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full ${!message.trim() || isTyping ? (darkMode ? 'text-slate-500 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed') : (darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600')} transition-colors`}
 >
 <IconComponents.Send className="w-3.5 h-3.5" />
 </button>
 </div>
 <button
 onClick={() => setIsToolsOpen(!isToolsOpen)}
 className={`p-1.5 rounded-full ${darkMode ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
 title="Tools"
 >
 <IconComponents.Tools className="w-4 h-4" />
 </button>
 <button
 onClick={() => setIsToolsOpen(!isToolsOpen)}
 className={`p-1.5 rounded-full md:hidden ${darkMode ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} transition-colors`}
 title="Chat History"
 >
 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </button>
 </div>
 <div className="flex items-center mt-1.5 text-xs space-x-3 justify-center">
 {isWebMode && (
 <div className="flex items-center">
 <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1"></span>
 <span className={`${darkMode ? 'text-slate-400' : 'text-gray-500'} font-medium text-xs`}>Web Search</span>
 </div>
 )}
 {isDetailedMode && (
 <div className="flex items-center">
 <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-1"></span>
 <span className={`${darkMode ? 'text-slate-400' : 'text-gray-500'} font-medium text-xs`}>Detailed</span>
 </div>
 )}
 {isVoiceMode && (
 <div className="flex items-center">
 <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
 <span className={`${darkMode ? 'text-slate-400' : 'text-gray-500'} font-medium text-xs`}>Voice</span>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 );
};

export default ChatContainer;