import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import TranslatedText from './TranslatedText';
import { translate } from '../utils/translations';

const MobileBottomBar = ({
    handleNewChat,
    isWebMode,
    setIsWebMode,
    setDocumentAnalysisId,
    setIsDocumentAnalysis,
    setIsHistoryOpen,
    isHistoryOpen,
    IconComponents,
    handleDocumentUploadClick,
    isDetailedMode,
    handleDetailedModeToggle
}) => {
    const { isDark } = useTheme();
    const { currentLanguage, changeLanguage, languages } = useLanguage();
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

    // Handle language change using our context
    const handleLanguageChange = (langCode) => {
        changeLanguage(langCode);
    };

    // Add translations for mobile buttons
    const translations = {
        newChat: translate('mobile.newChat', currentLanguage),
        web: translate('chat.webSearch', currentLanguage),
        upload: translate('document.upload', currentLanguage),
        language: translate('settings.language', currentLanguage),
        detailed: translate('chat.detailedMode', currentLanguage)
    };

    return (
        <>
            <div className={`pt-2 mt-2 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                <div className="flex justify-around items-center p-2">
                    <button
                        onClick={handleNewChat}
                        className="p-2 rounded-full flex flex-col items-center justify-center text-xs 
                                   text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white"
                        aria-label={translations.newChat}
                    >
                        <svg className="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 4v16m8-8H4" />
                        </svg>
                        <span>{translations.newChat}</span>
                    </button>

                    <button
                        onClick={() => {
                            if (!isWebMode) {
                                setDocumentAnalysisId(null);
                                setIsDocumentAnalysis(false);
                            }
                            setIsWebMode(!isWebMode);
                        }}
                        className="p-2 rounded-full flex flex-col items-center justify-center text-xs 
                                   text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white"
                        aria-label={translations.web}
                    >
                        <div className="relative">
                            <IconComponents.Globe className="w-5 h-5 mb-1" />
                            {isWebMode && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                        </div>
                        <span>{translations.web}</span>
                    </button>

                    {/* Document Upload Button */}
                    <button
                        onClick={handleDocumentUploadClick}
                        className="p-2 rounded-full flex flex-col items-center justify-center text-xs 
                                   text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white"
                        aria-label={translations.upload}
                    >
                        <svg className="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="12" y1="18" x2="12" y2="12" />
                            <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                        <span>{translations.upload}</span>
                    </button>

                    {/* Add Camera/OCR Button before the language button */}
                    <button
                        onClick={handleDocumentUploadClick}
                        className="p-2 rounded-full flex flex-col items-center justify-center text-xs 
                                   text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white"
                        aria-label="Camera/OCR"
                    >
                        <div className="relative">
                            <svg className="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                <circle cx="12" cy="13" r="4" />
                            </svg>
                        </div>
                        <span>Scan</span>
                    </button>

                    <button
                        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                        className="p-2 rounded-full flex flex-col items-center justify-center text-xs 
                                   text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white"
                        aria-label={translations.language}
                    >
                        <div className="relative">
                            <svg className="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
                                <path d="M3.6 9h16.8" />
                                <path d="M12 3a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10z" />
                                <path d="M7 12.5h3.5l2 5" />
                                <path d="M13.5 12.5h3.5" />
                                <path d="M16 10l2 2.5-2 2.5" />
                            </svg>
                            {currentLanguage !== 'en-US' && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                        </div>
                        <span>{translations.language}</span>
                    </button>

                    {/* Reasoning Mode Toggle (replacing History) */}
                    <button
                        onClick={() => handleDetailedModeToggle(!isDetailedMode)}
                        className="p-2 rounded-full flex flex-col items-center justify-center text-xs 
                                   text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white"
                        aria-label={translations.detailed}
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
                        <span>{translations.detailed}</span>
                    </button>
                </div>
            </div>
            
            {/* Language dropdown for mobile */}
            {isLanguageDropdownOpen && (
                <div className={`absolute bottom-16 left-0 right-0 p-2 border-t ${
                    isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-gray-200/50'
                }`}>
                    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    handleLanguageChange(lang.code);
                                    setIsLanguageDropdownOpen(false);
                                }}
                                className={`p-2 text-sm rounded-lg flex items-center space-x-2 ${
                                    currentLanguage === lang.code
                                        ? 'bg-slate-700 text-white'
                                        : 'text-slate-200 hover:bg-slate-700/50'
                                }`}
                            >
                                <span className="text-lg">{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default MobileBottomBar;
