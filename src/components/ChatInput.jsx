import React, { useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
import { FaMicrophone } from 'react-icons/fa';

const ChatInput = ({
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
    handleDetailedModeToggle,
    handleTextToSpeechToggle,
    isTextToSpeechEnabled,
    handleDocumentUploadClick,
    setIsWebMode,
    setDocumentAnalysisId,
    setIsDocumentAnalysis,
    handleVoiceRecord, // Updated to match Chat.jsx
    isRecording,
    transcribing,
}) => {
    const { isDark, lightModeBaseColor } = useTheme();
    const { currentLanguage } = useLanguage();
    const inputRef = useRef(null);

    return (
        <div
            className={`border-t ${
                isDark
                    ? 'border-slate-700/50 bg-slate-800/95 backdrop-blur-sm'
                    : `border-[${lightModeBaseColor}]/50 bg-white`
            }`}
        >
            <div className="max-w-3xl mx-auto p-3">
                {/* Mode indicators */}
                <div className="flex flex-wrap gap-2 mb-2">
                    {isWebMode && (
                        <div className="flex items-center text-xs text-blue-400">
                            <IconComponents.Globe className="w-3.5 h-3.5 mr-1.5" />
                            <span>{translate('chat.webModeEnabled', currentLanguage)}</span>
                            <span className="ml-1 px-1 py-0.5 text-xs bg-blue-500/20 rounded">
                                beta
                            </span>
                        </div>
                    )}
                    {isDetailedMode && (
                        <div className="flex items-center text-xs text-purple-400">
                            <svg
                                className="w-3.5 h-3.5 mr-1.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            </svg>
                            <span>{translate('chat.detailedModeEnabled', currentLanguage)}</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="relative">
                    <div className="relative">
                        <textarea
                            ref={inputRef}
                            value={message}
                            onChange={handleMessageChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                    e.target.style.height = '36px';
                                }
                            }}
                            placeholder={translate('chat.placeholder', currentLanguage)}
                            className={`w-full rounded-lg pl-3 pr-24 py-2
                                ${
                                    isDark
                                        ? 'bg-slate-700/40 text-white placeholder-slate-400 border-slate-600/40'
                                        : `bg-[${lightModeBaseColor}]/20 text-gray-800 placeholder-gray-500 border-[${lightModeBaseColor}]/50`
                                } border text-sm resize-none overflow-hidden leading-relaxed
                                transition-all duration-200 focus:outline-none
                                ${
                                    isWebMode
                                        ? 'focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20'
                                        : isDark
                                        ? 'focus:border-slate-500 focus:ring-1 focus:ring-slate-500/20'
                                        : `focus:border-[${lightModeBaseColor}] focus:ring-1 focus:ring-[${lightModeBaseColor}]/30`
                                }`}
                            disabled={isTyping || isTempUser || transcribing}
                            rows="1"
                            style={{ height: '36px' }}
                        />

                        {/* Action buttons */}
                        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            {/* Voice Record Button */}
                            <button
                                type="button"
                                onClick={handleVoiceRecord} // Updated to handleVoiceRecord
                                disabled={isTyping || transcribing || isTempUser}
                                className={`p-1.5 rounded-lg transition-all duration-200 flex items-center justify-center
                                    ${
                                        isRecording
                                            ? isDark
                                                ? 'text-red-400 bg-slate-700/50'
                                                : 'text-red-500 bg-gray-200'
                                            : isDark
                                            ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                            : `text-gray-600 hover:text-gray-800 hover:bg-[${lightModeBaseColor}]/50`
                                    } disabled:text-gray-400 disabled:cursor-not-allowed`}
                                    title={translate('chat.voiceInput', currentLanguage) || 'Voice Input'}
                            >
                                <FaMicrophone className="w-4 h-4" />
                            </button>

                            {/* Tools Button */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsToolsOpen(!isToolsOpen)}
                                    className={`p-1.5 rounded-lg transition-all duration-200 flex items-center justify-center
                                        ${
                                            isToolsOpen
                                                ? isDark
                                                    ? 'bg-slate-700/70 text-white'
                                                    : `bg-[${lightModeBaseColor}]/70 text-gray-700`
                                                : isDark
                                                ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                                : `text-gray-600 hover:text-gray-800 hover:bg-[${lightModeBaseColor}]/50`
                                        }`}
                                    title={translate('chat.tools', currentLanguage)}
                                >
                                    <IconComponents.Tools className="w-4 h-4" />
                                </button>

                                {/* Tools Menu */}
                                {isToolsOpen && (
                                    <div
                                        className={`absolute bottom-full right-0 mb-2 w-48 rounded-lg shadow-lg border ${
                                            isDark
                                                ? 'bg-slate-800 border-slate-700/50'
                                                : `bg-white border-[${lightModeBaseColor}]/50`
                                        }`}
                                    >
                                        <div className="p-2 space-y-1">
                                            {/* Web Search */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!isWebMode) {
                                                        setDocumentAnalysisId(null);
                                                        setIsDocumentAnalysis(false);
                                                    }
                                                    setIsWebMode(!isWebMode);
                                                    setIsToolsOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-2 p-1.5 rounded-md text-sm ${
                                                    isWebMode
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : isDark
                                                        ? 'text-slate-300 hover:bg-slate-700/50'
                                                        : `text-gray-700 hover:bg-[${lightModeBaseColor}]/50`
                                                }`}
                                            >
                                                <IconComponents.Globe className="w-4 h-4" />
                                                {translate('chat.webSearch', currentLanguage)}
                                            </button>

                                            {/* Text to Speech */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleTextToSpeechToggle();
                                                    setIsToolsOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-2 p-1.5 rounded-md text-sm ${
                                                    isTextToSpeechEnabled
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : isDark
                                                        ? 'text-slate-300 hover:bg-slate-700/50'
                                                        : `text-gray-700 hover:bg-[${lightModeBaseColor}]/50`
                                                }`}
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                                </svg>
                                                {translate('chat.textToSpeech', currentLanguage)}
                                            </button>

                                            {/* Detailed Mode */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleDetailedModeToggle(!isDetailedMode);
                                                    setIsToolsOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-2 p-1.5 rounded-md text-sm ${
                                                    isDetailedMode
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : isDark
                                                        ? 'text-slate-300 hover:bg-slate-700/50'
                                                        : `text-gray-700 hover:bg-[${lightModeBaseColor}]/50`
                                                }`}
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                                </svg>
                                                {translate('chat.detailedMode', currentLanguage) ||
                                                    'Reasoning Mode'}
                                            </button>

                                            {/* Voice Chat */}
                                            <button
                                                type="button"
                                                onClick={() => setIsToolsOpen(false)}
                                                className={`w-full flex items-center gap-2 p-1.5 rounded-md text-sm ${
                                                    isDark
                                                        ? 'text-slate-300 hover:bg-slate-700/50'
                                                        : `text-gray-700 hover:bg-[${lightModeBaseColor}]/50`
                                                }`}
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                                    <line x1="12" y1="19" x2="12" y2="23" />
                                                    <line x1="8" y1="23" x2="16" y2="23" />
                                                </svg>
                                                Voice Chat
                                            </button>

                                            {/* Document Upload */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleDocumentUploadClick();
                                                    setIsToolsOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-2 p-1.5 rounded-md text-sm ${
                                                    isDark
                                                        ? 'text-slate-300 hover:bg-slate-700/50'
                                                        : `text-gray-700 hover:bg-[${lightModeBaseColor}]/50`
                                                }`}
                                            >
                                                <svg
                                                    className="w-4 h-4"
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
                                                {translate('document.upload', currentLanguage)}
                                            </button>

                                            {/* Camera/OCR Button */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // Create a temporary input element for camera capture
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.capture = 'environment'; // Use rear camera
                                                    input.onchange = (e) => handleCameraCapture(e);
                                                    input.click();
                                                    setIsToolsOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-2 p-1.5 rounded-md text-sm ${
                                                    isDark
                                                        ? 'text-slate-300 hover:bg-slate-700/50'
                                                        : `text-gray-700 hover:bg-[${lightModeBaseColor}]/50`
                                                }`}
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                >
                                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                                    <circle cx="12" cy="13" r="4"/>
                                                </svg>
                                                Scan Document
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Send Button */}
                            <button
                                type="submit"
                                disabled={!message.trim() || isTyping || isTempUser || transcribing}
                                className={`p-1.5 rounded-lg flex items-center justify-center transition-all
                                    ${
                                        message.trim() && !isTyping && !isTempUser && !transcribing
                                            ? isDark
                                                ? 'text-white bg-blue-500 hover:bg-blue-600'
                                                : 'text-white bg-blue-500 hover:bg-blue-600'
                                            : isDark
                                            ? 'text-slate-400 cursor-not-allowed'
                                            : `text-gray-600 hover:text-gray-800 disabled:text-gray-400`
                                    } disabled:cursor-not-allowed`}
                                aria-label={translate('chat.send', currentLanguage)}
                            >
                                {isTyping ? (
                                    <IconComponents.Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <IconComponents.Send className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatInput;