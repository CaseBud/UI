import React, { useState, useRef, useEffect } from 'react';

const VoiceToVoice = ({ onVoiceInput, onSubmit, disabled, language = 'en-US' }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const recognitionRef = useRef(null);

    // Initialize speech recognition
    useEffect(() => {
        // Check if browser supports SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = language;
            
            recognitionRef.current.onresult = (event) => {
                const current = event.resultIndex;
                const transcriptText = event.results[current][0].transcript;
                setTranscript(transcriptText);
            };
            
            recognitionRef.current.onend = () => {
                if (isListening) {
                    // If we're still supposed to be listening, restart
                    recognitionRef.current.start();
                }
            };
            
            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
        }
        
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [language]);

    const startVoiceToVoice = async () => {
        try {
            // Start speech recognition
            if (recognitionRef.current) {
                recognitionRef.current.start();
                setIsListening(true);
            }
            
            // Start recording audio for backup
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];
            
            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };
            
            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, {
                    type: 'audio/webm'
                });
                
                // If speech recognition failed, use audio transcription as fallback
                if (!transcript) {
                    await handleTranscription(audioBlob);
                } else {
                    // Use the transcript from speech recognition
                    processTranscript(transcript);
                }
            };
            
            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting voice-to-voice:', error);
        }
    };

    const stopVoiceToVoice = () => {
        // Stop speech recognition
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
        
        // Stop audio recording
        if (mediaRecorder.current?.state === 'recording') {
            mediaRecorder.current.stop();
            setIsRecording(false);
            mediaRecorder.current.stream
                .getTracks()
                .forEach((track) => track.stop());
        }
    };

    const handleTranscription = async (audioBlob) => {
        setIsProcessing(true);
        try {
            // In a real implementation, this would send the audio to the backend
            // For now, we'll simulate a response
            setTimeout(() => {
                const mockTranscript = "This is a simulated transcript from the audio recording.";
                processTranscript(mockTranscript);
            }, 1000);
            
            // The real implementation would look like this:
            /*
            const formData = new FormData();
            formData.append('file', audioBlob);
            
            const response = await fetchWithToken(
                '/api/transcribe',
                {
                    method: 'POST',
                    body: formData
                },
                true
            );
            
            if (response.status === 'success' && response.data?.transcript) {
                processTranscript(response.data.transcript);
            }
            */
        } catch (error) {
            console.error('Transcription error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const processTranscript = (text) => {
        // Update input field and trigger chat submission
        onVoiceInput({ target: { value: text } });
        onSubmit(text);
        
        // Reset transcript
        setTranscript('');
    };

    return (
        <button
            onClick={isRecording ? stopVoiceToVoice : startVoiceToVoice}
            disabled={disabled || isProcessing}
            className={`p-1.5 md:p-2 rounded-lg transition-all duration-200 ${
                isRecording
                    ? 'text-purple-400 bg-purple-500/20 ring-1 ring-purple-500/50'
                    : isProcessing
                      ? 'text-slate-500'
                      : 'text-slate-400 hover:text-white'
            }`}
            title={isRecording ? 'Stop voice-to-voice' : 'Start voice-to-voice chat'}
        >
            {/* Voice-to-Voice Icon */}
            <svg
                className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-200 ${
                    isRecording ? 'scale-110' : ''
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
                
                {/* Add speaker icon to indicate voice-to-voice */}
                <path d="M2 15 L2 9 L6 9 L11 5 L11 19 L6 15 L2 15" transform="translate(11, 0) scale(0.5)" />
            </svg>

            {/* Recording Animation */}
            {isRecording && (
                <div className="absolute -top-1 -right-1 flex space-x-0.5">
                    <div
                        className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"
                        style={{ animationDelay: '0ms' }}
                    />
                    <div
                        className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"
                        style={{ animationDelay: '150ms' }}
                    />
                    <div
                        className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"
                        style={{ animationDelay: '300ms' }}
                    />
                </div>
            )}

            {/* Processing Animation */}
            {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center gap-0.5">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-0.5 h-3 bg-slate-400 rounded-full animate-synthesizer"
                                style={{
                                    animationDelay: `${i * 100}ms`,
                                    animationDuration: '600ms'
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </button>
    );
};

export default VoiceToVoice; 