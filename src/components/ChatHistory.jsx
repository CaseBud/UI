import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiX, FiArchive, FiChevronLeft } from 'react-icons/fi';

const ChatHistory = ({
    conversations = [],
    onSelectConversation,
    onDeleteConversation,
    onEditTitle,
    onNewChat,
    currentConversationId,
    darkMode,
    onClose
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Fix sorting with null check and default empty array
    const sortedConversations = React.useMemo(() => {
        if (!Array.isArray(conversations)) return [];
        return conversations; // comes sorted from backend
    }, [conversations]);

    // Fix filtering with null check
    const filteredConversations = React.useMemo(() => {
        return sortedConversations.filter((chat) =>
            chat?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedConversations, searchTerm]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const handleEditSubmit = (conversationId) => {
        onEditTitle(conversationId, newTitle);
        setEditingId(null);
        setNewTitle('');
    };

    const handleSelectConversation = (id) => {
        if (id && onSelectConversation) {
            onSelectConversation(id);
        }
    };

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center h-32 py-4">
            <FiArchive className={`h-8 w-8 mb-2 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`} />
            <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                No conversations yet
            </p>
            <button
                onClick={onNewChat}
                className={`mt-2 px-3 py-1 text-xs rounded-md ${
                    darkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                } transition-colors`}
            >
                Start chatting
            </button>
        </div>
    );

    const LoadingState = () => (
        <div className="flex items-center justify-center py-4">
            <div className={`animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 ${darkMode ? 'border-blue-500' : 'border-blue-600'}`} />
        </div>
    );

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className={`flex items-center justify-between p-2 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <h2 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Chat History
                </h2>
                <button
                    onClick={onClose}
                    className={`p-1.5 rounded-full ${darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-gray-500 hover:bg-gray-100'} transition-colors`}
                >
                    <FiX className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <div className="p-2 space-y-1.5">
                    {/* New Chat Button */}
                    <button
                        onClick={onNewChat}
                        className={`flex items-center justify-center w-full py-1.5 px-3 rounded-md 
                        ${darkMode 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'} 
                        transition-colors text-xs font-medium`}
                    >
                        <FiPlus className="w-3.5 h-3.5 mr-1.5" />
                        New Chat
                    </button>

                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <FiSearch className={`w-3 h-3 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-7 pr-2 py-1.5 text-xs rounded-md 
                            ${darkMode 
                                ? 'bg-slate-700 border-none text-white placeholder-slate-400 focus:ring-1 focus:ring-blue-500' 
                                : 'bg-gray-100 border-none text-gray-800 placeholder-gray-500 focus:ring-1 focus:ring-blue-500'} 
                            focus:outline-none`}
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {isLoading ? (
                        <LoadingState />
                    ) : !Array.isArray(conversations) || conversations.length === 0 ? (
                        <EmptyState />
                    ) : !filteredConversations.length ? (
                        <div className="flex items-center justify-center h-32">
                            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                No matching conversations
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredConversations.map((chat) => (
                                <div
                                    key={chat._id || chat.id}
                                    className={`group p-2 rounded-md cursor-pointer transition-all
                                    ${currentConversationId === (chat._id || chat.id)
                                        ? (darkMode ? 'bg-slate-700' : 'bg-gray-200')
                                        : (darkMode 
                                            ? 'hover:bg-slate-800' 
                                            : 'hover:bg-gray-100')
                                    }`}
                                    onClick={() => handleSelectConversation(chat._id || chat.id)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    {editingId === (chat._id || chat.id) ? (
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleEditSubmit(chat._id || chat.id);
                                            }}
                                            className="flex items-center space-x-1"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <input
                                                type="text"
                                                value={newTitle}
                                                onChange={(e) => setNewTitle(e.target.value)}
                                                className={`flex-1 px-2 py-1 rounded text-xs
                                                ${darkMode 
                                                    ? 'bg-slate-600 border-none text-white' 
                                                    : 'bg-white border border-gray-300 text-gray-800'}`}
                                                autoFocus
                                            />
                                            <button
                                                type="submit"
                                                className={`p-1 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </form>
                                    ) : (
                                        <div>
                                            <div className="flex items-start justify-between">
                                                <h3 className={`text-xs font-medium line-clamp-2 flex-1 ${
                                                    currentConversationId === (chat._id || chat.id)
                                                        ? (darkMode ? 'text-white' : 'text-gray-800')
                                                        : (darkMode ? 'text-slate-300' : 'text-gray-700')
                                                }`}>
                                                    {chat.title || 'Untitled Chat'}
                                                </h3>
                                                <div className="flex space-x-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingId(chat._id || chat.id);
                                                            setNewTitle(chat.title || '');
                                                        }}
                                                        className={`p-0.5 rounded-full ${
                                                            darkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-300'
                                                        }`}
                                                    >
                                                        <FiEdit2 className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDeleteConversation(chat._id || chat.id);
                                                        }}
                                                        className={`p-0.5 rounded-full ${
                                                            darkMode ? 'hover:bg-slate-600 text-red-400' : 'hover:bg-gray-300 text-red-500'
                                                        }`}
                                                    >
                                                        <FiTrash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className={`text-[10px] mt-1 ${
                                                darkMode ? 'text-slate-400' : 'text-gray-500'
                                            }`}>
                                                {chat.updatedAt && formatDate(chat.updatedAt)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatHistory;