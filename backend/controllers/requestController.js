import asyncHandler from 'express-async-handler';
import Request from '../models/Request.js';
import Inventory from '../models/Inventory.js';
import mongoose from 'mongoose';

// @desc    Create a new blood request
// @route   POST /api/v1/requests
// @access  Private (Recipient/Donor)
const createBloodRequest = asyncHandler(async (req, res) => {
    const { bloodType, quantity, hospitalName, hospitalAddress, reason } = req.body;

    if (!bloodType || !quantity || !hospitalName || !hospitalAddress) {
        res.status(400);
        throw new Error('Please fill all required fields for the request.');
    }

    const request = await Request.create({
        requester: req.user._id,
        bloodType,
        quantity,
        hospitalName,
        hospitalAddress,
        reason,
        status: 'Pending', // Default status upon creation
    });

    res.status(201).json(request);
});

// @desc    Get all requests for the current user
// @route   GET /api/v1/requests/myrequests
// @access  Private (Recipient/Donor)
const getMyRequests = asyncHandler(async (req, res) => {
    const requests = await Request.find({ requester: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
});

// @desc    Get all pending and non-fulfilled requests (Admin only)
// @route   GET /api/v1/requests
// @access  Private (Admin)
const getAllRequests = asyncHandler(async (req, res) => {
    const requests = await Request.find({})
        .populate('requester', 'email role')
        .sort({ status: 1, createdAt: -1 }); // Pending requests first
    res.json(requests);
});

// @desc    Update request status (Admin only) - Includes fulfillment logic
// @route   PUT /api/v1/requests/:id/status
// @access  Private (Admin)
const updateRequestStatus = asyncHandler(async (req, res) => {
    const request = await Request.findById(req.params.id);
    const { status } = req.body;

    if (!request) {
        res.status(404);
        throw new Error('Blood request not found');
    }

    if (request.status === 'Fulfilled' || request.status === 'Rejected') {
        res.status(400);
        throw new Error(`Cannot modify a request that is already ${request.status}.`);
    }

    // Handle fulfillment: Deduct from inventory
    if (status === 'Fulfilled') {
        const requiredQuantity = request.quantity;
        const requiredBloodType = request.bloodType;

        // 1. Get total available quantity
        const summary = await Inventory.aggregate([
            { $match: { bloodType: requiredBloodType, quantity: { $gt: 0 }, expiryDate: { $gt: new Date() } } },
            { $group: { _id: null, total: { $sum: '$quantity' } } }
        ]);

        const availableQuantity = summary[0] ? summary[0].total : 0;

        if (availableQuantity < requiredQuantity) {
            res.status(400);
            throw new Error(`Insufficient inventory: Only ${availableQuantity} units of ${requiredBloodType} available.`);
        }

        // --- Start Transaction for Inventory Deduction ---
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            let remainingToDeduct = requiredQuantity;
            
            // 2. Find and deduct from inventory units, oldest expiry first (FIFO)
            const unitsToDeduct = await Inventory.find({ 
                bloodType: requiredBloodType, 
                quantity: { $gt: 0 }, 
                expiryDate: { $gt: new Date() } 
            })
            .sort({ expiryDate: 1 }) // Deduct oldest stock first
            .session(session);

            for (const unit of unitsToDeduct) {
                if (remainingToDeduct === 0) break;

                const deductionAmount = Math.min(unit.quantity, remainingToDeduct);
                unit.quantity -= deductionAmount;
                remainingToDeduct -= deductionAmount;

                await unit.save({ session });
            }

            // 3. Update Request Status
            request.status = status;
            request.processedBy = req.user._id;
            const updatedRequest = await request.save({ session });

            await session.commitTransaction();
            session.endSession();

            res.json(updatedRequest);

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            // Re-throw the error to be caught by the error handler
            throw new Error(`Transaction failed during fulfillment: ${error.message}`);
        }
    } else {
        // Handle simple status updates (Pending, Approved, Rejected)
        request.status = status;
        request.processedBy = req.user._id;
        const updatedRequest = await request.save();
        res.json(updatedRequest);
    }
});


export {
    createBloodRequest,
    getMyRequests,
    getAllRequests,
    updateRequestStatus,
};