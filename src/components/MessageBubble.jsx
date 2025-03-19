import React, { useState, useRef } from 'react';
import { IconComponents } from './IconComponents';
import TextToSpeech from './TextToSpeech';
import { formatTextWithBold } from '../utils/formatText.jsx';
import DocumentPreview from './DocumentPreview';

const MessageBubble = ({ message, darkMode, language }) => {
 const [isCopied, setIsCopied] = useState(false);
 const timeoutRef = useRef(null);

 const handleCopy = async () => {
 try {
 await navigator.clipboard.writeText(message.content.response);
 setIsCopied(true);
 if (timeoutRef.current) clearTimeout(timeoutRef.current);
 timeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
 } catch (err) {
 console.error('Failed to copy:', err);
 }
 };

 const isUser = message.type === 'user';
 const isError = message.type === 'error';
 const isSystem = message.type === 'system';
 const messageTypeClasses = isUser
 ? 'bg-blue-600 text-white ml-auto rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl'
 : isError
 ? 'bg-red-500 text-white rounded-2xl'
 : isSystem
 ? 'bg-slate-600 text-slate-200 rounded-2xl mx-auto'
 : 'bg-slate-700 text-slate-100 mr-auto rounded-tr-2xl rounded-br-2xl rounded-tl-2xl';

 const getSiteIcon = (url) => {
 try {
 const hostname = new URL(url).hostname.toLowerCase();
 if (hostname.includes('wikipedia.org')) return 'Wikipedia';
 if (hostname.includes('google.com')) return 'Google';
 if (hostname.includes('facebook.com')) return 'Facebook';
 return 'Default';
 } catch {
 return 'Default';
 }
 };

 return (
 <div className={`group flex items-end gap-0.5 px-0.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
 {(message.type === 'assistant' || message.type === 'system') && (
 <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center mb-0">
 {message.type === 'system' ? (
 <IconComponents.System className="w-4 h-4 text-white" />
 ) : (
 <IconComponents.MessageCircle className="w-4 h-4 text-white" />
 )}
 </div>
 )}
 <div className={`flex flex-col max-w-[75%] md:max-w-[65%] space-y-0 ${isUser ? 'ml-auto' : ''}`}>
 <div className={`px-2.5 py-1.5 ${messageTypeClasses}`}>
 <p className="whitespace-pre-wrap text-sm">
 {isUser ? message.content.query : formatTextWithBold(message.content.response)}
 </p>
 {message.documents && message.documents.length > 0 && (
 <div className="mt-2 border-t border-slate-500/30 pt-2">
 {message.documents.map((doc, index) => (
 <DocumentPreview key={index} document={doc} />
 ))}
 </div>
 )}
 </div>
 {!(isUser) && (message.type === 'system' || message.type === 'assistant') && (
 <div className="mt-0 space-y-0.5">
 {message.isWebSearch && (
 <>
 <div className="flex items-center gap-1 px-1">
 <IconComponents.Globe className="w-3 h-3 text-blue-400" />
 <span className="text-xs font-medium text-blue-400">Web References</span>
 </div>
 <div className="space-y-0.5">
 {[
 { url: 'https://www.google.com/', title: 'Google Search Results' },
 { url: 'https://wikipedia.org/', title: 'Wikipedia Reference' },
 { url: 'https://facebook.com/', title: 'Public Information' }
 ].map((source, index) => {
 const SiteIcon = IconComponents[getSiteIcon(source.url)];
 return (
 <a
 key={index}
 href={source.url}
 target="_blank"
 rel="noopener noreferrer"
 className="block p-1 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
 >
 <div className="flex items-start gap-1">
 <div className="flex-shrink-0 w-3.5 h-3.5 mt-0.5 text-slate-400">
 <SiteIcon className="w-full h-full" />
 </div>
 <div className="flex-1 min-w-0">
 <h4 className="text-xs text-blue-400 font-medium truncate mb-0">{source.title || 'Web Source'}</h4>
 <p className="text-xs text-slate-400 truncate">{source.url}</p>
 </div>
 </div>
 </a>
 );
 })}
 </div>
 </>
 )}
 </div>
 )}
 <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
 <button
 onClick={handleCopy}
 className={`p-1 rounded-full ${darkMode ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-300' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'} transition-colors`}
 title="Copy to clipboard"
 >
 {isCopied ? (
 <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <path d="M20 6L9 17l-5-5"></path>
 </svg>
 ) : (
 <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
 <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
 <path d="M5 15H4a 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
 </svg>
 )}
 </button>
 {message.type === 'assistant' && message.content.response && (
 <TextToSpeech text={message.content.response} language={language} />
 )}
 </div>
 <div className={`flex items-center gap-0.5 text-xs ${darkMode ? 'text-slate-500' : 'text-gray-400'} mt-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
 <span className="opacity-60">
 {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </span>
 </div>
 </div>
 {isUser && (
 <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center mb-0">
 <IconComponents.User className="w-4 h-4 text-white" />
 </div>
 )}
 </div>
 );
};

export default MessageBubble;