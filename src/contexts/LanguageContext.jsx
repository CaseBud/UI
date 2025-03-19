import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available languages
export const languages = [
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
    { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
    { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'yo-NG', name: 'Yoruba', flag: '🇳🇬' },
    { code: 'ig-NG', name: 'Igbo', flag: '🇳🇬' },
    { code: 'ha-NG', name: 'Hausa', flag: '🇳🇬' }
];

// Create the language context
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Get stored language or default to English
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('userLanguage');
        return savedLanguage || 'en-US';
    });

    // Store language preference whenever it changes
    useEffect(() => {
        localStorage.setItem('userLanguage', currentLanguage);
    }, [currentLanguage]);

    // Change language handler
    const changeLanguage = (langCode) => {
        if (languages.some(lang => lang.code === langCode)) {
            setCurrentLanguage(langCode);
        }
    };

    // Get language details
    const getCurrentLanguageDetails = () => {
        return languages.find(lang => lang.code === currentLanguage) || languages[0];
    };

    const value = {
        currentLanguage,
        changeLanguage,
        languages,
        getCurrentLanguageDetails
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

// Custom hook for using the language context
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}; 