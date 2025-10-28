import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, MapPin, Clock, Phone, Mail, Globe, Search, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService'; // To fetch center locations

// --- CONFIGURATION AND UTILS (RE-INCLUDED FOR CLARITY) ---
const bgImagePath = '/assets/blood-texture.jpg'; // Consistent background placeholder

// Helper Components
const Card = ({ children, className = '' }) => (
  <div className={`section-card ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ icon, title, description }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '1rem' }}>
    <div className="p-2 rounded-lg bg-red-50 text-red-600 mr-4 icon-container">
      {icon}
    </div>
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: 0 }}>{title}</h2>
      {description && <p style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '0.25rem' }}>{description}</p>}
    </div>
  </div>
);

// --- MAIN CENTERS COMPONENT ---
function CentersPage() {
    const { user, logout } = useAuth();
    const [centers, setCenters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch the donation centers data
    const fetchCenters = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Calls dataService.getCenters() -> Backend route: /api/donor/centers
            const data = await dataService.getCenters(); 
            // Mock data structure: [{ name: "City Hospital", address: "123 Main St", phone: "555-1234", ... }, ...]
            setCenters(data.centers || data); 
        } catch (err) {
            console.error("Failed to fetch centers:", err);
            setError(err.message || "Failed to connect to the center directory server.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCenters();
    }, [fetchCenters]);

    // Filtering centers based on search term (name or address)
    const filteredCenters = centers.filter(center => 
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Inline styles for the modern look
    const appContainerStyle = {
        backgroundImage: `url(${bgImagePath})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        padding: '2rem 1rem',
    };

    const userName = user?.name || 'User';

    return (
        <div className="app-container" style={appContainerStyle}>
            {/* CSS Styles block - Simplified for direct chat viewing */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                body, html { margin: 0; padding: 0; font-family: 'Inter', sans-serif; color: #1f2937; }
                
                .section-card {
                    background-color: rgba(255, 255, 255, 0.15); 
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
                    border-radius: 1.5rem;
                    padding: 2.5rem;
                    margin-bottom: 2rem;
                    color: #e0e0e0;
                    transition: transform 0.3s ease;
                }
                .section-card:hover { transform: translateY(-3px); }
                .icon-container svg { width: 1.5rem; height: 1.5rem; }

                .navbar {
                    background-color: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 1rem;
                    margin-bottom: 2rem;
                    padding: 1rem 0;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .navbar-content {
                    max-width: 1400px; margin: 0 auto; padding: 0 1.5rem; display: flex;
                    justify-content: space-between; align-items: center;
                }
                .navbar-logo {
                    display: flex; align-items: center; gap: 0.5rem; font-size: 1.5rem;
                    font-weight: 800; color: white;
                }
                .logout-btn {
                    background-color: #ef4444; color: white; padding: 0.5rem 1rem;
                    border-radius: 0.5rem; font-weight: 500; border: none; cursor: pointer;
                    transition: background-color 0.2s;
                }
                .logout-btn:hover { background-color: #dc2626; }
                
                .main-header {
                    max-width: 1400px; margin: 0 auto 2rem; padding: 0 1.5rem; color: white;
                }
                .main-header h1 { font-size: 2.5rem; font-weight: 800; margin: 0 0 0.5rem 0; }
                .main-header p { font-size: 1.125rem; color: #ccc; margin: 0; }

                .center-list {
                    list-style: none; padding: 0; margin: 0;
                }
                .center-item {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 1.5rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    transition: background-color 0.2s;
                }
                .center-item:hover { background-color: rgba(255, 255, 255, 0.05); border-radius: 0.5rem; }
                .center-item:last-child { border-bottom: none; }
                
                .center-info h3 { font-size: 1.25rem; font-weight: 700; margin: 0; color: white; }
                .center-info p { font-size: 0.9rem; color: #ccc; margin: 0.25rem 0 0; }

                .center-details {
                    display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem;
                    text-align: right;
                }
                .detail-line {
                    display: flex; align-items: center; justify-content: flex-end; gap: 0.3rem;
                    color: #9ca3af;
                }
                
                .search-container {
                    display: flex; align-items: center; 
                    margin-bottom: 2rem;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 0.75rem;
                    padding: 0.5rem 1rem;
                    background-color: rgba(255, 255, 255, 0.1);
                    max-width: 500px;
                }
                .search-input {
                    border: none; outline: none; background: transparent; 
                    color: white; padding: 0.5rem; width: 100%;
                }
                .search-input::placeholder { color: #9ca3af; }

            `}</style>
            
            <nav className="navbar">
                <div className="navbar-content">
                    <div className="navbar-logo">
                        <Droplet color="#ef4444" size={32} />
                        <h1 style={{ margin: 0 }}>Blood Bank</h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: 'white', marginRight: '1rem' }}>Welcome, {userName}!</span>
                        <button onClick={logout} className="logout-btn">
                            <LogOut size={16} style={{ marginRight: '0.5rem' }} />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="main-header">
                <h1>Donation Centers</h1>
                <p>Find nearby blood donation locations, hospitals, and operational hours.</p>
            </div>
            
            <Card style={{ maxWidth: '1400px', margin: '0 auto 2rem' }}>
                <SectionHeader 
                    icon={<MapPin />} 
                    title="Find a Center Near You" 
                    description="Search by city, hospital name, or address."
                />

                <div className="search-container">
                    <Search size={20} color="#9ca3af" />
                    <input
                        type="text"
                        placeholder="Search for a center (e.g., City General Hospital, Downtown)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                {error && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                        Error: {error}
                    </div>
                )}

                {isLoading ? (
                    <p style={{ textAlign: 'center', padding: '4rem 0', color: '#ccc' }}>Loading donation centers...</p>
                ) : filteredCenters.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '4rem 0', color: '#ccc' }}>No centers found matching your search term.</p>
                ) : (
                    <ul className="center-list">
                        {filteredCenters.map((center, index) => (
                            <li key={index} className="center-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Heart color="#ef4444" size={32} />
                                    <div className="center-info">
                                        <h3>{center.name}</h3>
                                        <p>{center.address}</p>
                                    </div>
                                </div>
                                <div className="center-details">
                                    <div className="detail-line">
                                        <Clock size={14} />
                                        <span>{center.hours || 'Mon-Fri: 9:00 AM - 5:00 PM'}</span>
                                    </div>
                                    <div className="detail-line">
                                        <Phone size={14} />
                                        <span>{center.phone || 'N/A'}</span>
                                    </div>
                                    <a href={`mailto:${center.email || 'info@center.com'}`} className="detail-line" style={{ color: '#ef4444' }}>
                                        <Mail size={14} />
                                        <span>Contact Center</span>
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
}

export default CentersPage;