import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(
    <React.StrictMode>
        <AuthProvider>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </AuthProvider>
    </React.StrictMode>
);
