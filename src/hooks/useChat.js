import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { chatApi, documentsApi } from '../utils/api';
import { authService } from '../services/authService';

const useChat = (initialMode) => {
 const user = authService.getCurrentUser();
 const defaultGreeting = `Hello ${user?.fullName || user?.name || 'there'}! How can I help you today?`;
 const location = useLocation();
 const navigate = useNavigate();
 const isTempUser = location.state?.tempUser || false;

 const [message, setMessage] = useState('');
 const [messages, setMessages] = useState([{
 type: 'assistant',
 content: { response: defaultGreeting, query: null },
 timestamp: new Date()
 }]);
 const [isTyping, setIsTyping] = useState(false);
 const chatContainerRef = useRef(null);
 const inputRef = useRef(null);
 const fileInputRef = useRef(null);
 const [isHistoryOpen, setIsHistoryOpen] = useState(false);
 const [conversations, setConversations] = useState([]);
 const [currentConversationId, setCurrentConversationId] = useState(null);
 const [selectedDocuments, setSelectedDocuments] = useState([]);
 const [uploadedDocuments, setUploadedDocuments] = useState([]);
 const [isNewConversation, setIsNewConversation] = useState(true);
 const [isDocumentAnalysis, setIsDocumentAnalysis] = useState(false);
 const [documentAnalysisId, setDocumentAnalysisId] = useState(null);
 const [isIncognito, setIsIncognito] = useState(false);
 const [activeDocuments, setActiveDocuments] = useState([]);
 const [isWebMode, setIsWebMode] = useState(false);
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [isToolsOpen, setIsToolsOpen] = useState(false);
 const historyRef = useRef(null);
 const [isDetailedMode, setIsDetailedMode] = useState(false);
 const [language, setLanguage] = useState('en-US');
 const [showDocumentCreator, setShowDocumentCreator] = useState(false);
 const [documents, setDocuments] = useState([]);
 const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
 const [currentSpeakingMessage, setCurrentSpeakingMessage] = useState(null);
 const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
 const [isVoiceMode, setIsVoiceMode] = useState(initialMode === 'voice');
 const [darkMode, setDarkMode] = useState(true);

 useEffect(() => {
 const savedDarkMode = localStorage.getItem('darkMode');
 if (savedDarkMode !== null) setDarkMode(savedDarkMode === 'true');
 }, []);

 useEffect(() => {
 if (initialMode === 'voice') setIsVoiceMode(true);
 }, [initialMode]);

 useEffect(() => {
 if (!isIncognito && isHistoryOpen) fetchConversations();
 }, [isIncognito, isHistoryOpen]);

 useEffect(() => {
 const handleClickOutside = (event) => {
 if (window.innerWidth >= 768 && historyRef.current && !historyRef.current.contains(event.target)) {
 setIsHistoryOpen (false);
 }
 const languageDropdown = document.getElementById('language-dropdown-button');
 if (isLanguageDropdownOpen && languageDropdown && !languageDropdown.contains(event.target) && !event.target.closest('.language-dropdown-menu')) {
 setIsLanguageDropdownOpen(false);
 }
 };
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, [isLanguageDropdownOpen]);

 useEffect(() => {
 chatContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [messages]);

 const fetchConversations = async () => {
 try {
 const response = await chatApi.getConversations();
 if (!response?.conversations) return;
 const formattedConversations = response.conversations.map(conv => ({
 _id: conv._id,
 id: conv._id,
 title: conv.title,
 created_at: conv.createdAt,
 updated_at: conv.updatedAt
 }));
 setConversations(formattedConversations);
 } catch (error) {
 console.error('Failed to fetch conversations:', error);
 }
 };

 const showResponseGradually = async (response) => {
 setIsTyping(true);
 const characters = response.split('');
 let currentText = '';
 const charDelay = 5;
 const variation = 7;
 const maxTypingTime = 10000;
 const startTime = Date.now();

 try {
 if (isWebMode) {
 setIsTyping(false);
 return;
 }

 for (let i = 0; i < characters.length; i++) {
 if (i === 0) setIsTyping(false);
 if (Date.now() - startTime > maxTypingTime) {
 currentText = response;
 break;
 }
 await new Promise(resolve => setTimeout(resolve, charDelay));
 await new Promise(resolve => setTimeout(resolve, Math.random() * variation));
 currentText += characters[i];
 setMessages(prev => {
 const newMessages = [...prev];
 const lastIndex = newMessages.length - 1;
 if (lastIndex >= 0 && (newMessages[lastIndex].type === 'assistant' || newMessages[lastIndex].type === 'system')) {
 newMessages[lastIndex] = {
 ...newMessages[lastIndex],
 content: { ...newMessages[lastIndex].content, response: currentText }
 };
 }
 return newMessages;
 });
 if (['.', '?', '!', ',', ';'].includes(characters[i])) {
 await new Promise(resolve => setTimeout(resolve, 75));
 }
 }
 } finally {
 setMessages(prev => {
 const newMessages = [...prev];
 const lastIndex = newMessages.length - 1;
 if (lastIndex >= 0 && (newMessages[lastIndex].type === 'assistant' || newMessages[lastIndex].type === 'system')) {
 newMessages[lastIndex] = {
 ...newMessages[lastIndex],
 content: { ...newMessages[lastIndex].content, response }
 };
 }
 return newMessages;
 });
 setIsTyping(false);
 }
 };

 const sendMessage = async (content) => {
 if (!content?.trim() || isTyping) return;

 const newUserMessage = {
 type: 'user',
 content: { query: content.trim(), response: null },
 timestamp: new Date()
 };

 try {
 setMessages(prev => [...prev, newUserMessage]);
 setMessage('');
 setIsTyping(true);

 let response;
 if (isDocumentAnalysis) {
 try {
 localStorage.removeItem('lastConversationId');
 localStorage.removeItem('currentChatMessages');
 response = await chatApi.sendDocumentAnalysis(
 content.trim(),
 activeDocuments.length > 0 ? activeDocuments : null,
 documentAnalysisId
 );
 if (!response) throw new Error('No response from document analysis');
 setActiveDocuments([]);
 setDocumentAnalysisId(response.conversationId);
 setIsDocumentAnalysis(true);
 const assistantMessage = {
 type: 'assistant',
 content: { query: content.trim(), response: response.response || response.message || '' },
 documents: [],
 timestamp: new Date()
 };
 setMessages(prev => [...prev, assistantMessage]);
 await showResponseGradually(response.response || response.message || '');
 } catch (docError) {
 console.error('Document analysis error:', docError);
 setMessages(prev => [...prev, {
 type: 'error',
 content: { response: 'Document analysis failed. Please try again.' },
 timestamp: new Date()
 }]);
 }
 } else {
 if (documentAnalysisId || localStorage.getItem('lastConversationId')) {
 if (documentAnalysisId && localStorage.getItem('lastConversationId') !== documentAnalysisId) {
 setMessages(prev => [...prev, {
 type: 'system',
 content: { response: 'Switched to general conversation mode' },
 documents: [],
 timestamp: new Date()
 }]);
 }
 if (isWebMode) {
 setMessages(prev => [...prev, {
 type: 'system',
 content: { response: 'Switched to web browsing mode (beta)' },
 documents: [],
 timestamp: new Date()
 }]);
 }
 }
 setDocumentAnalysisId(null);
 setIsDocumentAnalysis(false);
 response = await chatApi.sendMessage(content.trim(), {
 conversationId: currentConversationId,
 webSearch: isWebMode,
 language,
 detailedMode: isDetailedMode
 });
 setCurrentConversationId(response.conversationId);
 if (isWebMode) {
 setMessages(prev => [...prev, {
 type: 'system',
 content: { response: 'Searching the web for relevant sources...' },
 timestamp: new Date()
 }]);
 }
 const assistantMessage = {
 type: isWebMode ? 'system' : 'assistant',
 content: { query: content.trim(), response: response.response || response.message || '' },
 isWebSearch: isWebMode,
 timestamp: new Date()
 };
 setMessages(prev => [...prev, assistantMessage]);
 await showResponseGradually(response.response || response.message || '');
 }

 localStorage.setItem('lastConversationId', response.conversationId);
 localStorage.setItem('currentChatMessages', JSON.stringify(messages));

 if (isTextToSpeechEnabled) {
 const responseText = response.response || response.message || '';
 setCurrentSpeakingMessage(responseText);
 }
 } catch (error) {
 console.error('Chat error:', error);
 setIsTyping(false);
 setMessages(prev => [...prev, {
 type: 'error',
 content: { response: error.message || 'Failed to process your request.' },
 timestamp: new Date()
 }]);
 }
 };

 const handleSubmit = (e) => {
 e.preventDefault();
 sendMessage(message);
 };

 const handleKeyPress = (e) => {
 if (e.key === 'Enter' && !e.shiftKey) {
 e.preventDefault();
 handleSubmit(e);
 }
 };

 const handleNewChat = async () => {
 if (isIncognito) return;
 try {
 await fetchConversations();
 setMessages([{ type: 'assistant', content: { response: defaultGreeting, query: null }, timestamp: new Date() }]);
 setCurrentConversationId(null);
 setIsNewConversation(true);
 setMessage('');
 setSelectedDocuments([]);
 setDocumentAnalysisId(null);
 setIsDocumentAnalysis(false);
 localStorage.removeItem('lastConversationId');
 localStorage.removeItem('currentChatMessages');
 if (window.innerWidth < 768) setIsHistoryOpen(false);
 chatContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
 } catch (error) {
 console.error('Failed to create new chat:', error);
 }
 };

 const handleSelectChat = async (conversationId) => {
 if (isIncognito) return;
 try {
 const conversation = await chatApi.getConversationById(conversationId);
 if (!conversation) throw new Error('Chat not found');
 const formattedMessages = [];
 if (conversation.type === 'document-analysis') {
 const documents = [];
 conversation.messages.forEach(msg => {
 if (msg.documents) documents.push(...msg.documents);
 });
 formattedMessages.push({
 type: 'system',
 content: { response: 'Uploaded documents:' },
 documents,
 timestamp: new Date()
 });
 }
 conversation.messages.forEach(msg => {
 if (msg.content && msg.content.query) {
 formattedMessages.push({
 type: 'user',
 content: { query: msg.content.query },
 timestamp: msg.timestamp || new Date()
 });
 }
 if (msg.isWebSearch) {
 formattedMessages.push({
 type: 'system',
 content: { response: 'Sources:' },
 isWebSearch: true,
 timestamp: msg.timestamp || new Date()
 });
 }
 if (msg.content && (msg.content.response || msg.content.message)) {
 formattedMessages.push({
 type: msg.isWebSearch ? 'system' : 'assistant',
 content: { response: msg.content.response || msg.content.message || '' },
 isWebSearch: msg.isWebSearch,
 timestamp: msg.timestamp || new Date()
 });
 }
 });
 if (conversation.type === 'document-analysis') {
 setDocumentAnalysisId(conversation._id);
 setIsDocumentAnalysis(true);
 setCurrentConversationId(null);
 } else {
 setDocumentAnalysisId(null);
 setIsDocumentAnalysis(false);
 setCurrentConversationId(conversation._id);
 }
 localStorage.setItem('lastConversationId', conversation._id);
 localStorage.setItem('currentChatMessages', JSON.stringify(formattedMessages));
 setMessages(formattedMessages);
 setIsNewConversation(false);
 if (window.innerWidth >= 768) setIsHistoryOpen(false);
 } catch (error) {
 console.error('Failed to fetch chat:', error);
 if (error.message === ' Chat not found') {
 localStorage.removeItem('lastConversationId');
 localStorage.removeItem('currentChatMessages');
 handleNewChat();
 }
 if (!isNewConversation) {
 setMessages(prev => [...prev, {
 type: 'error',
 content: { response: 'Failed to load conversation. Starting a new chat.' },
 timestamp: new Date()
 }]);
 localStorage.removeItem('lastConversationId');
 localStorage.removeItem('currentChatMessages');
 handleNewChat();
 }
 }
 };

 const handleDeleteConversation = async (conversationId) => {
 if (isIncognito) return;
 try {
 await fetch(`https://case-bud-backend-bzgqfka6daeracaj.centralus-01.azurewebsites.net/api/chat/${conversationId}`, {
 method: 'DELETE',
 headers: { Authorization: `Bearer ${authService.getToken()}` }
 });
 setConversations(prev => prev.filter(chat => chat.id !== conversationId));
 if (currentConversationId === conversationId) {
 setMessages([]);
 setCurrentConversationId(null);
 }
 } catch (error) {
 console.error('Failed to delete chat:', error);
 }
 };

 const handleEditTitle = async (conversationId, newTitle) => {
 if (isIncognito) return;
 try {
 await fetch(`https://case-bud-backend-bzgqfka6daeracaj.centralus-01.azurewebsites.net/api/chat/${conversationId}`, {
 method: 'PUT',
 headers: {
 Authorization: `Bearer ${authService.getToken()}`,
 'Content-Type': 'application/json'
 },
 body: JSON.stringify({ title: newTitle })
 });
 fetchConversations();
 } catch (error) {
 console.error('Failed to update chat title:', error);
 }
 };

 const handleVoiceInput = (text) => {
 if (typeof text === 'string') {
 setMessage(text);
 sendMessage(text);
 } else {
 setMessage(text.target.value);
 }
 };

 const handleFileUpload = async (event) => {
 const file = event.target.files[0];
 if (!file || isIncognito) return;
 try {
 const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
 const fileExt = '.' + file.name.split('.').pop().toLowerCase();
 if (!allowedTypes.includes(fileExt)) throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
 setMessages(prev => [...prev, {
 type: 'system',
 content: { response: `Uploading document: ${file.name}...` },
 timestamp: new Date()
 }]);
 const response = await documentsApi.uploadDocument(file, file.name);
 const document = response.data.document;
 setUploadedDocuments(prev => [...prev, document]);
 setActiveDocuments(prev => [...prev, document._id]);
 if (!isDocumentAnalysis) {
 setMessages(prev => [...prev, {
 type: 'system',
 content: { response: 'Switched to document analysis mode' },
 timestamp: new Date()
 }]);
 }
 setIsWebMode(false);
 setIsDocumentAnalysis(true);
 setDocumentAnalysisId(null);
 setMessages(prev => [...prev, {
 type: 'system',
 content: { response: `Document "${document.name}" uploaded successfully. You can now ask questions about this document.` },
 documents: [document],
 timestamp: new Date()
 }]);
 event.target.value = '';
 } catch (error) {
 console.error('Failed to upload document:', error);
 let errorMessage = error.message;
 if (error.status === 413) errorMessage = 'File size too large. Please try a smaller file.';
 else if (error.status === 415) errorMessage = 'Invalid file type. Please try another format.';
 setMessages(prev => [...prev, {
 type: 'error',
 content: { response: errorMessage || 'Failed to upload document. Please try again.' },
 timestamp: new Date()
 }]);
 }
 };

 const toggleDarkMode = () => {
 setDarkMode(prev => !prev);
 localStorage.setItem('darkMode', !darkMode);
 };

 const toggleHistory = () => {
 if (!isHistoryOpen) fetchConversations();
 setIsHistoryOpen(prev => !prev);
 };

 const handleSpeakMessage = (messageContent) => {
 if (currentSpeakingMessage === messageContent) {
 window.speechSynthesis.cancel();
 setCurrentSpeakingMessage(null);
 } else {
 window.speechSynthesis.cancel();
 setCurrentSpeakingMessage(messageContent);
 }
 };

 useEffect(() => {
 const restoreChat = async () => {
 const lastConversationId = localStorage.getItem('lastConversationId');
 const savedMessages = JSON.parse(localStorage.getItem('currentChatMessages') || '[]');
 if (savedMessages.length > 0) setMessages(savedMessages);
 if (lastConversationId) {
 try {
 await handleSelectChat(lastConversationId);
 } catch (error) {
 console.error('Failed to restore chat:', error);
 handleNewChat();
 }
 }
 chatContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
 };
 restoreChat();
 }, []);

 useEffect(() => {
 if (messages.length > 0) localStorage.setItem('currentChatMessages', JSON.stringify(messages));
 if (currentConversationId) localStorage.setItem('lastConversationId', currentConversationId);
 }, [messages, currentConversationId]);

 return {
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
 };
};

export default useChat;