import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ChatHeader = ({ 
    onDocumentUploadClick, 
    setIsLanguageDropdownOpen, 
    isLanguageDropdownOpen, 
    setIsHistoryOpen, 
    isHistoryOpen 
}) => {
    const { isDark } = useTheme();

    return (
        <div className={`border-b ${
            isDark ? 'border-slate-700/50' : 'border-gray-200/50'
        } p-3 flex items-center justify-between`}>
            <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Legal Assistant
            </h1>
            <div className="flex items-center gap-2">
                {/* Document Upload Button in header */}
                <button
                    onClick={onDocumentUploadClick}
                    className={`p-2 rounded-md transition-colors ${
                        isDark 
                            ? 'hover:bg-slate-700 text-slate-300' 
                            : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    aria-label="Upload document"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                </button>
                
                {/* Language dropdown - only show on desktop */}
                <div className="relative hidden md:block">
                    <button
                        id="language-dropdown-button"
                        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                        className={`p-2 rounded-lg ${
                            isDark 
                                ? 'hover:bg-slate-700/50 text-slate-400' 
                                : 'hover:bg-gray-100/70 text-gray-600'
                        }`}
                        aria-label="Select language"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                            <path d="M3.6 9h16.8" />
                            <path d="M12 3a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" />
                            <path d="M7 12.5h3.5l2 5" />
                            <path d="M13.5 12.5h3.5" />
                            <path d="M16 10l2 2.5-2 2.5" />
                        </svg>
                    </button>
                </div>
                
                {/* History toggle - show on both desktop and mobile */}
                <button
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                    className={`p-2 rounded-md transition-colors ${
                        isHistoryOpen
                            ? isDark 
                                ? 'bg-slate-700 text-white' 
                                : 'bg-gray-100 text-blue-600'
                            : isDark 
                                ? 'hover:bg-slate-700 text-slate-300' 
                                : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    aria-label="Toggle history"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatHeader; 