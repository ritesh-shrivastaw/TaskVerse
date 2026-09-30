import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotesPage } from './pages/NotesPage';
import { PrivacyPage } from './pages/PrivacyPage';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NotesPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </BrowserRouter>
  );
};
