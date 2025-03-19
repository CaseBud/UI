import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';

const TypingAnimation = () => {
    const { currentLanguage } = useLanguage();
    
    return (
        <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-slate-800 text-slate-400 text-sm w-fit">
            <span>{translate('chat.typing', currentLanguage)}</span>
            <span className="flex space-x-1">
                <span className="animate-bounce delay-75" style={{ animationDuration: '1s' }}>.</span>
                <span className="animate-bounce delay-100" style={{ animationDuration: '1s', animationDelay: '0.1s' }}>.</span>
                <span className="animate-bounce delay-150" style={{ animationDuration: '1s', animationDelay: '0.2s' }}>.</span>
            </span>
        </div>
    );
};

export default TypingAnimation;
