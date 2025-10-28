import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplet, User, Mail, Lock, Phone } from 'lucide-react';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    bloodGroup: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
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

    // Minor fix to ensure bloodGroup is not an empty string if nothing is selected
    if (!formData.bloodGroup) {
        setError("Please select your blood group.");
        setIsLoading(false);
        return;
    }

    try {
      // The register function now handles immediate login upon success
      await register(formData); 
      navigate('/dashboard'); // Redirect on success
    } catch (err) {
      // Error message is caught from AuthContext, which gets it from authService
      console.error('Registration error:', err);
      // Display the user-friendly message returned by the service, or a default.
      setError(err.message || 'Registration failed due to server communication error.');
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
        maxWidth: '450px', 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '1rem', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Droplet size={40} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937' }}>Create Your Account</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Join the community and save lives.</p>
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

          {/* Name Field */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.5rem 0.75rem' }}>
              <User size={18} color="#9ca3af" style={{ marginRight: '0.5rem' }} />
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Alex Johnson"
                style={{ width: '100%', border: 'none', outline: 'none', padding: 0 }}
              />
            </div>
          </div>

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
                placeholder="alex.j@example.com"
                style={{ width: '100%', border: 'none', outline: 'none', padding: 0 }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1rem' }}>
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

          {/* Phone Field */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Phone Number</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.5rem 0.75rem' }}>
              <Phone size={18} color="#9ca3af" style={{ marginRight: '0.5rem' }} />
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="9871234560"
                style={{ width: '100%', border: 'none', outline: 'none', padding: 0 }}
              />
            </div>
          </div>

          {/* Blood Group Field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="bloodGroup" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}>Blood Group</label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              required
              value={formData.bloodGroup}
              onChange={handleInputChange}
              style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.75rem 1rem', outline: 'none' }}
            >
              <option value="">Select your blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
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
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 600 }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;