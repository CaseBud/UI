import React, { useState, useEffect } from 'react';

const TextToSpeech = ({ text, language = 'en-US' }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [utterance, setUtterance] = useState(null);

    useEffect(() => {
        // Initialize speech synthesis
        const synth = window.speechSynthesis;
        const newUtterance = new SpeechSynthesisUtterance(text);
        newUtterance.lang = language;
        
        // Set event handlers
        newUtterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };
        
        newUtterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setIsSpeaking(false);
            setIsPaused(false);
        };
        
        setUtterance(newUtterance);
        
        // Clean up
        return () => {
            synth.cancel();
        };
    }, [text, language]);

    const handleSpeak = () => {
        const synth = window.speechSynthesis;
        
        if (isSpeaking && !isPaused) {
            // Pause speech
            synth.pause();
            setIsPaused(true);
        } else if (isSpeaking && isPaused) {
            // Resume speech
            synth.resume();
            setIsPaused(false);
        } else {
            // Start speech
            if (utterance) {
                synth.speak(utterance);
                setIsSpeaking(true);
                setIsPaused(false);
            }
        }
    };

    const handleStop = () => {
        const synth = window.speechSynthesis;
        synth.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    };

    return (
        <button
            onClick={handleSpeak}
            className={`p-1.5 md:p-2 rounded-lg transition-all duration-200 ${
                isSpeaking
                    ? 'text-blue-400 bg-blue-500/20 ring-1 ring-blue-500/50'
                    : 'text-slate-400 hover:text-white'
            }`}
            title={isSpeaking ? (isPaused ? 'Resume speech' : 'Pause speech') : 'Speak text'}
        >
            <svg
                className="w-4 h-4 md:w-5 md:h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                {isSpeaking && !isPaused ? (
                    <>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </>
                ) : (
                    <>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" strokeDasharray="1 2" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" strokeDasharray="1 2" />
                    </>
                )}
            </svg>
        </button>
    );
};

export default TextToSpeech; 