import React from 'react';

const TypingAnimation = () => {
    const texts = ["Thinking", "Processing", "Gathering data", "Generating responses", "Comparing responses", "Finalizing"];
    const [currentText, setCurrentText] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentText((prev) => (prev + 1) % texts.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center space-y-2">
            <div className="text-slate-400">{texts[currentText]}</div>
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            </div>
        </div>
    );
};

export default TypingAnimation;
