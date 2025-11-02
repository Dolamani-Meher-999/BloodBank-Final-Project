// import React, { useState, useEffect, useCallback } from 'react';
// import { LogOut, Droplet, MapPin, Clock, Phone, Mail, Search, Heart, Map, List, Globe, User, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { dataService } from '../services/dataService'; 

// // --- Component Helpers ---
// const Card = ({ children, className = '' }) => (
//     <div className={`card ${className}`}>
//         {children}
//     </div>
// );

// const SectionHeader = ({ icon, title, description }) => (
//     <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
//         <div className="p-2 rounded-lg bg-red-50 text-red-600 mr-4 icon-container" style={{backgroundColor: '#fee2e2', borderRadius: '0.75rem', padding: '0.75rem'}}>
//             {icon}
//         </div>
//         <div>
//             <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>{title}</h2>
//             {description && <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.25rem' }}>{description}</p>}
//         </div>
//     </div>
// );

// // New Helper: Status Badge for Centers
// const CenterStatusBadge = ({ status }) => {
//     const config = {
//         Active: { icon: <CheckCircle size={14} />, bg: '#d1fae5', color: '#059669', text: 'Active' },
//         Limited: { icon: <AlertTriangle size={14} />, bg: '#fef3c7', color: '#d97706', text: 'Limited Hours' },
//         Closed: { icon: <XCircle size={14} />, bg: '#fee2e2', color: '#dc2626', text: 'Temporarily Closed' },
//     };

//     const statusInfo = config[status] || config.default;

//     return (
//         <span style={{ 
//             backgroundColor: statusInfo.bg, 
//             color: statusInfo.color,
//             padding: '0.2rem 0.6rem',
//             borderRadius: '9999px',
//             fontSize: '0.75rem',
//             fontWeight: 600,
//             display: 'inline-flex',
//             alignItems: 'center',
//             gap: '0.25rem',
//             marginLeft: '10px'
//         }}>
//             {statusInfo.icon}
//             {statusInfo.text}
//         </span>
//     );
// };


// // --- MAIN CENTERS COMPONENT ---
// function CentersPage() {
//     const { user, logout } = useAuth();
//     const navigate = useNavigate();

//     const [centers, setCenters] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');

//     // --- Data Fetching: Fetch centers from API ---
//     const fetchCenters = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             // In a real app: const response = await dataService.getCenters(); 
//             // setCenters(response.centers || response); 

//             // IMPROVED DUMMY DATA FOR REALISM
//             setCenters([
//                 { id: 1, name: 'Red Cross Mega Center', address: '450 Health Parkway, Sector 12', phone: '022-3456-7890', hours: 'Mon-Sun, 8:00 - 20:00', email: 'redcross@bbank.org', status: 'Active' },
//                 { id: 2, name: 'City Trauma Unit Hospital', address: '789 Central Avenue, Downtown', phone: '022-1122-3344', hours: 'Emergency 24/7 (Appointments Only)', email: 'trauma@bbank.org', status: 'Limited' },
//                 { id: 3, name: 'Community Pop-up Drive', address: 'Local Church Hall, West Suburb', phone: '022-9988-7766', hours: 'Every Saturday, 10:00 - 16:00', email: 'popup@bbank.org', status: 'Limited' },
//                 { id: 4, name: 'Regional Mobile Unit A', address: 'Check Website for Current Location', phone: '022-5555-4444', hours: 'Varies Daily', email: 'mobileA@bbank.org', status: 'Active' },
//                 { id: 5, name: 'Main Blood Bank HQ', address: '100 Corporate Drive, Industrial Area', phone: '022-0000-1111', hours: 'Temporarily Unavailable', email: 'hq@bbank.org', status: 'Closed' },
//             ]);
//         } catch (err) {
//             console.error("Failed to fetch centers:", err);
//             setError(err.message || "Error: Failed to connect to /donors/centers endpoint."); 
//             // Keep mock data for UI test
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchCenters();
//     }, [fetchCenters]);

//     // FILTERING LOGIC (WORKING)
//     const filteredCenters = centers.filter(center => 
//         center.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         center.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         center.status?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const userName = user?.name || 'User';

//     return (
//         <div className="dashboard-container">
//             {/* Global CSS (Shared across pages) */}
//             <style jsx global>{`
//                 /* Global Reset and Font */
//                 body, html { background-color: #1a1a1a; color: #1f2937; }
//                 .dashboard-container { min-height: 100vh; position: relative; padding-bottom: 4rem; }
//                 .content-wrapper { position: relative; z-index: 10; max-width: 1400px; margin: 0 auto; padding: 0 1.5rem; }

//                 /* General Card Style */
//                 .card { background-color: #FFFFFF; border-radius: 1.25rem; padding: 1.5rem; border: 1px solid #e5e7eb; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15); transition: transform 0.3s ease; }
//                 .card:hover { transform: translateY(-3px); }

//                 /* Navbar Styles */
//                 .navbar { background-color: #FFFFFF; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); padding: 1rem 1.5rem; border-radius: 0.75rem; margin: 1.5rem auto; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e5e7eb; }
//                 .navbar-logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 700; color: #1f2937; }
//                 .logout-btn { background-color: #e30000; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500; font-size: 0.875rem; border: none; cursor: pointer; transition: background-color 0.2s, transform 0.2s; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
//                 .logout-btn:hover { background-color: #b00000; transform: translateY(-2px); }

//                 /* Header */
//                 .header-section { max-width: 1400px; margin: 0 auto 2rem; padding: 0 1.5rem; color: #fff; position: relative; z-index: 10; }
//                 .header-section h1 { font-size: 2.5rem; font-weight: 800; margin: 0 0 0.5rem 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); }
//                 .header-section p { font-size: 1.125rem; color: #b0b0b0; margin: 0; }

//                 /* Search Bar */
//                 .search-container {
//                     display: flex; align-items: center; background-color: #f3f4f6; border-radius: 0.75rem; 
//                     padding: 0.75rem 1rem; margin-bottom: 2rem; max-width: 600px; border: 1px solid #e5e7eb;
//                 }
//                 .search-input { border: none; outline: none; background: transparent; color: #1f2937; width: 100%; padding-left: 0.5rem; font-size: 1rem; }
//                 .search-input::placeholder { color: #9ca3af; }

//                 /* Center List */
//                 .center-list { list-style: none; padding: 0; margin: 0; }
//                 .center-item { display: flex; flex-direction: column; padding: 1.5rem 0; border-bottom: 1px solid #f3f4f6; }
//                 .center-item:last-child { border-bottom: none; }
//                 .center-name { font-size: 1.15rem; font-weight: 700; color: #e30000; margin-bottom: 0.5rem; display: flex; align-items: center; } /* Adjusted */
//                 .center-detail-row { display: flex; align-items: center; margin-bottom: 0.35rem; font-size: 0.9rem; color: #6b7280; }
//                 .center-detail-row svg { margin-right: 8px; color: #9ca3af; }

//                 /* Layout Grid */
//                 .centers-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
//                 @media (min-width: 1024px) {
//                     .centers-grid { grid-template-columns: 2fr 1fr; }
//                 }

//                 /* Map Placeholder */
//                 .map-placeholder { 
//                     background-color: #f3f4f6; 
//                     border-radius: 1rem; 
//                     height: 400px; 
//                     display: flex; 
//                     align-items: center; 
//                     justify-content: center; 
//                     color: #9ca3af; 
//                     font-weight: 600; 
//                     text-align: center;
//                 }
//             `}</style>

//             <div className="content-wrapper">
//                 {/* Navbar (Same as Dashboard) */}
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
//                 <header className="header-section" style={{ padding: '0 0' }}>
//                     <h1>Donation Center Directory</h1>
//                     <p>Find the nearest location to donate blood and view operating hours.</p>
//                 </header>

//                 <div className="centers-grid">
//                     {/* --- LEFT COLUMN: CENTER LIST --- */}
//                     <Card>
//                         <SectionHeader 
//                             icon={<List size={20} />} 
//                             title="Available Donation Centers" 
//                             description="Search by location, status, or name." 
//                         />
                        
//                         <div className search-container>
//                             <Search size={20} color="#6b7280" />
//                             <input
//                                 type="text"
//                                 placeholder="Search center, city, or status (e.g., Active)"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="search-input"
//                             />
//                         </div>

