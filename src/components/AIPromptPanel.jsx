import React, { useState } from 'react';

const AIPromptPanel = ({ onSubmitPrompt, aiSuggestion, onApplySuggestion, isProcessing, selectedText }) => {
    const [prompt, setPrompt] = useState('');
    const [promptHistory, setPromptHistory] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!prompt.trim() || isProcessing) return;
        
        onSubmitPrompt(prompt);
        
        // Add to history
        setPromptHistory(prev => [
            { id: Date.now(), text: prompt, timestamp: new Date() },
            ...prev.slice(0, 9) // Keep only the 10 most recent prompts
        ]);
        
        setPrompt('');
    };

    const handlePromptClick = (promptText) => {
        setPrompt(promptText);
    };

    // Predefined prompt suggestions
    const promptSuggestions = [
        { id: 'improve', text: 'Improve this section' },
        { id: 'summarize', text: 'Summarize this content' },
        { id: 'expand', text: 'Expand on this topic' },
        { id: 'simplify', text: 'Make this easier to understand' },
        { id: 'professional', text: 'Make this more professional' },
        { id: 'concise', text: 'Make this more concise' },
        { id: 'legal', text: 'Add legal terminology' },
        { id: 'citations', text: 'Add citations' }
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-semibold text-white mb-2">AI Assistant</h2>
                <p className="text-sm text-slate-400">
                    {selectedText 
                        ? 'Ask the AI to help with your selected text.'
                        : 'Ask the AI to help with your document.'}
                </p>
            </div>
            
            {/* Prompt Input */}
            <div className="p-4 border-b border-slate-700/50">
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your instructions for the AI..."
                        className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                        rows="4"
                        disabled={isProcessing}
                    />
                    <button
                        type="submit"
                        disabled={!prompt.trim() || isProcessing}
                        className="mt-2 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            'Generate'
                        )}
                    </button>
                </form>
            </div>
            
            {/* Prompt Suggestions */}
            <div className="p-4 border-b border-slate-700/50">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Suggestions</h3>
                <div className="flex flex-wrap gap-2">
                    {promptSuggestions.map(suggestion => (
                        <button
                            key={suggestion.id}
                            onClick={() => handlePromptClick(suggestion.text)}
                            className="px-2 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs rounded-md transition-colors"
                            disabled={isProcessing}
                        >
                            {suggestion.text}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* AI Response */}
            {aiSuggestion && (
                <div className="flex-1 p-4 overflow-auto">
                    <h3 className="text-sm font-medium text-slate-300 mb-2">AI Suggestion</h3>
                    <div className="p-3 bg-slate-700/30 border border-slate-600/50 rounded-lg text-slate-200 text-sm mb-3 max-h-60 overflow-auto">
                        <div dangerouslySetInnerHTML={{ __html: aiSuggestion }} />
                    </div>
                    <button
                        onClick={onApplySuggestion}
                        className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        Apply Changes
                    </button>
                </div>
            )}
            
            {/* Prompt History */}
            {promptHistory.length > 0 && !aiSuggestion && (
                <div className="flex-1 p-4 overflow-auto">
                    <h3 className="text-sm font-medium text-slate-300 mb-2">Recent Prompts</h3>
                    <div className="space-y-2">
                        {promptHistory.map(item => (
                            <div
                                key={item.id}
                                onClick={() => handlePromptClick(item.text)}
                                className="p-2 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 text-xs cursor-pointer"
                            >
                                <p>{item.text}</p>
                                <p className="text-slate-400 text-[10px] mt-1">
                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Empty State */}
            {!aiSuggestion && promptHistory.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 mb-4 text-slate-600">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M9.5 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-14a2 2 0 00-2-2h-4.5" />
                            <path d="M9.5 3V1h5v2" />
                            <path d="M9.5 12h5" />
                            <path d="M9.5 16h5" />
                            <path d="M9.5 8h5" />
                        </svg>
                    </div>
                    <h3 className="text-slate-400 text-sm font-medium mb-1">No AI suggestions yet</h3>
                    <p className="text-slate-500 text-xs">
                        Enter a prompt above to get AI assistance with your document.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AIPromptPanel; 