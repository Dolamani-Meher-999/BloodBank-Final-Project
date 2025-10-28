
// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { LogOut, Droplet, Users, Heart, MapPin, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';
// import * as THREE from 'three';
// import { useAuth } from '../context/AuthContext';
// import { dataService } from '../services/dataService'; // Assuming dataService is in ../services/

// // --- Component Helpers ---

// // Helper component for the solid white card look
// const Card = ({ children, className = '' }) => (
//     <div className={`card ${className}`}>
//         {children}
//     </div>
// );

// // Helper component for the statistic blocks
// const StatCard = ({ icon, title, value, unit, description, colorClass }) => (
//     <Card className={`stat-card ${colorClass}`}>
//         <div className="stat-icon-container">
//             {icon}
//         </div>
//         <p className="stat-title">{title}</p>
//         <h3 className="stat-value">{value}{unit}</h3>
//         <p className="stat-description">{description}</p>
//     </Card>
// );

// // --- Main Component ---

// const DashboardPage = () => {
//     // 1. Data and State Management
//     const { user, profile, logout } = useAuth();
//     const [stats, setStats] = useState({
//         totalDonors: 0,
//         totalDonations: 0,
//         pintsCollected: 0,
//     });
//     const [recentDonations, setRecentDonations] = useState([]);
//     const [nextDonationInfo, setNextDonationInfo] = useState('Checking eligibility...');
//     const [isLoading, setIsLoading] = useState(true);
//     const canvasRef = useRef(null);

//     // Mock data fetching function (replace with real dataService calls)
//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             if (!user) {
//                 setIsLoading(false);
//                 return;
//             }

//             try {
//                 // Mocking data for UI completion
//                 setStats({
//                     totalDonors: 42,
//                     totalDonations: 156,
//                     pintsCollected: 78, // in Liters
//                 });
//                 setRecentDonations([
//                     { id: 1, date: '2025-09-15', center: 'City General Hospital', status: 'Completed' },
//                     { id: 2, date: '2025-05-15', center: 'Main Blood Bank', status: 'Completed' },
//                     { id: 3, date: '2025-11-20', center: 'Community Drive', status: 'Scheduled' },
//                 ]);

//                 // Calculate next donation eligibility (Mock)
//                 const lastDonationDate = new Date('2025-05-15');
//                 const nextEligibleDate = new Date(lastDonationDate.setMonth(lastDonationDate.getMonth() + 3)); // 3 months
//                 const now = new Date();

//                 if (now > nextEligibleDate) {
//                     setNextDonationInfo('Ready! You are eligible to donate now.');
//                 } else {
//                     const diffTime = nextEligibleDate - now;
//                     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//                     setNextDonationInfo(`Eligible in ${diffDays} days.`);
//                 }

//             } catch (error) {
//                 console.error("Failed to fetch dashboard data:", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchDashboardData();
//     }, [user]);

//     // 2. Three.js Initialization for Background Effect (Remains the same)
//     useEffect(() => {
//         if (!canvasRef.current) return;

//         let scene, camera, renderer, particles;
//         const width = window.innerWidth;
//         const height = window.innerHeight;

//         // Scene Setup
//         scene = new THREE.Scene();
//         camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//         camera.position.z = 5;

//         renderer = new THREE.WebGLRenderer({
//             canvas: canvasRef.current,
//             alpha: true, 
//             antialias: true
//         });
//         renderer.setSize(width, height);
//         renderer.setPixelRatio(window.devicePixelRatio);

//         // Particle System (Creating the moving blood/smoke effect)
//         const geometry = new THREE.BufferGeometry();
//         const vertices = [];
//         const colors = [];

//         const numParticles = 1000;
//         const baseColor = new THREE.Color(0xFF0000); // Red color for blood theme

//         for (let i = 0; i < numParticles; i++) {
//             // Position randomly in a box
//             vertices.push(
//                 (Math.random() - 0.5) * 10,
//                 (Math.random() - 0.5) * 10,
//                 (Math.random() - 0.5) * 10
//             );
//             // Color with subtle variations
//             colors.push(
//                 baseColor.r + (Math.random() * 0.1 - 0.05),
//                 baseColor.g + (Math.random() * 0.1 - 0.05),
//                 baseColor.b + (Math.random() * 0.1 - 0.05)
//             );
//         }

//         geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
//         geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

//         const material = new THREE.PointsMaterial({
//             size: 0.05,
//             vertexColors: true,
//             transparent: true,
//             opacity: 0.8,
//             blending: THREE.AdditiveBlending,
//         });

//         particles = new THREE.Points(geometry, material);
//         scene.add(particles);

//         // Animation Loop
//         const animate = () => {
//             requestAnimationFrame(animate);

//             particles.rotation.y += 0.0005;
//             particles.rotation.x += 0.0002;

//             const positions = particles.geometry.attributes.position.array;
//             for (let i = 0; i < numParticles; i++) {
//                 positions[i * 3 + 1] += 0.001 + (Math.sin(Date.now() * 0.0005 + i) * 0.0005);
//                 if (positions[i * 3 + 1] > 5) {
//                     positions[i * 3 + 1] = -5;
//                 }
//             }
//             particles.geometry.attributes.position.needsUpdate = true;

//             renderer.render(scene, camera);
//         };

//         animate();

//         // Handle Window Resize
//         const handleResize = () => {
//             const newWidth = window.innerWidth;
//             const newHeight = window.innerHeight;
//             camera.aspect = newWidth / newHeight;
//             camera.updateProjectionMatrix();
//             renderer.setSize(newWidth, newHeight);
//         };

//         window.addEventListener('resize', handleResize);

//         // Cleanup
//         return () => {
//             window.removeEventListener('resize', handleResize);
//             renderer.dispose();
//         };
//     }, []);

//     // 3. Render Logic
//     const userName = profile?.name || 'Alex Johnson';
//     const userEmail = profile?.email || user?.email || 'user@example.com';
//     const userId = user?.uid || '68c5c24bda52f77be4ebc855';

//     // Mock data for Quick Actions (to link to other pages)
//     const QuickAction = ({ icon, label, className }) => (
//         <button className={`quick-action-btn ${className}`}>
//             {icon}
//             <span>{label}</span>
//         </button>
//     );

//     return (
//         <div className="dashboard-container">
//             {/* Three.js Canvas for Background Effect */}
//             <canvas ref={canvasRef} id="three-canvas"></canvas>

//             {/* Global CSS for Modern Look */}
//             <style jsx global>{`
//                 /* Global Reset and Font */
//                 @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

//                 body, html {
//                     margin: 0;
//                     padding: 0;
//                     font-family: 'Inter', sans-serif;
//                     background-color: #1a1a1a; /* Dark background for 3D effect */
//                     color: #1f2937; /* Default dark text color for white cards */
//                     -webkit-font-smoothing: antialiased;
//                     -moz-osx-font-smoothing: grayscale;
//                     overflow-x: hidden;
//                 }

//                 /* Dashboard Container and Canvas */
//                 .dashboard-container {
//                     min-height: 100vh;
//                     position: relative;
//                     padding-bottom: 4rem; 
//                 }

//                 #three-canvas {
//                     position: fixed;
//                     top: 0;
//                     left: 0;
//                     width: 100%;
//                     height: 100%;
//                     z-index: 0;
//                 }

//                 /* Main Content Wrapper */
//                 .content-wrapper {
//                     position: relative;
//                     z-index: 10;
//                     max-width: 1400px;
//                     margin: 0 auto;
//                     padding: 0 1.5rem;
//                 }

//                 /* General Card Style (SOLID WHITE) */
//                 .card {
//                     background-color: #FFFFFF; /* OPAQUE WHITE */
//                     backdrop-filter: none; /* BLUR REMOVED */
//                     border-radius: 1.25rem;
//                     padding: 1.5rem;
//                     border: 1px solid #e5e7eb;
//                     box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15); /* Soft shadow */
//                     transition: transform 0.3s ease;
//                 }
                
//                 .card:hover {
//                     transform: translateY(-5px);
//                 }

//                 /* Navbar Styles (Updated for white background context) */
//                 .navbar {
//                     background-color: #FFFFFF;
//                     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//                     padding: 1rem 1.5rem;
//                     border-radius: 0.75rem;
//                     margin: 1.5rem auto;
//                     display: flex;
//                     justify-content: space-between;
//                     align-items: center;
//                     border: 1px solid #e5e7eb;
//                 }

