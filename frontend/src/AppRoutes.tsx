import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { useAuth } from './contexts/AuthContext';

const AppRoutes: React.FC = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-red-light"></div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                <Route 
                    path="/login" 
                    element={!user ? <Login /> : <Navigate to="/" replace />} 
                />
                <Route 
                    path="/register" 
                    element={!user ? <Register /> : <Navigate to="/" replace />} 
                />
                <Route 
                    path="/" 
                    element={user ? <Home /> : <Navigate to="/login" replace />} 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;