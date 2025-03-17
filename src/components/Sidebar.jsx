import React, { useState } from 'react';
import {
    GiScales,
    GiHandcuffs,
    GiHouse,
    GiPublicSpeaker
} from 'react-icons/gi';
import { FiLogOut, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { 
    FiUploadCloud, 
    FiGlobe, 
    FiMic, 
    FiFileText, 
    FiBook, 
    FiVolume2, 
    FiPlus 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Sidebar = ({ user, onSelectPrompt, onDocumentUploadClick }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { isDark } = useTheme();
    const [isTipsOpen, setIsTipsOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isSearchToolsOpen, setIsSearchToolsOpen] = useState(false);
    const [isVoiceToolsOpen, setIsVoiceToolsOpen] = useState(false);
    const [isLanguageToolsOpen, setIsLanguageToolsOpen] = useState(false);
    const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);

    const handleLogout = () => {
        authService.logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className={`hidden md:flex w-60 flex-shrink-0 ${
            isDark ? 'bg-legal-dark-card text-legal-dark-text' : 'bg-white text-legal-light-text'
        } h-screen`}>
            <div className="flex flex-col w-full relative h-full">
                {/* Header */}
                <div className={`p-4 border-b ${
                    isDark ? 'border-slate-700/50' : 'border-gray-200'
                }`}>
                    <h2 className={`text-base font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                    } flex items-center`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isDark ? 'bg-legal-primary' : 'bg-legal-primary'
                        }`}>
                            {/* Legal scale icon */}
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="ml-2">CaseBud AI</span>
                    </h2>
                    <p className={`text-xs mt-1 ml-10 ${
                        isDark ? 'text-slate-400' : 'text-gray-500'
                    }`}>Legal Assistant</p>
                </div>

                <div className="flex-1 px-4 py-6 pb-20 overflow-y-auto">
                    {/* Quick Prompts Section */}
                    <div className="mb-6">
                        <h3 className={`text-xs font-medium uppercase tracking-wider mb-3 flex items-center ${
                            isDark ? 'text-slate-400' : 'text-gray-500'
                        }`}>
                            <svg className="w-3.5 h-3.5 mr-1.5 text-legal-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Quick Prompts
                        </h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => onSelectPrompt('What are my rights in a criminal case?')}
                                className={`w-full p-2.5 text-left rounded-lg transition-colors border ${
                                    isDark 
                                        ? 'bg-slate-700/30 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50' 
                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                                } group`}
                            >
                                <div className="flex items-center">
                                    {/* Handcuffs icon */}
                                    <svg className={`w-4 h-4 mr-2 ${isDark ? 'text-legal-accent' : 'text-legal-primary'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M7 7H3a2 2 0 00-2 2v10a2 2 0 002 2h4M17 7h4a2 2 0 012 2v10a2 2 0 01-2 2h-4M12 7v10M8 7h8" />
                                    </svg>
                                    <span className={`text-sm ${
                                        isDark ? 'text-slate-200' : 'text-gray-700'
                                    } group-hover:text-current transition-colors`}>
                                        Criminal Rights
                                    </span>
                                </div>
                            </button>

                            <button
                                onClick={() => onSelectPrompt('Help with tenant rights and housing laws')}
                                className={`w-full p-2.5 text-left rounded-lg transition-colors border ${
                                    isDark 
                                        ? 'bg-slate-700/30 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50' 
                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                                } group`}
                            >
                                <div className="flex items-center">
                                    {/* House icon */}
                                    <svg className={`w-4 h-4 mr-2 ${isDark ? 'text-legal-accent' : 'text-legal-primary'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span className={`text-sm ${
                                        isDark ? 'text-slate-200' : 'text-gray-700'
                                    } group-hover:text-current transition-colors`}>
                                        Housing Laws
                                    </span>
                                </div>
                            </button>

                            <button
                                onClick={() =>
                                    onSelectPrompt(
                                        'Explain contract terms and obligations'
                                    )
                                }
                                className={`w-full p-2.5 text-left rounded-lg transition-colors border ${
                                    isDark 
                                        ? 'bg-slate-700/30 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50' 
                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                                } group`}
                            >
                                <div className="flex items-center">
                                    <svg
                                        className={`w-4 h-4 mr-2 ${isDark ? 'text-legal-accent' : 'text-legal-primary'}`}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                    <span className={`text-sm ${
                                        isDark ? 'text-slate-200' : 'text-gray-700'
                                    } group-hover:text-current transition-colors`}>
                                        Contract Law
                                    </span>
                                </div>
                            </button>

                            <button
                                onClick={() =>
                                    onSelectPrompt(
                                        'Help analyze this legal document'
                                    )
                                }
                                className={`w-full p-2.5 text-left rounded-lg transition-colors border ${
                                    isDark 
                                        ? 'bg-slate-700/30 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50' 
                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                                } group`}
                            >
                                <div className="flex items-center">
                                    <svg
                                        className={`w-4 h-4 mr-2 ${isDark ? 'text-legal-accent' : 'text-legal-primary'}`}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                    <span className={`text-sm ${
                                        isDark ? 'text-slate-200' : 'text-gray-700'
                                    } group-hover:text-current transition-colors`}>
                                        Document Analysis
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="mb-6">
                        <button 
                            onClick={() => setIsTipsOpen(!isTipsOpen)}
                            className={`flex items-center justify-between w-full text-xs font-medium uppercase tracking-wider mb-3 ${
                                isDark ? 'text-slate-400' : 'text-gray-500'
                            }`}
                        >
                            <div className="flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1.5 text-legal-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Tips
                            </div>
                            {isTipsOpen ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                        </button>
                        
                        {isTipsOpen && (
                            <div className="space-y-3 pl-5 mb-4 animate-fadeIn">
                                {[
                                    'Ask specific legal questions',
                                    'Provide context when needed',
                                    'Request case law citations',
                                    'Use detailed mode for complex questions',
                                    'Try different languages for international law'
                                ].map((tip, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 mr-2 ${
                                            isDark ? 'bg-legal-accent' : 'bg-legal-primary'
                                        }`}></div>
                                        <p className={`text-xs ${
                                            isDark ? 'text-slate-300' : 'text-gray-600'
                                        }`}>{tip}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tools Section */}
                    <div className="mb-6">
                        <button 
                            onClick={() => setIsToolsOpen(!isToolsOpen)}
                            className={`flex items-center justify-between w-full text-left mb-3 mt-6 group ${
                                isDark ? 'hover:text-white' : 'hover:text-gray-900'
                            }`}
                        >
                            <h3 className={`text-xs font-medium uppercase tracking-wider flex items-center ${
                                isDark ? 'text-slate-400' : 'text-gray-500'
                            }`}>
                                <svg className="w-3.5 h-3.5 mr-1.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                </svg>
                                Tools
                            </h3>
                            <span className={`text-gray-400 group-hover:text-blue-400 transition-colors ${
                                isDark ? 'hover:text-white' : 'hover:text-gray-500'
                            }`}>
                                {isToolsOpen ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
                            </span>
                        </button>
                        
                        {isToolsOpen && (
                            <div className={`space-y-0 text-sm p-4 rounded-lg border ${
                                isDark ? 'bg-slate-700/20 border-slate-700/50 text-slate-300' : 'bg-gray-50 border-gray-200 text-gray-600'
                            }`}>
                                {/* Document Tools Group */}
                                <div className="mb-3">
                                    <p className="text-xs font-medium text-slate-400 uppercase mb-2 pl-1">Document Tools</p>
                                    <div className="space-y-2.5">
                                        <p 
                                            className="flex items-center p-2 hover:bg-slate-700/30 rounded-md transition-colors cursor-pointer"
                                            onClick={onDocumentUploadClick}
                                        >
                                            <svg className="w-4 h-4 mr-2.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                                <line x1="12" y1="18" x2="12" y2="12" />
                                                <line x1="9" y1="15" x2="15" y2="15" />
                                            </svg>
                                            Upload Document
                                        </p>
                                        <p className="flex items-center p-2 hover:bg-slate-700/30 rounded-md transition-colors">
                                            {/* Document Creation Icon */}
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                                <line x1="12" y1="18" x2="12" y2="12" />
                                                <line x1="9" y1="15" x2="15" y2="15" />
                                            </svg>
                                            Document Creation
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Search Tools Group */}
                                <div className="mb-3 pt-3 border-t border-slate-700/50">
                                    <p className="text-xs font-medium text-slate-400 uppercase mb-2 pl-1">Search Tools</p>
                                    <div className="space-y-2.5">
                                        <p className="flex items-center p-2 hover:bg-slate-700/30 rounded-md transition-colors">
                                            <svg
                                                className="w-4 h-4 mr-2.5 text-blue-400"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="2" y1="12" x2="22" y2="12" />
                                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                            </svg>
                                            Web Search
                                        </p>
                                        <p className="flex items-center p-2 hover:bg-slate-700/30 rounded-md transition-colors">
                                            <svg
                                                className="w-4 h-4 mr-2.5 text-blue-400"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                            </svg>
                                            Reasoning Mode
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Voice Tools Group */}
                                <div className="mb-3 pt-3 border-t border-slate-700/50">
                                    <p className="text-xs font-medium text-slate-400 uppercase mb-2 pl-1">Voice Tools</p>
                                    <div className="space-y-2.5">
                                        <p className="flex items-center p-2 hover:bg-slate-700/30 rounded-md transition-colors">
                                            <FiMic className="mr-2.5 text-blue-400" /> 
                                            Voice Chat
                                        </p>
                                        <p className="flex items-center p-2 hover:bg-slate-700/30 rounded-md transition-colors">
                                            {/* Custom SVG for Voice-to-Voice Chat */}
                                            <svg
                                                className="w-4 h-4 mr-2.5 text-purple-400"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                                <line x1="12" y1="19" x2="12" y2="23" />
                                                <line x1="8" y1="23" x2="16" y2="23" />
                                                <path d="M2 15 L2 9 L6 9 L11 5 L11 19 L6 15 L2 15" transform="translate(11, 0) scale(0.5)" />
                                            </svg>
                                            Voice-to-Voice Chat
                                        </p>
                                        <p className="flex items-center p-2 hover:bg-slate-700/30 rounded-md transition-colors">
                                            {/* Custom SVG for Text-to-Speech */}
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                            </svg>
                                            Text-to-Speech
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Language Tools Group */}
                                <div className="pt-3 border-t border-slate-700/50">
                                    <p className="text-xs font-medium text-slate-400 uppercase mb-2 pl-1">Language Tools</p>
                                    <div className="space-y-2.5">
                                        <p className="flex items-center p-2 hover:bg-slate-700/30 rounded-md transition-colors">
                                            {/* Language Selector with Translation Icon */}
                                            <svg
                                                className="w-4 h-4 mr-2.5 text-blue-400"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M4 21h16" />
                                                <path d="M9 3h6" />
                                                <path d="M12 3v18" />
                                                <path d="M5 8l6 6 6-6" />
                                            </svg>
                                            Multilingual Support
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <h3 className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Features
                        </h3>
                        <div className="space-y-1">
                            <a
                                href="/chat"
                                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700/50 hover:text-white"
                            >
                                <svg
                                    className="mr-3 h-5 w-5 text-slate-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                    />
                                </svg>
                                Chat
                            </a>
                            
                            <a
                                href="/document-editor"
                                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700/50 hover:text-white"
                            >
                                <svg
                                    className="mr-3 h-5 w-5 text-slate-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Document Editor
                            </a>
                        </div>
                    </div>
                </div>

                {!isAuthenticated && (
                    <div className="p-5 border-t border-slate-700/50">
                        <Link
                            to="/register"
                            className="block w-full text-center bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Register
                        </Link>
                    </div>
                )}

                <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
                    isDark ? 'border-slate-700/50' : 'border-gray-200'
                }`}>
                    <div className="flex items-center justify-between">
                        {user && (
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
                                    <p className={`text-sm font-medium truncate ${
                                        isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {user?.fullName || 'User'}
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                            <ThemeToggle className={isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100'} />
                            
                            <button
                                onClick={handleLogout}
                                className={`p-2 rounded-lg ${
                                    isDark ? 'text-red-400 hover:bg-slate-700/50 hover:text-red-300' : 'text-red-500 hover:bg-gray-100 hover:text-red-600'
                                } transition-colors`}
                                aria-label="Logout"
                            >
                                <FiLogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;