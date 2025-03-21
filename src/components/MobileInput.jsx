import React, { useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext'; // Import for translations
import { translate } from '../utils/translations'; // Import translation utility
import { FaMicrophone } from 'react-icons/fa'; // Import microphone icon

const MobileInput = ({
    message,
    handleMessageChange,
    handleSubmit,
    isTyping,
    isTempUser,
    isWebMode,
    isDetailedMode,
    isToolsOpen,
    setIsToolsOpen,
    IconComponents,
    handleVoiceRecord, // Updated prop name
    isRecording, // New prop
    transcribing, // New prop
}) => {
    const { isDark } = useTheme();
    const { currentLanguage } = useLanguage(); // Get current language
    const inputRef = useRef(null);

    return (
        <div
            className={`${
                isDark ? 'bg-slate-800/95 backdrop-blur-sm' : 'bg-white'
            }`}
        >
            <div className="p-3">
                <form onSubmit={handleSubmit} className="relative">
                    <div className="relative flex items-center">
                        <textarea
                            ref={inputRef}
                            value={message}
                            onChange={handleMessageChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                    e.target.style.height = '40px';
                                }
                            }}
                            placeholder={
                                isTempUser
                                    ? translate('chat.registerToChat', currentLanguage)
                                    : isWebMode
                                    ? translate('chat.webSearchPlaceholder', currentLanguage)
                                    : translate('chat.placeholder', currentLanguage)
                            }
                            className={`w-full rounded-lg pl-4 pr-20 py-3
                                ${
                                    isDark
                                        ? 'bg-slate-700/40 text-white placeholder-slate-400 border-slate-600/40'
                                        : 'bg-gray-100/80 text-gray-800 placeholder-gray-500 border-gray-200'
                                } border text-sm resize-none overflow-hidden leading-relaxed
                                transition-all duration-200 focus:outline-none
                                ${
                                    isWebMode
                                        ? 'focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                        : isDark
                                        ? 'focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20'
                                        : 'focus:border-blue-300 focus:ring-1 focus:ring-blue-300/30'
                                }`}
                            disabled={isTyping || isTempUser || transcribing}
                            rows="1"
                            style={{ height: '40px' }}
                        />

                        {/* Action Buttons */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            {/* Voice Record Button */}
                            <button
                                type="button"
                                onClick={handleVoiceRecord}
                                disabled={isTyping || transcribing || isTempUser}
                                className={`p-1.5 rounded-full transition-all duration-200 flex items-center justify-center
                                    ${
                                        isRecording
                                            ? isDark
                                                ? 'text-red-400 bg-slate-700/50'
                                                : 'text-red-500 bg-gray-200'
                                            : isDark
                                            ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                                    } disabled:text-gray-400 disabled:cursor-not-allowed`}
                                    title={translate('chat.voiceInput', currentLanguage) || 'Voice Input'}
                            >
                                <FaMicrophone className="w-5 h-5" />
                            </button>

                            {/* Send Button */}
                            <button
                                type="submit"
                                disabled={isTyping || !message.trim() || isTempUser || transcribing}
                                className={`p-1.5 rounded-full transition-colors flex items-center justify-center
                                    ${
                                        message.trim() && !isTyping && !isTempUser && !transcribing
                                            ? isDark
                                                ? 'text-white bg-blue-500 hover:bg-blue-600'
                                                : 'text-white bg-blue-500 hover:bg-blue-600'
                                            : isDark
                                            ? 'text-slate-400 hover:text-white disabled:text-slate-600'
                                            : 'text-gray-600 hover:text-gray-800 disabled:text-gray-400'
                                    } disabled:cursor-not-allowed`}
                            >
                                <IconComponents.Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MobileInput;