import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, User, Mail, Phone, Home, Droplet, Clock, Shield, CheckCircle, Edit, Save, X, Activity, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService'; 

// --- CONFIGURATION AND UTILS (MANDATORY FOR SINGLE FILE) ---
const bgImagePath = '/assets/blood-texture.jpg'; 

// Helper Components
const Card = ({ children, className = '' }) => (
    <div className={`card ${className}`}>
        {children}
    </div>
);

const SectionHeader = ({ icon, title, actionButton }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="p-2 rounded-lg bg-red-50 text-red-600 mr-4 icon-container" style={{backgroundColor: '#fee2e2', borderRadius: '0.75rem', padding: '0.75rem'}}>
                {icon}
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>{title}</h2>
        </div>
        {actionButton}
    </div>
);

const DetailRow = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ color: '#e30000', width: '2rem', display: 'flex', alignItems: 'center' }}>{icon}</div>
        <div style={{ flexGrow: 1 }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{label}</p>
            <p style={{ fontSize: '1rem', fontWeight: 500, color: '#1f2937', margin: 0 }}>{value || 'N/A'}</p>
        </div>
    </div>
);

const EditableField = ({ label, icon, value, name, onChange, isEditing, type = 'text' }) => (
    <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>{label}</label>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: isEditing ? '#fff' : '#f9fafb' }}>
            <div style={{ color: '#e30000', marginRight: '0.5rem' }}>{icon}</div>
            {isEditing ? (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: '#1f2937', padding: 0 }}
                />
            ) : (
                <p style={{ margin: 0, color: '#1f2937' }}>{value || 'N/A'}</p>
            )}
        </div>
    </div>
);

