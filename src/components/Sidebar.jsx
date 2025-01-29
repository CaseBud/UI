import React from 'react';
import { GiScales, GiHandcuffs, GiHouse, GiPublicSpeaker } from 'react-icons/gi';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Sidebar = ({ user, onSelectPrompt }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

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
            <button
              onClick={() => onSelectPrompt("What are my rights in a criminal case?")}
              className="w-full p-3 text-left rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center">
                <GiHandcuffs className="mr-3 text-slate-400" />
                <span className="text-sm text-slate-200">Criminal Rights</span>
              </div>
            </button>

            <button
              onClick={() => onSelectPrompt("Help with tenant rights and housing laws")}
              className="w-full p-3 text-left rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center">
                <GiHouse className="mr-3 text-slate-400" />
                <span className="text-sm text-slate-200">Housing Laws</span>
              </div>
            </button>

            <button
              onClick={() => onSelectPrompt("Explain contract terms and obligations")}
              className="w-full p-3 text-left rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center">
                <GiScales className="mr-3 text-slate-400" />
                <span className="text-sm text-slate-200">Contract Law</span>
              </div>
            </button>

            <button
              onClick={() => onSelectPrompt("Help analyze this legal document")}
              className="w-full p-3 text-left rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center">
                <GiPublicSpeaker className="mr-3 text-slate-400" />
                <span className="text-sm text-slate-200">Document Analysis</span>
              </div>
            </button>
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
