import React, { useState, useRef, useEffect } from 'react';
import { chatApi, documentsApi } from '../utils/api';
import { authService } from '../services/authService';
import Sidebar from './Sidebar';
import ChatHistory from './ChatHistory';
import TypingAnimation from './TypingAnimation'; // Ensure this import is correct
import DocumentUploader from './DocumentUploader';
import DocumentPreview from './DocumentPreview';
import VoiceChat from './VoiceChat';
import VoiceToVoice from './VoiceToVoice';
import TextToSpeech from './TextToSpeech';
import ReasoningModeToggle from './ReasoningModeToggle';
import LanguageSelector from './LanguageSelector';
import DocumentCreator from './DocumentCreator';
import { useLocation, useNavigate } from 'react-router-dom';
import MobileNav from './MobileNav';
import MobileBottomBar from './MobileBottomBar'; // Ensure this import is correct
import { FiFileText, FiSun, FiMoon } from 'react-icons/fi';

// Format text with bold formatting (** ** syntax)
const formatTextWithBold = (text) => {
    if (!text) return '';
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={index}>
                    {part.slice(2, -2)}
                </strong>
            );
        }
        return part;
    });
};

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
            <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .119-.075.176-.225.176l-.564.031c-.485.029-.727.164-.727.436 0 .135.053.33.166.601 1.082 2.646 4.818 10.521 4.818 10.521l.136.046 2.411-4.81-.482-1.067-1.658-3.264s-.318-.654-.428-.872c-.728-1.443-.712-1.518-1.447-1.617-.207-.023-.313-.05-.313-.149v-.468l.06-.045h4.292l.113.037v.451c0 .105-.076.15-.227.15l-.308.047c-.792.061-.661.381-.136 1.422l1.582 3.252 1.758-3.504c.293-.64.233-.801.111-.947-.07-.084-.305-.22-.812-.24l-.201-.021c-.052 0-.098-.015-.145-.051-.045-.031-.067-.076-.067-.129v-.427l.061-.045c1.247-.008 4.043 0 4.043 0l.059.045v.436c0 .121-.059.178-.193.178-.646.03-1.023.095-1.023.439-.12.186-.375.589-.646 1.039l-2.301 4.273-.065.135 2.792 5.712.17.048 4.396-10.438c.154-.422.129-.722-.064-.895-.197-.174-.346-.277-.857-.277l-.423-.015c-.061 0-.105-.014-.152-.045-.043-.029-.072-.075-.072-.072-.119v-.436l.059-.045h4.961l.041.045v.437c0 .119-.074.18-.209.18-.648.03-1.127.18-1.443.421-.314.255-.557.616-.736 1.067 0 0-4.043 9.258-5.426 12.339-.525 1.007-1.053.917-1.503-.031-.571-1.171-1.773-3.786-2.646-5.71l.053-.036z" />
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

