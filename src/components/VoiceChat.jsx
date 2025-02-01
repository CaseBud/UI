import React, { useState, useEffect, useRef } from 'react';

const VoiceChat = ({ onVoiceInput, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const animationFrameRef = useRef();

  const startListening = () => {
    setIsListening(true);
    // Simulate volume changes for the demo
    const simulateVolume = () => {
      setVolume(Math.random());
      animationFrameRef.current = requestAnimationFrame(simulateVolume);
    };
    simulateVolume();
  };

  const stopListening = () => {
    setIsListening(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setVolume(0);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const getVoiceBars = () => {
    return Array.from({ length: 4 }, (_, i) => (
      <div
        key={i}
        className={`w-1 bg-blue-500 rounded-full transition-all duration-150 transform ${
          isListening ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          height: `${Math.max(3, (volume * 24) + (Math.random() * 12))}px`,
          marginLeft: '2px',
          animation: isListening ? 'pulse 0.5s ease-in-out infinite' : 'none',
          animationDelay: `${i * 0.1}s`
        }}
      />
    ));
  };

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      disabled={disabled}
      className={`relative group p-2 rounded-md transition-all duration-300 ${
        isListening ? 'bg-blue-500/20' : 'hover:bg-slate-700/50'
      }`}
      title={isListening ? 'Stop voice input' : 'Start voice input'}
    >
      {isListening ? (
        <div className="flex items-center space-x-0.5 px-1">
          {getVoiceBars()}
        </div>
      ) : (
        <svg
          className={`w-5 h-5 ${
            disabled ? 'text-slate-600' : 'text-slate-400 group-hover:text-white'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      )}
    </button>
  );
};

export default VoiceChat;