//                 .navbar-logo {
//                     display: flex;
//                     align-items: center;
//                     gap: 0.75rem;
//                     font-size: 1.5rem;
//                     font-weight: 700;
//                     color: #1f2937; /* Dark text */
//                 }

//                 .navbar-user {
//                     display: flex;
//                     align-items: center;
//                     gap: 1.5rem;
//                 }

//                 .logout-btn {
//                     display: flex;
//                     align-items: center;
//                     gap: 0.5rem;
//                     background-color: #e30000;
//                     color: white;
//                     padding: 0.5rem 1rem;
//                     border-radius: 0.5rem;
//                     font-weight: 500;
//                     font-size: 0.875rem;
//                     border: none;
//                     cursor: pointer;
//                     transition: background-color 0.2s, transform 0.2s;
//                     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//                 }

//                 .logout-btn:hover {
//                     background-color: #b00000;
//                     transform: translateY(-2px);
//                 }

//                 /* Header Section */
//                 .header-section {
//                     margin-top: 2rem;
//                     margin-bottom: 2rem;
//                 }

//                 .header-section h1 {
//                     font-size: 2.5rem;
//                     font-weight: 800;
//                     color: #fff; /* White text looks better against the dark 3D background */
//                     margin-bottom: 0.5rem;
//                     text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
//                 }

//                 .header-section p {
//                     font-size: 1.1rem;
//                     color: #b0b0b0; /* Light gray text */
//                 }
                
//                 /* Quick Actions */
//                 .quick-actions-container {
//                     display: flex;
//                     gap: 1rem;
//                     margin-top: 1.5rem;
//                     flex-wrap: wrap;
//                 }

//                 .quick-action-btn {
//                     background-color: #f3f4f6; /* Very light gray button background */
//                     color: #1f2937;
//                     padding: 0.75rem 1.5rem;
//                     border-radius: 0.75rem;
//                     border: none;
//                     font-size: 1rem;
//                     font-weight: 600;
//                     cursor: pointer;
//                     display: flex;
//                     align-items: center;
//                     gap: 0.75rem;
//                     transition: background-color 0.2s;
//                     border: 1px solid #d1d5db;
//                 }

//                 .quick-action-btn:hover {
//                     background-color: #e5e7eb;
//                 }


//                 /* Grid Layout */
//                 .main-grid {
//                     display: grid;
//                     grid-template-columns: repeat(1, 1fr);
//                     gap: 1.5rem;
//                 }

//                 @media (min-width: 1024px) {
//                     .main-grid {
//                         grid-template-columns: 2fr 1fr;
//                     }
//                 }
                
//                 /* Stats Grid */
//                 .stats-grid {
//                     display: grid;
//                     grid-template-columns: repeat(1, 1fr);
//                     gap: 1.5rem;
//                     margin-bottom: 1.5rem;
//                 }

//                 @media (min-width: 768px) {
//                     .stats-grid {
//                         grid-template-columns: repeat(3, 1fr);
//                     }
//                 }

//                 /* Stat Card Specifics */
//                 .stat-icon-container {
//                     padding: 0.75rem;
//                     width: fit-content;
//                     border-radius: 50%;
//                     margin-bottom: 1rem;
//                     background-color: #fee2e2; /* Light red background */
//                     color: #e30000;
//                 }
                
//                 .stat-title {
//                     font-size: 0.9rem;
//                     font-weight: 500;
//                     color: #6b7280;
//                 }
                
//                 .stat-value {
//                     font-size: 2.25rem;
//                     font-weight: 800;
//                     color: #e30000; /* Red emphasis */
//                     margin: 0.25rem 0 0.5rem;
//                 }
                
//                 .stat-description {
//                     font-size: 0.8rem;
//                     color: #9ca3af;
//                 }

//                 /* Card Header */
//                 .card-header {
//                     display: flex;
//                     align-items: center;
//                     gap: 1rem;
//                     margin-bottom: 1.5rem;
//                     padding-bottom: 0.75rem;
//                     border-bottom: 1px solid #e5e7eb;
//                 }

//                 .card-header h2 {
//                     font-size: 1.25rem;
//                     font-weight: 700;
//                     color: #1f2937;
//                 }
                
//                 /* Eligibility Status */
//                 .status-ready {
//                     background-color: #10b981; /* Green for ready */
//                     color: #fff;
//                     padding: 0.5rem 1rem;
//                     border-radius: 0.75rem;
//                     font-size: 1rem;
//                     font-weight: 700;
//                     text-align: center;
//                     margin-top: 1rem;
//                     box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
//                 }

//                 .status-scheduled {
//                     background-color: #f59e0b; /* Orange for scheduled */
//                     color: #fff;
//                     padding: 0.5rem 1rem;
//                     border-radius: 0.75rem;
//                     font-size: 1rem;
//                     font-weight: 700;
//                     text-align: center;
//                     margin-top: 1rem;
//                     box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3);
//                 }
//             `}</style>

//             {/* Content Overlay */}
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
//                     <p>Your impact on the community and personal blood stats.</p>
//                     <div className="quick-actions-container">
//                         <QuickAction icon={<Droplet size={20} />} label="Request Blood" className="text-red-400" />
//                         <QuickAction icon={<MapPin size={20} />} label="Find Centers" className="text-blue-400" />
//                         <QuickAction icon={<User size={20} />} label="View Profile" className="text-green-400" />
//                     </div>
//                 </header>

//                 {/* Main Stats Grid */}
//                 <div className="stats-grid">
//                     <StatCard
//                         icon={<Users size={24} />}
//                         title="Total Donors"
//                         value={isLoading ? '...' : stats.totalDonors}
//                         unit=""
//                         description="Active members in the community."
//                         colorClass=""
//                     />
//                     <StatCard
//                         icon={<Heart size={24} />}
//                         title="Total Donations"
//                         value={isLoading ? '...' : stats.totalDonations}
//                         unit=""
//                         description="Total donations recorded to date."
//                         colorClass=""
//                     />
//                     <StatCard
//                         icon={<Droplet size={24} />}
//                         title="Pints Collected"
//                         value={isLoading ? '...' : stats.pintsCollected}
//                         unit=" L"
//                         description="Total blood volume collected in liters."
//                         colorClass=""
//                     />
//                 </div>

//                 {/* Secondary Grid (Profile / History / Eligibility) */}
//                 <div className="main-grid">
//                     {/* Left Column: Profile and History */}
//                     <div className="left-column" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                        
//                         {/* 1. Next Donation Eligibility */}
//                         <Card className="eligibility-card">
//                             <div className="card-header">
//                                 <Clock size={20} color="#e30000" />
//                                 <h2>Next Donation Eligibility</h2>
//                             </div>
//                             <div className={`status-badge ${nextDonationInfo.includes('Ready') ? 'status-ready' : 'status-scheduled'}`}>
//                                 {nextDonationInfo.includes('Ready') ? <CheckCircle size={20} style={{marginRight: '8px'}} /> : <AlertCircle size={20} style={{marginRight: '8px'}} />}
//                                 {nextDonationInfo}
//                             </div>
//                         </Card>

//                         {/* 2. My Profile Summary */}
//                         <Card>
//                             <div className="card-header">
//                                 <User size={20} color="#e30000" />
//                                 <h2>My Profile Summary</h2>
//                             </div>
//                             <ul className="profile-info-list">
//                                 <li>
//                                     <span className="label">Name</span>
//                                     <span>{userName}</span>
//                                 </li>
//                                 <li>
//                                     <span className="label">Email</span>
//                                     <span>{userEmail}</span>
//                                 </li>
//                                 <li>
//                                     <span className="label"><Droplet size={14} style={{ marginRight: '4px', color: '#e30000' }}/>Blood Group</span>
//                                     <span>{profile?.bloodGroup || 'O+'}</span>
//                                 </li>
//                                 <li>
//                                     <span className="label">User ID</span>
//                                     <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{userId.substring(0, 10)}...</span>
//                                 </li>
//                             </ul>
//                         </Card>

//                     </div>

