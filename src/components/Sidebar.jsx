import React from 'react';
import { GiScales, GiHandcuffs, GiHouse, GiPublicSpeaker } from 'react-icons/gi';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ user, onSelectPrompt, isTempUser }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  const quickPrompts = [
    "What are my rights in a criminal case?",
    "Help with tenant rights and housing laws",
    "Explain contract terms and obligations",
    "Help analyze this legal document"
  ];

  return (
    <div className="hidden md:flex w-64 flex-shrink-0 border-r border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
      <div className="flex flex-col w-full">
        <div className="p-4 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-white">CaseBud AI</h2>
          <p className="text-sm text-slate-400">Legal Assistant</p>
        </div>

        {/* Quick Prompts */}
        <div className="flex-1 p-4">
          <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">Quick Prompts</h3>
          <div className="space-y-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => onSelectPrompt(prompt)}
                className="w-full p-3 text-left rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center">
                  {index === 0 && <GiHandcuffs className="mr-3 text-slate-400" />}
                  {index === 1 && <GiHouse className="mr-3 text-slate-400" />}
                  {index === 2 && <GiScales className="mr-3 text-slate-400" />}
                  {index === 3 && <GiPublicSpeaker className="mr-3 text-slate-400" />}
                  <span className="text-sm text-slate-200">{prompt}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Tips</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p>• Ask specific legal questions</p>
              <p>• Provide context when needed</p>
              <p>• Request case law citations</p>
            </div>
          </div>
        </div>

        {/* Register Button - Only show when not authenticated */}
        {!isAuthenticated && (
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <button
              onClick={() => navigate('/register')}
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
                />
              </svg>
              <span>Register Now</span>
            </button>
            <p className="text-xs text-center text-slate-400 mt-2">
              Create an account to unlock all features
            </p>
          </div>
        )}

        {/* Limited Access Mode - Only show when isTempUser is true */}
        {isTempUser && (
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h3 className="text-blue-400 font-medium mb-2">Limited Access Mode</h3>
            <p className="text-sm text-slate-400 mb-3">
              Create an account to unlock all features:
            </p>
            <ul className="text-sm text-slate-400 space-y-2 mb-4">
              <li>• Save conversations</li>
              <li>• Upload documents</li>
              <li>• Access advanced features</li>
            </ul>
            <button
              onClick={() => navigate('/register')}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Register Now
            </button>
          </div>
        )}

        {/* User Profile */}
        <div className="p-4 border-t border-slate-700/50">
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
