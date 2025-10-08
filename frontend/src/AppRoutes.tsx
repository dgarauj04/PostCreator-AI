import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { useAuth } from './contexts/AuthContext';

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

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