function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    // Fetch user data from backend
    const fetchUserData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch profile data
            const profileResponse = await dataService.getProfile(); 
            const historyResponse = await dataService.getDonationHistory();

            const profileDetails = {
                name: profileResponse.name || profileResponse.firstName || user?.name || 'User Name Not Set',
                email: profileResponse.email || user?.email || 'N/A',
                phone: profileResponse.phone || profileResponse.contactNumber || 'No phone added',
                address: profileResponse.address?.street || profileResponse.address || 'No address added',
                bloodGroup: profileResponse.bloodGroup || 'Not specified',
                lastDonationDate: profileResponse.lastDonationDate ? new Date(profileResponse.lastDonationDate).toLocaleDateString() : 'Never donated',
                donationHistory: historyResponse || [],
            };
            
            setProfileData(profileDetails);
            setEditFormData(profileDetails);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            // Fallback to basic data from auth context to prevent crash
            setProfileData({
                name: user?.name || 'Guest User',
                email: user?.email || 'N/A',
                phone: 'N/A', address: 'N/A', bloodGroup: '?', lastDonationDate: 'Never donated', donationHistory: []
            });
            setEditFormData({ name: user?.name || '', email: user?.email || '' });

        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user, fetchUserData]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await dataService.updateProfile(editFormData);
            setProfileData(editFormData);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert(`Failed to save changes: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    // UI Loading State (CRITICAL FIX)
    if (isLoading) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a1a', color: '#fff' }}>
            <div className="spinner" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(255, 255, 255, 0.3)', borderTopColor: '#e30000', animation: 'spin 1s ease-in-out infinite', marginBottom: '15px' }}></div>
            <p style={{ color: '#ccc', marginLeft: '1rem' }}>Loading profile data...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      );
    }

    const userRole = user?.role || 'Donor';
    const hasHistory = profileData.donationHistory?.length > 0;

    return (
        <div className="app-container" style={{ 
            backgroundImage: `url(${bgImagePath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            padding: '2rem 1rem',
        }}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body, html { margin: 0; padding: 0; font-family: 'Inter', sans-serif; color: #1f2937; }

            /* --- FINAL STYLING: Solid White Cards --- */
            .card {
              background-color: #FFFFFF; /* OPAQUE WHITE */
              border-radius: 1.25rem;
              padding: 1.5rem;
              border: 1px solid #e5e7eb;
              box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15); 
              transition: transform 0.3s ease;
            }
            .card:hover { transform: translateY(-3px); }
            
            .app-container { position: relative; z-index: 10; padding: 2rem 1rem; }
            .content-wrapper { max-width: 1400px; margin: 0 auto; }


            .navbar {
              background-color: #FFFFFF; 
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              padding: 1rem 1.5rem;
              border-radius: 0.75rem;
              margin: 1.5rem auto;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border: 1px solid #e5e7eb;
            }
            .navbar-logo { display: flex; align-items: center; gap: 0.5rem; font-size: 1.5rem; font-weight: 700; color: #1f2937; }
            .logout-btn { background-color: #e30000; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500; border: none; cursor: pointer; transition: background-color 0.2s; }
            .logout-btn:hover { background-color: #b00000; }
            
            /* Buttons for Edit/Save/Cancel */
            .edit-btn { background: none; color: #4b5563; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #d1d5db; font-weight: 500; cursor: pointer; transition: background-color 0.2s; }
            .edit-btn:hover { background-color: #f3f4f6; }
            .save-btn { background-color: #10b981; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; font-weight: 500; cursor: pointer; transition: background-color 0.2s; margin-left: 0.5rem; }
            .save-btn:hover { background-color: #059669; }
            .cancel-btn { background: none; color: #e30000; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #e30000; font-weight: 500; cursor: pointer; transition: background-color 0.2s; margin-right: 0.5rem; }
            .cancel-btn:hover { background-color: #fee2e2; }

            .profile-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; max-width: 1400px; margin: 0 auto; }
            @media (min-width: 1024px) { .profile-grid { grid-template-columns: 2fr 3fr; } }
            .donation-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px dotted #f3f4f6; }
            .donation-item:last-child { border-bottom: none; }
          `}</style>

          <nav className="navbar">
            <div className="content-wrapper">
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                <Droplet color="#e30000" size={32} />
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginLeft: '10px' }}>Blood Bank Profile</h1>
              </div>
              <button onClick={logout} className="logout-btn">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </nav>
          
          <div className="content-wrapper" style={{ marginTop: '2rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>My Profile</h1>
            <p style={{ fontSize: '1.125rem', color: '#ccc', marginBottom: '2rem' }}>Manage your personal details and view donation records.</p>
                        icon={<Droplet />} 
                        title="Blood Information"
                    />
                    <DetailRow 
                        icon={<Droplet size={18} />} 
                        label="Blood Group" 
                        value={profileData.bloodGroup} 
                    />
                    <DetailRow 
                        icon={<Clock size={18} />} 
                        label="Last Donation" 
                        value={profileData.lastDonationDate} 
                    />
                    <DetailRow 
                        icon={<Shield size={18} />} 
                        label="Account Status" 
                        value={
                            <span style={{ color: '#10b981', fontWeight: 600 }}>
                                Active
                            </span>
                        } 
                    />
                </Card>

                {/* Donation History Card */}
                <Card>
                    <SectionHeader 
                        icon={<Activity />} 
                        title="Donation History"
                    />
                    {hasHistory ? (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {profileData.donationHistory.map((donation, index) => (
                                <li key={index} className="donation-item">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <CheckCircle size={20} color="#10b981" />
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 600 }}>
                                                {donation.amount || '1'} units ({donation.bloodGroup || 'O+'})
                                            </p>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
                                                {donation.date ? new Date(donation.date).toLocaleDateString() : 'N/A'} at {donation.center || 'Local Donation Center'}
                                            </p>
                                        </div>
                                    </div>
                                    <span style={{ color: '#10b981', fontWeight: 500 }}>Completed</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem 0' }}>
                            <p>No donation history found.</p>
                            <button 
                                onClick={() => navigate('/requests')} 
                                className="save-btn" 
                                style={{ marginTop: '15px' }}
                            >
                                Request Blood
                            </button>
                        </div>
                    )}
                </Card>
            </div>
          </div>
        </div>
    );
}   

export default ProfilePage;