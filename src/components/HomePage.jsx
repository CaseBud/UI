import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8">Welcome to Chat App</h1>
            <Link to="/chat" className="text-blue-500 hover:underline mb-4">Go to Chat</Link>
            <Link to="/voice-to-voice" className="text-blue-500 hover:underline">Go to Voice-to-Voice Chat</Link>
        </div>
    );
};

export default HomePage;
