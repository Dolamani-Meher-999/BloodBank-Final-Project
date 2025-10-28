import API from './api';

// Key used to store the token in the browser's local storage
const TOKEN_KEY = 'jwtToken';

/**
 * Handles communication with the backend for authentication.
 */

// --- Login Function ---
const login = async (credentials) => {
    try {
        // Calls the backend route: /api/auth/login
        const response = await API.post('/auth/login', credentials);
        
        // Assuming backend returns { user: {...}, token: '...' }
        const { user, token } = response.data;
        
        // Note: The AuthContext will call setToken and set global state
        return { user, token };
    } catch (error) {
        // Axios wraps the actual error in the .response property
        const message = error.response?.data?.message || 'Login failed due to network error.';
        throw new Error(message);
    }
};

// --- Register Function ---
const register = async (userData) => {
    try {
        // Calls the backend route: /api/auth/register
        const response = await API.post('/auth/register', userData);
        
        // Assuming backend returns { user: {...}, token: '...' }
        const { user, token } = response.data;
        
        // Note: The AuthContext will call setToken and set global state
        return { user, token };
    } catch (error) {
        const message = error.response?.data?.message || 'Registration failed due to server error.';
        throw new Error(message);
    }
};

// --- Token Management Functions ---
const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    // You might also want to clear Axios headers if necessary, 
    // but the interceptor handles token absence automatically.
};

const getProfile = async () => {
    // This is used by AuthContext to validate the token on app load
    // Calls the backend route: /api/auth/profile or /api/donor/profile
    // We assume the token is automatically included by the API interceptor
    try {
        const response = await API.get('/donor/profile');
        return response.data; 
    } catch (error) {
        // If profile fetch fails (e.g., 401), we treat it as an expired token
        logout();
        throw error;
    }
};

// --- CORRECT EXPORT: Export all functions wrapped in a single object ---
export const authService = {
    login,
    register,
    setToken,
    getToken,
    logout,
    getProfile
};