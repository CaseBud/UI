import React, { useState } from 'react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // Fix sorting with null check and default empty array
  const sortedConversations = React.useMemo(() => {
    if (!Array.isArray(conversations)) return [];
    
    return [...conversations].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
  }, [conversations]);

  // Fix filtering with null check
  const filteredConversations = React.useMemo(() => {
    return sortedConversations.filter(chat => 
      chat?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedConversations, searchTerm]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleEditSubmit = (conversationId) => {
    onEditTitle(conversationId, newTitle);
    setEditingId(null);
    setNewTitle('');
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
      <h3 className="mt-2 text-sm font-medium text-slate-300">No conversations yet</h3>
      <p className="mt-1 text-sm text-slate-400">Start a new chat to begin your legal inquiry.</p>
    </div>
  );

  const LoadingState = () => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
    </div>
  );

  return (
    <div className={`fixed right-0 top-0 h-full bg-slate-800/95 backdrop-blur-sm border-l border-slate-700/50 
                    transition-all duration-300 ease-in-out z-50
                    ${isOpen ? 'w-80 translate-x-0' : 'w-0 translate-x-full'}`}>
      <div className="flex flex-col h-full p-4">
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Chat History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="mb-4 flex items-center space-x-2 w-full px-4 py-2 rounded-lg 
                   hover:bg-slate-700/50 text-left text-white transition-colors group"
        >
          <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" 
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" 
                  strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Chat</span>
        </button>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700/50 rounded-lg border border-slate-600/50 
                     text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <LoadingState />
          ) : !Array.isArray(conversations) || conversations.length === 0 ? (
            <EmptyState />
          ) : !filteredConversations.length ? (
            <div className="text-center py-8 px-4">
              <p className="text-sm text-slate-400">No conversations found</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {filteredConversations.map((chat) => (
                <div 
                  key={chat.id}
                  className={`group p-3 rounded-lg cursor-pointer transition-all
                            ${currentconversationId === chat.id 
                              ? 'bg-blue-600 text-white' 
                              : 'hover:bg-slate-700/50 text-slate-300'}`}
                >
                  <div className="flex items-center justify-between">
                    {editingId === chat.id ? (
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleEditSubmit(chat.id);
                        }}
                        className="flex-1 flex items-center"
                      >
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="flex-1 px-2 py-1 bg-slate-900 rounded border border-slate-600"
                          autoFocus
                        />
                        <button type="submit" className="ml-2 text-blue-400 hover:text-blue-300">
                          Save
                        </button>
                      </form>
                    ) : (
                      <>
                        <div 
                          className="flex-1"
                          onClick={() => onSelectChat(chat.id)}
                        >
                          <h3 className="font-medium truncate">{chat.title}</h3>
                          <p className="text-xs opacity-70">
                            {formatDate(chat.created_at)}
                          </p>
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingId(chat.id);
                              setNewTitle(chat.title);
                            }}
                            className="text-slate-400 hover:text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteChat(chat.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {formatDate(chat.created_at)}
                  </div>
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
