import express from 'express';
import {
    createBloodRequest,
    getMyRequests,
    getAllRequests,
    updateRequestStatus,
} from '../controllers/requestController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Recipient/Donor Routes
router.route('/')
    .post(protect, createBloodRequest); // Create a new request

router.route('/myrequests')
    .get(protect, getMyRequests); // Get requests made by the current user

// Admin Routes
router.route('/')
    .get(protect, authorize('Admin'), getAllRequests); // Get all requests (Admin only)

router.route('/:id/status')
    .put(protect, authorize('Admin'), updateRequestStatus); // Update status and fulfill (Admin only)

export default router;