import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, Mail, Lock } from 'lucide-react';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      navigate('/dashboard'); // Redirect on success
    } catch (err) {
      console.error('Login error:', err);
      // Display error message from the service layer
      setError(err.message || 'Login failed. Check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f9fafb',
      padding: '2rem'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '1rem', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Droplet size={40} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937' }}>Welcome Back</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Sign in to access your blood bank dashboard.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ 
              backgroundColor: '#fee2e2', 
              color: '#991b1b', 
              padding: '0.75rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {/* Email Field */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.5rem 0.75rem' }}>
              <Mail size={18} color="#9ca3af" style={{ marginRight: '0.5rem' }} />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                style={{ width: '100%', border: 'none', outline: 'none', padding: 0 }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.5rem 0.75rem' }}>
              <Lock size={18} color="#9ca3af" style={{ marginRight: '0.5rem' }} />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                style={{ width: '100%', border: 'none', outline: 'none', padding: 0 }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{ 
              width: '100%', 
              backgroundColor: '#ef4444', 
              color: 'white', 
              fontWeight: 600, 
              padding: '0.75rem', 
              borderRadius: '0.5rem', 
              border: 'none', 
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Signing In...' : 'Log In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 600 }}>
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;