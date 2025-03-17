import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const MobileBottomBar = ({
    handleNewChat,
    isWebMode,
    setIsWebMode,
    setDocumentAnalysisId,
    setIsDocumentAnalysis,
    setIsLanguageDropdownOpen,
    isLanguageDropdownOpen,
    setIsHistoryOpen,
    isHistoryOpen,
    language,
    handleLanguageChange,
    IconComponents,
    handleDocumentUploadClick,
    isDetailedMode,
    handleDetailedModeToggle
}) => {
    const { isDark } = useTheme();

    return (
        <>
            <div className="pt-2 mt-2 border-t border-gray-200 dark:border-slate-700">
                <div className="flex justify-around items-center p-2">
                    <button
                        onClick={handleNewChat}
                        className={`p-2 rounded-full flex flex-col items-center justify-center text-xs ${
                            isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}
                        aria-label="New chat"
                    >
                        <svg className="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 4v16m8-8H4" />
                        </svg>
                        <span>New Chat</span>
                    </button>

                    <button
                        onClick={() => {
                            if (!isWebMode) {
                                setDocumentAnalysisId(null);
                                setIsDocumentAnalysis(false);
                            }
                            setIsWebMode(!isWebMode);
                        }}
                        className={`p-2 rounded-full flex flex-col items-center justify-center text-xs ${
                            isWebMode 
                                ? 'text-blue-400' 
                                : isDark 
                                    ? 'text-slate-400 hover:text-white' 
                                    : 'text-gray-600 hover:text-gray-800'
                        }`}
                        aria-label="Toggle web search"
                    >
                        <div className="relative">
                            <IconComponents.Globe className="w-5 h-5 mb-1" />
                            {isWebMode && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                        </div>
                        <span>Web</span>
                    </button>

                    {/* Document Upload Button */}
                    <button
                        onClick={handleDocumentUploadClick}
                        className={`p-2 rounded-full flex flex-col items-center justify-center text-xs ${
                            isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}
                        aria-label="Upload document"
                    >
                        <svg className="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="12" y1="18" x2="12" y2="12" />
                            <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                        <span>Upload</span>
                    </button>

                    <button
                        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                        className={`p-2 rounded-full flex flex-col items-center justify-center text-xs ${
                            isLanguageDropdownOpen ? 'text-blue-400' : isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}
                        aria-label="Language settings"
                    >
                        <div className="relative">
                            <svg className="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                                <path d="M3.6 9h16.8" />
                                <path d="M12 3a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" />
                                <path d="M7 12.5h3.5l2 5" />
                                <path d="M13.5 12.5h3.5" />
                                <path d="M16 10l2 2.5-2 2.5" />
                            </svg>
                            {language !== 'en-US' && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                        </div>
                        <span>Language</span>
                    </button>

                    {/* Reasoning Mode Toggle (replacing History) */}
                    <button
                        onClick={() => handleDetailedModeToggle(!isDetailedMode)}
                        className={`p-2 rounded-full flex flex-col items-center justify-center text-xs ${
                            isDetailedMode ? 'text-blue-400' : isDark ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}
                        aria-label="Toggle detailed mode"
                    >
                        <div className="relative">
                            <svg className="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg>
                            {isDetailedMode && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                        </div>
                        <span>Detailed</span>
                    </button>
                </div>
            </div>
            
            {/* Language dropdown for mobile */}
            {isLanguageDropdownOpen && (
                <div className={`absolute bottom-16 left-0 right-0 p-2 border-t ${
                    isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-gray-200/50'
                }`}>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { code: 'en-US', name: 'English' },
                            { code: 'es-ES', name: 'Spanish' },
                            { code: 'fr-FR', name: 'French' },
                            { code: 'de-DE', name: 'German' },
                            { code: 'zh-CN', name: 'Chinese' }
                        ].map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    handleLanguageChange(lang.code);
                                    setIsLanguageDropdownOpen(false);
                                }}
                                className={`p-2 text-sm rounded-lg ${
                                    language === lang.code
                                        ? isDark 
                                            ? 'bg-slate-700 text-white' 
                                            : 'bg-blue-100 text-gray-800'
                                        : isDark 
                                            ? 'text-slate-300 hover:bg-slate-700/50' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {lang.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default MobileBottomBar;
