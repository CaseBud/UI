import React, { useState } from 'react';
import {
    GiScales,
    GiHandcuffs,
    GiHouse
} from 'react-icons/gi';
import { 
    FiLogOut, 
    FiChevronDown, 
    FiChevronRight, 
    FiGlobe, 
    FiMic, 
    FiFileText, 
    FiPlus,
    FiSun,
    FiMoon,
    FiMenu,
    FiX,
    FiMessageSquare,
    FiZap,
    FiCode,
    FiEdit3,
    FiBookOpen
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ user, onSelectPrompt, darkMode, toggleDarkMode, onClose, isOpen }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isToolsOpen, setIsToolsOpen] = useState(true);
    const [activeSection, setActiveSection] = useState('quick');

    const handleLogout = () => {
        authService.logout();
        navigate('/login', { replace: true });
    };

    const quickPrompts = [
        { icon: <FiMessageSquare />, text: "Explain quantum computing in simple terms" },
        { icon: <FiZap />, text: "Write a creative story about a time traveler" },
        { icon: <FiCode />, text: "Help me debug this code snippet" },
        { icon: <FiEdit3 />, text: "Summarize the key points of climate change" },
        { icon: <FiBookOpen />, text: "Recommend books on artificial intelligence" }
    ];

    return (
        <div className={`fixed inset-y-0 left-0 w-52 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-30 flex flex-col ${darkMode ? 'bg-slate-900 text-slate-200' : 'bg-white text-gray-800'} shadow-lg`}>
            <div className={`flex items-center justify-between p-3 ${darkMode ? 'border-b border-slate-700' : 'border-b border-gray-200'}`}>
                <h2 className="text-base font-medium">AI Assistant</h2>
                <div className="flex space-x-1">
                    <button
                        onClick={toggleDarkMode}
                        className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} transition-colors`}
                        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={onClose}
                        className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} transition-colors md:hidden`}
                        aria-label="Close sidebar"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex border-b border-gray-200 dark:border-slate-700">
                <button
                    className={`flex-1 py-2 text-xs font-medium ${activeSection === 'quick' 
                        ? (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') 
                        : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700')}`}
                    onClick={() => setActiveSection('quick')}
                >
                    Quick Prompts
                </button>
                <button
                    className={`flex-1 py-2 text-xs font-medium ${activeSection === 'custom' 
                        ? (darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') 
                        : (darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700')}`}
                    onClick={() => setActiveSection('custom')}
                >
                    Custom Prompts
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {activeSection === 'quick' && (
                    <div className="space-y-1.5">
                        {quickPrompts.map((prompt, index) => (
                            <button
                                key={index}
                                className={`w-full text-left p-2 rounded-md text-xs flex items-start ${
                                    darkMode 
                                        ? 'hover:bg-slate-800 focus:bg-slate-800' 
                                        : 'hover:bg-gray-100 focus:bg-gray-100'
                                } transition-colors`}
                            >
                                <span className={`mr-2 mt-0.5 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                    {prompt.icon}
                                </span>
                                <span className="leading-tight">{prompt.text}</span>
                            </button>
                        ))}
                    </div>
                )}
                
                {activeSection === 'custom' && (
                    <div className={`flex flex-col items-center justify-center h-full ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                        <p className="text-xs text-center mb-2">No custom prompts yet</p>
                        <button className={`px-3 py-1.5 rounded-md text-xs ${
                            darkMode 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        } transition-colors`}>
                            Create Prompt
                        </button>
                    </div>
                )}
            </div>

            <div className={`p-3 ${darkMode ? 'border-t border-slate-700' : 'border-t border-gray-200'}`}>
                <button className={`w-full py-1.5 px-3 rounded-md text-xs font-medium ${
                    darkMode 
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                } transition-colors flex items-center justify-center`}>
                    <FiMenu className="mr-1.5 w-3.5 h-3.5" />
                    Settings
                </button>
            </div>
        </div>
    );
};

export default Sidebar;