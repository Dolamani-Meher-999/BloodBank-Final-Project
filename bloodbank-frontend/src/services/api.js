import axios from 'axios';
import { authService } from './authService';

// Define the base URL for your Express backend API
// Base URL for the backend API
const API_BASE_URL = 'http://localhost:5004/api/v1'; // Updated to use port 5004

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the JWT token to every outgoing request
API.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      // Set the Authorization header with the Bearer token
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally (e.g., token expiration)
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error response suggests an expired or invalid token (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request. Token might be expired or missing. Logging out user.');
      authService.logout();
    }
    // IMPORTANT: If the error is 400 or 500, we still throw it so the frontend can display the message.
    return Promise.reject(error);
  }
);

export default API;