const Chat = ({ initialMode }) => {
    const user = authService.getCurrentUser();
    // Create greeting with user's name - update this line
    const defaultGreeting = `Hello ${user?.fullName || user?.name || 'there'}! How can I help you today?`;
    const location = useLocation();
    const navigate = useNavigate();
    const isTempUser = location.state?.tempUser || false;

    const [message, setMessage] = useState('');
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
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
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
    const [language, setLanguage] = useState('en-US');
    const [showDocumentCreator, setShowDocumentCreator] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(false);
    const [currentSpeakingMessage, setCurrentSpeakingMessage] = useState(null);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState(null); // Add state for copied message tracking

    // Add initialMode prop to the Chat component
    const [isVoiceMode, setIsVoiceMode] = useState(initialMode === 'voice');

    // Add dark mode state and toggle function
    const [darkMode, setDarkMode] = useState(true);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        // You could also save this preference to localStorage
        localStorage.setItem('darkMode', !darkMode);
    };

    // Add useEffect to load dark mode preference from localStorage
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode !== null) {
            setDarkMode(savedDarkMode === 'true');
        }
    }, []);

    useEffect(() => {
        if (initialMode === 'voice') {
            setIsVoiceMode(true);
        }
    }, [initialMode]);

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
            
            // Close language dropdown when clicking outside
            const languageDropdown = document.getElementById('language-dropdown-button');
            if (
                isLanguageDropdownOpen && 
                languageDropdown && 
                !languageDropdown.contains(event.target) &&
                !event.target.closest('.language-dropdown-menu')
            ) {
                setIsLanguageDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isLanguageDropdownOpen]);

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

    const handleDeleteConversation = async (conversationId) => {
        if (isIncognito) return; // Disable chat deletion in incognito mode

        try {
            await fetch(
                `https://case-bud-backend-bzgqfka6daeracaj.centralus-01.azurewebsites.net/api/chat/${conversationId}`,
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
                `https://case-bud-backend-bzgqfka6daeracaj.centralus-01.azurewebsites.net/api/chat/${conversationId}`,
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
                setIsTyping(false);
                return;
            }
            
            for (let i = 0; i < characters.length; i++) {
                if (i === 0) {
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
                        (newMessages[lastIndex].type === 'assistant' || newMessages[lastIndex].type === 'system')
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
                    (newMessages[lastIndex].type === 'assistant' || newMessages[lastIndex].type === 'system')
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
        if (isIncognito || !response?.data?.document) return;
        
        const document = response.data.document;
        
        setUploadedDocuments(prev => [...prev, document]);
        setActiveDocuments(prev => [...prev, document._id]);
        
        if (!isDocumentAnalysis) {
            setMessages(prev => [
                ...prev,
                {
                    type: 'system',
                    content: {
                        response: 'Switched to document analysis mode'
                    },
                    timestamp: new Date()
                }
            ]);
        }
        
        setIsWebMode(false);
        setIsDocumentAnalysis(true);
        setDocumentAnalysisId(null); // Reset analysis ID for new document
        
        setMessages(prev => [
            ...prev,
            {
                type: 'system', 
                content: {
                    response: `Document "${document.name}" uploaded successfully. You can now ask questions about this document.`
                },
                documents: [document],
                timestamp: new Date()
            }
        ]);
    };

    // Ensure document analysis chat sets conversationId to null when starting a new document chat
    const handleDocumentAnalysis = async (query, documentIds) => {
        if (isIncognito) return; // Disable document analysis in incognito mode

        try {
            setCurrentconversationId(null); // Reset conversationId for new document chat
            const response = await chatApi.sendDocumentAnalysis(
                query,
                documentIds,
                documentAnalysisId
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
    
    const handleLanguageChange = (lang) => {
        setLanguage(lang);
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

    // Modify the sendMessage function to ensure consistent message structure
    const sendMessage = async (content) => {
        if (!content?.trim() || isTyping) return;

        // Create a properly structured user message
        const newUserMessage = {
            type: 'user',
            content: {
                query: content.trim(),
                response: null
            },
            timestamp: new Date()
        };

        try {
            setMessages((prev) => [...prev, newUserMessage]);
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

                    if (!response) {
                        throw new Error('No response from document analysis');
                    }
                    setActiveDocuments([]); // Clear documents
                    setDocumentAnalysisId(response.conversationId);
                    setIsDocumentAnalysis(true);

                    // Add assistant message with proper structure
                    const assistantMessage = {
                        type: 'assistant',
                        content: {
                            query: content.trim(),
                            response: response.response || response.message || ''
                        },
                        documents: [],
                        timestamp: new Date()
                    };

                    setMessages((prev) => [...prev, assistantMessage]);
                    await showResponseGradually(
                        response.response || response.message || ''
                    );
                } catch (docError) {
                    console.error('Document analysis error details:', docError);
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: 'error',
                            content: {
                                response:
                                    'Document analysis failed. Please try again.'
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
                                    response:
                                        'Switched to general conversation mode'
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
                                    response:
                                        'Switched to web browsing mode (beta)'
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
                    conversationId: currentconversationId,
                    webSearch: isWebMode,
                    language: language,
                    detailedMode: isDetailedMode
                });
                setCurrentconversationId(response.conversationId);
                if (isWebMode) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            type: 'system',
                            content: {
                                response:
                                    'Searching the web for relevant sources...'
                            },
                            timestamp: new Date()
                        }
                    ]);
                }

                const assistantMessage = {
                    type: isWebMode ? 'system' : 'assistant',
                    content: {
                        query: content.trim(),
                        response: response.response || response.message || ''
                    },
                    isWebSearch: isWebMode,
                    timestamp: new Date()
                };

                setMessages((prev) => [...prev, assistantMessage]);

                await showResponseGradually(
                    response.response || response.message || ''
                );
            }

            localStorage.setItem('lastConversationId', response.conversationId);
            localStorage.setItem(
                'currentChatMessages',
                JSON.stringify(messages)
            );

            // If text-to-speech is enabled, speak the response
            if (isTextToSpeechEnabled) {
                const responseText = response.response || response.message || '';
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
                        response: error.message || 'Failed to process your request.'
                    },
                    timestamp: new Date()
                }
            ]);
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

    const handleSelectPrompt = (promptText) => {
        setMessage(promptText);
        inputRef.current?.focus();
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
                        response: defaultGreeting,
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
                        response: defaultGreeting,
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
                content: 'Switched to general conversation mode',
                timestamp: new Date()
            }
        ]);
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const isMobile = () => window.innerWidth < 768;

    const MessageBubble = ({ message }) => {
        const [isCopied, setIsCopied] = useState(false);
        const timeoutRef = useRef(null);

        const handleCopy = async () => {
            try {
                await navigator.clipboard.writeText(message.content.response);
                setIsCopied(true);

                // Reset the "Copied!" message after 2 seconds
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        };

        const isUser = message.type === 'user';
        const isError = message.type === 'error';
        const isSystem = message.type === 'system';

        // Updated message type classes
        const messageTypeClasses = isUser
            ? 'bg-blue-600 text-white ml-auto rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl'
            : isError
              ? 'bg-red-500 text-white rounded-2xl'
              : isSystem
                ? 'bg-slate-600 text-slate-200 rounded-2xl mx-auto'
                : 'bg-slate-700 text-slate-100 mr-auto rounded-tr-2xl rounded-br-2xl rounded-tl-2xl';

        const getSiteIcon = (url) => {
            try {
                const hostname = new URL(url).hostname.toLowerCase();
                if (hostname.includes('wikipedia.org')) return 'Wikipedia';
                if (hostname.includes('google.com')) return 'Google';
                if (hostname.includes('facebook.com')) return 'Facebook';
                return 'Default';
            } catch {
                return 'Default';
            }
        };

        return (
            <div
                className={`group flex items-end gap-0.5 px-0.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
                {/* Assistant/System Avatar - Adjusted size */}
                {(message.type === 'assistant' ||
                    message.type === 'system') && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center mb-0">
                        {message.type === 'system' ? (
                            <IconComponents.System className="w-4 h-4 text-white" />
                        ) : (
                            <IconComponents.Assistant className="w-4 h-4 text-white" />
                        )}
                    </div>
                )}

                <div className="flex-grow flex flex-col">
                    <div className="flex items-start justify-between">
                        {/* Show typing animation only if message is empty and isTyping is true */}
                        {message.content.response === '' && isTyping ? (
                            <TypingAnimation />
                        ) : (
                            <p className="whitespace-pre-wrap text-sm">
                                {message.content.response || message.content}
                            </p>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 ml-2 mt-0.5">
                            <button
                                onClick={handleCopy}
                                className={`p-1 rounded-full ${
                                    darkMode
                                        ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-300'
                                        : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                                } transition-colors`}
                                title="Copy to clipboard"
                            >
                                {isCopied ? (
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                )}
                            </button>
                            
                            {/* Text-to-speech button for assistant messages */}
                            {message.type === 'assistant' && message.content.response && (
                                <TextToSpeech 
                                    text={message.content.response} 
                                    language={language}
                                />
                            )}
                            
                            {/* Create document button for assistant messages */}
                            {message.type === 'assistant' && message.content.response && (
                                <button
                                    onClick={() => {
                                        navigate('/document-editor', { 
                                            state: { 
                                                initialContent: message.content.response,
                                                initialTitle: message.content.query || 'Chat Response'
                                            } 
                                        });
                                    }}
                                    className="p-0.5 text-slate-400 hover:text-white rounded"
                                    title="Create document from this response"
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a3 3 0 0 0-3-3H2z"></path>
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Timestamp */}
                    <div
                        className={`flex items-center gap-0.5 text-xs text-slate-400 ${
                            message.type === 'user'
                                ? 'justify-end'
                                : 'justify-start'
                        }`}
                    >
                        <span className="opacity-60">
                            {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }
                            )}
                        </span>
                    </div>
                </div>

                {/* User Avatar - Also adjusted size for consistency */}
                {message.type === 'user' && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center mb-0">
                        <IconComponents.User className="w-4 h-4 text-white" />
                    </div>
                )}
            </div>
        );
    };

    // Add toggle function for history
    const toggleHistory = () => {
        if (!isHistoryOpen) {
            fetchConversations();
        }
        setIsHistoryOpen(!isHistoryOpen);
    };

    // Add new function to handle textarea height
    const adjustTextareaHeight = (element) => {
        element.style.height = 'auto'; // Reset height to recalculate
        const newHeight = Math.min(element.scrollHeight, 120); // Max height of 120px
        element.style.height = !element.value ? '44px' : `${newHeight}px`; // Default height when empty
    };

    // Update message state handler to include height adjustment
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
        adjustTextareaHeight(e.target);
    };

    // Add new effect to handle page reload
    useEffect(() => {
        const restoreChat = async () => {
            // Try to get last conversation from localStorage
            const lastConversationId =
                localStorage.getItem('lastConversationId');
            const savedMessages = JSON.parse(
                localStorage.getItem('currentChatMessages') || '[]'
            );

            if (savedMessages.length > 0) {
                setMessages(savedMessages);
            }

            if (lastConversationId) {
                try {
                    await handleSelectChat(lastConversationId);
                } catch (error) {
                    console.error('Failed to restore chat:', error);
                    // If chat restoration fails, start a new chat
                    createNewChat();
                }
            }

            // Scroll to bottom after restoring chat
            chatContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
        };

        restoreChat();
    }, []);

    // Add effect to save current chat state
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(
                'currentChatMessages',
                JSON.stringify(messages)
            );
        }
        if (currentconversationId) {
            localStorage.setItem('lastConversationId', currentconversationId);
        }
    }, [messages, currentconversationId]);

    // Modify handleSelectChat to close history on desktop
    const handleSelectChat = async (conversationId) => {
        if (isIncognito) return;

        try {
            const conversation =
                await chatApi.getConversationById(conversationId);
            if (!conversation) {
                throw new Error('Chat not found');
            }

            // Transform messages to match the new structure
            const formattedMessages = [];
            if (conversation.type === 'document-analysis') {
                const documents = [];

                conversation.messages.forEach((msg) => {
                    if (msg.documents) {
                        documents.push(...msg.documents);
                    }
                });

                formattedMessages.push({
                    type: 'system',
                    content: {
                        response: 'Uploaded documents:'
                    },
                    documents,
                    timestamp: new Date()
                });
            }
            
            conversation.messages.forEach((msg) => {
                // First add the user message if it exists
                if (msg.content && msg.content.query) {
                    formattedMessages.push({
                        type: 'user',
                        content: {
                            query: msg.content.query
                        },
                        timestamp: msg.timestamp || new Date()
                    });
                }

                // Then add web search indicator before the response if it's a web search
                if (msg.isWebSearch) {
                    formattedMessages.push({
                        type: 'system',
                        content: {
                            response: 'Sources:'
                        },
                        isWebSearch: true,
                        timestamp: msg.timestamp || new Date()
                    });
                }

                // Finally add the assistant response
                if (msg.content && (msg.content.response || msg.content.message)) {
                    formattedMessages.push({
                        type: msg.isWebSearch ? 'system' : 'assistant',
                        content: {
                            response: msg.content.response || msg.content.message || ''
                        },
                        isWebSearch: msg.isWebSearch,
                        timestamp: msg.timestamp || new Date()
                    });
                }
            });

            if (conversation.type === 'document-analysis') {
                setDocumentAnalysisId(conversation._id);
                setIsDocumentAnalysis(true);
                setCurrentconversationId(null);
                localStorage.setItem('lastConversationId', conversation._id);
            } else {
                setDocumentAnalysisId(null);
                setIsDocumentAnalysis(false);
                setCurrentconversationId(conversation._id);
                localStorage.setItem('lastConversationId', conversation._id);
            }

            localStorage.setItem('lastConversationId', conversation._id);
            localStorage.setItem(
                'currentChatMessages',
                JSON.stringify(formattedMessages)
            );
            setMessages(formattedMessages);
            setIsNewConversation(false);

            // Add this to close history on desktop after selecting chat
            if (window.innerWidth >= 768) {
                setIsHistoryOpen(false);
            }
        } catch (error) {
            console.error('Failed to fetch chat:', error);

            // Clear saved state if chat not found
            if (error.message === 'Chat not found') {
                localStorage.removeItem('lastConversationId');
                localStorage.removeItem('currentChatMessages');
                createNewChat();
            }

            if (isNewConversation) {
                return;
            }

            setMessages((prev) => [
                ...prev,
                {
                    type: 'error',
                    content: {
                        response: 'Failed to load conversation. Starting a new chat.'
                    },
                    timestamp: new Date()
                }
            ]);
            localStorage.removeItem('lastConversationId');
            localStorage.removeItem('currentChatMessages');
            createNewChat();
        }
    };

    // Update the message bubble styles to use solid colors instead of glassmorphism
    const getMessageBubbleClass = (isUser) => {
        return isUser
            ? 'bg-blue-600 text-white ml-auto rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl'
            : 'bg-slate-700 text-slate-100 mr-auto rounded-tr-2xl rounded-br-2xl rounded-tl-2xl';
    };

    // Update the quoted message bubble styles
    const getQuotedMessageBubbleClass = (isUser) => {
        return isUser
            ? 'bg-blue-700 text-white ml-auto rounded-tl-2xl rounded-bl-2xl rounded-tr-2xl'
            : 'bg-slate-700 text-slate-100 mr-auto rounded-tr-2xl rounded-br-2xl rounded-tl-2xl';
    };

    // Add a handleSendMessage function that calls sendMessage
    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage(message);
        }
    };

    // Move the handleFileUpload function before the return statement
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || isIncognito) return;

        try {
            // Log file details for debugging
            console.log('File details:', {
                name: file.name,
                size: file.size,
                type: file.type,
                sizeInMB: file.size / (1024 * 1024)
            });

            // File type validation
            const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
            const fileExt = '.' + file.name.split('.').pop().toLowerCase();
            if (!allowedTypes.includes(fileExt)) {
                throw new Error(
                    `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
                );
            }

            // Show a system message that we're uploading
            setMessages((prev) => [
                ...prev,
                {
                    type: 'system',
                    content: {
                        response: `Uploading document: ${file.name}...`
                    },
                    timestamp: new Date()
                }
            ]);

            const response = await documentsApi.uploadDocument(file, file.name);
            
            // Call the existing upload complete handler
            handleUploadComplete(response);
            
            // Reset the file input
            event.target.value = '';
            
        } catch (error) {
            console.error('Failed to upload document:', error);
            let errorMessage = error.message;

            // Handle specific error cases
            if (error.status === 413) {
                errorMessage = 'File size too large. Please try a smaller file.';
            } else if (error.status === 415) {
                errorMessage = 'Invalid file type. Please try another format.';
            }

            // Show error message
            setMessages((prev) => [
                ...prev,
                {
                    type: 'error',
                    content: {
                        response: errorMessage || 'Failed to upload document. Please try again.'
                    },
                    timestamp: new Date()
                }
            ]);
        }
    };

    // Update the renderChatContainer function for a more compact UI with better fonts
    const renderChatContainer = () => {
        return (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Chat messages container */}
                <div 
                    className={`flex-1 overflow-y-auto px-3 py-4 space-y-4 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}
                    style={{ paddingBottom: '80px' }}
                >
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center max-w-md mx-auto px-4">
                                <div className={`w-14 h-14 mx-auto mb-3 rounded-full ${darkMode ? 'bg-blue-600/20' : 'bg-blue-100'} flex items-center justify-center`}>
                                    <svg
                                        className={`w-7 h-7 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                    />
                                </svg>
                            </div>
                            <h2 className={`text-xl font-semibold mb-2 tracking-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Hello Murewa Ajala!
                            </h2>
                            <p className={`${darkMode ? 'text-slate-300' : 'text-gray-600'} mb-5 text-sm`}>
                                How can I help you with your legal questions today?
                            </p>
                            <div className="space-y-2">
                                {['What are my rights in a criminal case?', 'Help with tenant rights', 'How do I file for divorce?'].map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setMessage(suggestion);
                                            setTimeout(() => {
                                                if (inputRef.current) {
                                                    inputRef.current.focus();
                                                }
                                            }, 100);
                                        }}
                                        className={`w-full py-2.5 px-3 rounded-lg text-left text-sm ${
                                            darkMode 
                                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' 
                                                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                                        } transition-colors`}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`group flex items-end gap-0.5 px-0.5 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {/* Assistant/System Avatar - Adjusted size */}
                                {(msg.type === 'assistant' ||
                                    msg.type === 'system') && (
                                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center mb-0">
                                        {msg.type === 'system' ? (
                                            <IconComponents.System className="w-4 h-4 text-white" />
                                        ) : (
                                            <IconComponents.MessageCircle className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                )}

                                <div
                                    className={`flex flex-col max-w-[75%] md:max-w-[65%] space-y-0 ${
                                        msg.type === 'user'
                                            ? 'ml-auto'
                                            : ''
                                    }`}
                                >
                                    <div
                                        className={`px-2.5 py-1.5 ${getMessageBubbleClass(msg.type === 'user')}`}
                                    >
                                        {/* Show typing animation only if message is empty and isTyping is true */}
                                        {msg.content.response === '' && isTyping ? (
                                            <TypingAnimation />
                                        ) : (
                                            <p className="whitespace-pre-wrap text-sm">
                                                {msg.type === 'user'
                                                    ? msg.content.query
                                                    : formatTextWithBold(msg.content.response)}
                                            </p>
                                        )}

                                        {/* Document Preview - Inside the message bubble */}
                                        {msg.documents && msg.documents.length > 0 && (
                                            <div className="mt-2 border-t border-slate-500/30 pt-2">
                                                {msg.documents.map((doc, index) => (
                                                    <DocumentPreview
                                                        key={index}
                                                        document={doc}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {!(msg.type === 'user') &&
                                        (msg.type === 'system' ||
                                            msg.type === 'assistant') && (
                                            <div className="mt-0 space-y-0.5">
                                                {/* Show web sources if they exist */}
                                                {msg.isWebSearch && (
                                                    <>
                                                        <div className="flex items-center gap-1 px-1">
                                                            <IconComponents.Globe className="w-3 h-3 text-blue-400" />
                                                            <span className="text-xs font-medium text-blue-400">
                                                                Web References
                                                            </span>
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            {[
                                                                {
                                                                    url: 'https://www.google.com/',
                                                                    title: 'Google Search Results'
                                                                },
                                                                {
                                                                    url: 'https://wikipedia.org/',
                                                                    title: 'Wikipedia Reference'
                                                                },
                                                                {
                                                                    url: 'https://facebook.com/',
                                                                    title: 'Public Information'
                                                                }
                                                            ].map((source, index) => {
                                                                const SiteIcon =
                                                                    IconComponents[
                                                                        getSiteIcon(source.url)
                                                                    ];
                                                                return (
                                                                    <a
                                                                        key={index}
                                                                        href={source.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="block p-1 rounded-lg bg-slate-800/50 border border-slate-700/50 
                                                               hover:bg-slate-700/50 transition-colors"
                                                                    >
                                                                        <div className="flex items-start gap-1">
                                                                            <div className="flex-shrink-0 w-3.5 h-3.5 mt-0.5 text-slate-400">
                                                                                <SiteIcon className="w-full h-full" />
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <h4 className="text-xs text-blue-400 font-medium truncate mb-0">
                                                                                    {source.title ||
                                                                                        'Web Source'}
                                                                                </h4>
                                                                                <p className="text-xs text-slate-400 truncate">
                                                                                    {source.url}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </a>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                    {/* Message Actions */}
                                    <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* Copy button with icon instead of text */}
                                        <button
                                            onClick={() => handleCopy(msg.content.response)}
                                            className={`p-1 rounded-full ${
                                                darkMode
                                                    ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-300'
                                                    : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                                            } transition-colors`}
                                            title={copiedMessageId === msg.content.response ? "Copied!" : "Copy to clipboard"}
                                        >
                                            {copiedMessageId === msg.content.response ? (
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 6L9 17l-5-5"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                </svg>
                                            )}
                                        </button>
                                        
                                        {/* Text-to-speech button for assistant messages */}
                                        {msg.type === 'assistant' && msg.content.response && (
                                            <TextToSpeech 
                                                text={msg.content.response} 
                                                language={language}
                                            />
                                        )}
                                        
                                        {/* Create document button for assistant messages */}
                                        {msg.type === 'assistant' && msg.content.response && (
                                            <button
                                                onClick={() => {
                                                    setShowDocumentCreator(true);
                                                    setDocumentContent(msg.content.response);
                                                }}
                                                className={`p-1 rounded-full ${
                                                    darkMode
                                                        ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-300'
                                                        : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                                                } transition-colors`}
                                                title="Create document from this response"
                                            >
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a3 3 0 0 0-3-3H2z"></path>
                                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {/* Timestamp */}
                                    <div
                                        className={`flex items-center gap-0.5 text-xs text-slate-400 ${
                                            darkMode ? 'text-slate-500' : 'text-gray-400'
                                        } mt-1 opacity-0 group-hover:opacity-100 transition-opacity`}
                                    >
                                        <span className="opacity-60">
                                            {new Date(msg.timestamp).toLocaleTimeString(
                                                [],
                                                {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* User Avatar - Also adjusted size for consistency */}
                                {msg.type === 'user' && (
                                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center mb-0">
                                        <IconComponents.User className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 mr-2 mt-1 flex items-center justify-center">
                                <svg
                                    className="w-3.5 h-3.5 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                </svg>
                            </div>
                            <div className={`max-w-[85%] md:max-w-[75%] rounded-lg p-3 rounded-tl-none ${
                                darkMode ? 'bg-slate-800 text-slate-200' : 'bg-white text-gray-800 border border-gray-200'
                            } shadow-sm`}>
                                <TypingAnimation />
                            </div>
                        </div>
                    )}
                    <div ref={chatContainerRef} />
                </div>,  {/* Add comma here */}

                {/* Input area */}
                <div className={`border-t ${darkMode ? 'border-slate-700/50 bg-slate-800' : 'border-gray-200 bg-white'} p-3 relative`}>
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center space-x-1.5">
                            {/* Feature toggles */}
                            <div className="flex space-x-1">
                                {/* Web search toggle */}
                                <button
                                    onClick={() => setIsWebMode(!isWebMode)}
                                    className={`p-1.5 rounded-full transition-colors ${
                                        isWebMode 
                                            ? (darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600') 
                                            : (darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-gray-500 hover:text-gray-700')
                                    }`}
                                    title={isWebMode ? "Web search enabled" : "Enable web search"}
                                >
                                    <IconComponents.Globe className="w-4 h-4" />
                                </button>
                                
                                {/* Detailed reasoning toggle */}
                                <button
                                    onClick={() => setIsDetailedMode(!isDetailedMode)}
                                    className={`p-1.5 rounded-full transition-colors ${
                                        isDetailedMode 
                                            ? (darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600') 
                                            : (darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-gray-500 hover:text-gray-700')
                                    }`}
                                    title={isDetailedMode ? "Detailed reasoning enabled" : "Enable detailed reasoning"}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Text input */}
                            <div className="flex-1 relative">
                                <textarea
                                    ref={inputRef}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="Type your message..."
                                    className={`w-full ${
                                        darkMode 
                                            ? 'bg-slate-700 text-white focus:ring-blue-500' 
                                            : 'bg-gray-100 text-gray-900 focus:ring-blue-500'
                                    } rounded-full pl-3 pr-10 py-2 focus:outline-none focus:ring-1 resize-none text-sm font-medium`}
                                    rows={1}
                                    style={{
                                        minHeight: '40px',
                                        maxHeight: '120px'
                                    }}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!message.trim() || isTyping}
                                    className={`absolute right-1.5 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full ${
                                        !message.trim() || isTyping
                                            ? (darkMode ? 'text-slate-500 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed')
                                            : (darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600')
                                    } transition-colors`}
                                >
                                    <IconComponents.Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            
                            {/* Tools button */}
                            <button
                                onClick={() => setIsToolsOpen(!isToolsOpen)}
                                className={`p-1.5 rounded-full ${
                                    darkMode ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                } transition-colors`}
                                title="Tools"
                            >
                                <IconComponents.Tools className="w-4 h-4" />
                            </button>
                            
                            {/* History toggle button (visible on mobile) */}
                            <button
                                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                                className={`p-1.5 rounded-full md:hidden ${
                                    darkMode ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                } transition-colors`}
                                title="Chat History"
                            >
                                <svg
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Mode indicators */}
                        <div className="flex items-center mt-1.5 text-xs space-x-3 justify-center">
                            {isWebMode && (
                                <div className="flex items-center">
                                    <span className={`w-1.5 h-1.5 bg-blue-400 rounded-full mr-1`}></span>
                                    <span className={`${darkMode ? 'text-slate-400' : 'text-gray-500'} font-medium text-xs`}>
                                        Web Search
                                    </span>
                                </div>
                            )}
                            {isDetailedMode && (
                                <div className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-1"></span>
                                    <span className={`${darkMode ? 'text-slate-400' : 'text-gray-500'} font-medium text-xs`}>
                                        Detailed
                                    </span>
                                </div>
                            )}
                            {isVoiceMode && (
                                <div className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                                    <span className={`${darkMode ? 'text-slate-400' : 'text-gray-500'} font-medium text-xs`}>
                                        Voice
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleCopy = async (messageContent) => {
        try {
            if (!messageContent) return;
            await navigator.clipboard.writeText(messageContent);
            setCopiedMessageId(messageContent);
            setTimeout(() => setCopiedMessageId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-slate-900 text-slate-200' : 'bg-gray-50 text-gray-800'}`}>
            {/* Sidebar - hidden on mobile, visible on desktop */}
            <div className="hidden md:block">
                <Sidebar 
                    user={user} 
                    onSelectPrompt={handleSelectPrompt} 
                    darkMode={darkMode} 
                    toggleDarkMode={toggleDarkMode}
                    isOpen={true}
                    onClose={() => {}}
                />
            </div>
            
            {/* Mobile Sidebar - only visible when toggled */}
            <Sidebar 
                user={user} 
                onSelectPrompt={handleSelectPrompt} 
                darkMode={darkMode} 
                toggleDarkMode={toggleDarkMode}
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                className="md:hidden"
            />
            
            {/* Main content area */}
            <div className="flex-1 flex flex-col h-screen relative overflow-hidden">
                {/* Mobile top navigation - only visible on mobile */}
                <div className={`flex items-center justify-between p-2 ${darkMode ? 'border-b border-slate-700/50' : 'border-b border-gray-200'} md:hidden`}>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-200'} transition-colors`}
                    >
                        <svg
                            className={`w-4 h-4 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </button>
                    <h1 className="text-sm font-medium">AI Assistant</h1>
                    <button
                        onClick={toggleDarkMode}
                        className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-200'} transition-colors`}
                    >
                        {darkMode ? (
                            <FiSun className={`w-4 h-4 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`} />
                        ) : (
                            <FiMoon className={`w-4 h-4 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`} />
                        )}
                    </button>
                </div>
                
                {/* Main content with chat and history */}
                <div className="flex flex-1 overflow-hidden relative">
                    {/* Main chat area */}
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        {isVoiceMode ? (
                            <VoiceChat
                                onVoiceInput={handleVoiceInput}
                                onSendMessage={handleSendMessage}
                                isTyping={isTyping}
                                messages={messages}
                                chatContainerRef={chatContainerRef}
                                darkMode={darkMode}
                            />
                        ) : (
                            renderChatContainer()
                        )}
                    </div>
                    
                    {/* Chat history sidebar */}
                    <div
                        ref={historyRef}
                        className={`${
                            isHistoryOpen
                                ? 'translate-x-0 opacity-100'
                                : 'translate-x-full opacity-0 md:translate-x-0 md:opacity-100'
                        } transition-all duration-300 w-full md:w-64 absolute md:relative right-0 z-20 h-full ${
                            darkMode ? 'bg-slate-800 border-l border-slate-700/50' : 'bg-white border-l border-gray-200'
                        } overflow-hidden flex flex-col`}
                    >
                        <ChatHistory
                            conversations={conversations}
                            onSelectChat={handleSelectChat}
                            onNewChat={handleNewChat} 
                            onDeleteChat={handleDeleteConversation}
                            onEditTitle={handleEditTitle}
                            currentConversationId={currentconversationId}
                            onClose={() => setIsHistoryOpen(false)}
                            darkMode={darkMode}
                        />
                    </div>
                </div>
                
                {/* Mobile bottom navigation - only visible on mobile */}
                <div className="md:hidden">
                    <MobileBottomBar
                        darkMode={darkMode}
                        onDarkModeToggle={toggleDarkMode}
                        onNewChat={handleNewChat}
                        onHistoryToggle={() => setIsHistoryOpen(!isHistoryOpen)}
                        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        onWebToggle={() => setIsWebMode(!isWebMode)}
                        onVoiceToggle={() => setIsVoiceMode(!isVoiceMode)}
                        isWebMode={isWebMode}
                        isVoiceMode={isVoiceMode}
                    />
                </div>
                
                {/* Mobile menu - only visible when open */}
                <MobileNav
                    darkMode={darkMode}
                    user={user}
                    onSelectPrompt={handleSelectPrompt}
                    isTempUser={isTempUser}
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                />
                
                {/* Tools panel */}
                <div className={`fixed bottom-16 md:bottom-4 right-4 z-10 ${isToolsOpen ? 'block' : 'hidden'}`}>
                    <div className={`p-2 rounded-lg shadow-lg ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'}`}>
                        <div className="mb-1">
                            <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Upload Document</p>
                        </div>
                        <label className={`flex items-center justify-center px-2 py-1.5 rounded-md cursor-pointer text-xs ${
                            darkMode 
                                ? 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border border-blue-600/20' 
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                        }`}>
                            <FiFileText className="mr-1.5 w-3.5 h-3.5" />
                            <span>Choose File</span>
                            <input type="file" className="hidden" onChange={handleFileUpload} />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
