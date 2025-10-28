import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, Droplet, User, Hospital, AlertCircle, CheckCircle, ChevronRight, Send, Heart, MapPin, X, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService'; // USED FOR createRequest

// --- CONFIGURATION AND UTILS (MANDATORY FOR SINGLE FILE) ---
const bgImagePath = '/assets/blood-texture.jpg'; // Consistent background placeholder

// Helper Components
const Card = ({ children, className = '' }) => (
    <div className={`card ${className}`}>
        {children}
    </div>
);

const SectionHeader = ({ icon, title, description }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
        <div className="p-2 rounded-lg bg-red-50 text-red-600 mr-4 icon-container" style={{backgroundColor: '#fee2e2', borderRadius: '0.75rem', padding: '0.75rem'}}>
            {icon}
        </div>
        <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>{title}</h2>
            {description && <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.25rem' }}>{description}</p>}
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const statusConfig = {
        Pending: {
            icon: <AlertCircle size={14} />,
            bg: '#f59e0b', color: '#fff'
        },
        Fulfilled: {
            icon: <CheckCircle size={14} />,
            bg: '#10b981', color: '#fff'
        },
        Rejected: {
            icon: <X size={14} />,
            bg: '#ef4444', color: '#fff'
        },
    };

    const config = statusConfig[status] || statusConfig.default;

    return (
        <span className="status-badge" style={{ backgroundColor: config.bg, color: config.color }}>
            {config.icon}
            <span style={{ marginLeft: '0.3rem' }}>{status}</span>
        </span>
    );
};

// --- MAIN APPLICATION COMPONENT ---
function RequestsPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [requestData, setRequestData] = useState({
        bloodGroup: '',
        quantity: 1,
        hospital: '',
        reason: ''
    });
    const [requests, setRequests] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching: Fetch user's blood requests ---
    const fetchRequests = useCallback(async () => {
        if (!user) return;
        
        try {
            setIsLoading(true);
            // CALLS REAL API: dataService.getUserRequests()
            const response = await dataService.getUserRequests(); 
            // Assuming response is { requests: [...] } or just [...]
            setRequests(response.requests || response); 
        } catch (err) {
            console.error('Error fetching blood requests:', err);
            setError(err.message || 'Failed to load blood requests.');
             // Fallback mock data if API fails to prevent blank list (optional)
            setRequests([
                { id: 1, bloodGroup: 'O+', quantity: 2, hospital: 'St. Jude Medical Center', status: 'Pending', reason: 'Emergency surgery', timestamp: new Date('2025-10-25') },
                { id: 2, bloodGroup: 'AB-', quantity: 1, hospital: 'City General Hospital', status: 'Fulfilled', reason: 'Accident patient', timestamp: new Date('2025-09-10') },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRequestData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // --- FUNCTIONAL SUBMIT HANDLER ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // VALIDATION: Ensure required fields are set
            if (!requestData.bloodGroup || !requestData.quantity || !requestData.hospital) {
                setError("Please fill out all required fields.");
                setIsSubmitting(false);
                return;
            }

            // --- ACTUAL API CALL IMPLEMENTED HERE ---
            const newRequestResponse = await dataService.createRequest({
                ...requestData,
                quantity: parseInt(requestData.quantity, 10),
            });
            // ----------------------------------------

            // API usually returns the newly created object (response.data or the response itself)
            const savedRequest = newRequestResponse.data || newRequestResponse;
            
            // Update the local list
            setRequests([savedRequest, ...requests]);
            
            // Reset form
            setRequestData({
                bloodGroup: '',
                quantity: 1,
                hospital: '',
                reason: ''
            });

            setRequestSuccess(true);
            setTimeout(() => setRequestSuccess(false), 3000);
        } catch (err) {
            console.error('Error submitting request:', err);
            setError(err.message || 'Failed to submit request. Check your backend connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Inline styles for the modern look
    const appContainerStyle = {
        backgroundColor: '#1a1a1a', 
        minHeight: '100vh', 
        paddingBottom: '4rem' 
    };

    const userName = user?.name || 'User';

    return (
        <div className="dashboard-container" style={appContainerStyle}>
            {/* Global CSS for Modern Look */}
            <style jsx global>{`
                /* Global Reset and Font */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

                body, html {
                    margin: 0;
                    padding: 0;
                    font-family: 'Inter', sans-serif;
                    background-color: #1a1a1a; 
                    color: #1f2937; 
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    overflow-x: hidden;
                }

                .dashboard-container {
                    min-height: 100vh;
                    position: relative;
                }
                
                .content-wrapper {
                    position: relative;
                    z-index: 10;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                /* General Card Style (SOLID WHITE) */
                .card {
                    background-color: #FFFFFF; /* OPAQUE WHITE */
                    border-radius: 1.25rem;
                    padding: 1.5rem;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15); 
                    transition: transform 0.3s ease;
                }
                
                .card:hover {
                    transform: translateY(-3px); 
                }

                /* Navbar Styles (Updated for white background context) */
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

                .navbar-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937; /* Dark text */
                }

                .logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background-color: #e30000;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    font-size: 0.875rem;
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.2s, transform 0.2s;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .logout-btn:hover {
                    background-color: #b00000;
                    transform: translateY(-2px);
                }

                /* Header Section */
                .header-section {
                    max-width: 1400px; margin: 0 auto 2rem; padding: 0 1.5rem; color: #fff;
                    position: relative; z-index: 10;
                }
                .header-section h1 { 
                    font-size: 2.5rem; font-weight: 800; margin: 0 0 0.5rem 0; 
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                }
                .header-section p { font-size: 1.125rem; color: #b0b0b0; margin: 0; }

                /* --- FORM STYLES (UI FIXES APPLIED) --- */
                .form-input, .form-select, .form-textarea {
                    /* Removed fixed width; width: 100% inside container handles sizing */
                    box-sizing: border-box; /* IMPORTANT: Ensures padding/border stays inside the 100% width */
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    margin-bottom: 0; /* Reset margin here, controlled by form-group */
                    transition: border-color 0.2s, box-shadow 0.2s;
                    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.07);
                    color: #1f2937; 
                }
                .form-input:focus, .form-select:focus, .form-textarea:focus {
                    outline: none;
                    border-color: #e30000; 
                    box-shadow: 0 0 0 1px #e30000; 
                }
                .form-label {
                    display: block;
                    margin-bottom: 0.35rem; 
                    font-weight: 600;
                    color: #374151;
                    font-size: 0.95rem;
                }
                .form-group {
                    margin-bottom: 1.5rem; /* Controls consistent vertical spacing */
                }

                /* Primary Button */
                .btn-primary {
                    width: 100%;
                    padding: 0.75rem 1.5rem;
                    background-color: #e30000;
                    color: white;
                    border: none;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: background-color 0.2s, transform 0.2s;
                    box-shadow: 0 4px 8px rgba(227, 0, 0, 0.3); 
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                }
                .btn-primary:hover {
                    background-color: #b00000;
                    transform: translateY(-1px);
                }
                .btn-primary:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Alert Styles */
                .success-alert {
                    background-color: #dcfce7;
                    color: #10b981;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    margin-top: 1rem;
                    font-weight: 600;
                    display: flex; align-items: center; gap: 0.5rem;
                }
                .error-alert {
                    background-color: #fee2e2;
                    color: #ef4444;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    margin-top: 1rem;
                    font-weight: 600;
                    display: flex; align-items: center; gap: 0.5rem;
                }

                /* Requests Grid */
                .requests-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2rem;
                    max-width: 1400px;
                    margin-top: 1rem;
                }
                @media (min-width: 1024px) {
                    .requests-grid {
                        grid-template-columns: 1fr 2fr;
                    }
                }

                /* Request List Styling */
                .request-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 0;
                    border-bottom: 1px solid #f3f4f6;
                    transition: background-color 0.2s;
                }
                .request-item:hover {
                    background-color: #fafafa;
                }
                .request-item:last-child {
                    border-bottom: none;
                }
                
                .request-details-text {
                    font-size: 0.9rem;
                    color: #6b7280;
                    margin-top: 0.25rem;
                }
                .status-badge {
                    font-size: 0.75rem;
                    font-weight: 600;
                    padding: 0.3rem 0.6rem;
                    border-radius: 9999px;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                }

            `}</style>

            {/* Content Overlay */}
            <div className="content-wrapper">
                {/* Navbar (Same as Dashboard) */}
                <nav className="navbar">
                    <div className="navbar-logo">
                        <Droplet color="#e30000" size={32} />
                        Blood Bank System
                    </div>
                    <div className="navbar-user">
                        <span style={{ color: '#1f2937' }}>Welcome, {user?.name || 'User'}!</span>
                        <button onClick={() => logout()} className="logout-btn">
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </nav>

                {/* Header */}
                <header className="header-section" style={{ padding: '0 0' }}>
                    <h1>Blood Request System</h1>
                    <p>Submit urgent blood requests and track your history.</p>
                </header>

                <div className="requests-grid">
                    {/* --- LEFT COLUMN: REQUEST FORM --- */}
                    <Card className="request-form-card">
                        <SectionHeader 
                            icon={<Send size={20} />} 
                            title="New Blood Request" 
                            description="Fill out the form below to initiate a blood request." 
                        />
                        
                        {error && (
                            <div className="error-alert">
                                <AlertCircle size={20} /> {error}
                            </div>
                        )}
                        {requestSuccess && (
                            <div className="success-alert">
                                <CheckCircle size={20} /> Request submitted successfully!
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="bloodGroup" className="form-label">Blood Group *</label>
                                <select
                                    id="bloodGroup"
                                    name="bloodGroup"
                                    className="form-select"
                                    value={requestData.bloodGroup}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select blood group</option>
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

                            <div className="form-group">
                                <label htmlFor="quantity" className="form-label">Quantity (Units) *</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    className="form-input"
                                    value={requestData.quantity}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="hospital" className="form-label">Hospital Name *</label>
                                <input
                                    type="text"
                                    id="hospital"
                                    name="hospital"
                                    className="form-input"
                                    value={requestData.hospital}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., City General Hospital"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="reason" className="form-label">Reason for Request</label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    className="form-textarea"
                                    rows="3"
                                    value={requestData.reason}
                                    onChange={handleInputChange}
                                    placeholder="Briefly describe the medical emergency."
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : <><Send size={20} /> Submit Request</>}
                            </button>
                        </form>
                    </Card>

                    {/* --- RIGHT COLUMN: REQUEST HISTORY --- */}
                    <Card className="request-history-card">
                        <SectionHeader 
                            icon={<Heart size={20} />} 
                            title="Your Request History" 
                            description="Track the fulfillment status of your submitted requests." 
                        />

                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>Loading requests...</div>
                        ) : requests.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>No requests submitted yet.</div>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {requests.map((req) => (
                                    <li key={req.id} className="request-item">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <Droplet color="#e30000" size={20} />
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                                                    {req.bloodGroup} - {req.quantity} Unit(s)
                                                </h3>
                                                <p className="request-details-text">
                                                    <Hospital size={14} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#888' }}/> {req.hospital}
                                                </p>
                                                <p className="request-details-text">
                                                    <Clock size={14} style={{ marginRight: '4px', verticalAlign: 'middle', color: '#888' }}/> Submitted: {new Date(req.timestamp || Date.now()).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <StatusBadge status={req.status} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default RequestsPage;