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

const Sidebar = ({ user, onSelectPrompt }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isTipsOpen, setIsTipsOpen] = useState(true);
    const [isToolsOpen, setIsToolsOpen] = useState(true);

    const handleLogout = () => {
        authService.logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="hidden md:flex w-64 flex-shrink-0 bg-slate-800/50 backdrop-blur-sm h-screen">
            <div className="flex flex-col w-full relative h-full">
                {/* Header with logo and app name */}
                <div className="p-5 border-b border-slate-700/50">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                            <svg
                                className="w-5 h-5 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                        </div>
                        CaseBud AI
                    </h2>
                    <p className="text-sm text-slate-400 mt-1 ml-11">Legal Assistant</p>
                </div>

                <div className="flex-1 p-5 pb-24 overflow-y-auto">
                    {/* Quick Prompts Section */}
                    <div className="mb-6">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                            <svg className="w-3.5 h-3.5 mr-1.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Quick Prompts
                        </h3>
                        <div className="space-y-2.5">
                            <button
                                onClick={() =>
                                    onSelectPrompt(
                                        'What are my rights in a criminal case?'
                                    )
                                }
                                className="w-full p-3 text-left rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors border border-slate-700/50 hover:border-slate-600/50"
                            >
                                <div className="flex items-center">
                                    <GiHandcuffs className="mr-3 text-blue-400" />
                                    <span className="text-sm text-slate-200">
                                        Criminal Rights
                                    </span>
                                </div>
                            </button>

                            <button
                                onClick={() =>
                                    onSelectPrompt(
                                        'Help with tenant rights and housing laws'
                                    )
                                }
                                className="w-full p-3 text-left rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors border border-slate-700/50 hover:border-slate-600/50"
                            >
                                <div className="flex items-center">
                                    <GiHouse className="mr-3 text-blue-400" />
                                    <span className="text-sm text-slate-200">
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
                                className="w-full p-3 text-left rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors border border-slate-700/50 hover:border-slate-600/50"
                            >
                                <div className="flex items-center">
                                    <GiScales className="mr-3 text-blue-400" />
                                    <span className="text-sm text-slate-200">
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
                                className="w-full p-3 text-left rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors border border-slate-700/50 hover:border-slate-600/50"
                            >
                                <div className="flex items-center">
                                    <GiPublicSpeaker className="mr-3 text-blue-400" />
                                    <span className="text-sm text-slate-200">
                                        Document Analysis
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Tips Section with Dropdown */}
                    <div className="mb-6">
                        <button 
                            onClick={() => setIsTipsOpen(!isTipsOpen)}
                            className="flex items-center justify-between w-full text-left mb-3 group"
                        >
                            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                    <path d="M12 8v4M12 16h.01" />
                                </svg>
                                Tips
                            </h3>
                            <span className="text-slate-400 group-hover:text-blue-400 transition-colors">
                                {isTipsOpen ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
                            </span>
                        </button>
                        
                        {isTipsOpen && (
                            <div className="space-y-2.5 text-sm text-slate-300 pl-1 mb-4 bg-slate-700/20 p-4 rounded-lg border border-slate-700/50">
                                <p className="flex items-center">
                                    <span className="text-blue-400 mr-2.5 text-lg">•</span> 
                                    Ask specific legal questions
                                </p>
                                <p className="flex items-center">
                                    <span className="text-blue-400 mr-2.5 text-lg">•</span> 
                                    Provide context when needed
                                </p>
                                <p className="flex items-center">
                                    <span className="text-blue-400 mr-2.5 text-lg">•</span> 
                                    Request case law citations
                                </p>
                                <p className="flex items-center">
                                    <span className="text-blue-400 mr-2.5 text-lg">•</span> 
                                    Use detailed mode for complex questions
                                </p>
                                <p className="flex items-center">
                                    <span className="text-blue-400 mr-2.5 text-lg">•</span> 
                                    Try different languages for international law
                                </p>
                            </div>
                        )}
                        
                        {/* Tools Section with Dropdown */}
                        <button 
                            onClick={() => setIsToolsOpen(!isToolsOpen)}
                            className="flex items-center justify-between w-full text-left mb-3 mt-6 group"
                        >
                            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center">
                                <svg className="w-3.5 h-3.5 mr-1.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                                </svg>
                                Tools
                            </h3>
                            <span className="text-slate-400 group-hover:text-blue-400 transition-colors">
                                {isToolsOpen ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
                            </span>
                        </button>
                        
                        {isToolsOpen && (
                            <div className="space-y-0 text-sm text-slate-300 pl-1 bg-slate-700/20 p-4 rounded-lg border border-slate-700/50">
                                {/* Document Tools Group */}
                                <div className="mb-3">
                                    <p className="text-xs font-medium text-slate-400 uppercase mb-2 pl-1">Document Tools</p>
                                    <div className="space-y-2.5">
                                        <p className="flex items-center p-2 hover:bg-slate-700/30 rounded-md transition-colors">
                                            <FiUploadCloud className="mr-2.5 text-blue-400" /> 
                                            Document Upload
                                        </p>
                                        <p className="flex items-center p-2 hover:bg-slate-700/30 rounded-md transition-colors">
                                            {/* Document Creation Icon */}
                                            <svg
                                                className="w-4 h-4 mr-2.5 text-blue-400"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
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
                                            <FiGlobe className="mr-2.5 text-blue-400" /> 
                                            Web Search
                                        </p>
                                        <p className="flex items-center p-2 hover:bg-slate-700/30 rounded-md transition-colors">
                                            {/* Custom SVG for Detailed Reasoning */}
                                            <svg
                                                className="w-4 h-4 mr-2.5 text-green-400"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                                <line x1="6" y1="8" x2="15" y2="8" />
                                                <line x1="6" y1="12" x2="15" y2="12" />
                                                <line x1="6" y1="16" x2="15" y2="16" />
                                            </svg>
                                            Detailed Reasoning
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
                                                className="w-4 h-4 mr-2.5 text-blue-400"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
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

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">
                                    {user?.fullName?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.fullName || 'User'}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                    {user?.email || 'user@example.com'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
                            title="Logout"
                        >
                            <FiLogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;