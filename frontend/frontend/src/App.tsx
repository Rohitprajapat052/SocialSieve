import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '.././pages/Login';
import Dashboard from '.././pages/Dashboard';
import VoiceAnalysisPage from './pages/VoiceAnalysis';
import TextAnalysisPage from './pages/TextAnalysis';
import History from './pages/History';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/voice" element={<VoiceAnalysisPage />} />
        <Route path="/text" element={<TextAnalysisPage />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;