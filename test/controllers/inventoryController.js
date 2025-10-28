import asyncHandler from 'express-async-handler';
import Inventory from '../models/Inventory.js';

// @desc    Add new blood unit to inventory
// @route   POST /api/v1/inventory
// @access  Private (Admin)
const addBloodUnit = asyncHandler(async (req, res) => {
    const { bloodType, quantity, location, donationDate, expiryDate, donorProfile } = req.body;

    // Basic validation
    if (!bloodType || !quantity || !location || !donationDate || !expiryDate) {
        res.status(400);
        throw new Error('Please fill all required inventory fields');
    }

    const inventory = await Inventory.create({
        bloodType,
        quantity,
        location,
        donationDate,
        expiryDate,
        donorProfile,
        recordedBy: req.user._id, // Set the Admin user who added the stock
    });

    res.status(201).json(inventory);
});

// @desc    Get all inventory records (Detailed view)
// @route   GET /api/v1/inventory
// @access  Private (Admin/Recipient)
const getAllInventory = asyncHandler(async (req, res) => {
    // Admin users get all details. Recipients/Donors might get a simpler list.
    // For now, we'll fetch all. Authorization middleware will limit who can access this.
    const inventory = await Inventory.find({})
        .populate('donorProfile', 'firstName lastName contactNumber bloodType')
        .sort({ expiryDate: 1 }); // Sort by expiry date

    res.json(inventory);
});

// @desc    Get inventory summary by blood type
// @route   GET /api/v1/inventory/summary
// @access  Public (Can be used by anyone to see availability)
const getInventorySummary = asyncHandler(async (req, res) => {
    const summary = await Inventory.aggregate([
        {
            // Group by blood type and sum the quantity
            $group: {
                _id: '$bloodType',
                totalQuantity: { $sum: '$quantity' },
            },
        },
        {
            // Rename _id to bloodType for cleaner output
            $project: {
                bloodType: '$_id',
                totalQuantity: 1,
                _id: 0,
            },
        },
        {
            // Sort by blood type
            $sort: { bloodType: 1 },
        },
    ]);

    // Handle case where specific blood types might be missing from the summary
    const allBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const finalSummary = allBloodTypes.map(type => {
        const found = summary.find(s => s.bloodType === type);
        return {
            bloodType: type,
            totalQuantity: found ? found.totalQuantity : 0,
        };
    });

    res.json(finalSummary);
});

// @desc    Update quantity or details of a specific inventory unit
// @route   PUT /api/v1/inventory/:id
// @access  Private (Admin)
const updateInventoryUnit = asyncHandler(async (req, res) => {
    const unit = await Inventory.findById(req.params.id);

    if (unit) {
        // Only update fields provided in the request body
        unit.bloodType = req.body.bloodType || unit.bloodType;
        unit.quantity = req.body.quantity !== undefined ? req.body.quantity : unit.quantity;
        unit.location = req.body.location || unit.location;
        unit.donationDate = req.body.donationDate || unit.donationDate;
        unit.expiryDate = req.body.expiryDate || unit.expiryDate;

        const updatedUnit = await unit.save();
        res.json(updatedUnit);
    } else {
        res.status(404);
        throw new Error('Inventory unit not found');
    }
});

// @desc    Delete an inventory unit
// @route   DELETE /api/v1/inventory/:id
// @access  Private (Admin)
const deleteInventoryUnit = asyncHandler(async (req, res) => {
    const unit = await Inventory.findById(req.params.id);

    if (unit) {
        await unit.deleteOne(); // Use deleteOne() on the document
        res.json({ message: 'Inventory unit removed' });
    } else {
        res.status(404);
        throw new Error('Inventory unit not found');
    }
});

export {
    addBloodUnit,
    getAllInventory,
    getInventorySummary,
    updateInventoryUnit,
    deleteInventoryUnit,
};