//                     {/* Right Column: Recent Donations */}
//                     <div className="right-column">
//                         <Card style={{ height: '100%' }}>
//                             <div className="card-header">
//                                 <Heart size={20} color="#e30000" />
//                                 <h2>Recent Donation History</h2>
//                             </div>
//                             {recentDonations.length > 0 ? (
//                                 <ul className="history-list">
//                                     {recentDonations.slice(0, 5).map(donation => (
//                                         <li key={donation.id} className="history-item">
//                                             <div className="history-item-details">
//                                                 <span className="history-item-date">{new Date(donation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
//                                                 <span className="history-item-center"><MapPin size={12} style={{ marginRight: '4px', color: '#6b7280' }}/> {donation.center}</span>
//                                             </div>
//                                             <span className={`status-badge ${donation.status === 'Completed' ? 'status-completed' : 'status-scheduled'}`}>
//                                                 {donation.status}
//                                             </span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             ) : (
//                                 <div style={{ textAlign: 'center', padding: '2rem 0', color: '#888' }}>
//                                     No recent donation history found.
//                                 </div>
//                             )}
//                         </Card>
//                     </div>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default DashboardPage;

import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Droplet, Users, Heart, MapPin, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <-- RE-IMPORTED
import * as THREE from 'three'; // <-- Re-imported globally for stability
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService'; 

// --- Component Helpers ---

// Helper component for the solid white card look
const Card = ({ children, className = '' }) => (
    <div className={`card ${className}`}>
        {children}
    </div>
);

