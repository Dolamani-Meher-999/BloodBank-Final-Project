// import express from 'express';
// import {
//     createDonorProfile,
//     getMyDonorProfile,
//     getAllDonors,
//     updateEligibilityStatus,
// } from '../controllers/donorController.js';
// import { protect, authorize } from '../middleware/authMiddleware.js';

// const router = express.Router();

// // Publicly visible: Admin can fetch all donors, Donors can manage their profile
// router.route('/profile')
//     .post(protect, createDonorProfile) // Create or update profile
//     .get(protect, getMyDonorProfile);  // Get current user's profile

// // Admin-specific routes
// router.route('/')
//     .get(protect, authorize('Admin'), getAllDonors); // Get all donor profiles (Admin only)
// router.route('/:id/eligibility')
//     .put(protect, authorize('Admin'), updateEligibilityStatus); // Update eligibility (Admin only)
// export default router;
import express from 'express';
import {
    createDonorProfile,
    getMyDonorProfile,
    getAllDonors,
    updateEligibilityStatus,
    // FIX 1: Add required function to the import list
    getDonationCenters, 
} from '../controllers/donorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// NOTE: This router is mounted at /api/v1/donors

// Donation Centers Route
router.route('/centers')
    .get(protect, getDonationCenters); // Get all donation centers

// Recipient/Donor Routes
router.route('/profile')
    .post(protect, createDonorProfile) // Create or update profile
    .get(protect, getMyDonorProfile);  // Get current user's profile

// Admin-specific routes
router.route('/')
    .get(protect, authorize('Admin'), getAllDonors); // Get all donor profiles (Admin only)

router.route('/:id/eligibility')
    .put(protect, authorize('Admin'), updateEligibilityStatus); // Update eligibility (Admin only)

export default router;