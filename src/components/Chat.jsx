import React from 'react';
import Sidebar from './Sidebar';
import ChatHistory from './ChatHistory';
import DocumentUploader from './DocumentUploader';
import VoiceChat from './VoiceChat';
import VoiceToVoice from './VoiceToVoice';
import MobileNav from './MobileNav';
import MobileBottomBar from './MobileBottomBar';
import useChat from '../hooks/useChat';
import ChatContainer from './ChatContainer';
import MessageBubble from './MessageBubble';

const Chat = ({ initialMode }) => {
 const {
 messages,
 message,
 setMessage,
 isTyping,
 chatContainerRef,
 inputRef,
 fileInputRef,
 isHistoryOpen,
 toggleHistory,
 conversations,
 handleNewChat,
 handleSelectChat,
 handleDeleteConversation,
 handleEditTitle,
 handleSubmit,
 handleKeyPress,
 handleVoiceInput,
 handleFileUpload,
 darkMode,
 toggleDarkMode,
 isWebMode,
 setIsWebMode,
 isDetailedMode,
 setIsDetailedMode,
 language,
 setLanguage,
 isTextToSpeechEnabled,
 setIsTextToSpeechEnabled,
 handleSpeakMessage,
 currentSpeakingMessage,
 isVoiceMode,
 setIsVoiceMode,
 isToolsOpen,
 setIsToolsOpen,
 } = useChat(initialMode);

 return (
 <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
 <Sidebar />
 <div className="flex-1 flex flex-col">
 <MobileNav 
 toggleHistory={toggleHistory}
 darkMode={darkMode}
 toggleDarkMode={toggleDarkMode}
 />
 <ChatContainer
 messages={messages}
 isTyping={isTyping}
 chatContainerRef={chatContainerRef}
 inputRef={inputRef}
 message={message}
 setMessage={setMessage}
 handleSubmit={handleSubmit}
 handleKeyPress={handleKeyPress}
 darkMode={darkMode}
 MessageBubble={MessageBubble}
 isWebMode={isWebMode}
 setIsWebMode={setIsWebMode}
 isDetailedMode={isDetailedMode}
 setIsDetailedMode={setIsDetailedMode}
 isVoiceMode={isVoiceMode}
 isToolsOpen={isToolsOpen}
 setIsToolsOpen={setIsToolsOpen}
 />
 <MobileBottomBar />
 </div>
 {isHistoryOpen && (
 <ChatHistory
 conversations={conversations}
 onNewChat={handleNewChat}
 onSelectChat={handleSelectChat}
 onDeleteConversation={handleDeleteConversation}
 onEditTitle={handleEditTitle}
 />
 )}
 <DocumentUploader onUploadComplete={handleFileUpload} fileInputRef={fileInputRef} />
 {isVoiceMode && (
 <>
 <VoiceChat onVoiceInput={handleVoiceInput} />
 <VoiceToVoice />
 </>
 )}
 </div>
 );
};

export default Chat;