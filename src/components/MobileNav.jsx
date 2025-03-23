import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const MobileNav = ({ user, onSelectPrompt, isTempUser, onClose = () => {} }) => {
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const handleLogout = () => {
        authService.logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="md:hidden flex">
            <div className={`w-24 h-full ${isDark ? 'bg-legal-dark-card' : 'bg-white'} border-r ${isDark ? 'border-slate-700/50' : 'border-gray-200'}`}>
                <div className="p-4 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div
                                className="h-8 w-8 bg-legal-primary rounded-lg 
                            flex items-center justify-center"
                            >
                                <svg
                                    className="h-5 w-5 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                CaseBud
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                        >
                            <svg
                                className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-4 border-b border-slate-700/50">
                    <h3 className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'} uppercase tracking-wider mb-4`}>
                        Quick Prompts
                    </h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => {
                                onSelectPrompt('What are my rights in a criminal case?');
                                onClose();
                            }}
                            className={`w-full p-3 rounded-lg ${isDark ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
                        >
                            Criminal Rights
                        </button>
                        <button
                            onClick={() => {
                                onSelectPrompt('Help with tenant rights and housing laws');
                                onClose();
                            }}
                            className={`w-full p-3 rounded-lg ${isDark ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
                        >
                            Housing Laws
                        </button>
                    </div>
                </div>

                <div className="p-4 border-b border-slate-700/50">
                    <h3 className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'} uppercase tracking-wider mb-4`}>
                        Tools
                    </h3>
                    <div className="space-y-2">
                        <button className={`w-full p-3 text-left rounded-lg ${isDark ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors flex items-center`}>
                            <svg className="w-5 h-5 mr-3 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/>
                            </svg>
                            Web Search
                        </button>
                        
                        <button className={`w-full p-3 text-left rounded-lg ${isDark ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors flex items-center`}>
                            <svg className="w-5 h-5 mr-3 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                            </svg>
                            Reasoning Mode
                        </button>

                        <button className={`w-full p-3 text-left rounded-lg ${isDark ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'bg-gray-50 hover:bg-gray-100'} transition-colors flex items-center`}>
                            <svg className="w-5 h-5 mr-3 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                <line x1="12" y1="19" x2="12" y2="23"/>
                                <line x1="8" y1="23" x2="16" y2="23"/>
                            </svg>
                            Voice Features
                        </button>
                    </div>
                </div>

                <div className="p-4 border-b border-slate-700/50">
                    <h3 className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'} uppercase tracking-wider mb-4`}>
                        Features
                    </h3>
                    <div className="space-y-2">
                        <a href="/chat" className={`block p-3 rounded-lg ${isDark ? 'bg-slate-700/30 hover:bg-slate-700/50 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'} transition-colors`}>
                            Chat
                        </a>
                        <a href="/document-editor" className={`block p-3 rounded-lg ${isDark ? 'bg-slate-700/30 hover:bg-slate-700/50 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'} transition-colors`}>
                            Document Editor
                        </a>
                        <a href="/voice-to-voice" className={`block p-3 rounded-lg ${isDark ? 'bg-slate-700/30 hover:bg-slate-700/50 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-900'} transition-colors`}>
                            Voice to Voice Chat
                        </a>
                    </div>
                </div>

                <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${isDark ? 'border-slate-700/50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Theme
                        </span>
                        <ThemeToggle />
                    </div>
                    
                    {user && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'} flex items-center justify-center`}>
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                        {user.fullName?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {user.fullName || 'User'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={handleLogout} className={`p-2 rounded-lg ${isDark ? 'text-red-400 hover:bg-slate-700/50' : 'text-red-500 hover:bg-gray-100'} transition-colors`}>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileNav;
