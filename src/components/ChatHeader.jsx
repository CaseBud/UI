import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSelector from './LanguageSelector';
import TranslatedText from './TranslatedText';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';

const ChatHeader = ({
    onDocumentUploadClick,
    setIsHistoryOpen,
    isHistoryOpen,
    IconComponents
}) => {
    const { isDark } = useTheme();
    const { currentLanguage } = useLanguage();

    return (
        <div className={`flex items-center justify-between p-2 border-b ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white/50'} backdrop-blur-lg sticky top-0 z-10`}>
            {/* Left side - Logo and Title */}
            <div className="flex items-center space-x-2">
                <img src="/chat-icon.png" alt="Logo" className="h-8 w-8" />
                <div className="hidden md:block">
                    <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        <TranslatedText id="app.title" defaultMessage="CaseBud AI Assistant" />
                    </h1>
                </div>
            </div>
            
            {/* Right side - Action Buttons */}
            <div className="flex items-center space-x-0.5 sm:space-x-1">
                {/* Upload Document Button */}
                <button
                    onClick={onDocumentUploadClick}
                    className={`p-1.5 md:p-2 rounded-lg transition-all duration-200 ${
                        isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                    }`}
                    title={translate('document.upload', currentLanguage)}
                    aria-label={translate('document.upload', currentLanguage)}
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </button>
                
                {/* Language dropdown - only show on desktop */}
                <div className="hidden md:block">
                    <LanguageSelector />
                </div>
                
                {/* History toggle */}
                <button
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                    className={`p-1.5 md:p-2 rounded-lg transition-all duration-200 ${
                        isHistoryOpen 
                            ? 'text-blue-400 bg-blue-500/20 ring-1 ring-blue-500/50' 
                            : isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                    }`}
                    title={translate('chat.history', currentLanguage)}
                    aria-label={translate('chat.history', currentLanguage)}
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatHeader; 