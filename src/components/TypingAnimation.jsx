import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';

const TypingAnimation = () => {
    const { currentLanguage } = useLanguage();
    
    return (
        <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-slate-800 text-slate-400 text-sm w-fit">
            <span>{translate('chat.typing', currentLanguage)}</span>
            <span className="flex space-x-1">
                <span className="typing-dot" style={{ animationDelay: '0ms' }}></span>
                <span className="typing-dot" style={{ animationDelay: '200ms' }}></span>
                <span className="typing-dot" style={{ animationDelay: '400ms' }}></span>
            </span>
        </div>
    );
};

export default TypingAnimation;
