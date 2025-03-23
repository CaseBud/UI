import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import VerifyOTP from './components/VerifyOTP';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import DocumentEditor from './components/DocumentEditor';
import DocumentList from './components/DocumentList';
import VoiceToVoiceChat from './components/VoiceToVoiceChat'; // Import the new component
import './styles/formattedText.css';
 

const App = () => {
  
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected Routes */}
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    }
                />
                
                {/* Document Editor Routes */}
                <Route
                    path="/document-editor"
                    element={
                        <ProtectedRoute>
                            <DocumentEditor />
                        </ProtectedRoute>
                    }
                />
                
                <Route
                    path="/documents"
                    element={
                        <ProtectedRoute>
                            <DocumentList />
                        </ProtectedRoute>
                    }
                />

                {/* Voice-to-Voice Chat Route */}
                <Route
                    path="/voice-to-voice"
                    element={
                        <ProtectedRoute>
                            <VoiceToVoiceChat />
                        </ProtectedRoute>
                    }
                />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
