import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { FiX, FiMessageSquare, FiMic, FiFolder, FiLogOut } from 'react-icons/fi';

const MobileNav = ({ user, onSelectPrompt, isTempUser, isOpen, onClose, darkMode }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login', { replace: true });
    };

    return (
        <div
            className={`fixed inset-0 ${darkMode ? 'bg-slate-900/90' : 'bg-gray-800/80'} z-50 lg:hidden transition-all duration-300 
                  ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div
                className={`w-[280px] h-full ${darkMode ? 'bg-slate-800' : 'bg-white'} transform transition-transform duration-300 shadow-xl
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className={`p-4 border-b ${darkMode ? 'border-slate-700/50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div
                                className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg 
                            flex items-center justify-center"
                            >
                                <img
                                    src="https://res.cloudinary.com/dintwofob/image/upload/v1739117262/assets/sgep1zueqfedt8xkham4.jpg"
                                    alt="Icon"
                                    className="h-5 w-5 text-white"
                                />
                            </div>
                            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                CaseBud
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                        >
                            <FiX className={`w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'} uppercase tracking-wider mb-3`}>
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
                            }
                        ].map((item) => (
                            <button
                                key={item.title}
                                onClick={() => {
                                    onSelectPrompt(item.prompt);
                                    onClose();
                                }}
                                className={`w-full p-3 text-left rounded-lg ${
                                    darkMode 
                                        ? 'bg-slate-700 hover:bg-slate-700/80 text-slate-200' 
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                } transition-colors flex items-center space-x-3`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="text-sm font-medium">
                                    {item.title}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`px-4 py-3 border-t ${darkMode ? 'border-slate-700/50' : 'border-gray-200'}`}>
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'} uppercase tracking-wider mb-3`}>
                        Navigation
                    </h3>
                    <div className="space-y-1">
                        <a
                            href="/chat"
                            className={`flex items-center px-3 py-2.5 rounded-md text-base font-medium ${
                                darkMode 
                                    ? 'text-slate-300 hover:bg-slate-700 hover:text-white' 
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            } transition-colors`}
                        >
                            <FiMessageSquare className="w-5 h-5 mr-3" />
                            Chat
                        </a>
                        <a
                            href="/voice-chat"
                            className={`flex items-center px-3 py-2.5 rounded-md text-base font-medium ${
                                darkMode 
                                    ? 'text-slate-300 hover:bg-slate-700 hover:text-white' 
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            } transition-colors`}
                        >
                            <FiMic className="w-5 h-5 mr-3" />
                            Voice Chat
                        </a>
                        <a
                            href="/documents"
                            className={`flex items-center px-3 py-2.5 rounded-md text-base font-medium ${
                                darkMode 
                                    ? 'text-slate-300 hover:bg-slate-700 hover:text-white' 
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            } transition-colors`}
                        >
                            <FiFolder className="w-5 h-5 mr-3" />
                            Documents
                        </a>
                    </div>
                </div>

                {user && (
                    <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${darkMode ? 'border-slate-700/50' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-slate-600' : 'bg-gray-200'} flex items-center justify-center`}>
                                    <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                        {user.fullName?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'} truncate`}>
                                        {user.fullName || 'User'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center justify-center px-3 py-2 rounded-lg 
                            ${darkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100'} transition-colors`}
                        >
                            <FiLogOut className="w-5 h-5 mr-2" />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileNav;
