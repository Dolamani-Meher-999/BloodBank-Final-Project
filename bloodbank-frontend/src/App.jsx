import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Lazy load the pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage')); // <-- SYNTAX FIXED HERE
const DashboardPage = lazy(() => import('./pages/DashboardPage')); // UNIFIED DASHBOARD
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const RequestsPage = lazy(() => import('./pages/RequestsPage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage')); 
const CentersPage = lazy(() => import('./pages/CentersPage'));     

// Component for handling private routes (Simplified for single dashboard)
const PrivateRoute = ({ element }) => {
    const { isAuthenticated, isAuthLoading } = useAuth();
    
    if (isAuthLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '1.2rem', color: '#ef4444' }}>
                Loading...
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // No role check needed here, as all authenticated users access these routes
    return element;
};

// Component that safely redirects to the unified Dashboard
const RoleRedirect = () => {
    const { isAuthenticated, isAuthLoading } = useAuth();
    
    if (isAuthLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '1.2rem', color: '#ef4444' }}>
                Authenticating...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Simply redirect authenticated users to the main dashboard
    return <Navigate to="/dashboard" replace />;
};

function App() {
    return (
        <Router>
            <Suspense fallback={
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '1.2rem', color: '#ef4444' }}>
                    Loading Page...
                </div>
            }>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Default Redirect: This is the first route checked after auth is ready */}
                    <Route path="/" element={<RoleRedirect />} />

                    {/* --- PROTECTED ROUTES --- */}
                    
                    {/* All Core Pages */}
                    <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
                    <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
                    <Route path="/requests" element={<PrivateRoute element={<RequestsPage />} />} />
                    
                    {/* Pages that were throwing 404s, now correctly mapped */}
                    <Route path="/inventory" element={<PrivateRoute element={<InventoryPage />} />} />
                    <Route path="/centers" element={<PrivateRoute element={<CentersPage />} />} />


                    {/* Fallback 404 page (optional) */}
                    <Route path="*" element={
                        <div style={{ padding: '50px', textAlign: 'center' }}>
                            <h1>404 Not Found</h1>
                            <p>The page you requested does not exist.</p>
                            <a href="/" style={{ color: '#ef4444' }}>Go Home</a>
                        </div>
                    } />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;