// Helper component for the statistic blocks
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
    const { user, profile, logout } = useAuth();
    const navigate = useNavigate(); // <-- INITIALIZED
    
    const [stats, setStats] = useState({ totalDonors: 0, totalDonations: 0, pintsCollected: 0 });
    const [recentDonations, setRecentDonations] = useState([]);
    const [nextDonationInfo, setNextDonationInfo] = useState('Checking eligibility...');
    const [isLoading, setIsLoading] = useState(true);
    const canvasRef = useRef(null);

    // --- Data Fetching Logic (Remains the same) ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }
            // MOCK DATA SETUP
            setStats({ totalDonors: 1420, totalDonations: 856, pintsCollected: 428 });
            setRecentDonations([
                { id: 1, date: '2025-09-15', center: 'City General Hospital', status: 'Completed' },
                { id: 2, date: '2025-05-15', center: 'Main Blood Bank', status: 'Completed' },
                { id: 3, date: '2025-11-20', center: 'Community Drive', status: 'Scheduled' },
            ]);
            setNextDonationInfo('Ready! You are eligible to donate now.');
            setIsLoading(false);
        };
        fetchDashboardData();
    }, [user]);

    // --- Three.js Initialization (Restored Safely) ---
    useEffect(() => {
        if (!canvasRef.current || typeof THREE === 'undefined') {
             console.error("Three.js not available globally or canvas not found.");
             return;
        }

        let scene, camera, renderer, particles;
        const width = window.innerWidth;
        const height = window.innerHeight;
        let animationFrameId;

        const init = () => {
            try {
                // Scene Setup
                scene = new THREE.Scene();
                camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
                camera.position.z = 5;

                renderer = new THREE.WebGLRenderer({
                    canvas: canvasRef.current,
                    alpha: true, 
                    antialias: true
                });
                renderer.setSize(width, height);
                renderer.setPixelRatio(window.devicePixelRatio);

                // Particle System (Blood/Smoke Effect)
                const geometry = new THREE.BufferGeometry();
                const vertices = [];
                const numParticles = 1000;
                const baseColor = new THREE.Color(0xFF0000); 

                for (let i = 0; i < numParticles; i++) {
                    vertices.push((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
                }

                geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                
                const material = new THREE.PointsMaterial({
                    size: 0.05,
                    color: baseColor,
                    transparent: true,
                    opacity: 0.7,
                    blending: THREE.AdditiveBlending,
                });

                particles = new THREE.Points(geometry, material);
                scene.add(particles);

                // Start Animation Loop
                animate();

            } catch (error) {
                console.error("Three.js background effect failed to initialize. Dashboard running without 3D:", error);
            }
        };

        // Animation Loop
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            if (particles && renderer && scene && camera) {
                particles.rotation.y += 0.0005;
                particles.rotation.x += 0.0002;

                const positions = particles.geometry.attributes.position.array;
                const numParticles = positions.length / 3;

                for (let i = 0; i < numParticles; i++) {
                    positions[i * 3 + 1] += 0.001; 
                    if (positions[i * 3 + 1] > 5) {
                        positions[i * 3 + 1] = -5;
                    }
                }
                particles.geometry.attributes.position.needsUpdate = true;
                renderer.render(scene, camera);
            }
        };

        // Handle Window Resize
        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            if (camera) camera.aspect = newWidth / newHeight;
            if (camera) camera.updateProjectionMatrix();
            if (renderer) renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);
        init(); // Initialize the scene

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (renderer) renderer.dispose();
            if (particles && scene) scene.remove(particles);
        };
    }, []);


    // 3. Render Logic
    const userName = profile?.name || 'Alex Johnson';

    // Quick Action Helper Component with onClick prop
    const QuickAction = ({ icon, label, onClick }) => ( 
        <button className={`quick-action-btn`} onClick={onClick}>
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="dashboard-container">
             {/* Include Three.js library globally here for stability if not installed via NPM */}
             <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

            {/* Three.js Canvas for Background Effect */}
            <canvas ref={canvasRef} id="three-canvas"></canvas>

            {/* Global CSS for Modern Look */}
            <style jsx global>{`
                /* Global Reset and Font */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

                body, html {
                    margin: 0;
                    padding: 0;
                    font-family: 'Inter', sans-serif;
                    background-color: #1a1a1a; /* Dark background for 3D effect */
                    color: #1f2937; /* Default dark text color for white cards */
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    overflow-x: hidden;
                }

                /* Dashboard Container and Canvas */
                .dashboard-container {
                    min-height: 100vh;
                    position: relative;
                    padding-bottom: 4rem; 
                }

                #three-canvas {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                }

                /* Main Content Wrapper */
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
                    backdrop-filter: none; /* BLUR REMOVED */
                    border-radius: 1.25rem;
                    padding: 1.5rem;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15); /* Soft shadow */
                    transition: transform 0.3s ease;
                }
                
                .card:hover {
                    transform: translateY(-5px);
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

                .navbar-user {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
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
                    margin-top: 2rem;
                    margin-bottom: 2rem;
                }

                .header-section h1 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #fff; /* White text looks better against the dark 3D background */
                    margin-bottom: 0.5rem;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                }

                .header-section p {
                    font-size: 1.1rem;
                    color: #b0b0b0; /* Light gray text */
                }
                
                /* Quick Actions */
                .quick-actions-container {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.5rem;
                    flex-wrap: wrap;
                }

                .quick-action-btn {
                    background-color: #f3f4f6; /* Very light gray button background */
                    color: #1f2937;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.75rem;
                    border: none;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    transition: background-color 0.2s;
                    border: 1px solid #d1d5db;
                }

                .quick-action-btn:hover {
                    background-color: #e5e7eb;
                }


                /* Grid Layout */
                .main-grid {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 1.5rem;
                }

                @media (min-width: 1024px) {
                    .main-grid {
                        grid-template-columns: 2fr 1fr;
                    }
                }
                
                /* Stats Grid */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                }

                @media (min-width: 768px) {
                    .stats-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                /* Stat Card Specifics */
                .stat-icon-container {
                    padding: 0.75rem;
                    width: fit-content;
                    border-radius: 50%;
                    background-color: #fee2e2; /* Light red background */
                    color: #e30000;
                }
                
                .stat-title {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #6b7280;
                }
                
                .stat-value {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: #e30000; /* Red emphasis */
                    margin: 0.25rem 0 0.5rem;
                }
                
                .stat-description {
                    font-size: 0.8rem;
                    color: #9ca3af;
                }

                /* Card Header */
                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid #e5e7eb;
                }

                .card-header h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1f2937;
                }
                
                /* Eligibility Status */
                .status-ready {
                    background-color: #10b981; /* Green for ready */
                    color: #fff;
                    padding: 0.5rem 1rem;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    font-weight: 700;
                    text-align: center;
                    margin-top: 1rem;
                    box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
                }

                .status-scheduled {
                    background-color: #f59e0b; /* Orange for scheduled */
                    color: #fff;
                    padding: 0.5rem 1rem;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    font-weight: 700;
                    text-align: center;
                    margin-top: 1rem;
                    box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3);
                }
            `}</style>

            {/* Content Overlay */}
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
                    <h1>Welcome back, {userName}!</h1>
                    <p>Your impact on the community and personal blood stats.</p>
                    <div className="quick-actions-container">
                        {/* 1. Request Blood Button */}
                        <QuickAction 
                            icon={<Droplet size={20} />} 
                            label="Request Blood" 
                            onClick={() => navigate('/requests')} 
                        />
                        {/* 2. Find Centers Button */}
                        <QuickAction 
                            icon={<MapPin size={20} />} 
                            label="Find Centers" 
                            onClick={() => navigate('/centers')} 
                        />
                        {/* 3. View Profile Button */}
                        <QuickAction 
                            icon={<User size={20} />} 
                            label="View Profile" 
                            onClick={() => navigate('/profile')} 
                        />
                    </div>
                </header>

                {/* Main Stats Grid */}
                <div className="stats-grid">
                    <StatCard
                        icon={<Users size={24} />}
                        title="Total Donors"
                        value={isLoading ? '...' : stats.totalDonors}
                        unit=""
                        description="Active members in the community."
                    />
                    <StatCard
                        icon={<Heart size={24} />}
                        title="Total Donations"
                        value={isLoading ? '...' : stats.totalDonations}
                        unit=""
                        description="Total donations recorded to date."
                    />
                    <StatCard
                        icon={<Droplet size={24} />}
                        title="Pints Collected"
                        value={isLoading ? '...' : stats.pintsCollected}
                        unit=" L"
                        description="Total blood volume collected in liters."
                    />
                </div>

                {/* Secondary Grid (Profile / History / Eligibility) */}
                <div className="main-grid">
                    {/* Left Column: Profile and History */}
                    <div className="left-column" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                        
                        {/* 1. Next Donation Eligibility */}
                        <Card className="eligibility-card">
                            <div className="card-header">
                                <Clock size={20} color="#e30000" />
                                <h2>Next Donation Eligibility</h2>
                            </div>
                            <div className={`status-badge ${nextDonationInfo.includes('Ready') ? 'status-ready' : 'status-scheduled'}`}>
                                {nextDonationInfo.includes('Ready') ? <CheckCircle size={20} style={{marginRight: '8px'}} /> : <AlertCircle size={20} style={{marginRight: '8px'}} />}
                                {nextDonationInfo}
                            </div>
                        </Card>

                        {/* 2. My Profile Summary */}
                        <Card>
                            <div className="card-header">
                                <User size={20} color="#e30000" />
                                <h2>My Profile Summary</h2>
                            </div>
                            <ul className="profile-info-list">
                                <li>
                                    <span className="label">Name</span>
                                    <span>{userName}</span>
                                </li>
                                <li>
                                    <span className="label">Email</span>
                                    <span>{user?.email || 'N/A'}</span>
                                </li>
                                <li>
                                    <span className="label"><Droplet size={14} style={{ marginRight: '4px', color: '#e30000' }}/>Blood Group</span>
                                    <span>{profile?.bloodGroup || 'O+'}</span>
                                </li>
                                <li>
                                    <span className="label">User ID</span>
                                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{user?.uid?.substring(0, 10) || 'N/A'}...</span>
                                </li>
                            </ul>
                        </Card>

                    </div>

                    {/* Right Column: Recent Donations */}
                    <div className="right-column">
                        <Card style={{ height: '100%' }}>
                            <div className="card-header">
                                <Heart size={20} color="#e30000" />
                                <h2>Recent Donation History</h2>
                            </div>
                            {recentDonations.length > 0 ? (
                                <ul className="history-list">
                                    {recentDonations.slice(0, 5).map(donation => (
                                        <li key={donation.id} className="history-item">
                                            <div className="history-item-details">
                                                <span className="history-item-date">{new Date(donation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                <span className="history-item-center"><MapPin size={12} style={{ marginRight: '4px', color: '#6b7280' }}/> {donation.center}</span>
                                            </div>
                                            <span className={`status-badge ${donation.status === 'Completed' ? 'status-completed' : 'status-scheduled'}`}>
                                                {donation.status}
                                            </span>
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

            </div>
        </div>
    );
};

export default DashboardPage;