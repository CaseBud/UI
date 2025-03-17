import React, { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { formatText } from '../utils/textFormatter';

const MessageBubble = ({ message, handleTextToSpeechToggle, IconComponents }) => {
    const { isDark, lightModeBaseColor } = useTheme();
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef(null);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content.response);
            setIsCopied(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy message:', error);
        }
    };

    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';

    // Format the message content if it's not from the user
    const formattedContent = !isUser && message.content.response 
        ? formatText(message.content.response) 
        : null;

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
                    <div className={`flex items-center ${isUser ? 'justify-end' : 'justify-start'} mt-1`}>
                        <div className={`text-xs ${
                            isDark ? 'text-slate-500' : 'text-gray-600'
                        }`}>
                            {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                        
                        {!isUser && message.content.response && (
                            <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={handleCopy}
                                    className={`p-1 rounded transition-colors ${
                                        isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                    title={isCopied ? "Copied!" : "Copy to clipboard"}
                                >
                                    {isCopied ? (
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    ) : (
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                    )}
                                </button>

                                <button
                                    onClick={handleTextToSpeechToggle}
                                    className={`p-1 rounded transition-colors ${
                                        isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                    title="Text to speech"
                                >
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBubble; 