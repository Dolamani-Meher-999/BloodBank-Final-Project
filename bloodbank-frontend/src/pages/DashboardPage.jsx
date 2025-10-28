import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LogOut, Droplet, Users, Heart, MapPin, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import * as THREE from 'three';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService'; // Assuming dataService is in ../services/

// --- Component Helpers ---

// Helper component for the translucent, blurred card look
const Card = ({ children, className = '' }) => (
    <div className={`card ${className}`}>
        {children}
    </div>
);

// Helper component for the statistic blocks
const StatCard = ({ icon, title, value, unit, description, colorClass }) => (
    <Card className={`stat-card ${colorClass}`}>
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
    // 1. Data and State Management
    const { user, profile, logout } = useAuth();
    const [stats, setStats] = useState({
        totalDonors: 0,
        totalDonations: 0,
        pintsCollected: 0,
    });
    const [recentDonations, setRecentDonations] = useState([]);
    const [nextDonationInfo, setNextDonationInfo] = useState('Checking eligibility...');
    const [isLoading, setIsLoading] = useState(true);
    const canvasRef = useRef(null);

    // Mock data fetching function (replace with real dataService calls)
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                // Fetch stats data
                // const statsResponse = await dataService.getDashboardStats();
                // setStats(statsResponse.data);

                // Fetch recent donations
                // const donationsResponse = await dataService.getRecentDonations(user.id);
                // setRecentDonations(donationsResponse.data);

                // Mocking data for UI completion
                setStats({
                    totalDonors: 42,
                    totalDonations: 156,
                    pintsCollected: 78, // in Liters
                });
                setRecentDonations([
                    { id: 1, date: '2025-09-15', center: 'City General Hospital', status: 'Completed' },
                    { id: 2, date: '2025-05-15', center: 'Main Blood Bank', status: 'Completed' },
                    { id: 3, date: '2025-11-20', center: 'Community Drive', status: 'Scheduled' },
                ]);

                // Calculate next donation eligibility (Mock)
                const lastDonationDate = new Date('2025-05-15');
                const nextEligibleDate = new Date(lastDonationDate.setMonth(lastDonationDate.getMonth() + 3)); // 3 months
                const now = new Date();

                if (now > nextEligibleDate) {
                    setNextDonationInfo('Ready! You are eligible to donate now.');
                } else {
                    const diffTime = nextEligibleDate - now;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    setNextDonationInfo(`Eligible in ${diffDays} days.`);
                }

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    // 2. Three.js Initialization for Background Effect
    useEffect(() => {
        if (!canvasRef.current) return;

        let scene, camera, renderer, particles;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Scene Setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;

        renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true, // Transparent background
            antialias: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Particle System (Creating the moving blood/smoke effect)
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];

        const numParticles = 1000;
        const baseColor = new THREE.Color(0xFF0000); // Red color for blood theme

        for (let i = 0; i < numParticles; i++) {
            // Position randomly in a box
            vertices.push(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            // Color with subtle variations
            colors.push(
                baseColor.r + (Math.random() * 0.1 - 0.05),
                baseColor.g + (Math.random() * 0.1 - 0.05),
                baseColor.b + (Math.random() * 0.1 - 0.05)
            );
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate the particle field slowly
            particles.rotation.y += 0.0005;
            particles.rotation.x += 0.0002;

            // Move the particles (simple fluid-like translation)
            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < numParticles; i++) {
                // Simple upward drift with noise for turbulence
                positions[i * 3 + 1] += 0.001 + (Math.sin(Date.now() * 0.0005 + i) * 0.0005);

                // If a particle drifts too far up, wrap it to the bottom
                if (positions[i * 3 + 1] > 5) {
                    positions[i * 3 + 1] = -5;
                }
            }
            particles.geometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        };

        animate();

        // Handle Window Resize
        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
        };
    }, []);

    // 3. Render Logic
    const userName = profile?.name || 'Alex Johnson';
    const userEmail = profile?.email || user?.email || 'user@example.com';
    const userId = user?.uid || '68c5c24bda52f77be4ebc855';

    // Mock data for Quick Actions (to link to other pages)
    const QuickAction = ({ icon, label, className }) => (
        <button className={`quick-action-btn ${className}`}>
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="dashboard-container">
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
                    background-color: #1a1a1a; /* Dark background */
                    color: #e5e7eb;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    overflow-x: hidden;
                }

                /* Dashboard Container and Canvas */
                .dashboard-container {
                    min-height: 100vh;
                    position: relative;
                    padding-bottom: 4rem; /* For footer/spacing */
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

                /* Navbar Styles */
                .navbar {
                    background-color: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    padding: 1rem 1.5rem;
                    border-radius: 0.75rem;
                    margin: 1.5rem auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .navbar-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #fff;
                    text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
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
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .logout-btn:hover {
                    background-color: #b00000;
                    transform: translateY(-2px);
                }

                /* General Card Style (Translucent and Modern) */
                .card {
                    background-color: rgba(255, 255, 255, 0.08); /* Light, subtle background */
                    backdrop-filter: blur(10px);
                    border-radius: 1.25rem;
                    padding: 1.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                    transition: transform 0.3s ease;
                }
                
                .card:hover {
                    transform: translateY(-5px);
                }

                /* Header Section */
                .header-section {
                    margin-top: 2rem;
                    margin-bottom: 2rem;
                }

                .header-section h1 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #fff;
                    margin-bottom: 0.5rem;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                }

                .header-section p {
                    font-size: 1.1rem;
                    color: #b0b0b0;
                }
                
                /* Quick Actions */
                .quick-actions-container {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.5rem;
                    flex-wrap: wrap;
                }

                .quick-action-btn {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.75rem;
                    border: none;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    transition: background-color 0.2s, border-color 0.2s;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .quick-action-btn:hover {
                    background-color: rgba(255, 0, 0, 0.3);
                    border-color: #ff4d4d;
                }


                /* Grid Layout */
                .main-grid {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 1.5rem;
                }

                @media (min-width: 768px) {
                    .main-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .stats-grid {
                        grid-column: span 2;
                        grid-template-columns: repeat(3, 1fr);
                    }
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
                .stat-card {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                }

                .stat-icon-container {
                    padding: 0.75rem;
                    width: fit-content;
                    border-radius: 50%;
                    margin-bottom: 1rem;
                    background-color: rgba(255, 255, 255, 0.15);
                    color: #ff4d4d;
                }
                
                .stat-title {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #9ca3af;
                }
                
                .stat-value {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: #fff;
                    margin: 0.25rem 0 0.5rem;
                    text-shadow: 0 0 5px rgba(255, 0, 0, 0.2);
                }
                
                .stat-description {
                    font-size: 0.8rem;
                    color: #9ca3af;
                }

                /* Section Headers in Cards */
                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .card-header h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #fff;
                }
                
                /* Profile & Eligibility */
                .profile-info-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .profile-info-list li {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.75rem 0;
                    border-bottom: 1px dotted rgba(255, 255, 255, 0.1);
                    font-size: 0.95rem;
                    color: #ccc;
                }

                .profile-info-list li:last-child {
                    border-bottom: none;
                }

                .label {
                    font-weight: 600;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                /* Donation History */
                .history-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    max-height: 400px;
                    overflow-y: auto;
                }

                .history-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 0;
                    border-bottom: 1px dotted rgba(255, 255, 255, 0.1);
                }
                
                .history-item-details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .history-item-date {
                    font-weight: 600;
                    color: #fff;
                }

                .history-item-center {
                    font-size: 0.85rem;
                    color: #9ca3af;
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

                .status-completed {
                    background-color: #05966933; /* Green */
                    color: #10b981;
                }

                .status-scheduled {
                    background-color: #f59e0b33; /* Yellow */
                    color: #f59e0b;
                }
                
                .status-ready {
                    background-color: #ef4444; /* Red */
                    color: #fff;
                    padding: 0.5rem 1rem;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    font-weight: 700;
                    text-align: center;
                    margin-top: 1rem;
                }

                .eligibility-card .card-header {
                    margin-bottom: 0;
                }
            `}</style>

            {/* Content Overlay */}
            <div className="content-wrapper">
                {/* Navbar */}
                <nav className="navbar">
                    <div className="navbar-logo">
                        <Droplet color="#ff4d4d" size={32} />
                        Blood Bank System
                    </div>
                    <div className="navbar-user">
                        <span style={{ color: '#ccc' }}>Welcome, {userName}!</span>
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
                        <QuickAction icon={<Droplet size={20} />} label="Request Blood" className="text-red-400" />
                        <QuickAction icon={<MapPin size={20} />} label="Find Centers" className="text-blue-400" />
                        <QuickAction icon={<User size={20} />} label="View Profile" className="text-green-400" />
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
                        colorClass="bg-red-900/30"
                    />
                    <StatCard
                        icon={<Heart size={24} />}
                        title="Total Donations"
                        value={isLoading ? '...' : stats.totalDonations}
                        unit=""
                        description="Total donations recorded to date."
                        colorClass="bg-red-900/30"
                    />
                    <StatCard
                        icon={<Droplet size={24} />}
                        title="Pints Collected"
                        value={isLoading ? '...' : stats.pintsCollected}
                        unit=" L"
                        description="Total blood volume collected in liters."
                        colorClass="bg-red-900/30"
                    />
                </div>

                {/* Secondary Grid (Profile / History / Eligibility) */}
                <div className="main-grid">
                    {/* Left Column: Profile and History */}
                    <div className="left-column" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                        
                        {/* 1. Next Donation Eligibility */}
                        <Card className="eligibility-card">
                            <div className="card-header">
                                <Clock size={20} color="#ff4d4d" />
                                <h2>Next Donation Eligibility</h2>
                            </div>
                            <div className={`status-badge status-ready ${nextDonationInfo.includes('Ready') ? 'status-ready' : 'status-scheduled'}`}>
                                {nextDonationInfo.includes('Ready') ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                {nextDonationInfo}
                            </div>
                        </Card>

                        {/* 2. My Profile Summary */}
                        <Card>
                            <div className="card-header">
                                <User size={20} color="#ff4d4d" />
                                <h2>My Profile Summary</h2>
                            </div>
                            <ul className="profile-info-list">
                                <li>
                                    <span className="label">Name</span>
                                    <span>{userName}</span>
                                </li>
                                <li>
                                    <span className="label">Email</span>
                                    <span>{userEmail}</span>
                                </li>
                                <li>
                                    <span className="label"><Droplet size={14} style={{ marginRight: '4px' }}/>Blood Group</span>
                                    <span>{profile?.bloodGroup || 'O+'}</span>
                                </li>
                                <li>
                                    <span className="label">User ID</span>
                                    <span style={{ fontSize: '0.75rem' }}>{userId.substring(0, 10)}...</span>
                                </li>
                            </ul>
                        </Card>

                    </div>

                    {/* Right Column: Recent Donations */}
                    <div className="right-column">
                        <Card style={{ height: '100%' }}>
                            <div className="card-header">
                                <Heart size={20} color="#ff4d4d" />
                                <h2>Recent Donation History</h2>
                            </div>
                            {recentDonations.length > 0 ? (
                                <ul className="history-list">
                                    {recentDonations.slice(0, 5).map(donation => (
                                        <li key={donation.id} className="history-item">
                                            <div className="history-item-details">
                                                <span className="history-item-date">{new Date(donation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                <span className="history-item-center"><MapPin size={12} style={{ marginRight: '4px' }}/> {donation.center}</span>
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
