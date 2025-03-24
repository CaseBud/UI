import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import TranslatedText from './TranslatedText';
import LanguageSelector from './LanguageSelector';

const ChatHeader = ({ onDocumentUploadClick, setIsHistoryOpen, isHistoryOpen, isMobile = false }) => {
    const { isDark } = useTheme();
    
    return (
        <div className={`w-full px-4 h-14 flex items-center justify-between ${isDark ? 'bg-slate-800/95 backdrop-blur-sm' : 'bg-white'}`}>
            {!isMobile && (
                <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    <TranslatedText id="app.title" defaultMessage="CaseBud AI Assistant" />
                </h1>
            )}
            
            <div className="flex items-center space-x-1">
                {/* Upload Document Button */}
                <button
                    onClick={onDocumentUploadClick}
                    className="p-1.5 md:p-2 rounded-lg transition-all duration-200 text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </button>
                
                {/* Language dropdown - only show on desktop */}
                {!isMobile && (
                    <div className="hidden md:block">
                        <LanguageSelector />
                    </div>
                )}
                
                {/* History toggle */}
                <button
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                    className="p-1.5 md:p-2 rounded-lg transition-all duration-200 text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white dark:bg-transparent dark:hover:bg-slate-800/30 focus:ring-1 focus:ring-blue-500/50"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;