import React, { useState, useRef, useEffect } from 'react';
import audioBufferToWav from 'audiobuffer-to-wav';
import { chatApi } from '../utils/api';
import { authService } from '../services/authService';
import Sidebar from './Sidebar';
import ChatHistory from './ChatHistory';
import TypingAnimation from './TypingAnimation';
import DocumentUploader from './DocumentUploader';
import DocumentPreview from './DocumentPreview';
import VoiceChat from './VoiceChat';
import VoiceToVoice from './VoiceToVoice';
import TextToSpeech from './TextToSpeech';
import ReasoningModeToggle from './ReasoningModeToggle';
import LanguageSelector from './LanguageSelector';
import { useLocation, useNavigate } from 'react-router-dom';
import MobileNav from './MobileNav';
import { useTheme } from '../contexts/ThemeContext';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import MobileInput from './MobileInput';
import MobileBottomBar from './MobileBottomBar';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
import { AssemblyAI } from 'assemblyai';
import useVoiceRecorder from '../useVoiceRecorder'; // Import the new hook
import { FaMicrophone } from 'react-icons/fa';
// Replace lucide-react imports with SVG components
const IconComponents = {
    MessageCircle: (props) => (
        <svg
            className="h-6 w-6 text-black-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
            />
        </svg>

        
    ),
    System: (props) => (
        <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
            />
        </svg>
    ),
    Send: (props) => (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
    ),
    User: (props) => (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    Loader2: (props) => (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    ),
    Globe: (props) => (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    ),
    ChevronRight: (props) => (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 18l6-6-6-6" />
        </svg>
    ),
    Tools: (props) => (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 7 L12 3 L21 7 L12 11 Z" fill="none" />
            <path d="M3 7 L3 17 L12 21 L12 11 Z" fill="none" />
            <path d="M21 7 L21 17 L12 21 L12 11 Z" fill="none" />

            <circle cx="7" cy="14" r="1.5" />
            <circle cx="12" cy="16" r="1.5" />
            <circle cx="17" cy="14" r="1.5" />

            <line
                x1="12"
                y1="11"
                x2="12"
                y2="21"
                stroke="currentColor"
                opacity="0.3"
            />
            <line
                x1="3"
                y1="7"
                x2="12"
                y2="11"
                stroke="currentColor"
                opacity="0.3"
            />
            <line
                x1="21"
                y1="7"
                x2="12"
                y2="11"
                stroke="currentColor"
                opacity="0.3"
            />
        </svg>
    ),
    Wikipedia: (props) => (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .119-.075.176-.225.176l-.564.031c-.485.029-.727.164-.727.436 0 .135.053.33.166.601 1.082 2.646 4.818 10.521 4.818 10.521l.136.046 2.411-4.81-.482-1.067-1.658-3.264s-.318-.654-.428-.872c-.728-1.443-.712-1.518-1.447-1.617-.207-.023-.313-.05-.313-.149v-.468l.06-.045h4.292l.113.037v.451c0 .105-.076.15-.227.15l-.308.047c-.792.061-.661.381-.136 1.422l1.582 3.252 1.758-3.504c.293-.64.233-.801.111-.947-.07-.084-.305-.22-.812-.24l-.201-.021c-.052 0-.098-.015-.145-.051-.045-.031-.067-.076-.067-.129v-.427l.061-.045c1.247-.008 4.043 0 4.043 0l.059.045v.436c0 .121-.059.178-.193.178-.646.03-1.023.095-1.023.439-.12.186-.375.589-.646 1.039l-2.301 4.273-.065.135 2.792 5.712.17.048 4.396-10.438c.154-.422.129-.722-.064-.895-.197-.174-.346-.277-.857-.277l-.423-.015c-.061 0-.105-.014-.152-.045-.043-.029-.072-.075-.072-.072-.119v-.436l.059-.045h4.961l.041.045v.437c0 .119-.074.18-.209.18-.648.03-1.127.18-1.443.421-.314.255-.557.616-.736 1.067 0 0-4.043 9.258-5.426 12.339-.525 1.007-1.053.917-1.503-.031-.571-1.171-1.773-3.786-2.646-5.71l.053-.036z" />
        </svg>
    ),
    Google: (props) => (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8c1.93 0 3.68.68 5.07 1.81L14.1 9.9c-.56-.56-1.32-.9-2.1-.9-1.66 0-3 1.34-3 3s1.34 3 3 3c1.38 0 2.54-.93 2.87-2.18H12v-2.82h5.64c.09.5.14 1.01.14 1.54 0 4.41-3.59 8-8 8z" />
        </svg>
    ),
    Facebook: (props) => (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.324-.593 1.324-1.324V1.325C24 .593 23.407 0 22.675 0z" />
        </svg>
    ),
    Default: (props) => (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
        </svg>
    )
};

const Chat = () => {
    const user = authService.getCurrentUser();
    const { currentLanguage } = useLanguage();
    const userName = user?.fullName || user?.name || 'there';
    const defaultGreeting = translate('default.greeting', currentLanguage).replace('{name}', userName);
    const location = useLocation();
    const navigate = useNavigate();
    const isTempUser = location.state?.tempUser || false;

    // Add inputRef definition
    const inputRef = useRef(null);
    const [message, setMessage] = useState('');
    
    // Add handleMessageChange function
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
        // Auto-grow textarea
        e.target.style.height = '36px';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const [messages, setMessages] = useState([
        {
            type: 'assistant',
            content: {
                response: defaultGreeting,
                query: null
            },
            timestamp: new Date()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [currentconversationId, setCurrentconversationId] = useState(null);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [isNewConversation, setIsNewConversation] = useState(true);
    const [isDocumentAnalysis, setIsDocumentAnalysis] = useState(false);
    const [documentAnalysisId, setDocumentAnalysisId] = useState(null);
    const [isIncognito, setIsIncognito] = useState(false); // Add incognito mode state
    const [activeDocuments, setActiveDocuments] = useState([]); // Add this new state
    const [isWebMode, setIsWebMode] = useState(false); // Add new state for web browsing mode
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const historyRef = useRef(null);
    
    // New state variables for the new features
    const [isDetailedMode, setIsDetailedMode] = useState(false);
    const [showDocumentCreator, setShowDocumentCreator] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
    const [currentSpeakingMessage, setCurrentSpeakingMessage] = useState(null);
    const { isDark, lightModeBaseColor } = useTheme();

    // Create a ref for the file input
    const fileInputRef = useRef(null);

    // Voice recording states
    const { isRecording, audioBlob, startRecording, stopRecording, setAudioBlob } = useVoiceRecorder();
    const [transcribing, setTranscribing] = useState(false);

    const client = new AssemblyAI({
        //!PROCESS ENV ASAP BEFORE OLU EATS ME
        apiKey: import.meta.env.VITE_ASSEMBLYAI_API_KEY, // Replace with your AssemblyAI API key
    });

    useEffect(() => {
        if (!isIncognito && isHistoryOpen) {
            fetchConversations();
        }
    }, [isIncognito, isHistoryOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Only handle outside clicks on desktop
            if (window.innerWidth >= 768) {
                if (
                    historyRef.current &&
                    !historyRef.current.contains(event.target)
                ) {
                    setIsHistoryOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const response = await chatApi.getConversations();

            // Check if response exists
            if (!response?.conversations) {
                console.warn('No data in response');
                return [];
            }

            const conversations = response.conversations.map((conv) => ({
                _id: conv._id, // Keep the original _id
                id: conv._id, // Add id for compatibility
                title: conv.title,
                created_at: conv.createdAt,
                updated_at: conv.updatedAt
            }));
            setConversations(conversations);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
            throw error;
        }
    };

    const handleDeleteChat = async (conversationId) => {
        if (isIncognito) return; // Disable chat deletion in incognito mode

        try {
            await fetch(
                `https://case-bud-backend-1.onrender.com/api/chat/${conversationId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${authService.getToken()}`
                    }
                }
            );
            setConversations((prev) =>
                prev.filter((chat) => chat.id !== conversationId)
            );
            if (currentconversationId === conversationId) {
                setMessages([]);
                setCurrentconversationId(null);
            }
        } catch (error) {
            console.error('Failed to delete chat:', error);
        }
    };

    const handleEditTitle = async (conversationId, newTitle) => {
        if (isIncognito) return; // Disable chat title editing in incognito mode

        try {
            await fetch(
                `https://case-bud-backend-1.onrender.com/api/chat/${conversationId}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${authService.getToken()}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: newTitle })
                }
            );
            fetchConversations(); // Refresh the conversation list
        } catch (error) {
            console.error('Failed to update chat title:', error);
        }
    };

    // Helper function to simulate typing and show response gradually
    const showResponseGradually = async (response) => {
        setIsTyping(true);
        const characters = response.split('');
        let currentText = '';
        const charDelay = 5;
        const variation = 7;
        const maxTypingTime = 10000; // 10 seconds
        const startTime = Date.now();

        try {
            if (isWebMode) {
                return;
            }
            for (let i = 0; i < characters.length; i++) {
                if (i == 0) {
                    setIsTyping(false);
                }
                const elapsedTime = Date.now() - startTime;
                if (elapsedTime > maxTypingTime) {
                    currentText = response;
                    break;
                }
                
                await new Promise((resolve) => setTimeout(resolve, charDelay));
                await new Promise((resolve) =>
                    setTimeout(resolve, Math.random() * variation)
                );
                
                currentText += characters[i];
                setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastIndex = newMessages.length - 1;
                    if (
                        lastIndex >= 0 &&
                        newMessages[lastIndex].type === 'assistant'
                    ) {
                        newMessages[lastIndex] = {
                            ...newMessages[lastIndex],
                            content: {
                                ...newMessages[lastIndex].content,
                                response: currentText
                            }
                        };
                    }
                    return newMessages;
                });
                
                if (['.', '?', '!', ',', ';'].includes(characters[i])) {
                    await new Promise((resolve) => setTimeout(resolve, 75));
                }
            }
        } finally {
            setMessages((prev) => {
                const newMessages = [...prev];
                const lastIndex = newMessages.length - 1;
                if (
                    lastIndex >= 0 &&
                    newMessages[lastIndex].type === 'assistant'
                ) {
                    newMessages[lastIndex] = {
                        ...newMessages[lastIndex],
                        content: {
                            ...newMessages[lastIndex].content,
                            response: response
                        }
                    };
                }
                return newMessages;
            });
            setIsTyping(false);
        }
    };

    const handleDocumentSelect = (docId) => {
        if (isIncognito) return; // Disable document selection in incognito mode

        setSelectedDocuments((prev) => {
            const isSelected = prev.includes(docId);
            return isSelected
                ? prev.filter((id) => id !== docId)
                : [...prev, docId];
        });
    };

    const handleUploadComplete = (response) => {
        if (!response?.data?.document) {
            console.error('Invalid response format:', response);
            throw new Error('Invalid response format from server');
        }
    
        const document = response.data.document;
        console.log('Document data received:', document);
        
        // Ensure we have a valid document ID
        const documentId = document._id;
        if (!documentId) {
            console.error('Document data missing ID:', document);
            throw new Error('Document ID missing from response');
        }
    
        // Update state with new document
        setUploadedDocuments(prev => [...prev, document]);
        setActiveDocuments(prev => [...prev, documentId]);
        
        // Set document analysis mode
        setDocumentAnalysisId(response.conversationId || null);
        setIsDocumentAnalysis(true);
        setIsWebMode(false);
    
        // Add upload success message
        setMessages(prev => [
            ...prev,
            {
                type: 'system',
                content: {
                    response: translate('default.documentUploaded', currentLanguage)
                        .replace('{name}', document.name)
                },
                documents: [document],
                timestamp: new Date()
            }
        ]);
    
        console.log('Document upload completed. Active documents:', documentId);
    };
    
    const handleDocumentAnalysis = async (query, documentIds) => {
        if (isIncognito) return; // Disable document analysis in incognito mode

        try {
            setCurrentconversationId(null); // Reset conversationId for new document chat
            const response = await chatApi.sendDocumentAnalysis(
                query,
                documentIds,
                documentAnalysisId,
                currentLanguage
            );
            await showResponseGradually(
                response.response || 'No response received'
            );
        } catch (error) {
            console.error('Document analysis error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    type: 'error',
                    content:
                        error.message ||
                        'Failed to analyze document. Please try again.',
                    timestamp: new Date()
                }
            ]);
        }
    };

    // Add handler functions for the new features
    const handleDetailedModeToggle = (isDetailed) => {
        setIsDetailedMode(isDetailed);
    };
    
    const handleDocumentCreate = (newDocument) => {
        setDocuments([...documents, newDocument]);
        setShowDocumentCreator(false);
    };
    
    const handleTextToSpeechToggle = () => {
        setIsTextToSpeechEnabled(!isTextToSpeechEnabled);
        
        // Cancel any ongoing speech when toggling off
        if (isTextToSpeechEnabled) {
            window.speechSynthesis.cancel();
            setCurrentSpeakingMessage(null);
        }
    };
    
    const handleSpeakMessage = (messageContent) => {
        if (currentSpeakingMessage === messageContent) {
            // If already speaking this message, stop it
            window.speechSynthesis.cancel();
            setCurrentSpeakingMessage(null);
        } else {
            // Stop any current speech and speak the new message
            window.speechSynthesis.cancel();
            setCurrentSpeakingMessage(messageContent);
        }
    };

    // Modify the sendMessage function to include the new features
    const sendMessage = async (content) => {
        if (!content?.trim() || isTyping) return;

        const newUserMessage = {
            type: 'user',
            content: {
                query: content,
                response: null
            },
            timestamp: new Date()
        };

        try {
            setMessages((prev) => [...prev, newUserMessage]);
            setMessage('');
            setIsTyping(true);

            let response;

            // Check if we have active documents and are in document analysis mode
            if (isDocumentAnalysis && activeDocuments.length > 0) {
                console.log('Sending document analysis with docs:', activeDocuments);
                try {
                    response = await chatApi.sendDocumentAnalysis(
                        content.trim(),
                        activeDocuments,
                        documentAnalysisId,
                        currentLanguage
                    );
    
                    if (response) {
                        const assistantMessage = {
                            type: 'assistant',
                            content: {
                                query: content,
                                response: response.response
                            },
                            documents: response.documents || [],
                            timestamp: new Date()
                        };
    
                        setDocumentAnalysisId(response.conversationId);
                        setMessages((prev) => [...prev, assistantMessage]);
                        await showResponseGradually(response.response);
                    }
                } catch (docError) {
                    console.error('Document analysis error details:', docError);
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: 'error',
                            content: {
                                response: docError.message || 'Document analysis failed. Please try again.'
                            },
                            timestamp: new Date()
                        }
                    ]);
                }
            } else {
                if (
                    documentAnalysisId ||
                    localStorage.getItem('lastConversationId')
                ) {
                    if (
                        documentAnalysisId &&
                        localStorage.getItem('lastConversationId', null) !==
                            documentAnalysisId
                    ) {
                        setMessages((prev) => [
                            ...prev,
                            {
                                type: 'system',
                                content: {
                                    response: translate('default.generalChat', currentLanguage)
                                },
                                documents: [],
                                timestamp: new Date()
                            }
                        ]);
                    }
                    if (isWebMode) {
                        setMessages((prev) => [
                            ...prev,
                            {
                                type: 'system',
                                content: {
                                    response: translate('default.webSearchMode', currentLanguage)
                                },
                                documents: [],
                                timestamp: new Date()
                            }
                        ]);
                    }
                }
                setDocumentAnalysisId(null);
                setIsDocumentAnalysis(false);
                response = await chatApi.sendMessage(content.trim(), {
                    conversationId: currentconversationId
                });
                setCurrentconversationId(response.conversationId);
                if (isWebMode) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: 'system',
                            content: {
                                response: translate('default.searchingWeb', currentLanguage)
                            },
                            timestamp: new Date()
                        }
                    ]);
                    // await showResponseGradually(
                    //     messages[messages.length - 1].content.response
                    // );
                }

                const assistantMessage = {
                    type: isWebMode ? 'system' : 'assistant',
                    content: {
                        response: response.response || response.message
                    },
                    isWebSearch: isWebMode,
                    timestamp: new Date()
                };

                // if (isWebMode) {
                //     // Update: Don't add empty assistant message here
                //     // Instead, wait for the actual response
                // }

                setMessages((prev) => [...prev, assistantMessage]);

                await showResponseGradually(
                    response.response || response.message
                );
            }

            localStorage.setItem('lastConversationId', response.conversationId);
            localStorage.setItem(
                'currentChatMessages',
                JSON.stringify(messages)
            );

            // If text-to-speech is enabled, speak the response
            if (isTextToSpeechEnabled) {
                const responseText = response.response || response.message;
                setCurrentSpeakingMessage(responseText);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                {
                    type: 'error',
                    content: {
                        response: error.message === 'Query is required' 
                            ? 'Please enter a message' 
                            : error.message || 'Failed to process your request.'
                    },
                    timestamp: new Date()
                }
            ]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            sendMessage(message);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleSelectPrompt = (promptText) => {
        setMessage(promptText);
        sendMessage(promptText);
    };

    const createNewChat = async () => {
        if (isIncognito) return; // Disable new chat creation in incognito mode

        try {
            await fetchConversations(); // Refresh the conversation list
            // Reset current chat state
            setMessages([
                {
                    type: 'assistant',
                    content: {
                        response: translate('default.greeting', currentLanguage).replace('{name}', userName),
                        query: null
                    },
                    timestamp: new Date()
                }
            ]);
            setCurrentconversationId(null);
            setIsNewConversation(true);
            setMessage('');
            setSelectedDocuments([]);
            setDocumentAnalysisId(null);
            setIsDocumentAnalysis(false);
            localStorage.removeItem('lastConversationId');
            localStorage.removeItem('currentChatMessages');

            if (window.innerWidth < 768) {
                setIsHistoryOpen(false);
            }

            // Scroll to bottom after creating a new chat
            chatContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Failed to create new chat:', error);
        }
    };

    // Replace the existing handleNewChat with createNewChat
    const handleNewChat = createNewChat;

   // Handle voice recording and transcription
   const handleVoiceRecord = async () => {
    if (!isRecording && !audioBlob) {
        startRecording();
    } else if (isRecording) {
        stopRecording();
    }
};

const transcribeAudio = async (blob) => {
    setTranscribing(true);
    try {
        console.log('Original Blob:', { size: blob.size, type: blob.type });

        // Convert WebM to WAV
        const audioContext = new AudioContext();
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const wavBlob = new Blob([audioBufferToWav(audioBuffer)], { type: 'audio/wav' });
        console.log('Converted WAV Blob:', { size: wavBlob.size, type: wavBlob.type });

        // Upload WAV file to AssemblyAI
        const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
            method: 'POST',
            headers: {
                'authorization': import.meta.env.VITE_ASSEMBLYAI_API_KEY,
                'content-type': 'application/octet-stream'
            },
            body: wavBlob
        });

        if (!uploadResponse.ok) {
            throw new Error('Upload failed, please try again. If you continue to have issues please reach out to support@assemblyai.com');
        }

        const uploadData = await uploadResponse.json();
        const audioUrl = uploadData.upload_url;

        // Request transcription
        const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
            method: 'POST',
            headers: {
                'authorization': import.meta.env.VITE_ASSEMBLYAI_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({ audio_url: audioUrl })
        });

        if (!transcriptResponse.ok) {
            throw new Error('Transcription request failed');
        }

        const transcriptData = await transcriptResponse.json();
        const transcriptId = transcriptData.id;

        // Poll for transcription result
        let transcriptionResult;
        while (true) {
            const resultResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
                headers: {
                    'authorization': import.meta.env.VITE_ASSEMBLYAI_API_KEY
                }
            });

            if (!resultResponse.ok) {
                throw new Error('Failed to fetch transcription result');
            }

            transcriptionResult = await resultResponse.json();

            if (transcriptionResult.status === 'completed') {
                break;
            } else if (transcriptionResult.status === 'failed') {
                throw new Error('Transcription failed');
            }

            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before polling again
        }

        if (transcriptionResult.text) {
            setMessage(transcriptionResult.text);
            sendMessage(transcriptionResult.text);
        } else {
            throw new Error('Transcription result is empty');
        }
    } catch (error) {
        console.error('Transcription error:', error);
        setMessages((prev) => [
            ...prev,
            {
                type: 'error',
                content: { response: 'Failed to transcribe audio: ' + error.message },
                timestamp: new Date(),
            },
        ]);
    } finally {
        setTranscribing(false);
    }
};
   // Effect to trigger transcription when audioBlob is set
useEffect(() => {
    if (audioBlob && !isRecording) {
        transcribeAudio(audioBlob);
        setAudioBlob(null); // Reset after processing
    }
}, [audioBlob, isRecording]);






    const handleVoiceInput = (text) => {
        if (typeof text === 'string') {
            setMessage(text);
            // Auto submit after voice transcription
            sendMessage(text);
        } else {
            setMessage(text.target.value);
        }
    };

    const toggleIncognitoMode = () => {
        setIsIncognito(!isIncognito);
        if (!isIncognito) {
            // Clear current chat state when entering incognito mode
            setMessages([
                {
                    type: 'assistant',
                    content: {
                        response: translate('default.greeting', currentLanguage).replace('{name}', userName),
                        query: null
                    },
                    timestamp: new Date()
                }
            ]);
            setCurrentconversationId(null);
            setIsNewConversation(true);
            setMessage('');
            setSelectedDocuments([]);
            setUploadedDocuments([]);
            setDocumentAnalysisId(null);
            setIsDocumentAnalysis(false);
        }
    };

    const clearActiveDocuments = () => {
        setActiveDocuments([]);
        setMessages((prev) => [
            ...prev,
            {
                type: 'system',
                content: {
                    response: translate('default.generalChat', currentLanguage)
                },
                timestamp: new Date()
            }
        ]);
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const isMobile = () => {
        return window.innerWidth < 768;
    };

    const handleSelectChat = async (conversationId) => {
        if (isIncognito) return; // Disable chat selection in incognito mode
        
        try {
            const response = await chatApi.getConversation(conversationId);
            if (response?.messages) {
                setMessages(response.messages.map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                })));
                setCurrentconversationId(conversationId);
                setIsNewConversation(false);
                setIsDocumentAnalysis(false);
                setDocumentAnalysisId(null);
                setIsWebMode(false);
                
                // Close history panel on mobile after selection
                if (window.innerWidth < 768) {
                    setIsHistoryOpen(false);
                }
                
                // Scroll to bottom after loading chat
                chatContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Failed to load conversation:', error);
            // Show error message to user using the translation
            setMessages([{
                type: 'error',
                content: {
                    response: translate('default.loadError', currentLanguage)
                },
                timestamp: new Date()
            }]);
        }
    };

    // Add toggleHistory function
    const toggleHistory = () => {
        setIsHistoryOpen(!isHistoryOpen);
    };

    // Update the handleDocumentUploadClick function
    const handleDocumentUploadClick = () => {
        // Directly trigger file selection
        fileInputRef.current?.click();
        setIsToolsOpen(false); // Close tools dropdown
    };

    // Handle document upload (regular upload)
    const handleDocumentUpload = async (file) => {
        try {
            setMessages(prev => [...prev, {
                type: 'system',
                content: {
                    response: translate('default.documentUploading', currentLanguage)
                        .replace('{name}', file.name)
                },
                timestamp: new Date()
            }]);

            const response = await chatApi.sendDocument(file);
            
            if (!response.success) {
                throw new Error('Upload failed');
            }
            
            await handleUploadComplete(response);
            
        } catch (error) {
            console.error('Upload failed:', error);
            setMessages(prev => [...prev, {
                type: 'error',
                content: {
                    response: translate('default.uploadError', currentLanguage)
                        .replace('{error}', error.message)
                },
                timestamp: new Date()
            }]);
            
            // Reset states on error
            setIsDocumentAnalysis(false);
            setDocumentAnalysisId(null);
        }
    };

    // Add new OCR handler
    const handleOCR = async (file) => {
        try {
            setMessages(prev => [...prev, {
                type: 'system',
                content: {
                    response: translate('default.ocrProcessing', currentLanguage)
                        .replace('{name}', file.name)
                },
                timestamp: new Date()
            }]);

            const result = await chatApi.performOCR(file);
            
            if (result.text) {
                setMessage(result.text);
                await sendMessage(result.text);
            }
        } catch (error) {
            console.error('OCR failed:', error);
            setMessages(prev => [...prev, {
                type: 'error',
                content: {
                    response: translate('default.ocrError', currentLanguage)
                        .replace('{error}', error.message)
                },
                timestamp: new Date()
            }]);
        }
    };

    // Add camera capture handler
    const handleCameraCapture = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setMessages(prev => [...prev, {
                type: 'system',
                content: {
                    response: translate('default.ocrProcessing', currentLanguage)
                        .replace('{name}', file.name)
                },
                timestamp: new Date()
            }]);

            // Process the image
            const result = await chatApi.performOCR(file);
            
            if (result.text) {
                // Send the extracted text through the standard conversation endpoint
                await sendMessage(result.text);
            }
        } catch (error) {
            console.error('Camera capture/OCR failed:', error);
            setMessages(prev => [...prev, {
                type: 'error',
                content: {
                    response: translate('default.ocrError', currentLanguage)
                        .replace('{error}', error.message)
                },
                timestamp: new Date()
            }]);
        }
    };

    return (
        <div className={`flex h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* Hidden file input for document upload */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    // If it's an image, ask user if they want to use OCR
                    if (file.type.startsWith('image/')) {
                        const useOCR = window.confirm(
                            translate('default.useOCR', currentLanguage) ||
                            'Would you like to extract text from this image using OCR?'
                        );
                        
                        if (useOCR) {
                            handleOCR(file);
                        } else {
                            handleDocumentUpload(file);
                        }
                    } else {
                        handleDocumentUpload(file);
                    }
                    
                    event.target.value = '';
                }}
            />

            {/* Sidebar */}
            <Sidebar 
                user={user} 
                onSelectPrompt={handleSelectPrompt}
                onDocumentUploadClick={handleDocumentUploadClick}
            />

            <div className="flex-1 flex flex-col">
                <ChatHeader 
                    onDocumentUploadClick={handleDocumentUploadClick}
                    setIsHistoryOpen={setIsHistoryOpen}
                    isHistoryOpen={isHistoryOpen}
                />

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto py-3 space-y-2 pb-40 md:pb-4">
                        {messages.map((message, index) => (
                            <MessageBubble 
                                key={index} 
                                message={message} 
                                handleTextToSpeechToggle={() => handleSpeakMessage(message.content.response)}
                                IconComponents={IconComponents}
                            />
                        ))}
                        {isTyping && (
                            <div className="flex mb-3">
                                <div className="flex flex-row max-w-[85%]">
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${
                                        isDark ? 'bg-blue-600' : 'bg-blue-500'
                                    } flex items-center justify-center self-start mt-1 mr-2`}>
                                        <IconComponents.MessageCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className={`px-3 py-2 rounded-lg ${
                                            isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-gray-800 border border-gray-200'
                                        }`}>
                                            <TypingAnimation />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {transcribing && (
                            <div className="flex mb-3">
                                <div className="flex flex-row max-w-[85%]">
                                    <div className={`px-3 py-2 rounded-lg ${
                                        isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-gray-800 border border-gray-200'
                                    }`}>
                                        Transcribing...
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatContainerRef} />
                    </div>
                </div>

                <div className="hidden md:block">
    <ChatInput 
        message={message}
        handleMessageChange={handleMessageChange}
        handleSubmit={handleSubmit}
        isTyping={isTyping}
        isTempUser={isTempUser}
        isWebMode={isWebMode}
        isDetailedMode={isDetailedMode}
        isToolsOpen={isToolsOpen}
        setIsToolsOpen={setIsToolsOpen}
        IconComponents={IconComponents}
        handleDetailedModeToggle={handleDetailedModeToggle}
        handleTextToSpeechToggle={handleTextToSpeechToggle}
        isTextToSpeechEnabled={isTextToSpeechEnabled}
        handleDocumentUploadClick={handleDocumentUploadClick}
        setIsWebMode={setIsWebMode}
        setDocumentAnalysisId={setDocumentAnalysisId}
        setIsDocumentAnalysis={setIsDocumentAnalysis}
        handleVoiceRecord={handleVoiceRecord} // Correct prop name
        isRecording={isRecording}
        transcribing={transcribing}
        handleCameraCapture={handleCameraCapture} // Pass handleCameraCapture
    />
</div>
            </div>

            <div 
                className={`fixed top-0 right-0 h-full bg-slate-800 border-l border-slate-700/50 overflow-y-auto transition-transform duration-300 ease-in-out ${isHistoryOpen ? 'translate-x-0' : 'translate-x-full'} w-full md:w-72 z-50`}
                ref={historyRef}
            >
                <ChatHistory
                    conversations={conversations}
                    onSelectChat={handleSelectChat}
                    onDeleteChat={handleDeleteChat}
                    onEditTitle={handleEditTitle}
                    onNewChat={handleNewChat}
                    isOpen={isHistoryOpen}
                    currentconversationId={currentconversationId}
                    onClose={() => setIsHistoryOpen(false)}
                />
            </div>

            <MobileNav
                user={user}
                onSelectPrompt={handleSelectPrompt}
                isTempUser={isTempUser}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />  

            <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 ${
                isDark ? 'bg-slate-800/95 backdrop-blur-sm' : 'bg-white'
            } pb-safe`}>
                <div className="border-t border-b border-gray-200 dark:border-slate-700/50">
                    <MobileInput 
                        message={message}
                        handleMessageChange={handleMessageChange}
                        handleSubmit={handleSubmit}
                        isTyping={isTyping}
                        isTempUser={isTempUser}
                        isWebMode={isWebMode}
                        isDetailedMode={isDetailedMode}
                        isToolsOpen={isToolsOpen}
                        setIsToolsOpen={setIsToolsOpen}
                        IconComponents={IconComponents}
                        handleVoiceRecord={handleVoiceRecord} // Pass voice handler
                        isRecording={isRecording} // Pass recording state
                        transcribing={transcribing} // Pass transcribing state
                    />
                </div>
                
                <MobileBottomBar 
                    handleNewChat={handleNewChat}
                    isWebMode={isWebMode}
                    setIsWebMode={setIsWebMode}
                    setDocumentAnalysisId={setDocumentAnalysisId}
                    setIsDocumentAnalysis={setIsDocumentAnalysis}
                    setIsHistoryOpen={setIsHistoryOpen}
                    isHistoryOpen={isHistoryOpen}
                    language={currentLanguage}
                    handleLanguageChange={() => {}}
                    IconComponents={IconComponents}
                    handleDocumentUploadClick={handleDocumentUploadClick}
                    isDetailedMode={isDetailedMode}
                    handleDetailedModeToggle={handleDetailedModeToggle}
                />
            </div>
        </div>
    );
};

export default Chat;