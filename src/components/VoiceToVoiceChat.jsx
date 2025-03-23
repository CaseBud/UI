import React, { useState, useRef, useEffect } from 'react';
import { VoiceService } from '../services/voiceService';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
import { FaMicrophone } from 'react-icons/fa';

const voiceService = new VoiceService(import.meta.env.VITE_ELEVEN_LABS_API_KEY);

const VoiceToVoiceChat = () => {
    const { isDark } = useTheme();
    const { currentLanguage } = useLanguage();
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [responseAudio, setResponseAudio] = useState(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    useEffect(() => {
        voiceService.initialize();
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                await handleTranscription(audioBlob);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current?.state === 'recording') {
            mediaRecorder.current.stop();
            setIsRecording(false);
            mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
        }
    };

    const handleTranscription = async (audioBlob) => {
        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append('file', audioBlob);

            const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.transcript) {
                setTranscript(data.transcript);
                await handleVoiceResponse(data.transcript);
            }
        } catch (error) {
            console.error('Transcription error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleVoiceResponse = async (text) => {
        try {
            const audioResponse = await voiceService.textToSpeech(text);
            const audioUrl = URL.createObjectURL(audioResponse);
            setResponseAudio(audioUrl);
        } catch (error) {
            console.error('Voice response error:', error);
        }
    };

    useEffect(() => {
        if (responseAudio) {
            const audio = new Audio(responseAudio);
            audio.play();
        }
    }, [responseAudio]);

    return (
        <div className={`flex flex-col items-center justify-center h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <h1 className="text-2xl font-semibold mb-4">{translate('voiceToVoice.title', currentLanguage) || 'Voice to Voice Chat'}</h1>
            <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`p-4 rounded-full transition-all duration-200 ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white`}
                title={isRecording ? 'Stop recording' : 'Start recording'}
            >
                <FaMicrophone className="w-6 h-6" />
            </button>
            {isProcessing && <p className="mt-4 text-gray-500">{translate('voiceToVoice.processing', currentLanguage) || 'Processing...'}</p>}
            {transcript && <p className="mt-4 text-gray-500">{translate('voiceToVoice.transcript', currentLanguage) || 'Transcript'}: {transcript}</p>}
        </div>
    );
};

export default VoiceToVoiceChat;
