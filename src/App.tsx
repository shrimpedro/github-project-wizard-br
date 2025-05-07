
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Public Pages
import HomePage from './pages/HomePage';
import RentalsPage from './pages/RentalsPage';
import SalesPage from './pages/SalesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchResultsPage from './pages/SearchResultsPage';

// Admin Pages
import AdminPage from './pages/AdminPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import PropertiesPage from './pages/PropertiesPage';
import MessagesPage from './pages/MessagesPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import MetricsPage from './pages/MetricsPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/alugar" element={<RentalsPage />} />
        <Route path="/comprar" element={<SalesPage />} />
        <Route path="/imovel/:id" element={<PropertyDetailPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/busca" element={<SearchResultsPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="metrics" element={<MetricsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
};

export default App;
