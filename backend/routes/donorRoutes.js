import express from 'express';
import {
    createDonorProfile,
    getMyDonorProfile,
    getAllDonors,
    updateEligibilityStatus,
} from '../controllers/donorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Publicly visible: Admin can fetch all donors, Donors can manage their profile
router.route('/profile')
    .post(protect, createDonorProfile) // Create or update profile
    .get(protect, getMyDonorProfile);  // Get current user's profile

// Admin-specific routes
router.route('/')
    .get(protect, authorize('Admin'), getAllDonors); // Get all donor profiles (Admin only)

router.route('/:id/eligibility')
    .put(protect, authorize('Admin'), updateEligibilityStatus); // Update eligibility (Admin only)

export default router;