import React, { useState, useEffect } from 'react';
import { LogOut, Droplet, Hospital, AlertCircle, CheckCircle, ChevronRight, Send } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, collection, query, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';

// --- CONFIGURATION AND UTILS (MANDATORY FOR SINGLE FILE) ---
const bgImagePath = '/assets/blood-texture.jpg'; // Placeholder for moving 3D effect background
const __firebase_config = '{}'; 
const __initial_auth_token = '';
const __app_id = '';

// Helper Components
const Card = ({ children, className = '' }) => (
  <div className={`section-card ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ icon, title, description }) => (
  <div className="flex items-center mb-6">
    <div className="p-2 rounded-lg bg-red-50 text-red-600 mr-4 icon-container">
      {icon}
    </div>
    <div>
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: {
      icon: <AlertCircle style={{ width: '0.875rem', height: '0.875rem' }} />,
      className: 'status-pending'
    },
    Fulfilled: {
      icon: <CheckCircle style={{ width: '0.875rem', height: '0.875rem' }} />,
      className: 'status-fulfilled'
    },
    Rejected: {
      icon: <AlertCircle style={{ width: '0.875rem', height: '0.875rem' }} />,
      className: 'status-rejected'
    },
    default: {
      icon: <AlertCircle style={{ width: '0.875rem', height: '0.875rem' }} />,
      className: 'status-default'
    }
  };

  const config = statusConfig[status] || statusConfig.default;

  return (
    <span className={`status-badge ${config.className}`}>
      {config.icon}
      <span style={{ marginLeft: '0.375rem' }}>{status}</span>
    </span>
  );
};

// --- MAIN APPLICATION COMPONENT ---
function RequestsPage() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  const [requestData, setRequestData] = useState({
    bloodGroup: '',
    quantity: 1,
    hospital: '',
    reason: ''
  });
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // 1. FIREBASE INITIALIZATION & AUTHENTICATION
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const firebaseConfig = JSON.parse(__firebase_config || '{}');
        if (Object.keys(firebaseConfig).length > 0) {
          const app = initializeApp(firebaseConfig);
          const dbInstance = getFirestore(app);
          const authInstance = getAuth(app);
          
          setDb(dbInstance);
          setAuth(authInstance);
          
          const unsubscribe = onAuthStateChanged(authInstance, async (authUser) => {
            if (authUser) {
              setUser(authUser);
              setIsAuthReady(true);
            } else {
              try {
                if (__initial_auth_token && __initial_auth_token !== '') {
                  await signInWithCustomToken(authInstance, __initial_auth_token);
                } else {
                  await signInAnonymously(authInstance);
                }
              } catch (error) {
                console.error('Authentication error:', error);
                setIsAuthReady(true);
              }
            }
          });
          
          return () => unsubscribe();
        } else {
          console.error("Firebase config is empty. Running without database features.");
          setIsAuthReady(true);
        }
      } catch (error) {
        console.error('Failed to initialize Firebase:', error);
        setIsAuthReady(true);
      }
    };
    
    initializeFirebase();
  }, []);

  // 2. DATA SUBSCRIPTION (Profile & Requests)
  useEffect(() => {
    if (isAuthReady && user && db) {
      const userId = user.uid;
      const profileDocRef = doc(db, `/artifacts/${appId}/users/${userId}/profile`, 'userProfile');
      const requestsColRef = collection(db, `/artifacts/${appId}/users/${userId}/requests`);

      const unsubscribeProfile = onSnapshot(profileDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      });

      const q = query(requestsColRef, orderBy('timestamp', 'desc'));
      const unsubscribeRequests = onSnapshot(q, (snapshot) => {
        const requestsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(requestsList);
        setIsLoading(false);
      });

      return () => {
        unsubscribeProfile();
        unsubscribeRequests();
      };
    }
  }, [isAuthReady, user, db, appId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestData.bloodGroup || !requestData.quantity || !requestData.hospital || !db || !user) {
      console.error('Invalid request data or user not authenticated.');
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = user.uid;
      const publicRequestsColRef = collection(db, `/artifacts/${appId}/public/data/requests`);
      const userRequestsColRef = collection(db, `/artifacts/${appId}/users/${userId}/requests`);

      const requestPayload = {
        ...requestData,
        quantity: parseInt(requestData.quantity, 10),
        userId: userId,
        status: 'Pending',
        timestamp: serverTimestamp(),
      };

      await addDoc(userRequestsColRef, requestPayload);
      await addDoc(publicRequestsColRef, requestPayload);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      setUser(null);
    }
  };

  const userName = profile?.name || 'User';

  if (!isAuthReady) {
    // Simplified Loading Screen
    return (
      <div className="loading-screen" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner"></div>
          <h2 style={{ color: '#1f2937', fontWeight: '600' }}>Loading Application...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ backgroundImage: `url(${bgImagePath})`, minHeight: '100vh', padding: '2rem 1rem' }}>
      <style>{`
        /* --- GLOBAL STYLES --- */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body, html { margin: 0; padding: 0; font-family: 'Inter', sans-serif; color: #1f2937; }
        
        .app-container {
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          background-repeat: no-repeat;
          position: relative;
        }

        /* --- GLASS EFFECT CARDS --- */
        .section-card {
          background-color: rgba(255, 255, 255, 0.15); /* Light translucent background */
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
          border-radius: 1.5rem;
          padding: 2.5rem;
          margin-bottom: 2rem;
          color: #e0e0e0; /* Light text for better contrast on dark/effect background */
        }
        
        .section-card h2, .section-card h3 {
          color: white;
          font-weight: 700;
        }
        .section-card p, .section-card label {
          color: #cccccc;
        }
        
        /* --- NAVBAR --- */
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
          display: flex;
          align-items: center;
          gap: 0.5rem;
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

        /* --- FORM STYLES --- */
        .form-input, .form-select, .form-textarea {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          width: 100%;
          transition: all 0.2s;
          font-size: 1rem;
          color: white;
          margin-bottom: 1rem;
        }
        .form-input::placeholder, .form-textarea::placeholder, .form-select option {
          color: #9ca3af;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
        }
        .btn-primary {
          background-color: #ef4444;
          color: white;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .btn-primary:hover {
          background-color: #dc2626;
          transform: translateY(-1px);
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .success-message {
          background-color: rgba(16, 185, 129, 0.2);
          color: #10b981;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          margin-top: 1rem;
          font-size: 0.875rem;
          text-align: center;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        /* --- REQUESTS LIST STYLES --- */
        .requests-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .request-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: background-color 0.2s;
        }
        .request-item:last-child {
          border-bottom: none;
        }
        .request-item:hover {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
        }
        .request-details {
          display: flex;
          flex-direction: column;
        }
        .request-main-info {
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .request-sub-info {
          font-size: 0.875rem;
          color: #9ca3af;
          margin-top: 0.25rem;
        }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.3rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid;
        }
        .status-pending { background-color: rgba(251, 191, 36, 0.2); color: #facc15; border-color: #fbbf24; }
        .status-fulfilled { background-color: rgba(16, 185, 129, 0.2); color: #10b981; border-color: #10b981; }
        .status-rejected { background-color: rgba(239, 68, 68, 0.2); color: #f87171; border-color: #f87171; }

        /* --- LAYOUT GRID --- */
        .grid-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .grid-container {
            grid-template-columns: 1fr 2fr;
          }
        }
        
        .main-header {
          max-width: 1400px;
          margin: 0 auto 2rem;
          padding: 0 1.5rem;
          color: white;
        }
        .main-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        .main-header p {
          font-size: 1.25rem;
          color: #ccc;
        }
      `}</style>
      
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-logo">
            <Droplet color="#ef4444" size={32} />
            <h1 style={{ margin: 0 }}>Blood Bank</h1>
          </div>
          <div className="navbar-user">
            <span style={{ color: 'white', marginRight: '1rem' }}>Welcome, {userName}!</span>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="main-header">
        <h1>Blood Request System</h1>
        <p>Request blood donations or view the status of your existing requests.</p>
      </div>
      
      <div className="grid-container">
        {/* --- 1. NEW REQUEST FORM (Left Column) --- */}
        <Card>
          <SectionHeader 
            icon={<Send style={{ width: '1.5rem', height: '1.5rem' }} />} 
            title="Submit New Request" 
            description="Fill out the form below to initiate a blood request." 
          />
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="bloodGroup" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Blood Group</label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                className="form-select"
                value={requestData.bloodGroup}
                onChange={handleInputChange}
                required
              >
                <option value="" style={{ color: '#6b7280' }}>Select Blood Group</option>
                <option value="A+" style={{ color: '#1f2937' }}>A+</option>
                <option value="A-" style={{ color: '#1f2937' }}>A-</option>
                <option value="B+" style={{ color: '#1f2937' }}>B+</option>
                <option value="B-" style={{ color: '#1f2937' }}>B-</option>
                <option value="AB+" style={{ color: '#1f2937' }}>AB+</option>
                <option value="AB-" style={{ color: '#1f2937' }}>AB-</option>
                <option value="O+" style={{ color: '#1f2937' }}>O+</option>
                <option value="O-" style={{ color: '#1f2937' }}>O-</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="quantity" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Quantity (Units)</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                className="form-input"
                value={requestData.quantity}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="hospital" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Hospital Name</label>
              <input
                id="hospital"
                name="hospital"
                type="text"
                className="form-input"
                value={requestData.hospital}
                onChange={handleInputChange}
                required
                placeholder="e.g., City General Hospital"
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="reason" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Reason for Request</label>
              <textarea
                id="reason"
                name="reason"
                className="form-textarea"
                rows="3"
                value={requestData.reason}
                onChange={handleInputChange}
                required
                placeholder="Briefly describe the medical need."
              ></textarea>
            </div>
            
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending Request...' : 'Submit Request'}
            </button>
            
            {requestSuccess && (
              <div className="success-message">
                Request submitted successfully! We are processing it now.
              </div>
            )}
          </form>
        </Card>

        {/* --- 2. REQUESTS HISTORY (Right Column) --- */}
        <Card>
          <SectionHeader 
            icon={<Hospital style={{ width: '1.5rem', height: '1.5rem' }} />} 
            title="My Request History" 
            description="A list of all blood requests submitted from your account." 
          />
          
          {isLoading ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#ccc' }}>Loading requests...</p>
          ) : requests.length > 0 ? (
            <ul className="requests-list">
              {requests.map((req) => (
                <li key={req.id} className="request-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Droplet color="#ef4444" size={24} />
                    <div className="request-details">
                      <div className="request-main-info">
                        <span>{req.bloodGroup} - {req.quantity} unit(s)</span>
                        <StatusBadge status={req.status} />
                      </div>
                      <div className="request-sub-info">
                        <span style={{ marginRight: '1rem' }}>{req.hospital}</span>
                        <span>{req.timestamp ? new Date(req.timestamp.toDate()).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} color="#9ca3af" />
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9ca3af' }}>
              <Droplet style={{ width: '2rem', height: '2rem', marginBottom: '1rem', color: '#ef4444' }} />
              <p>You haven't made any blood requests yet.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default RequestsPage;