//                         {isLoading ? (
//                             <div style={{ textAlign: 'center', padding: '2rem 0', color: '#888' }}>Loading centers...</div>
//                         ) : error ? (
//                             <div style={{ color: '#e30000', padding: '1rem', border: '1px solid #e3000060', borderRadius: '0.5rem' }}>Error: {error}</div>
//                         ) : filteredCenters.length === 0 ? (
//                              <div style={{ textAlign: 'center', padding: '2rem 0', color: '#888' }}>No centers found matching your search.</div>
//                         ) : (
//                             <ul className="center-list">
//                                 {filteredCenters.map((center) => (
//                                     <li key={center.id} className="center-item">
//                                         <div className="center-name">
//                                             {center.name} 
//                                             <CenterStatusBadge status={center.status} />
//                                         </div>
//                                         <div className="center-detail-row">
//                                             <MapPin size={16} /> {center.address}
//                                         </div>
//                                         <div className="center-detail-row">
//                                             <Clock size={16} /> {center.hours}
//                                         </div>
//                                         <div className="center-detail-row">
//                                             <Phone size={16} /> {center.phone}
//                                         </div>
//                                         <a href={`mailto:${center.email}`} className="center-detail-row" style={{ color: '#e30000', marginTop: '0.5rem', fontWeight: 600 }}>
//                                             <Mail size={16} /> Contact Center
//                                         </a>
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </Card>

//                     {/* --- RIGHT COLUMN: MAP & GUIDANCE --- */}
//                     <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', gap: '2rem' }}>
                        
//                         {/* Map Placeholder */}
//                         <Card>
//                              <SectionHeader icon={<Map size={20} />} title="Map View" description="Interactive map integration goes here." />
//                             <div className="map-placeholder">
//                                 {filteredCenters.length > 0 ? (
//                                     <>
//                                         <MapPin size={32} style={{marginRight: '10px'}}/> 
//                                         Showing {filteredCenters.length} centers in the map area.
//                                         (Map API Integration Required)
//                                     </>
//                                 ) : (
//                                     "Map Placeholder"
//                                 )}
//                             </div>
//                         </Card>

//                         {/* Quick Guidance */}
//                         <Card>
//                             <SectionHeader icon={<Globe size={20} />} title="Before You Go" description="Essential tips for a successful donation." />
//                             <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#6b7280' }}>
//                                 <li style={{ marginBottom: '10px' }}>**Appointment Recommended:** Call ahead, especially for Limited hours.</li>
//                                 <li style={{ marginBottom: '10px' }}>Eat a full meal 2 hours before donation.</li>
//                                 <li style={{ marginBottom: '10px' }}>Drink plenty of water (at least 500ml).</li>
//                                 <li style={{ marginBottom: '10px' }}>Bring a photo ID and donor card (if applicable).</li>
//                             </ul>
//                         </Card>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default CentersPage;

import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, Droplet, MapPin, Clock, Phone, Mail, Search, Heart, Map, List, Globe, User, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService'; 

// --- Component Helpers ---
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

// Status Badge for Centers
const CenterStatusBadge = ({ status }) => {
    const config = {
        Active: { icon: <CheckCircle size={14} />, bg: '#d1fae5', color: '#059669', text: 'Active' },
        Limited: { icon: <AlertTriangle size={14} />, bg: '#fef3c7', color: '#d97706', text: 'Limited Hours' },
        Closed: { icon: <XCircle size={14} />, bg: '#fee2e2', color: '#dc2626', text: 'Temporarily Closed' },
    };

    const statusInfo = config[status] || config.default;

    return (
        <span style={{ 
            backgroundColor: statusInfo.bg, 
            color: statusInfo.color,
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginLeft: '10px'
        }}>
            {statusInfo.icon}
            {statusInfo.text}
        </span>
    );
};


