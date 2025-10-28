import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Lazy load the pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const RequestsPage = lazy(() => import('./pages/RequestsPage'));
// You will add more pages here (Inventory, Centers, etc.)

// Component for handling private routes
const PrivateRoute = ({ element }) => {
  const { isAuthenticated, isAuthLoading } = useAuth();
  
  if (isAuthLoading) {
    // Basic loading indicator while checking authentication status
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '1.2rem', color: '#ef4444' }}>
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  return isAuthenticated ? element : <Navigate to="/login" replace />;
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
          
          {/* Default Redirect: Send unauthenticated users to login, authenticated users to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
          <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
          <Route path="/requests" element={<PrivateRoute element={<RequestsPage />} />} />
          
          {/* Add more protected routes here */}
          {/* <Route path="/inventory" element={<PrivateRoute element={<InventoryPage />} />} /> */}
          {/* <Route path="/centers" element={<PrivateRoute element={<CentersPage />} />} /> */}

          {/* Fallback 404 page (optional) */}
          <Route path="*" element={
            <div style={{ padding: '50px', textAlign: 'center' }}>
              <h1>404 Not Found</h1>
              <p>The page you requested does not exist.</p>
              <a href="/dashboard" style={{ color: '#ef4444' }}>Go to Dashboard</a>
            </div>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;