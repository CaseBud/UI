import React from 'react';
import { FiMenu, FiPlus, FiGlobe, FiMic, FiClock, FiSun, FiMoon } from 'react-icons/fi';

const MobileBottomBar = ({ 
  onMenuToggle, 
  onNewChat, 
  onWebToggle, 
  onVoiceToggle, 
  onHistoryToggle, 
  isWebMode, 
  isVoiceMode, 
  darkMode, 
  onDarkModeToggle 
}) => {
  return (
    <div className={`fixed bottom-0 left-0 right-0 ${darkMode ? 'bg-slate-800 border-t border-slate-700' : 'bg-white border-t border-gray-200'} py-2 px-3 flex justify-between items-center z-10`}>
      <button
        onClick={onMenuToggle}
        className={`p-2 rounded-full ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
        aria-label="Toggle menu"
      >
        <FiMenu className="w-4 h-4" />
      </button>

      <button
        onClick={onNewChat}
        className={`p-2 rounded-full ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'} transition-colors`}
        aria-label="New chat"
      >
        <FiPlus className="w-4 h-4" />
      </button>

      <button
        onClick={onWebToggle}
        className={`p-2 rounded-full transition-colors ${
          isWebMode 
            ? (darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600') 
            : (darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100')
        }`}
        aria-label={isWebMode ? "Web search enabled" : "Enable web search"}
      >
        <FiGlobe className="w-4 h-4" />
      </button>

      <button
        onClick={onVoiceToggle}
        className={`p-2 rounded-full transition-colors ${
          isVoiceMode 
            ? (darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600') 
            : (darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100')
        }`}
        aria-label={isVoiceMode ? "Voice mode enabled" : "Enable voice mode"}
      >
        <FiMic className="w-4 h-4" />
      </button>

      <button
        onClick={onHistoryToggle}
        className={`p-2 rounded-full ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
        aria-label="Toggle history"
      >
        <FiClock className="w-4 h-4" />
      </button>

      <button
        onClick={onDarkModeToggle}
        className={`p-2 rounded-full ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default MobileBottomBar;
