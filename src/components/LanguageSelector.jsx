import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';

const LanguageSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { currentLanguage, changeLanguage, languages, getCurrentLanguageDetails } = useLanguage();
    
    const selectedLang = getCurrentLanguageDetails();
    
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
                title={translate('settings.language', currentLanguage)}
                aria-label={translate('settings.language', currentLanguage)}
            >
                <span className="text-lg">{selectedLang.flag}</span>
            </button>
            
            {isOpen && (
                <div className="absolute z-10 mt-1 right-0 bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1 w-48 max-h-60 overflow-y-auto">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => {
                                changeLanguage(language.code);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 flex items-center space-x-2 ${
                                currentLanguage === language.code ? 'bg-slate-700 text-white' : 'text-slate-300'
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