import React, { useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const MobileInput = ({
    message,
    handleMessageChange,
    handleSubmit,
    isTyping,
    isTempUser,
    isWebMode,
    isDetailedMode,
    isToolsOpen,
    setIsToolsOpen,
    IconComponents
}) => {
    const { isDark } = useTheme();
    const inputRef = useRef(null);

    return (
        <div className={`${
            isDark ? 'bg-slate-800/95 backdrop-blur-sm' : 'bg-white'
        }`}>
            <div className="p-3">
                <form onSubmit={handleSubmit} className="relative">
                    <div className="relative flex items-center">
                        <textarea
                            ref={inputRef}
                            value={message}
                            onChange={handleMessageChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                    e.target.style.height = '40px';
                                }
                            }}
                            placeholder={
                                isTempUser
                                    ? 'Register to chat...'
                                    : isWebMode
                                        ? 'Search the web for legal information...'
                                        : 'Ask any legal question...'
                            }
                            className={`w-full rounded-lg pl-4 pr-12 py-3
                                ${isDark 
                                    ? 'bg-slate-700/40 text-white placeholder-slate-400 border-slate-600/40' 
                                    : 'bg-gray-100/80 text-gray-800 placeholder-gray-500 border-gray-200'
                                } border text-sm resize-none overflow-hidden leading-relaxed
                                transition-all duration-200 focus:outline-none
                                ${isWebMode 
                                    ? 'focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20' 
                                    : isDark 
                                        ? 'focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20' 
                                        : 'focus:border-blue-300 focus:ring-1 focus:ring-blue-300/30'
                                }`}
                            disabled={isTyping || isTempUser}
                            rows="1"
                            style={{ height: '40px' }}
                        />

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={isTyping || !message.trim() || isTempUser}
                            className={`absolute right-2 p-2 rounded-full transition-colors flex items-center justify-center
                                ${isDark 
                                    ? 'text-slate-400 hover:text-white disabled:text-slate-600' 
                                    : 'text-gray-600 hover:text-gray-800 disabled:text-gray-400'
                                } disabled:cursor-not-allowed`}
                        >
                            <IconComponents.Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MobileInput; 