import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { authService } from '../services/authService'; // <-- FIX: Changed to named import

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Custom Hook to use the Context easily
export const useAuth = () => {
    return useContext(AuthContext);
};

// 3. Context Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to check and load user from token on app mount
    useEffect(() => {
        const loadUser = async () => {
            // FIX: Use authService.getToken() instead of hardcoded localStorage key 
            const token = authService.getToken(); 
            
            if (token) {
                try {
                    // Validate token and fetch user data from the backend
                    const profile = await authService.getProfile();
                    setUser(profile);
                    setIsAuthenticated(true);
                } catch (err) {
                    // Token invalid or expired, clear storage
                    console.error('Token validation failed:', err);
                    authService.logout();
                    setUser(null);
                    setIsAuthenticated(false);
                    setError('Session expired. Please log in again.');
                }
            }
            setIsLoading(false);
        };

        loadUser();
    }, []);

    // --- Auth Actions ---

    const login = async (credentials) => {
        setIsLoading(true);
        setError(null);
        try {
            // FIX: authService.login returns { user, token }
            const { user: userData, token } = await authService.login(credentials); 
            
            // Set token in storage and user state
            authService.setToken(token);
            setUser(userData);
            setIsAuthenticated(true);
            setIsLoading(false);
            return userData;
        } catch (err) {
            setIsLoading(false);
            setError(err.message || 'Login failed. Check your credentials.');
            throw err; // Re-throw the error for component handling
        }
    };

    const register = async (userData) => {
        setIsLoading(true);
        setError(null);
        try {
            // FIX: Register should return { user, token } to immediately log user in
            const { user: newUser, token } = await authService.register(userData);
            
            // Log user in immediately after successful registration
            authService.setToken(token);
            setUser(newUser);
            setIsAuthenticated(true);
            
            setIsLoading(false);
            return newUser;
        } catch (err) {
            setIsLoading(false);
            setError(err.message || 'Registration failed.');
            throw err;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
    };

    // Memoize the value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        register,
        setError, // Allows components to clear or set the global error state
    }), [user, isAuthenticated, isLoading, error]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};