import React from 'react';

const ReasoningModeToggle = ({ isDetailed, onChange }) => {
    return (
        <button
            onClick={() => onChange(!isDetailed)}
            className={`p-1.5 md:p-2 rounded-lg transition-all duration-200 ${
                isDetailed
                    ? 'text-green-400 bg-green-500/20 ring-1 ring-green-500/50'
                    : 'text-slate-400 hover:text-white'
            }`}
            title={isDetailed ? 'Detailed reasoning mode enabled' : 'Enable detailed reasoning'}
        >
            <svg
                className="w-4 h-4 md:w-5 md:h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                {isDetailed && (
                    <>
                        <line x1="6" y1="8" x2="15" y2="8" />
                        <line x1="6" y1="12" x2="15" y2="12" />
                        <line x1="6" y1="16" x2="15" y2="16" />
                    </>
                )}
            </svg>
        </button>
    );
};

export default ReasoningModeToggle; 