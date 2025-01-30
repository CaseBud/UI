import React, { useState } from 'react';

const ChatHistory = ({ 
  conversations, 
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

  const filteredConversations = conversations && Array.isArray(conversations) 
    ? conversations.filter(chat => 
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) 
    : [];

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
          {filteredConversations.map((chat) => (
            <div 
              key={chat.id}
              className={`group p-3 mb-2 rounded-lg cursor-pointer transition-all
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
