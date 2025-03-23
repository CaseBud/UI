import React, { useState, useRef, useEffect } from "react";
import { VoiceService } from "../services/voiceService";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { translate } from "../utils/translations";
import { FaMicrophone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const voiceService = new VoiceService(import.meta.env.VITE_ELEVEN_LABS_API_KEY);

const VoiceToVoiceChat = () => {
    const { isDark } = useTheme();
    const { currentLanguage } = useLanguage();
    const navigate = useNavigate();
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [chatbotResponse, setChatbotResponse] = useState("");
    const [error, setError] = useState(null);
    const [responseAudio, setResponseAudio] = useState(null);
    
    const mediaRecorder = useRef(null);
    const recognition = useRef(null);
    const audioChunks = useRef([]);
    const audioRef = useRef(null);

    useEffect(() => {
        voiceService.initialize();
        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = false;
            recognition.current.interimResults = false;
            recognition.current.lang = currentLanguage;
        }
    }, [currentLanguage]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = async () => {
                // Process final transcript from recognition
                if (transcript) {
                    await handleTranscription(transcript);
                }
            };

            // Start both recording and recognition
            mediaRecorder.current.start();
            recognition.current?.start();
            setIsRecording(true);
            setError(null);

            // Set up recognition handlers
            recognition.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setTranscript(transcript);
            };

            recognition.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setError('Speech recognition error. Please try again.');
            };

        } catch (error) {
            console.error("Error starting recording:", error);
            setError("Failed to start recording. Please check your microphone access.");
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current?.state === "recording") {
            mediaRecorder.current.stop();
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        }
        recognition.current?.stop();
        setIsRecording(false);
    };

    const handleTranscription = async (text) => {
        setIsProcessing(true);
        try {
            // Get chatbot response
            const response = await getBotResponse(text);
            setChatbotResponse(response);
            
            // Convert response to speech
            await handleVoiceResponse(response);
        } catch (error) {
            console.error("Processing error:", error);
            setError("Failed to process your message. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const getBotResponse = async (userText) => {
        // Replace with your actual chatbot API call
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText })
            });
            
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error("Chatbot error:", error);
            throw new Error("Failed to get response from chatbot");
        }
    };

    const handleVoiceResponse = async (text) => {
        try {
            // Cleanup old audio URL if exists
            if (responseAudio) {
                URL.revokeObjectURL(responseAudio);
            }
            
            const audioResponse = await voiceService.textToSpeech(text);
            const audioUrl = URL.createObjectURL(audioResponse);
            setResponseAudio(audioUrl);
        } catch (error) {
            console.error("Voice response error:", error);
            setError(translate("voiceToVoice.responseError", currentLanguage) || "Error generating voice response.");
        }
    };

    useEffect(() => {
        if (responseAudio && audioRef.current) {
            audioRef.current.src = responseAudio;
            audioRef.current.play().catch((err) => {
                console.error("Audio playback error:", err);
                setError(translate("voiceToVoice.playbackError", currentLanguage) || "Error playing audio.");
            });
        }
    }, [responseAudio, currentLanguage]);

    // Cleanup audio URL on unmount or new audio
    useEffect(() => {
        return () => {
            if (responseAudio) {
                URL.revokeObjectURL(responseAudio);
            }
        };
    }, [responseAudio]);

    return (
        <div className={`min-h-screen ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
            {/* Header */}
            <div className="flex items-center h-14 px-4 border-b border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate("/chat")}
                        className="p-2 hover:bg-slate-700/50 rounded-lg"
                        title="Back to Chat"
                    >
                        <svg
                            className="w-5 h-5 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                    </button>
                    <h1 className="text-lg font-medium text-white">
                        {translate("voiceToVoice.title", currentLanguage) || "Voice to Voice Chat"}
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div
                    className={`p-6 rounded-lg ${isDark ? "bg-slate-800" : "bg-white"} border ${
                        isDark ? "border-slate-700/50" : "border-gray-200"
                    }`}
                >
                    <div className="flex flex-col items-center">
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={isProcessing}
                            className={`p-6 rounded-full transition-all duration-200 ${
                                isRecording
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-blue-500 hover:bg-blue-600"
                            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={isRecording ? "Stop recording" : "Start recording"}
                        >
                            <FaMicrophone className="w-8 h-8" />
                        </button>

                        <div className="mt-6 text-center w-full">
                            {isProcessing && (
                                <div className="flex items-center justify-center space-x-2 text-slate-400">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    <span>
                                        {translate("voiceToVoice.processing", currentLanguage) || "Processing..."}
                                    </span>
                                </div>
                            )}

                            {error && (
                                <div
                                    className={`mt-4 p-4 rounded-lg ${
                                        isDark ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {error}
                                </div>
                            )}

                            {transcript && (
                                <div
                                    className={`mt-4 p-4 rounded-lg ${
                                        isDark ? "bg-slate-700/50" : "bg-gray-50"
                                    }`}
                                >
                                    <h3
                                        className={`text-sm font-medium mb-2 ${
                                            isDark ? "text-slate-300" : "text-gray-600"
                                        }`}
                                    >
                                        {translate("voiceToVoice.transcript", currentLanguage) || "Transcript"}
                                    </h3>
                                    <p className={`text-lg ${isDark ? "text-white" : "text-gray-800"}`}>
                                        {transcript}
                                    </p>
                                </div>
                            )}

                            {chatbotResponse && (
                                <div
                                    className={`mt-4 p-4 rounded-lg ${
                                        isDark ? "bg-slate-700/50" : "bg-gray-50"
                                    }`}
                                >
                                    <h3
                                        className={`text-sm font-medium mb-2 ${
                                            isDark ? "text-slate-300" : "text-gray-600"
                                        }`}
                                    >
                                        {translate("voiceToVoice.chatbotResponse", currentLanguage) || "Chatbot Response"}
                                    </h3>
                                    <p className={`text-lg ${isDark ? "text-white" : "text-gray-800"}`}>
                                        {chatbotResponse}
                                    </p>
                                </div>
                            )}

                            {/* Hidden audio element for playback */}
                            <audio ref={audioRef} hidden />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceToVoiceChat;