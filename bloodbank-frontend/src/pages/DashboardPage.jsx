// import React, { useState, useEffect, useRef } from 'react';
// import { LogOut, Droplet, Users, Heart, MapPin, User, CheckCircle, Clock, AlertCircle, Phone, Mail, Map } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import * as THREE from 'three'; 
// import { useAuth } from '../context/AuthContext';
// import { dataService } from '../services/dataService'; 

// // --- Component Helpers ---

// // Helper component for the solid white card look
// const Card = ({ children, className = '' }) => (
//     <div className={`card ${className}`}>
//         {children}
//     </div>
// );

// // Helper component for the statistic blocks
// const StatCard = ({ icon, title, value, unit, description }) => (
//     <Card className="stat-card">
//         <div className="stat-icon-container">
//             {icon}
//         </div>
//         <p className="stat-title">{title}</p>
//         <h3 className="stat-value">{value}{unit}</h3>
//         <p className="stat-description">{description}</p>
//     </Card>
// );

// // --- Main Component ---

// const UserDashboardPage = () => {
//     const { user, profile, logout } = useAuth();
//     const navigate = useNavigate(); 
    
//     // State and Mock Data Logic
//     const [stats, setStats] = useState({ totalDonors: 1420, totalDonations: 856, pintsCollected: 428 });
//     const [recentDonations, setRecentDonations] = useState([
//         { id: 1, date: '2025-09-15', center: 'City General Hospital', status: 'Completed' },
//         { id: 2, date: '2025-05-15', center: 'Main Blood Bank', status: 'Completed' },
//     ]);
//     const [nextDonationInfo, setNextDonationInfo] = useState({ status: 'ready', text: 'You are eligible to donate now.', percent: 100 });
//     const [isLoading, setIsLoading] = useState(false);
//     const canvasRef = useRef(null);

//     // --- Data Fetching Logic (MOCK) ---
//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             if (!user) {
//                 setIsLoading(false);
//                 return;
//             }
            
//             // Mock eligibility calculation
//             const lastDonationDate = new Date('2025-05-15');
//             const requiredIntervalDays = 90; // Approx 3 months
//             const daysSinceDonation = Math.floor((Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24));
            
//             let status, text, percent;

//             if (daysSinceDonation >= requiredIntervalDays) {
//                 status = 'ready';
//                 text = 'Ready! You are eligible to donate now.';
//                 percent = 100;
//             } else {
//                 const daysRemaining = requiredIntervalDays - daysSinceDonation;
//                 percent = Math.floor((daysSinceDonation / requiredIntervalDays) * 100);
//                 text = `Eligible in ${daysRemaining} days. (${daysSinceDonation} / 90 days complete)`;
//                 status = 'scheduled';
//             }

//             setNextDonationInfo({ status, text, percent });
//             setIsLoading(false);
//         };
//         fetchDashboardData();
//     }, [user]);

//     // --- Three.js Initialization (Safely Encapsulated) ---
//     useEffect(() => {
//         if (!canvasRef.current || typeof THREE === 'undefined') return;

//         let scene, camera, renderer, particles;
//         const width = window.innerWidth;
//         const height = window.innerHeight;
//         let animationFrameId;

//         const init = () => {
//             try {
//                 scene = new THREE.Scene();
//                 camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//                 camera.position.z = 5;

//                 renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
//                 renderer.setSize(width, height);
//                 renderer.setPixelRatio(window.devicePixelRatio);

//                 const geometry = new THREE.BufferGeometry();
//                 const vertices = [];
//                 const numParticles = 1000;
//                 const baseColor = new THREE.Color(0xFF0000); 

//                 for (let i = 0; i < numParticles; i++) {
//                     vertices.push((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
//                 }
//                 geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                
//                 const material = new THREE.PointsMaterial({ size: 0.05, color: baseColor, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
//                 particles = new THREE.Points(geometry, material);
//                 scene.add(particles);
//                 animate();
//             } catch (error) {
//                 console.error("Three.js background effect failed to initialize.");
//             }
//         };

//         const animate = () => {
//             animationFrameId = requestAnimationFrame(animate);
//             if (particles && renderer && scene && camera) {
//                 particles.rotation.y += 0.0005;
//                 particles.rotation.x += 0.0002;
//                 const positions = particles.geometry.attributes.position.array;
//                 const numParticles = positions.length / 3;
//                 for (let i = 0; i < numParticles; i++) {
//                     positions[i * 3 + 1] += 0.001; 
//                     if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = -5;
//                 }
//                 particles.geometry.attributes.position.needsUpdate = true;
//                 renderer.render(scene, camera);
//             }
//         };

//         window.addEventListener('resize', () => {
//             const newWidth = window.innerWidth;
//             const newHeight = window.innerHeight;
//             if (camera) { camera.aspect = newWidth / newHeight; camera.updateProjectionMatrix(); }
//             if (renderer) renderer.setSize(newWidth, newHeight);
//         });
//         init(); 

//         return () => {
//             cancelAnimationFrame(animationFrameId);
//             if (renderer) renderer.dispose();
//             if (particles && scene) scene.remove(particles);
//         };
//     }, []);


//     // 3. Render Logic
//     const userName = profile?.name || 'Alex Johnson';
//     const userRole = user?.role || 'Donor';

//     // Quick Action Helper Component with onClick prop
//     const QuickAction = ({ icon, label, onClick }) => ( 
//         <button className={`quick-action-btn`} onClick={onClick}>
//             {icon}
//             <span>{label}</span>
//         </button>
//     );
    
//     // Status style helper
//     const isEligible = nextDonationInfo.status === 'ready';

//     // Utility function for circular progress bar stroke offset
//     const getCircleOffset = (percent) => 440 - (440 * percent) / 100;


//     return (
//         <div className="dashboard-container">
//              <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

//             <canvas ref={canvasRef} id="three-canvas"></canvas>

//             {/* Global CSS for Modern Look */}
//             <style jsx global>{`
//                 /* Global Reset and Font */
//                 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

//                 body, html {
//                     margin: 0; padding: 0; font-family: 'Inter', sans-serif;
//                     background-color: #1a1a1a; color: #1f2937; 
//                     -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
//                     overflow-x: hidden;
//                 }
//                 .dashboard-container { min-height: 100vh; position: relative; padding-bottom: 50px; }
//                 #three-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
//                 .content-wrapper { position: relative; z-index: 10; max-width: 1400px; margin: 0 auto; padding: 0 1.5rem; }

//                 /* General Card Style (SOLID WHITE) */
//                 .card {
//                     background-color: #FFFFFF; border-radius: 1.25rem; padding: 1.5rem;
//                     border: 1px solid #e5e7eb; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15); 
//                     transition: transform 0.3s ease;
//                 }
//                 .card:hover { transform: translateY(-3px); }

//                 /* Navbar Styles */
//                 .navbar { background-color: #FFFFFF; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); padding: 1rem 1.5rem; border-radius: 0.75rem; margin: 1.5rem auto; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e5e7eb; }
//                 .navbar-logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 700; color: #1f2937; }
//                 .logout-btn { background-color: #e30000; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500; font-size: 0.875rem; border: none; cursor: pointer; transition: background-color 0.2s, transform 0.2s; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
//                 .logout-btn:hover { background-color: #b00000; transform: translateY(-2px); }

//                 /* Header Section */
//                 .header-section { margin-top: 2rem; margin-bottom: 2rem; }
//                 .header-section h1 { font-size: 2.5rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); }
//                 .header-section p { font-size: 1.1rem; color: #b0b0b0; margin: 0; }
                
//                 /* Quick Actions */
//                 .quick-actions-container { display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap; }
//                 .quick-action-btn { background-color: #f3f4f6; color: #1f2937; padding: 0.75rem 1.5rem; border-radius: 0.75rem; border: 1px solid #d1d5db; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: background-color 0.2s; }
//                 .quick-action-btn:hover { background-color: #e5e7eb; }

//                 /* Grids */
//                 .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem; }
//                 .main-grid { 
//                     display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; 
//                     margin-bottom: 3rem; 
//                 }

//                 /* Stat Card Specifics */
//                 .stat-icon-container { padding: 0.75rem; width: fit-content; border-radius: 50%; background-color: #fee2e2; color: #e30000; }
//                 .stat-value { font-size: 2.25rem; font-weight: 800; color: #e30000; margin: 0.25rem 0 0.5rem; }
//                 .stat-title { font-size: 0.9rem; font-weight: 500; color: #6b7280; }
//                 .stat-description { font-size: 0.8rem; color: #9ca3af; }

//                 /* Eligibility Status */
//                 .eligibility-header { margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; }
//                 .eligibility-content { display: flex; align-items: center; gap: 1.5rem; margin-top: 10px; }
                
//                 /* Circular Progress Bar CSS */
//                 .progress-circle { 
//                     width: 110px; height: 110px; position: relative;
//                     min-width: 110px; /* Fix size on flex container */
//                 }
//                 .progress-ring__circle { 
//                     transition: stroke-dashoffset 0.35s; 
//                     transform: rotate(-90deg); 
//                     transform-origin: 50% 50%; 
//                     stroke-linecap: round;
//                 }
//                 .progress-text { 
//                     position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
//                     font-size: 1.1rem; font-weight: 700; color: #1f2937;
//                 }

//                 .status-ready { background-color: #10b981; color: #fff; padding: 0.5rem 1rem; border-radius: 0.75rem; font-size: 0.9rem; font-weight: 600; text-align: center; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3); }
//                 .status-scheduled { background-color: #f59e0b; color: #fff; padding: 0.5rem 1rem; border-radius: 0.75rem; font-size: 0.9rem; font-weight: 600; text-align: center; box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3); }

//                 /* Profile List */
//                 .profile-info-list li { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px dotted #f3f4f6; font-size: 0.95rem; color: #374151; }
//                 .profile-info-list li:last-child { border-bottom: none; }
//                 .label { font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 0.5rem; }

//                 /* Recency Badge */
//                 .recency-badge {
//                     background-color: #fee2e2; color: #dc2626; padding: 0.4rem 0.8rem; border-radius: 0.5rem;
//                     font-size: 0.8rem; font-weight: 600; margin-left: 10px;
//                 }

//                 /* Footer */
//                 .footer { background-color: #111; color: #b0b0b0; padding: 3rem 1.5rem; position: relative; z-index: 10; font-size: 0.9rem; margin-top: auto; }
//                 .footer-grid { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; }
//                 .footer-section h4 { color: white; font-weight: 700; margin-bottom: 1rem; font-size: 1.1rem; }
//                 .footer-section ul { list-style: none; padding: 0; margin: 0; }
//                 .footer-section ul li { margin-bottom: 0.5rem; }
//                 .footer-section a { color: #b0b0b0; text-decoration: none; transition: color 0.2s; }
//                 .footer-section a:hover { color: #e30000; }
//             `}</style>

//             <div className="content-wrapper">
//                 {/* Navbar */}
//                 <nav className="navbar">
//                     <div className="navbar-logo">
//                         <Droplet color="#e30000" size={32} />
//                         Blood Bank System
//                     </div>
//                     <div className="navbar-user">
//                         <span style={{ color: '#1f2937' }}>Welcome, {userName}!</span>
//                         <button onClick={logout} className="logout-btn">
//                             <LogOut size={16} />
//                             Logout
//                         </button>
//                     </div>
//                 </nav>

//                 {/* Header */}
//                 <header className="header-section">
//                     <h1>Welcome back, {userName}!</h1>
//                     <p>Your impact on the community and personal blood stats. Role: {userRole}</p>
//                     <div className="quick-actions-container">
//                         {/* Functional Quick Actions */}
//                         <QuickAction icon={<Droplet size={20} />} label="Request Blood" onClick={() => navigate('/requests')} />
//                         <QuickAction icon={<MapPin size={20} />} label="Find Centers" onClick={() => navigate('/centers')} />
//                         <QuickAction icon={<User size={20} />} label="View Profile" onClick={() => navigate('/profile')} />
//                         {/* Admin Link (Hidden for regular users) */}
//                         {userRole === 'Admin' && (
//                              <QuickAction icon={<Send size={20} />} label="Admin Panel" onClick={() => navigate('/admin')} />
//                         )}
//                     </div>
//                 </header>

//                 {/* Main Stats Grid */}
//                 <div className="stats-grid">
//                     <StatCard icon={<Users size={24} />} title="Total Donors" value={stats.totalDonors} description="Active members in the community." />
//                     <StatCard icon={<Heart size={24} />} title="Total Donations" value={stats.totalDonations} description="Total donations recorded to date." />
//                     <StatCard icon={<Droplet size={24} />} title="Pints Collected" value={stats.pintsCollected} unit=" L" description="Total blood volume collected in liters." />
//                 </div>

//                 {/* Secondary Grid: FINAL LAYOUT FIX & ENHANCEMENTS */}
//                 <div className="main-grid">
                    
//                     {/* Eligibility and Profile Summary - COMBINED INTO A SINGLE COLUMN */}
//                     <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', gap: '1.5rem' }}>
                        
//                         {/* 1. Next Donation Eligibility (VISUAL ENHANCEMENT) */}
//                         <Card className="eligibility-card">
//                             <div className="eligibility-header">
//                                 <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
//                                     <Clock size={20} color="#e30000" /> Next Donation Eligibility
//                                 </h2>
//                             </div>
//                             <div className="eligibility-content">
//                                 {/* Circular Progress Bar */}
//                                 <div className="progress-circle">
//                                     <svg width="100%" height="100%" viewBox="0 0 160 160">
//                                         <circle
//                                             className="progress-ring__circle"
//                                             stroke="#f3f4f6"
//                                             strokeWidth="10"
//                                             fill="transparent"
//                                             r="70"
//                                             cx="80"
//                                             cy="80"
//                                         />
//                                         <circle
//                                             className="progress-ring__circle"
//                                             stroke={isEligible ? '#10b981' : '#f59e0b'}
//                                             strokeWidth="10"
//                                             fill="transparent"
//                                             r="70"
//                                             cx="80"
//                                             cy="80"
//                                             style={{
//                                                 strokeDasharray: 440,
//                                                 strokeDashoffset: getCircleOffset(nextDonationInfo.percent),
//                                             }}
//                                         />
//                                     </svg>
//                                     <span className="progress-text">{nextDonationInfo.percent}%</span>
//                                 </div>

//                                 {/* Eligibility Text */}
//                                 <div style={{ flexGrow: 1 }}>
//                                     <div className={`status-badge ${isEligible ? 'status-ready' : 'status-scheduled'}`} style={{ marginBottom: '10px' }}>
//                                         {isEligible ? <CheckCircle size={20} style={{marginRight: '8px'}} /> : <AlertCircle size={20} style={{marginRight: '8px'}} />}
//                                         {isEligible ? 'ELIGIBLE' : 'IN PROGRESS'}
//                                     </div>
//                                     <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>
//                                         {nextDonationInfo.text}
//                                     </p>
//                                     <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '5px' }}>
//                                         Last Donated: {new Date('2025-05-15').toLocaleDateString()}
//                                     </p>
//                                 </div>
//                             </div>
//                         </Card>

//                         {/* 2. My Profile Summary */}
//                         <Card>
//                             <div className="card-header">
//                                 <User size={20} color="#e30000" />
//                                 <h2>My Profile Summary</h2>
//                                 {/* NEW: Recency Badge for visual attraction */}
//                                 <span className="recency-badge">TOP DONOR</span>
//                             </div>
//                             <ul className="profile-info-list">
//                                 <li>
//                                     <span className="label">Name</span>
//                                     <span>{userName}</span>
//                                 </li>
//                                 <li>
//                                     <span className="label">Email</span>
//                                     <span>{user?.email || 'N/A'}</span>
//                                 </li>
//                                 <li>
//                                     <span className="label"><Droplet size={14} style={{ marginRight: '4px', color: '#e30000' }}/>Blood Group</span>
//                                     <span>{profile?.bloodGroup || 'O+'}</span>
//                                 </li>
//                                 <li>
//                                     <span className="label">Role</span>
//                                     <span style={{ fontWeight: 700, color: userRole === 'Admin' ? '#e30000' : '#10b981' }}>{userRole}</span>
//                                 </li>
//                             </ul>
//                         </Card>
//                     </div>

//                     {/* Right Column: Recent Donations */}
//                     <Card style={{ marginBottom: '3rem' }}>
//                         <div className="card-header">
//                             <Heart size={20} color="#e30000" />
//                             <h2>Recent Donation History</h2>
//                         </div>
//                         {recentDonations.length > 0 ? (
//                             <ul className="history-list">
//                                 {recentDonations.slice(0, 5).map(donation => (
//                                     <li key={donation.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dotted #f3f4f6' }}>
//                                         <span style={{ fontWeight: 600 }}>{new Date(donation.date).toLocaleDateString()}</span>
//                                         <span style={{ color: '#6b7280' }}>{donation.center}</span>
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <div style={{ textAlign: 'center', padding: '2rem 0', color: '#888' }}>
//                                 No recent donation history found.
//                             </div>
//                         )}
//                     </Card>
//                 </div>
//             </div>

//             {/* --- FOOTER --- */}
//             <footer className="footer">
//                 <div className="footer-grid">
//                     <div className="footer-section">
//                         <h4><Droplet size={20} style={{ marginRight: '5px' }}/> Blood Bank System</h4>
//                         <p style={{ color: '#9ca3af' }}>Saving lives through community and technology. Built on MERN stack.</p>
//                     </div>
//                     <div className="footer-section">
//                         <h4>Quick Links</h4>
//                         <ul>
//                             <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/requests'); }}>Request Blood</a></li>
//                             <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/inventory'); }}>View Inventory</a></li>
//                             <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/centers'); }}>Find Centers</a></li>
//                         </ul>
//                     </div>
//                     <div className="footer-section">
//                         <h4>About Us</h4>
//                         <ul>
//                             <li><a href="#">Our Mission</a></li>
//                             <li><a href="#">Privacy Policy</a></li>
//                             <li><a href="#">Terms of Service</a></li>
//                         </ul>
//                     </div>
//                     <div className="footer-section">
//                         <h4>Contact</h4>
//                         <ul>
//                             <li><Phone size={14} style={{ marginRight: '8px' }}/> +91 99887 76655</li>
//                             <li><Mail size={14} style={{ marginRight: '8px' }}/> support@bloodbank.org</li>
//                             <li><MapPin size={14} style={{ marginRight: '8px' }}/> 123 Health Ave, City</li>
//                         </ul>
//                     </div>
//                 </div>
//             </footer>
//         </div>
//     );
// };

// export default UserDashboardPage;

import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Droplet, Users, Heart, MapPin, User, CheckCircle, Clock, AlertCircle, Phone, Mail, Map, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three'; 
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService'; 

// --- Component Helpers ---

const Card = ({ children, className = '' }) => (
    <div className={`card ${className}`}>
        {children}
    </div>
);

const StatCard = ({ icon, title, value, unit, description }) => (
    <Card className="stat-card">
        <div className="stat-icon-container">
            {icon}
        </div>
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}{unit}</h3>
        <p className="stat-description">{description}</p>
    </Card>
);

// --- Main Component ---

const DashboardPage = () => {
    // FIX: Destructure user and profile for dynamic data access
    const { user, profile, logout } = useAuth();
    const navigate = useNavigate(); 
    
    // State and Mock Data Logic
    const [stats, setStats] = useState({ totalDonors: 1420, totalDonations: 856, pintsCollected: 428 });
    const [recentDonations, setRecentDonations] = useState([
        { id: 1, date: '2025-09-15', center: 'City General Hospital', status: 'Completed' },
        { id: 2, date: '2025-05-15', center: 'Main Blood Bank', status: 'Completed' },
    ]);
    const [nextDonationInfo, setNextDonationInfo] = useState({ status: 'ready', text: 'You are eligible to donate now.', percent: 100 });
    const [isLoading, setIsLoading] = useState(false);
    const canvasRef = useRef(null);

    // --- Data Fetching Logic (MOCK) ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }
            
            // Mock eligibility calculation
            const lastDonationDate = new Date('2025-05-15');
            const requiredIntervalDays = 90; // Approx 3 months
            const daysSinceDonation = Math.floor((Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24));
            
            let status, text, percent;

            if (daysSinceDonation >= requiredIntervalDays) {
                status = 'ready';
                text = 'Ready! You are eligible to donate now.';
                percent = 100;
            } else {
                const daysRemaining = requiredIntervalDays - daysSinceDonation;
                percent = Math.floor((daysSinceDonation / requiredIntervalDays) * 100);
                text = `Eligible in ${daysRemaining} days. (${daysSinceDonation} / 90 days complete)`;
                status = 'scheduled';
            }

            setNextDonationInfo({ status, text, percent });
            setIsLoading(false);
        };
        fetchDashboardData();
    }, [user]);

    // --- Three.js Initialization (Safely Encapsulated) ---
    useEffect(() => {
        if (!canvasRef.current || typeof THREE === 'undefined') return;

        let scene, camera, renderer, particles;
        const width = window.innerWidth;
        const height = window.innerHeight;
        let animationFrameId;

        const init = () => {
            try {
                scene = new THREE.Scene();
                camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
                camera.position.z = 5;

                renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
                renderer.setSize(width, height);
                renderer.setPixelRatio(window.devicePixelRatio);

                const geometry = new THREE.BufferGeometry();
                const vertices = [];
                const numParticles = 1000;
                const baseColor = new THREE.Color(0xFF0000); 

                for (let i = 0; i < numParticles; i++) {
                    vertices.push((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
                }
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                
                const material = new THREE.PointsMaterial({ size: 0.05, color: baseColor, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
                particles = new THREE.Points(geometry, material);
                scene.add(particles);
                animate();
            } catch (error) {
                console.error("Three.js background effect failed to initialize.");
            }
        };

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (particles && renderer && scene && camera) {
                particles.rotation.y += 0.0005;
                particles.rotation.x += 0.0002;
                const positions = particles.geometry.attributes.position.array;
                const numParticles = positions.length / 3;

                for (let i = 0; i < numParticles; i++) {
                    positions[i * 3 + 1] += 0.001; 
                    if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = -5;
                }
                particles.geometry.attributes.position.needsUpdate = true;
                renderer.render(scene, camera);
            }
        };

        window.addEventListener('resize', () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            if (camera) { camera.aspect = newWidth / newHeight; camera.updateProjectionMatrix(); }
            if (renderer) renderer.setSize(newWidth, newHeight);
        });
        init(); 

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (renderer) renderer.dispose();
            if (particles && scene) scene.remove(particles);
        };
    }, []);


    // 3. Render Logic
    // FIX: Read name and role from the user context (user is from auth response, profile is from dataService)
    // Uses profile.name first, falls back to user.name, then email username.
    const userName = profile?.name || user?.name || user?.email?.split('@')[0] || 'User'; 
    const userRole = user?.role || 'Donor';
    const userEmail = user?.email || 'N/A';
    const userBloodGroup = profile?.bloodGroup || user?.bloodGroup || 'O+';
    const userId = user?.uid || 'N/A';


    // Quick Action Helper Component with onClick prop
    const QuickAction = ({ icon, label, onClick }) => ( 
        <button className={`quick-action-btn`} onClick={onClick}>
            {icon}
            <span>{label}</span>
        </button>
    );
    
    // Status style helper
    const isEligible = nextDonationInfo.status === 'ready';

    // Utility function for circular progress bar stroke offset
    const getCircleOffset = (percent) => 440 - (440 * percent) / 100;


    return (
        <div className="dashboard-container">
             <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

            <canvas ref={canvasRef} id="three-canvas"></canvas>

            {/* Global CSS for Modern Look */}
            <style jsx global>{`
                /* Global Reset and Font */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

                body, html {
                    margin: 0; padding: 0; font-family: 'Inter', sans-serif;
                    background-color: #1a1a1a; color: #1f2937; 
                    -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
                    overflow-x: hidden;
                }
                .dashboard-container { min-height: 100vh; position: relative; padding-bottom: 50px; }
                #three-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
                .content-wrapper { position: relative; z-index: 10; max-width: 1400px; margin: 0 auto; padding: 0 1.5rem; }

                /* General Card Style (SOLID WHITE) */
                .card {
                    background-color: #FFFFFF; border-radius: 1.25rem; padding: 1.5rem;
                    border: 1px solid #e5e7eb; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15); 
                    transition: transform 0.3s ease;
                }
                .card:hover { transform: translateY(-3px); }

                /* Navbar Styles */
                .navbar { background-color: #FFFFFF; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); padding: 1rem 1.5rem; border-radius: 0.75rem; margin: 1.5rem auto; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e5e7eb; }
                .navbar-logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 700; color: #1f2937; }
                .logout-btn { background-color: #e30000; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500; font-size: 0.875rem; border: none; cursor: pointer; transition: background-color 0.2s, transform 0.2s; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
                .logout-btn:hover { background-color: #b00000; transform: translateY(-2px); }

                /* Header Section */
                .header-section { margin-top: 2rem; margin-bottom: 2rem; }
                .header-section h1 { font-size: 2.5rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); }
                .header-section p { font-size: 1.1rem; color: #b0b0b0; margin: 0; }
                
                /* Quick Actions */
                .quick-actions-container { display: flex; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap; }
                .quick-action-btn { background-color: #f3f4f6; color: #1f2937; padding: 0.75rem 1.5rem; border-radius: 0.75rem; border: 1px solid #d1d5db; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: background-color 0.2s; }
                .quick-action-btn:hover { background-color: #e5e7eb; }

                /* Grids */
                .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem; }
                .main-grid { 
                    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; 
                    margin-bottom: 3rem; 
                }

                /* Stat Card Specifics */
                .stat-icon-container { padding: 0.75rem; width: fit-content; border-radius: 50%; background-color: #fee2e2; color: #e30000; }
                .stat-value { font-size: 2.25rem; font-weight: 800; color: #e30000; margin: 0.25rem 0 0.5rem; }
                .stat-title { font-size: 0.9rem; font-weight: 500; color: #6b7280; }
                .stat-description { font-size: 0.8rem; color: #9ca3af; }

                /* Eligibility Status */
                .eligibility-header { margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; }
                .eligibility-content { display: flex; align-items: center; gap: 1.5rem; margin-top: 10px; }
                
                /* Circular Progress Bar CSS */
                .progress-circle { 
                    width: 110px; height: 110px; position: relative;
                    min-width: 110px; /* Fix size on flex container */
                }
                .progress-ring__circle { 
                    transition: stroke-dashoffset 0.35s; 
                    transform: rotate(-90deg); 
                    transform-origin: 50% 50%; 
                    stroke-linecap: round;
                }
                .progress-text { 
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    font-size: 1.1rem; font-weight: 700; color: #1f2937;
                }

                .status-ready { background-color: #10b981; color: #fff; padding: 0.5rem 1rem; border-radius: 0.75rem; font-size: 0.9rem; font-weight: 600; text-align: center; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3); }
                .status-scheduled { background-color: #f59e0b; color: #fff; padding: 0.5rem 1rem; border-radius: 0.75rem; font-size: 0.9rem; font-weight: 600; text-align: center; box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3); }

                /* Profile List */
                .profile-info-list li { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px dotted #f3f4f6; font-size: 0.95rem; color: #374151; }
                .profile-info-list li:last-child { border-bottom: none; }
                .label { font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 0.5rem; }

                /* Recency Badge */
                .recency-badge {
                    background-color: #fee2e2; color: #dc2626; padding: 0.4rem 0.8rem; border-radius: 0.5rem;
                    font-size: 0.8rem; font-weight: 600; margin-left: 10px;
                }

                /* Footer */
                .footer { background-color: #111; color: #b0b0b0; padding: 3rem 1.5rem; position: relative; z-index: 10; font-size: 0.9rem; margin-top: auto; }
                .footer-grid { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; }
                .footer-section h4 { color: white; font-weight: 700; margin-bottom: 1rem; font-size: 1.1rem; }
                .footer-section ul { list-style: none; padding: 0; margin: 0; }
                .footer-section ul li { margin-bottom: 0.5rem; }
                .footer-section a { color: #b0b0b0; text-decoration: none; transition: color 0.2s; }
                .footer-section a:hover { color: #e30000; }
            `}</style>

            <div className="content-wrapper">
                {/* Navbar */}
                <nav className="navbar">
                    <div className="navbar-logo">
                        <Droplet color="#e30000" size={32} />
                        Blood Bank System
                    </div>
                    <div className="navbar-user">
                        <span style={{ color: '#1f2937' }}>Welcome, {userName}!</span>
                        <button onClick={logout} className="logout-btn">
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </nav>

                {/* Header */}
                <header className="header-section">
                    {/* FIX: Use dynamic name here */}
                    <h1>Welcome back, {userName}!</h1>
                    <p>Your impact on the community and personal blood stats. Role: {userRole}</p>
                    <div className="quick-actions-container">
                        {/* Functional Quick Actions */}
                        <QuickAction icon={<Droplet size={20} />} label="Request Blood" onClick={() => navigate('/requests')} />
                        <QuickAction icon={<MapPin size={20} />} label="Find Centers" onClick={() => navigate('/centers')} />
                        <QuickAction icon={<User size={20} />} label="View Profile" onClick={() => navigate('/profile')} />
                    </div>
                </header>

                {/* Main Stats Grid */}
                <div className="stats-grid">
                    <StatCard icon={<Users size={24} />} title="Total Donors" value={stats.totalDonors} description="Active members in the community." />
                    <StatCard icon={<Heart size={24} />} title="Total Donations" value={stats.totalDonations} description="Total donations recorded to date." />
                    <StatCard icon={<Droplet size={24} />} title="Pints Collected" value={stats.pintsCollected} unit=" L" description="Total blood volume collected in liters." />
                </div>

                {/* Secondary Grid: FINAL LAYOUT FIX & ENHANCEMENTS */}
                <div className="main-grid">
                    
                    {/* Eligibility and Profile Summary - COMBINED INTO A SINGLE COLUMN */}
                    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', gap: '1.5rem' }}>
                        
                        {/* 1. Next Donation Eligibility (VISUAL ENHANCEMENT) */}
                        <Card className="eligibility-card">
                            <div className="eligibility-header">
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Clock size={20} color="#e30000" /> Next Donation Eligibility
                                </h2>
                            </div>
                            <div className="eligibility-content">
                                {/* Circular Progress Bar */}
                                <div className="progress-circle">
                                    <svg width="100%" height="100%" viewBox="0 0 160 160">
                                        <circle
                                            className="progress-ring__circle"
                                            stroke="#f3f4f6"
                                            strokeWidth="10"
                                            fill="transparent"
                                            r="70"
                                            cx="80"
                                            cy="80"
                                        />
                                        <circle
                                            className="progress-ring__circle"
                                            stroke={isEligible ? '#10b981' : '#f59e0b'}
                                            strokeWidth="10"
                                            fill="transparent"
                                            r="70"
                                            cx="80"
                                            cy="80"
                                            style={{
                                                strokeDasharray: 440,
                                                strokeDashoffset: getCircleOffset(nextDonationInfo.percent),
                                            }}
                                        />
                                    </svg>
                                    <span className="progress-text">{nextDonationInfo.percent}%</span>
                                </div>

                                {/* Eligibility Text */}
                                <div style={{ flexGrow: 1 }}>
                                    <div className={`status-badge ${isEligible ? 'status-ready' : 'status-scheduled'}`} style={{ marginBottom: '10px' }}>
                                        {isEligible ? <CheckCircle size={20} style={{marginRight: '8px'}} /> : <AlertCircle size={20} style={{marginRight: '8px'}} />}
                                        {isEligible ? 'ELIGIBLE' : 'IN PROGRESS'}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>
                                        {nextDonationInfo.text}
                                    </p>
                                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '5px' }}>
                                        Last Donated: {new Date('2025-05-15').toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* 2. My Profile Summary (DYNAMIC DETAILS) */}
                        <Card>
                            <div className="card-header">
                                <User size={20} color="#e30000" />
                                <h2>My Profile Summary</h2>
                                <span className="recency-badge">TOP DONOR</span>
                            </div>
                            <ul className="profile-info-list">
                                <li>
                                    <span className="label">Name</span>
                                    <span>{user?.name || 'N/A'}</span> {/* FIX: Dynamic Name */}
                                </li>
                                <li>
                                    <span className="label">Email</span>
                                    <span>{user?.email || 'N/A'}</span> {/* FIX: Dynamic Email */}
                                </li>
                                <li>
                                    <span className="label"><Droplet size={14} style={{ marginRight: '4px', color: '#e30000' }}/>Blood Group</span>
                                    <span>{userBloodGroup}</span> {/* FIX: Dynamic Blood Group */}
                                </li>
                                <li>
                                    <span className="label">Role</span>
                                    <span style={{ fontWeight: 700, color: userRole === 'Admin' ? '#e30000' : '#10b981' }}>{userRole}</span>
                                </li>
                            </ul>
                        </Card>
                    </div>

                    {/* Right Column: Recent Donations */}
                    <Card style={{ marginBottom: '3rem' }}>
                        <div className="card-header">
                            <Heart size={20} color="#e30000" />
                            <h2>Recent Donation History</h2>
                        </div>
                        {recentDonations.length > 0 ? (
                            <ul className="history-list">
                                {recentDonations.map(donation => (
                                    <li key={donation.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dotted #f3f4f6' }}>
                                        <span style={{ fontWeight: 600 }}>{new Date(donation.date).toLocaleDateString()}</span>
                                        <span style={{ color: '#6b7280' }}>{donation.center}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#888' }}>
                                No recent donation history found.
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* --- FOOTER --- */}
            <footer className="footer">
                <div className="footer-grid">
                    <div className="footer-section">
                        <h4><Droplet size={20} style={{ marginRight: '5px' }}/> Blood Bank System</h4>
                        <p style={{ color: '#9ca3af' }}>Saving lives through community and technology. Built on MERN stack.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/requests'); }}>Request Blood</a></li>
                            <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/inventory'); }}>View Inventory</a
></li>
                            <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/centers'); }}>Find Centers</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>About Us</h4>
                        <ul>
                            <li><a href="#">Our Mission</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Contact</h4>
                        <ul>
                            <li><Phone size={14} style={{ marginRight: '8px' }}/> +91 99887 76655</li>
                            <li><Mail size={14} style={{ marginRight: '8px' }}/> support@bloodbank.org</li>
                            <li><MapPin size={14} style={{ marginRight: '8px' }}/> 123 Health Ave, City</li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DashboardPage;