import React, { useState, useEffect, useCallback } from 'react';
import { Droplet, TrendingUp, TrendingDown, Server, Map, AlertTriangle, Shield, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService'; // To fetch inventory data

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

// --- MAIN INVENTORY COMPONENT ---
function InventoryPage() {
    const { isAuthenticated, user, logout } = useAuth();
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the blood inventory data
    const fetchInventory = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Calls dataService.getInventory() -> Backend route: /api/inventory
            const data = await dataService.getInventory(); 
            // Mock data structure: [{ group: "A+", units: 150 }, ...]
            setInventory(data.inventory || data); 
        } catch (err) {
            console.error("Failed to fetch inventory:", err);
            setError(err.message || "Failed to connect to the blood inventory server.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    // Determines status and styling based on unit count
    const getStatus = (units) => {
        if (units <= 20) return { status: 'Critical', color: '#ef4444', icon: <AlertTriangle size={18} /> };
        if (units <= 50) return { status: 'Low', color: '#facc15', icon: <TrendingDown size={18} /> };
        return { status: 'Stable', color: '#10b981', icon: <TrendingUp size={18} /> };
    };

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

                .inventory-grid {
                    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
                    gap: 2rem; max-width: 1400px; margin: 0 auto;
                }

                /* Specific Inventory Item Card Style */
                .item-card {
                    display: flex; flex-direction: column; align-items: center;
                    text-align: center; padding: 1.5rem;
                    background-color: rgba(255, 255, 255, 0.1); /* Slightly darker card background */
                    border-radius: 1rem; transition: all 0.3s;
                }
                .item-card:hover { transform: scale(1.02); }

                .blood-group-label {
                    font-size: 2.5rem; font-weight: 800; margin: 0.5rem 0;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                }
                .unit-count {
                    font-size: 1.5rem; font-weight: 700; color: white; margin-top: 0.5rem;
                }
                .status-badge {
                    display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;
                    font-weight: 600; padding: 0.5rem 1rem; border-radius: 9999px;
                    margin-top: 1rem;
                }
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
                <h1>Blood Inventory</h1>
                <p>Real-time stock levels of all blood groups across the network.</p>
            </div>
            
            <Card>
                <SectionHeader 
                    icon={<Server />} 
                    title="Current Stock Overview" 
                    description="Units are measured in the standard 'unit' volume."
                />

                {error && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                        <AlertTriangle size={20} style={{ marginRight: '0.5rem' }} />
                        Error: {error}
                    </div>
                )}

                {isLoading ? (
                    <p style={{ textAlign: 'center', padding: '4rem 0', color: '#ccc' }}>Loading inventory data...</p>
                ) : (
                    <div className="inventory-grid">
                        {inventory.map((item, index) => {
                            const statusInfo = getStatus(item.units);
                            const unitsText = item.units > 0 ? `${item.units} Units` : '0 Units';

                            return (
                                <div key={index} className="item-card" style={{ 
                                    border: `2px solid ${statusInfo.color}`,
                                    boxShadow: `0 0 15px ${statusInfo.color}40`,
                                }}>
                                    <Droplet color={statusInfo.color} size={36} />
                                    <div className="blood-group-label">{item.group}</div>
                                    <p className="unit-count">{unitsText}</p>
                                    <div className="status-badge" style={{ 
                                        backgroundColor: `${statusInfo.color}20`, 
                                        color: statusInfo.color,
                                        borderColor: `${statusInfo.color}80`
                                    }}>
                                        {statusInfo.icon}
                                        <span>{statusInfo.status}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
            
            <Card style={{ marginTop: '2rem' }}>
                <SectionHeader 
                    icon={<Heart />} 
                    title="Need Urgent Blood?" 
                    description="If your required blood group is Critical, please contact us immediately."
                />
                <div style={{ display: 'flex', justifyContent: 'space-around', gap: '2rem' }}>
                    <div style={{ textAlign: 'center', flexGrow: 1 }}>
                        <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Emergency Contact</p>
                        <p style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700 }}>+91 99887 76655</p>
                    </div>
                    <div style={{ textAlign: 'center', flexGrow: 1 }}>
                        <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Email Support</p>
                        <p style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700 }}>support@bloodbank.org</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default InventoryPage;