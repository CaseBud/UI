import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
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

const MessageBubble = ({ message, handleTextToSpeechToggle, IconComponents }) => {
    const { isDark } = useTheme();
    const { currentLanguage } = useLanguage();
    const [formattedContent, setFormattedContent] = useState('');
    
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';
    const isError = message.type === 'error';
    
    // Format message content with code highlighting
    useEffect(() => {
        if (!isUser && message.content.response) {
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
                    <div className={`px-3 py-2 rounded-lg ${
                        isUser
                            ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                            : isSystem
                                ? isDark ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-800'
                                : isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                        <div className="text-sm leading-relaxed formatted-text">
                            {isUser
                                ? message.content.query
                                : formattedContent || message.content.response}
                        </div>
                    </div>

                    {/* Message Actions and Timestamp */}
                    <div className={`flex items-center text-xs mt-1 text-slate-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
                        {/* Timestamp */}
                        <span>
                            {message.timestamp ? new Intl.DateTimeFormat(currentLanguage, {
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
                </div>
            </div>
        </div>
    );
};

export default MessageBubble; 