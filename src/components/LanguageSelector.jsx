import React, { useState, useRef, useEffect } from 'react';

const LanguageSelector = ({ selectedLanguage, onLanguageChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    const languages = [
        { code: 'en-US', name: 'English', flag: '🇺🇸' },
        { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
        { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
        { code: 'de-DE', name: 'German', flag: '🇩🇪' },
        { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
        { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
        { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
        { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
        { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
        { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' }
    ];
    
    const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-1.5 md:p-2 rounded-lg transition-all duration-200 flex items-center ${
                    isOpen ? 'text-blue-400 bg-blue-500/20 ring-1 ring-blue-500/50' : 'text-slate-400 hover:text-white'
                }`}
                title="Select language"
            >
                <span className="text-lg">{selectedLang.flag}</span>
            </button>
            
            {isOpen && (
                <div className="absolute z-10 mt-1 right-0 bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1 w-48 max-h-60 overflow-y-auto">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => {
                                onLanguageChange(language.code);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 flex items-center space-x-2 ${
                                selectedLanguage === language.code ? 'bg-slate-700 text-white' : 'text-slate-300'
                            }`}
                        >
                            <span className="text-lg">{language.flag}</span>
                            <span>{language.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector; 