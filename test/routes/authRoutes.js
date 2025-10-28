import express from 'express';
import { 
    registerUser, 
    authUser, 
    getUserProfile 
} from '../controllers/authController.js';

// Import the authentication middleware
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for registration and login
router.post('/register', registerUser);
router.post('/login', authUser);

// Private route for getting the user's profile, protected by middleware
router.get('/profile', protect, getUserProfile); 

export default router;
