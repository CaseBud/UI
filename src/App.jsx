import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResetPassword from './components/ResetPassword';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import VerifyOTP from './components/VerifyOTP';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './components/Landing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/chat" element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;