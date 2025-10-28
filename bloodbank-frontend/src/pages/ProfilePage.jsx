import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, User, Mail, Phone, Home, Droplet, Clock, Shield, CheckCircle, Edit, Save, X, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService'; // To fetch profile and donation history

// --- CONFIGURATION AND UTILS (MANDATORY FOR SINGLE FILE) ---
const bgImagePath = '/assets/blood-texture.jpg'; 

// Helper Components
const Card = ({ children, className = '' }) => (
  <div className={`section-card ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ icon, title, actionButton }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div className="p-2 rounded-lg bg-red-50 text-red-600 mr-3 icon-container">
        {icon}
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{title}</h2>
    </div>
    {actionButton}
  </div>
);

const DetailRow = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ color: '#ef4444', width: '2rem', display: 'flex', alignItems: 'center' }}>{icon}</div>
        <div style={{ flexGrow: 1 }}>
            <p style={{ fontSize: '0.875rem', color: '#ccc', margin: 0 }}>{label}</p>
            <p style={{ fontSize: '1rem', fontWeight: 500, color: 'white', margin: 0 }}>{value}</p>
        </div>
    </div>
);

const EditableField = ({ label, icon, value, name, onChange, isEditing, type = 'text' }) => (
    <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#ccc', fontWeight: 500 }}>{label}</label>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div style={{ color: '#ef4444', marginRight: '0.5rem' }}>{icon}</div>
            {isEditing ? (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', color: 'white', padding: 0 }}
                />
            ) : (
                <p style={{ margin: 0, color: 'white' }}>{value}</p>
            )}
        </div>
    </div>
);

function ProfilePage() {
    const { user, logout } = useAuth();
    const [profileData, setProfileData] = useState({
        name: 'Loading...',
        email: user?.email || '',
        phone: 'N/A',
        address: 'N/A',
        bloodGroup: '?',
        lastDonationDate: 'Never donated',
        donationHistory: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    // Fetch user data from backend
    const fetchUserData = useCallback(async () => {
        setIsLoading(true);
        try {
            const profile = await dataService.getProfile();
            const history = await dataService.getDonationHistory();

            const profileDetails = {
                name: profile.name || 'User Name Not Set',
                email: profile.email || user?.email,
                phone: profile.phone || 'No phone added',
                address: profile.address || 'No address added',
                bloodGroup: profile.bloodGroup || 'Not specified',
                lastDonationDate: profile.lastDonationDate ? new Date(profile.lastDonationDate).toLocaleDateString() : 'Never donated',
                donationHistory: history || [],
            };
            
            setProfileData(profileDetails);
            setEditFormData(profileDetails);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            // Fallback for essential data
            setProfileData(prev => ({ ...prev, email: user?.email || 'Error loading email' }));
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
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to save changes.");
        } finally {
            setIsLoading(false);
        }
    };
    
    // Custom inline styles for the modern look
    const appContainerStyle = {
      backgroundImage: `url(${bgImagePath})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      padding: '2rem 1rem',
    };

    if (isLoading) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1f2937' }}>
            <div className="spinner"></div>
            <p style={{ color: 'white', marginLeft: '1rem' }}>Loading profile data...</p>
        </div>
      );
    }

    return (
        <div className="app-container" style={appContainerStyle}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body, html { margin: 0; padding: 0; font-family: 'Inter', sans-serif; color: #1f2937; }

            .section-card {
              background-color: rgba(255, 255, 255, 0.15); /* Translucent background */
              backdrop-filter: blur(15px);
              border: 1px solid rgba(255, 255, 255, 0.2);
              box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
              border-radius: 1.5rem;
              padding: 2.5rem;
              margin-bottom: 2rem;
              color: #e0e0e0;
              transition: transform 0.3s ease;
            }
            .section-card:hover {
                transform: translateY(-5px);
            }
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
              max-width: 1400px;
              margin: 0 auto;
              padding: 0 1.5rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .navbar-logo {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              font-size: 1.5rem;
              font-weight: 800;
              color: white;
            }
            .logout-btn {
              background-color: #ef4444;
              color: white;
              padding: 0.5rem 1rem;
              border-radius: 0.5rem;
              font-weight: 500;
              border: none;
              cursor: pointer;
              transition: background-color 0.2s;
            }
            .logout-btn:hover {
              background-color: #dc2626;
            }
            .edit-btn {
                background: none;
                border: 1px solid white;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .edit-btn:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
            .save-btn {
                background-color: #10b981;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                border: none;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            .save-btn:hover {
                background-color: #059669;
            }
            .cancel-btn {
                background: none;
                color: #f87171;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                border: 1px solid #f87171;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
                margin-right: 0.5rem;
            }
            .cancel-btn:hover {
                background-color: rgba(239, 68, 68, 0.1);
            }
            .profile-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 2rem;
                max-width: 1400px;
                margin: 0 auto;
            }
            @media (min-width: 1024px) {
                .profile-grid {
                    grid-template-columns: 2fr 3fr;
                }
            }
            .donation-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .donation-item:last-child {
                border-bottom: none;
            }
          `}</style>

          <nav className="navbar">
            <div className="navbar-content">
              <div className="navbar-logo">
                <Droplet color="#ef4444" size={32} />
                <h1 style={{ margin: 0 }}>Blood Bank</h1>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'white', marginRight: '1rem' }}>Welcome, {profileData.name.split(' ')[0]}!</span>
                <button onClick={logout} className="logout-btn">
                    <LogOut size={16} style={{ marginRight: '0.5rem' }} />
                    Logout
                </button>
              </div>
            </div>
          </nav>
          
          <div style={{ maxWidth: '1400px', margin: '0 auto 2rem', padding: '0 1rem', color: 'white' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>My Profile</h1>
            <p style={{ fontSize: '1.125rem', color: '#ccc', marginTop: '0.5rem' }}>Manage your personal details and view donation records.</p>
          </div>

          <div className="profile-grid">
            
            {/* --- LEFT COLUMN: PERSONAL DETAILS --- */}
            <Card>
                <SectionHeader 
                    icon={<User />} 
                    title="Personal Details"
                    actionButton={
                        isEditing ? (
                            <div style={{ display: 'flex' }}>
                                <button onClick={() => { setIsEditing(false); setEditFormData(profileData); }} className="cancel-btn">
                                    <X size={16} style={{ marginRight: '0.5rem' }} /> Cancel
                                </button>
                                <button onClick={handleSave} className="save-btn">
                                    {isLoading ? 'Saving...' : <><Save size={16} style={{ marginRight: '0.5rem' }} /> Save</>}
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="edit-btn">
                                <Edit size={16} style={{ marginRight: '0.5rem' }} /> Edit Profile
                            </button>
                        )
                    }
                />
                
                {isEditing ? (
                    <div style={{ marginTop: '1rem' }}>
                        <EditableField label="Full Name" icon={<User size={18} />} value={editFormData.name} name="name" onChange={handleEditChange} isEditing={true} />
                        <EditableField label="Email Address" icon={<Mail size={18} />} value={editFormData.email} name="email" onChange={handleEditChange} isEditing={true} type="email" />
                        <EditableField label="Phone" icon={<Phone size={18} />} value={editFormData.phone} name="phone" onChange={handleEditChange} isEditing={true} type="tel" />
                        <EditableField label="Address" icon={<Home size={18} />} value={editFormData.address} name="address" onChange={handleEditChange} isEditing={true} />
                    </div>
                ) : (
                    <div style={{ marginTop: '1rem' }}>
                        <DetailRow icon={<Mail size={18} />} label="Email" value={profileData.email} />
                        <DetailRow icon={<Phone size={18} />} label="Phone" value={profileData.phone} />
                        <DetailRow icon={<Home size={18} />} label="Address" value={profileData.address} />
                    </div>
                )}
            </Card>

            {/* --- RIGHT COLUMN: BLOOD AND HISTORY --- */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                
                {/* Blood Information Card */}
                <Card>
                    <SectionHeader icon={<Droplet />} title="Blood Information" />
                    <DetailRow icon={<Droplet size={18} />} label="Blood Group" value={profileData.bloodGroup} />
                    <DetailRow icon={<Clock size={18} />} label="Last Donation" value={profileData.lastDonationDate} />
                    <DetailRow icon={<Shield size={18} />} label="Security Status" value={<span style={{ color: '#10b981', fontWeight: 600 }}>Verified</span>} />
                </Card>

                {/* Donation History Card */}
                <Card>
                    <SectionHeader icon={<Activity />} title="Donation History" />
                    {profileData.donationHistory.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {profileData.donationHistory.map((donation, index) => (
                                <li key={index} className="donation-item">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <CheckCircle size={20} color="#10b981" />
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 600 }}>{donation.amount} units ({donation.bloodGroup})</p>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#ccc' }}>{new Date(donation.date).toLocaleDateString()} at {donation.center}</p>
                                        </div>
                                    </div>
                                    <span style={{ color: '#10b981', fontWeight: 500 }}>Completed</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#9ca3af', padding: '1rem 0' }}>No donation history found.</p>
                    )}
                </Card>
            </div>
          </div>
        </div>
    );
}

export default ProfilePage;