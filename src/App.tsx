import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/login';
import ClientsPage from './components/clients/index'; // Assuming this is the main page with sidebar
import AddClient from './components/clients/AddClient';
import ClientDetailPage from './components/clients/ClientDetail';
import SettingsPage from './components/settings/SettingsPage';
import Home from './components/home/HomePage'; // Changed import name back to Home
// import { Spin } from 'antd'; // Removed unused import
import './App.scss';
 // Assuming you have a main App CSS/SCSS file

// Basic Protected Route Component
const ProtectedRoute: React.FC = () => {
    const { token } = useAuth();

    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

             
                <Route element={<ProtectedRoute />}>
               
                    <Route path="/" element={<Navigate to="/home" replace />} /> 
                    <Route path="/home" element={<Home />} /> 
                    <Route path="/clients" element={<ClientsPage />} />
                    <Route path="/clients/add" element={<AddClient />} />
                    <Route path="/clients/:id" element={<ClientDetailPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>

        
            </Routes>
        </Router>
    );
}

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
