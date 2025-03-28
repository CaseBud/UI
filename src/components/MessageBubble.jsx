import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations'; // Add this import
import DOMPurify from 'dompurify';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';

const MessageBubble = ({ 
    message = { content: { query: '', response: '' } }, 
    handleTextToSpeechToggle, 
    IconComponents 
}) => {
    const { isDark } = useTheme();
    const { currentLanguage } = useLanguage();
    const [formattedContent, setFormattedContent] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';
    const isError = message.type === 'error';
    
    // Format message content with code highlighting
    useEffect(() => {
        if (!isUser && message.content?.response) {
            const content = message.content.response;
            // Create a temporary div to parse the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content
                .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
                    const lang = language || 'javascript';
                    const highlighted = Prism.highlight(
                        code, 
                        Prism.languages[lang] || Prism.languages.javascript, 
                        lang
                    );
                    return `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`;
                })
                .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
                .replace(/\n/g, '<br />');
            
            const sanitized = DOMPurify.sanitize(tempDiv.innerHTML);
            setFormattedContent(sanitized);
        }
    }, [message, isUser]);

    const handleCopyText = async () => {
        try {
            const textToCopy = message.content?.response || message.content?.query;
            await navigator.clipboard.writeText(textToCopy);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    const formatContent = (content) => {
        if (message.isWebSearch && message.formatted) {
            // Preserve formatting for web search results
            return (
                <div className="whitespace-pre-wrap">
                    {content}
                </div>
            );
        }
        
        // Regular message formatting
        return <div>{content}</div>;
    };

    return (
        <div className={`group flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[85%]`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full ${
                    isUser 
                        ? isDark ? 'bg-slate-700' : 'bg-gray-200'
                        : isDark ? 'bg-blue-600' : 'bg-blue-500'
                } flex items-center justify-center self-start mt-1 ${isUser ? 'ml-2' : 'mr-2'}`}>
                    {isUser ? (
                        <IconComponents.User className={`w-4 h-4 ${
                            isDark ? 'text-slate-300' : 'text-gray-600'
                        }`} />
                    ) : isSystem ? (
                        <IconComponents.System className="w-4 h-4 text-white" />
                    ) : (
                        <IconComponents.MessageCircle className="w-4 h-4 text-white" />
                    )}
                </div>

                {/* Message content */}
                <div className="flex flex-col">
                    <div className={`relative px-3 py-2 rounded-lg ${
                        message.isReasoning 
                            ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                            : isUser
                                ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                                : isSystem
                                    ? isDark ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-800'
                                    : isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                        {message.isReasoning && (
                            <div className="absolute left-2 top-2 animate-pulse">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                        )}
                        
                        <div className={`text-sm leading-relaxed formatted-text ${message.isReasoning ? 'pl-7' : ''}`}
                            dangerouslySetInnerHTML={{ 
                                __html: isUser 
                                    ? message.content?.query || '' 
                                    : formattedContent || message.content?.response || ''
                            }} 
                        />
                        
                        {/* Copy button - Only show for assistant messages */}
                        {!isUser && !isSystem && (
                            <button
                                onClick={handleCopyText}
                                className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity
                                    ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100'}
                                    ${copySuccess ? 'text-green-500' : isDark ? 'text-slate-400' : 'text-gray-400'}`}
                                title={copySuccess ? translate('copy.success', currentLanguage) : translate('copy.text', currentLanguage)}
                            >
                                {copySuccess ? (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Message Actions and Timestamp */}
                    <div className={`flex items-center text-xs mt-1 text-slate-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
                        {/* Timestamp */}
                        <span>
                            {message.timestamp && !isNaN(new Date(message.timestamp).getTime()) ? new Intl.DateTimeFormat(currentLanguage, {
                                hour: '2-digit',
                                minute: '2-digit'
                            }).format(new Date(message.timestamp)) : ''}
                        </span>
                        
                        {/* Text-to-Speech button for AI messages */}
                        {!isUser && handleTextToSpeechToggle && (
                            <button 
                                onClick={() => handleTextToSpeechToggle()} 
                                className="ml-2 p-1 hover:bg-slate-700/30 rounded-full opacity-50 hover:opacity-100 transition-opacity"
                                aria-label="Text to speech"
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* References for web search results */}
                    {message.isWebSearch && message.references && (
                        <div className="mt-2 text-xs text-blue-500">
                            <strong>{translate('default.references', currentLanguage)}:</strong>
                            <ul className="list-disc pl-5">
                                {message.references.map((ref, index) => (
                                    <li key={index}>
                                        <a href={ref.url} target="_blank" rel="noopener noreferrer">
                                            {ref.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
