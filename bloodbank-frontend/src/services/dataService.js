// import API from './api';

// // --- PROFILE & DONOR DATA ---

// /**
//  * Fetches the currently authenticated user's profile data.
//  * Corresponds to your backend route: /api/donor/profile or similar.
//  */
// const getProfile = async () => {
//     try {
//         const response = await API.get('/donor/profile');
//         return response.data;
//     } catch (error) {
//         // Axios wraps the actual error in the .response property
//         const message = error.response?.data?.message || 'Failed to fetch user profile.';
//         throw new Error(message);
//     }
// };

// /**
//  * Updates the user's profile information.
//  * Corresponds to your backend route: /api/donor/profile/update or similar.
//  */
// const updateProfile = async (profileData) => {
//     try {
//         const response = await API.put('/donor/profile/update', profileData);
//         return response.data;
//     } catch (error) {
//         const message = error.response?.data?.message || 'Failed to update profile.';
//         throw new Error(message);
//     }
// };

// /**
//  * Fetches the user's donation history.
//  * Corresponds to your backend route: /api/donor/history or similar.
//  */
// const getDonationHistory = async () => {
//     try {
//         const response = await API.get('/donor/history');
//         // Assuming the backend returns an array of donation records
//         return response.data; 
//     } catch (error) {
//         const message = error.response?.data?.message || 'Failed to fetch donation history.';
//         throw new Error(message);
//     }
// };


// // --- INVENTORY & CENTERS DATA ---

// /**
//  * Fetches the current global blood inventory levels.
//  * Corresponds to your backend route: /api/inventory.
//  */
// const getInventory = async () => {
//     try {
//         const response = await API.get('/inventory');
//         // Assuming backend returns { inventory: [{ group: 'A+', units: 100 }, ...] }
//         return response.data; 
//     } catch (error) {
//         const message = error.response?.data?.message || 'Failed to fetch blood inventory.';
//         throw new Error(message);
//     }
// };

// /**
//  * Fetches the list of donation centers.
//  * Corresponds to your backend route: /api/donor/centers or similar.
//  */
// const getCenters = async () => {
//     try {
//         const response = await API.get('/donor/centers');
//         // Assuming backend returns { centers: [{ name: '...', address: '...' }, ...] }
//         return response.data; 
//     } catch (error) {
//         const message = error.response?.data?.message || 'Failed to fetch donation centers.';
//         throw new Error(message);
//     }
// };


//     try {
//         const response = await API.get('/request/myrequests');
//         return response.data;
//     } catch (error) {
//         const message = error.response?.data?.message || 'Failed to load request history.';
//         throw new Error(message);
//     }
// };


// export const dataService = {
//     getProfile,
//     updateProfile,
//     getDonationHistory,
//     getInventory,
//     getCenters,
//     createRequest,
//     getUserRequests,
// };

import API from './api';

// --- PROFILE & DONOR DATA ---

/**
 * Fetches the currently authenticated user's profile data.
 */
const getProfile = async () => {
    try {
        const response = await API.get('/donor/profile');
        return response.data;
    } catch (error) {
        // Axios wraps the actual error in the .response property
        const message = error.response?.data?.message || 'Failed to fetch user profile.';
        throw new Error(message);
    }
};

/**
 * Updates the user's profile information.
 */
const updateProfile = async (profileData) => {
    try {
        const response = await API.put('/donor/profile/update', profileData);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to update profile.';
        throw new Error(message);
    }
};

/**
 * Fetches the user's donation history.
 */
const getDonationHistory = async () => {
    try {
        const response = await API.get('/donor/history');
        // Assuming the backend returns an array of donation records
        return response.data; 
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch donation history.';
        throw new Error(message);
    }
};


// --- INVENTORY & CENTERS DATA ---

/**
 * Fetches the current global blood inventory levels.
 */
const getInventory = async () => {
    try {
        const response = await API.get('/inventory');
        return response.data; 
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch blood inventory.';
        throw new Error(message);
    }
};

/**
 * Fetches the list of donation centers.
 */
const getCenters = async () => {
    try {
        const response = await API.get('/donor/centers');
        return response.data; 
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch donation centers.';
        throw new Error(message);
    }
};


// --- BLOOD REQUESTS ---

/**
 * Submits a new blood request.
 * Corresponds to your backend route: /api/v1/requests
 */
const createRequest = async (requestData) => {
    try {
        console.log('Sending request data:', requestData); // Log the request data
        const response = await API.post('/requests', requestData);
        console.log('Request successful:', response.data); // Log successful response
        return response.data; // Return the response data
    } catch (error) {
        console.error('Error in createRequest:', error);
        const message = error.response?.data?.message || 
                       error.message || 
                       'Failed to submit blood request. Please try again later.';
        throw new Error(message);
    }
};

/**
 * Fetches the user's submitted blood requests.
 */
const getUserRequests = async () => {
    try {
        const response = await API.get('/requests/myrequests');
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to load request history.';
        throw new Error(message);
    }
};


export const dataService = {
    getProfile,
    updateProfile,
    getDonationHistory,
    getInventory,
    getCenters,
    createRequest,
    getUserRequests,
};