import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const MobileNav = ({ user, onSelectPrompt, isTempUser, isOpen, onClose }) => {
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const handleLogout = () => {
        authService.logout();
        navigate('/login', { replace: true });
    };

    return (
        <div
            className={`fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 lg:hidden transition-all duration-300 
                  ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div
                className={`w-[280px] h-full ${isDark ? 'bg-legal-dark-card' : 'bg-white'} transform transition-transform duration-300 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
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

                <div className="p-4">
                    <h3 className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'} uppercase tracking-wider mb-4`}>
                        Quick Prompts
                    </h3>
                    <div className="space-y-2">
                        {[
                            {
                                title: 'Criminal Rights',
                                prompt: 'What are my rights in a criminal case?',
                                icon: '⚖️'
                            },
                            {
                                title: 'Housing Laws',
                                prompt: 'Help with tenant rights and housing laws',
                                icon: '🏠'
                            },
                            {
                                title: 'Contract Law',
                                prompt: 'Explain contract terms and obligations',
                                icon: '📄'
                            }
                        ].map((item) => (
                            <button
                                key={item.title}
                                onClick={() => {
                                    onSelectPrompt(item.prompt);
                                    onClose();
                                }}
                                className={`w-full p-3 text-left rounded-lg ${
                                    isDark 
                                        ? 'bg-slate-700/30 hover:bg-slate-700/50' 
                                        : 'bg-gray-50 hover:bg-gray-100'
                                } transition-colors flex items-center space-x-3`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className={`text-sm ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                                    {item.title}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-4 pt-2 pb-3 space-y-1">
                    <a
                        href="/chat"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                            isDark 
                                ? 'text-white bg-slate-700/50 hover:bg-slate-700' 
                                : 'text-gray-900 bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        Chat
                    </a>
                    <a
                        href="/document-editor"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                            isDark 
                                ? 'text-slate-300 hover:bg-slate-700 hover:text-white' 
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                        Document Editor
                    </a>
                </div>

                <div className={`absolute bottom-[140px] left-0 right-0 p-4 border-t ${
                    isDark ? 'border-slate-700/50' : 'border-gray-200'
                }`}>
                    <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Theme
                        </span>
                        <ThemeToggle />
                    </div>
                </div>

                {user && (
                    <div className={`absolute bottom-[72px] left-0 right-0 p-4 border-t ${
                        isDark ? 'border-slate-700/50' : 'border-gray-200'
                    }`}>
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg 
                            ${isDark 
                                ? 'hover:bg-slate-700/50 text-red-400 hover:text-red-300' 
                                : 'hover:bg-gray-100 text-red-500 hover:text-red-600'
                            } transition-colors`}
                        >
                            <span>Logout</span>
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                {user && (
                    <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
                        isDark ? 'border-slate-700/50' : 'border-gray-200'
                    }`}>
                        <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full ${
                                isDark ? 'bg-slate-700' : 'bg-gray-200'
                            } flex items-center justify-center`}>
                                <span className={`text-sm font-medium ${
                                    isDark ? 'text-white' : 'text-gray-700'
                                }`}>
                                    {user.fullName?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                } truncate`}>
                                    {user.fullName || 'User'}
                                </p>
                                <p className={`text-xs ${
                                    isDark ? 'text-slate-400' : 'text-gray-500'
                                } truncate`}>
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileNav;
