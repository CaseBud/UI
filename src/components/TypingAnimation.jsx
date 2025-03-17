import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const TypingAnimation = () => {
    const { isDark } = useTheme();
    
    return (
        <div className="flex space-x-1.5 p-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
                isDark ? 'bg-slate-400' : 'bg-gray-400'
            }`}></div>
            <div className={`w-2 h-2 rounded-full animate-pulse animation-delay-200 ${
                isDark ? 'bg-slate-400' : 'bg-gray-400'
            }`}></div>
            <div className={`w-2 h-2 rounded-full animate-pulse animation-delay-400 ${
                isDark ? 'bg-slate-400' : 'bg-gray-400'
            }`}></div>
        </div>
    );
};

export default TypingAnimation;
