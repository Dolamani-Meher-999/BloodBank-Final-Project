import express from 'express';
import {
    addBloodUnit,
    getAllInventory,
    getInventorySummary,
    updateInventoryUnit,
    deleteInventoryUnit,
} from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for getting a public summary of available blood types (less sensitive)
router.route('/summary').get(getInventorySummary);

// Admin-specific routes for full CRUD and detailed viewing
router.route('/')
    // GET /api/v1/inventory: View detailed inventory (Admin only)
    // POST /api/v1/inventory: Add new blood unit (Admin only)
    .get(protect, authorize('Admin'), getAllInventory)
    .post(protect, authorize('Admin'), addBloodUnit);

router.route('/:id')
    // PUT /api/v1/inventory/:id: Update unit details or quantity (Admin only)
    // DELETE /api/v1/inventory/:id: Remove expired or used unit (Admin only)
    .put(protect, authorize('Admin'), updateInventoryUnit)
    .delete(protect, authorize('Admin'), deleteInventoryUnit);

export default router;