// --- MAIN CENTERS COMPONENT ---
function CentersPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [centers, setCenters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // --- Data Fetching: Fetch centers from API ---
    const fetchCenters = useCallback(async () => {
        try {
            setIsLoading(true);
            // In a real app: const response = await dataService.getCenters(); 
            // setCenters(response.centers || response); 

            // IMPROVED DUMMY DATA FOR REALISM
            setCenters([
                { id: 1, name: 'Red Cross Mega Center', address: '450 Health Parkway, Sector 12', phone: '022-3456-7890', hours: 'Mon-Sun, 8:00 - 20:00', email: 'redcross@bbank.org', status: 'Active' },
                { id: 2, name: 'City Trauma Unit Hospital', address: '789 Central Avenue, Downtown', phone: '022-1122-3344', hours: 'Emergency 24/7 (Appointments Only)', email: 'trauma@bbank.org', status: 'Limited' },
                { id: 3, name: 'Community Pop-up Drive', address: 'Local Church Hall, West Suburb', phone: '022-9988-7766', hours: 'Every Saturday, 10:00 - 16:00', email: 'popup@bbank.org', status: 'Limited' },
                { id: 4, name: 'Regional Mobile Unit A', address: 'Check Website for Current Location', phone: '022-5555-4444', hours: 'Varies Daily', email: 'mobileA@bbank.org', status: 'Active' },
                { id: 5, name: 'Main Blood Bank HQ', address: '100 Corporate Drive, Industrial Area', phone: '022-0000-1111', hours: 'Temporarily Unavailable', email: 'hq@bbank.org', status: 'Closed' },
            ]);
        } catch (err) {
            console.error("Failed to fetch centers:", err);
            setError(err.message || "Error: Failed to connect to /donors/centers endpoint."); 
            // Keep mock data for UI test
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCenters();
    }, [fetchCenters]);

    // FILTERING LOGIC (WORKING)
    const filteredCenters = centers.filter(center => {
        const query = searchTerm.toLowerCase();
        return (
            center.name?.toLowerCase().includes(query) ||
            center.address?.toLowerCase().includes(query) ||
            center.status?.toLowerCase().includes(query) ||
            center.hours?.toLowerCase().includes(query)
        );
    });

    const userName = user?.name || 'User';

    return (
        <div className="dashboard-container">
            {/* Global CSS (Shared across pages) */}
            <style jsx global>{`
                /* Global Reset and Font */
                body, html { background-color: #1a1a1a; color: #1f2937; }
                .dashboard-container { min-height: 100vh; position: relative; padding-bottom: 4rem; }
                .content-wrapper { position: relative; z-index: 10; max-width: 1400px; margin: 0 auto; padding: 0 1.5rem; }

                /* General Card Style */
                .card { background-color: #FFFFFF; border-radius: 1.25rem; padding: 1.5rem; border: 1px solid #e5e7eb; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15); transition: transform 0.3s ease; }
                .card:hover { transform: translateY(-3px); }

                /* Navbar Styles */
                .navbar { background-color: #FFFFFF; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); padding: 1rem 1.5rem; border-radius: 0.75rem; margin: 1.5rem auto; display: flex; justify-content: space-between; align-items: center; border: 1px solid #e5e7eb; }
                .navbar-logo { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 700; color: #1f2937; }
                .logout-btn { background-color: #e30000; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500; font-size: 0.875rem; border: none; cursor: pointer; transition: background-color 0.2s, transform 0.2s; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
                .logout-btn:hover { background-color: #b00000; transform: translateY(-2px); }

                /* Header */
                .header-section { max-width: 1400px; margin: 0 auto 2rem; padding: 0 1.5rem; color: #fff; position: relative; z-index: 10; }
                .header-section h1 { font-size: 2.5rem; font-weight: 800; margin: 0 0 0.5rem 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); }
                .header-section p { font-size: 1.125rem; color: #b0b0b0; margin: 0; }

                /* Search Bar (Updated Styling) */
                .search-container {
                    display: flex; align-items: center; background-color: #f9fafb; border-radius: 0.75rem; 
                    padding: 0.5rem 1rem; margin-bottom: 2rem; max-width: 600px; border: 2px solid transparent; /* Neutral state */
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* Subtle shadow */
                    transition: all 0.2s;
                }
                .search-container:focus-within {
                    border-color: #e30000; /* Red border on focus */
                    box-shadow: 0 0 0 1px #e30000;
                }
                .search-input { border: none; outline: none; background: transparent; color: #1f2937; width: 100%; padding-left: 0.5rem; font-size: 1rem; }
                .search-input::placeholder { color: #9ca3af; }

                /* Center List */
                .center-list { list-style: none; padding: 0; margin: 0; }
                .center-item { display: flex; flex-direction: column; padding: 1.5rem 0; border-bottom: 1px solid #f3f4f6; }
                .center-item:last-child { border-bottom: none; }
                .center-name { font-size: 1.15rem; font-weight: 700; color: #e30000; margin-bottom: 0.5rem; display: flex; align-items: center; } 
                .center-detail-row { display: flex; align-items: center; margin-bottom: 0.35rem; font-size: 0.9rem; color: #6b7280; }
                .center-detail-row svg { margin-right: 8px; color: #9ca3af; }

                /* Layout Grid */
                .centers-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
                @media (min-width: 1024px) {
                    .centers-grid { grid-template-columns: 2fr 1fr; }
                }

                /* Map Placeholder */
                .map-placeholder { 
                    background-color: #f3f4f6; border-radius: 1rem; height: 400px; display: flex; 
                    align-items: center; justify-content: center; color: #9ca3af; font-weight: 600; text-align: center;
                }
            `}</style>

            <div className="content-wrapper">
                {/* Navbar (Same as Dashboard) */}
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
                <header className="header-section" style={{ padding: '0 0' }}>
                    <h1>Donation Center Directory</h1>
                    <p>Find the nearest location to donate blood and view operating hours.</p>
                </header>

                <div className="centers-grid">
                    {/* --- LEFT COLUMN: CENTER LIST --- */}
                    <Card>
                        <SectionHeader 
                            icon={<List size={20} />} 
                            title="Available Donation Centers" 
                            description="Search by location, status, or name." 
                        />
                        
                        <div className="search-container">
                            <Search size={20} color="#6b7280" />
                            <input
                                type="text"
                                placeholder="Search center, city, status (e.g., Active or Downtown)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        {error && (
                            <div style={{ color: '#e30000', padding: '1rem', border: '1px solid #e3000060', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                                Error: {error}
                            </div>
                        )}

                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#888' }}>Loading centers...</div>
                        ) : filteredCenters.length === 0 ? (
                             <div style={{ textAlign: 'center', padding: '2rem 0', color: '#888' }}>No centers found matching **"{searchTerm}"**.</div>
                        ) : (
                            <ul className="center-list">
                                <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '1rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' }}>
                                    Displaying {filteredCenters.length} matching centers.
                                </p>
                                {filteredCenters.map((center) => (
                                    <li key={center.id} className="center-item">
                                        <div className="center-name">
                                            {center.name} 
                                            <CenterStatusBadge status={center.status} />
                                        </div>
                                        <div className="center-detail-row">
                                            <MapPin size={16} /> {center.address}
                                        </div>
                                        <div className="center-detail-row">
                                            <Clock size={16} /> {center.hours}
                                        </div>
                                        <div className="center-detail-row">
                                            <Phone size={16} /> {center.phone}
                                        </div>
                                        <a href={`mailto:${center.email}`} className="center-detail-row" style={{ color: '#e30000', marginTop: '0.5rem', fontWeight: 600 }}>
                                            <Mail size={16} /> Contact Center
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    {/* --- RIGHT COLUMN: MAP & GUIDANCE --- */}
                    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', gap: '2rem' }}>
                        
                        {/* Map Placeholder */}
                        <Card>
                             <SectionHeader icon={<Map size={20} />} title="Map View" description="Interactive map integration goes here." />
                            <div className="map-placeholder">
                                {filteredCenters.length > 0 ? (
                                    <>
                                        <MapPin size={32} style={{marginRight: '10px'}}/> 
                                        Showing {filteredCenters.length} centers in the map area.
                                        (Map API Integration Required)
                                    </>
                                ) : (
                                    "Search a center to view location."
                                )}
                            </div>
                        </Card>

                        {/* Quick Guidance */}
                        <Card>
                            <SectionHeader icon={<Globe size={20} />} title="Before You Go" description="Essential tips for a successful donation." />
                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#6b7280' }}>
                                <li style={{ marginBottom: '10px' }}>**Appointment Recommended:** Call ahead, especially for Limited hours.</li>
                                <li style={{ marginBottom: '10px' }}>Eat a full meal 2 hours before donation.</li>
                                <li style={{ marginBottom: '10px' }}>Drink plenty of water (at least 500ml).</li>
                                <li style={{ marginBottom: '10px' }}>Bring a photo ID and donor card (if applicable).</li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CentersPage;