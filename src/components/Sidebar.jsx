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
                <div className="p-4 border-t border-transparent">
                    <h2 className="text-lg font-semibold text-white">
                        CaseBud AI
                    </h2>
                    <p className="text-sm text-slate-400">Legal Assistant</p>
                </div>

                <div className="flex-1 p-4 pb-24 overflow-y-auto">
                    <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">
                        Quick Prompts
                    </h3>
                    <div className="space-y-2">
                        <button
                            onClick={() =>
                                onSelectPrompt(
                                    'What are my rights in a criminal case?'
                                )
                            }
                            className="w-full p-3 text-left rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                        >
                            <div className="flex items-center">
                                <GiHandcuffs className="mr-3 text-slate-400" />
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
                            className="w-full p-3 text-left rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                        >
                            <div className="flex items-center">
                                <GiHouse className="mr-3 text-slate-400" />
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
                            className="w-full p-3 text-left rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                        >
                            <div className="flex items-center">
                                <GiScales className="mr-3 text-slate-400" />
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
                            className="w-full p-3 text-left rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                        >
                            <div className="flex items-center">
                                <GiPublicSpeaker className="mr-3 text-slate-400" />
                                <span className="text-sm text-slate-200">
                                    Document Analysis
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* Tips Section with Dropdown */}
                    <div className="mt-6">
                        <button 
                            onClick={() => setIsTipsOpen(!isTipsOpen)}
                            className="flex items-center justify-between w-full text-left mb-2"
                        >
                            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Tips
                            </h3>
                            <span className="text-slate-400">
                                {isTipsOpen ? <FiChevronDown /> : <FiChevronRight />}
                            </span>
                        </button>
                        
                        {isTipsOpen && (
                            <div className="space-y-2 text-sm text-slate-300 pl-1 mb-4 bg-slate-700/20 p-3 rounded-lg">
                                <p className="flex items-center">
                                    <span className="text-blue-400 mr-2">•</span> 
                                    Ask specific legal questions
                                </p>
                                <p className="flex items-center">
                                    <span className="text-blue-400 mr-2">•</span> 
                                    Provide context when needed
                                </p>
                                <p className="flex items-center">
                                    <span className="text-blue-400 mr-2">•</span> 
                                    Request case law citations
                                </p>
                                <p className="flex items-center">
                                    <span className="text-blue-400 mr-2">•</span> 
                                    Use detailed mode for complex questions
                                </p>
                                <p className="flex items-center">
                                    <span className="text-blue-400 mr-2">•</span> 
                                    Try different languages for international law
                                </p>
                            </div>
                        )}
                        
                        {/* Tools Section with Dropdown */}
                        <button 
                            onClick={() => setIsToolsOpen(!isToolsOpen)}
                            className="flex items-center justify-between w-full text-left mb-2 mt-4"
                        >
                            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Tools
                            </h3>
                            <span className="text-slate-400">
                                {isToolsOpen ? <FiChevronDown /> : <FiChevronRight />}
                            </span>
                        </button>
                        
                        {isToolsOpen && (
                            <div className="space-y-2 text-sm text-slate-300 pl-1 bg-slate-700/20 p-3 rounded-lg">
                                <p className="flex items-center">
                                    <FiUploadCloud className="mr-2 text-blue-400" /> 
                                    Document Upload
                                </p>
                                <p className="flex items-center">
                                    <FiGlobe className="mr-2 text-blue-400" /> 
                                    Web Search
                                </p>
                                <p className="flex items-center">
                                    <FiMic className="mr-2 text-blue-400" /> 
                                    Voice Chat
                                </p>
                                <p className="flex items-center">
                                    {/* Custom SVG for Voice-to-Voice Chat */}
                                    <svg
                                        className="w-4 h-4 mr-2 text-purple-400"
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
                                <p className="flex items-center">
                                    {/* Custom SVG for Text-to-Speech */}
                                    <svg
                                        className="w-4 h-4 mr-2 text-blue-400"
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
                                <p className="flex items-center">
                                    {/* Custom SVG for Detailed Reasoning */}
                                    <svg
                                        className="w-4 h-4 mr-2 text-green-400"
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
                                <p className="flex items-center">
                                    {/* Language Selector with Translation Icon */}
                                    <svg
                                        className="w-4 h-4 mr-2 text-blue-400"
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
                                <p className="flex items-center">
                                    {/* Document Creation Icon */}
                                    <svg
                                        className="w-4 h-4 mr-2 text-blue-400"
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
                        )}
                    </div>
                </div>

                {!isAuthenticated && (
                    <div className="p-4">
                        <Link
                            to="/register"
                            className="block w-full text-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Register
                        </Link>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-800/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
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