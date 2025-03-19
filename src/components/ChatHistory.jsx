import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';

const ChatHistory = ({
    conversations = [], // Add default empty array
    onSelectChat,
    onDeleteChat,
    onEditTitle,
    onNewChat,
    isOpen,
    currentconversationId,
    onClose
}) => {
    const { isDark } = useTheme();
    const { currentLanguage } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingChatId, setEditingChatId] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    // Fix sorting with null check and default empty array
    const sortedConversations = React.useMemo(() => {
        if (!Array.isArray(conversations)) return [];

        return conversations; // comes sorted from backend o
    }, [conversations]);

    // Fix filtering with null check
    const filteredConversations = React.useMemo(() => {
        return sortedConversations.filter((chat) =>
            chat?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedConversations, searchTerm]);

    const handleStartEdit = (chatId, currentTitle) => {
        setEditingChatId(chatId);
        setNewTitle(currentTitle);
    };

    const handleSaveEdit = (chatId) => {
        if (newTitle.trim()) {
            onEditTitle(chatId, newTitle.trim());
        }
        setEditingChatId(null);
    };

    const handleCancelEdit = () => {
        setEditingChatId(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(currentLanguage, { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const EmptyState = () => (
        <div className="text-center py-8 px-4">
            <svg
                className="mx-auto h-12 w-12 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-300">
                {translate('chat.noHistory', currentLanguage) || 'No conversations yet'}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
                {translate('chat.startNew', currentLanguage) || 'Start a new chat to begin your legal inquiry.'}
            </p>
        </div>
    );

    const LoadingState = () => (
        <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
    );

    return (
        <div
            className={`
      fixed inset-0 md:static md:inset-auto
      bg-slate-800/95 z-50
      transform transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    `}
        >
            <div className="h-full flex flex-col">
                {/* Header - More compact */}
                <div className="flex items-center h-14 px-4 border-b border-slate-700/50">
                    <div className="flex items-center space-x-2">
                        <svg
                            className="w-4 h-4 text-slate-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        </svg>
                        <h2 className="text-sm font-medium text-slate-300">
                            {translate('chat.history', currentLanguage)}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors group"
                        aria-label={translate('common.close', currentLanguage)}
                    >
                        <svg
                            className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content - Better scroll handling */}
                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-3 space-y-1">
                            {/* New Chat Button with updated font */}
                            <button
                                onClick={onNewChat}
                                className="flex items-center space-x-2 w-full p-2 rounded-lg 
                          hover:bg-slate-700/50 text-left transition-colors group mb-2
                          font-medium"
                            >
                                <svg
                                    className="w-4 h-4 text-slate-400 group-hover:text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                <span className="text-sm text-slate-300">
                                    {translate('mobile.newChat', currentLanguage)}
                                </span>
                            </button>

                            {/* Search Input */}
                            <div className="relative mb-2">
                                <input
                                    type="text"
                                    placeholder={translate('chat.search', currentLanguage) || "Search conversations..."}
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full px-3 py-1.5 text-sm bg-slate-700/50 rounded-lg border border-slate-600/50 
                            text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                                />
                                <svg
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>

                            {/* Chat List with updated styling */}
                            <div className="flex-1 overflow-y-auto min-h-0 -mr-2 pr-2">
                                {isLoading ? (
                                    <LoadingState />
                                ) : !Array.isArray(conversations) ||
                                  conversations.length === 0 ? (
                                    <EmptyState />
                                ) : !filteredConversations.length ? (
                                    <div className="text-center py-8 px-4">
                                        <p className="text-sm text-slate-400">
                                            {translate('chat.noConversationsFound', currentLanguage) || 'No conversations found'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 p-4">
                                        {filteredConversations.map((chat) => (
                                            <div
                                                key={chat._id || chat.id}
                                                className={`group p-3 rounded-lg cursor-pointer transition-all
                                  ${
                                      localStorage.getItem(
                                          'lastConversationId',
                                          ''
                                      ) === (chat._id || chat.id)
                                          ? 'bg-blue-600 text-white'
                                          : 'hover:bg-slate-700/50 text-slate-300'
                                  }`}
                                            >
                                                {editingChatId ===
                                                (chat._id || chat.id) ? (
                                                    <div className="flex items-center p-2 rounded-lg">
                                                        <input
                                                            type="text"
                                                            value={newTitle}
                                                            onChange={(e) =>
                                                                setNewTitle(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="flex-1 bg-slate-700 text-white border border-slate-600 rounded p-1 text-sm mr-2"
                                                            autoFocus
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleSaveEdit(chat._id || chat.id);
                                                                if (e.key === 'Escape') handleCancelEdit();
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => handleSaveEdit(chat._id || chat.id)}
                                                            className="p-1 text-green-400 hover:text-green-300"
                                                        >
                                                            <svg
                                                                className="w-4 h-4"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="p-1 text-red-400 hover:text-red-300"
                                                        >
                                                            <svg
                                                                className="w-4 h-4"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M6 18L18 6M6 6l12 12"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between">
                                                        <div
                                                            className="flex-1 min-w-0 cursor-pointer"
                                                            onClick={() =>
                                                                onSelectChat(
                                                                    chat._id ||
                                                                        chat.id
                                                                )
                                                            }
                                                        >
                                                            <h3 className="font-medium text-sm leading-5 truncate">
                                                                {chat.title}
                                                            </h3>
                                                            <div className="text-xs text-slate-400">
                                                                {formatDate(chat.updated_at || chat.created_at)}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    handleStartEdit(
                                                                        chat._id ||
                                                                            chat.id,
                                                                        chat.title
                                                                    );
                                                                }}
                                                                className="p-1 rounded hover:bg-slate-600/50 transition-colors"
                                                                aria-label={translate('common.edit', currentLanguage) || "Edit"}
                                                            >
                                                                <svg
                                                                    className="w-3.5 h-3.5 text-slate-400 hover:text-white"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                                                    />
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    if (window.confirm(translate('chat.confirmDelete', currentLanguage) || "Are you sure you want to delete this conversation?")) {
                                                                        onDeleteChat(
                                                                            chat._id ||
                                                                                chat.id
                                                                        );
                                                                    }
                                                                }}
                                                                className="p-1 rounded hover:bg-slate-600/50 transition-colors"
                                                                aria-label={translate('common.delete', currentLanguage) || "Delete"}
                                                            >
                                                                <svg
                                                                    className="w-3.5 h-3.5 text-red-400 hover:text-red-300"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatHistory;
