import asyncHandler from 'express-async-handler';
import Request from '../models/Request.js';
import Inventory from '../models/Inventory.js';
import mongoose from 'mongoose';

// @desc    Create a new blood request
// @route   POST /api/v1/requests
// @access  Private (Recipient/Donor)
const createBloodRequest = asyncHandler(async (req, res) => {
    // 1. Destructure fields sent by frontend and map them to backend model names
    const { bloodGroup, quantity, hospital, reason } = req.body;

    // Map frontend names to backend model names
    const bloodType = bloodGroup; 
    const hospitalName = hospital;
    // CRITICAL: Set placeholder for optional field not sent by frontend
    const hospitalAddress = 'Address not provided by request form.'; 

    // Basic validation check (required fields from frontend)
    if (!bloodType || !quantity || !hospitalName) {
        res.status(400);
        throw new Error('Please fill all required fields (Blood Group, Quantity, Hospital Name).');
    }

    // 2. Create and save the Request document
    const request = await Request.create({
        requester: req.user._id,
        bloodType, // Saved as bloodType in MongoDB
        quantity,
        hospitalName, // Saved as hospitalName in MongoDB
        hospitalAddress, // Safely saved as placeholder string
        reason,
        status: 'Pending', // Default status upon creation
    });
    
    // 3. Send back the correctly formatted response for the frontend list
    res.status(201).json({
        id: request._id,
        bloodGroup: request.bloodType, // Mapped back for frontend consistency
        quantity: request.quantity,
        hospital: request.hospitalName,
        status: request.status,
        timestamp: request.createdAt,
        reason: request.reason
    });
});

// @desc    Get all requests for the current user
// @route   GET /api/v1/requests/myrequests
// @access  Private (Recipient/Donor)
const getMyRequests = asyncHandler(async (req, res) => {
    const requests = await Request.find({ requester: req.user._id }).sort({ createdAt: -1 });
    
    // Map backend model field names to expected frontend names for consistency
    const formattedRequests = requests.map(req => ({
        id: req._id,
        bloodGroup: req.bloodType, // Map: bloodType -> bloodGroup
        quantity: req.quantity,
        hospital: req.hospitalName, // Map: hospitalName -> hospital
        status: req.status,
        reason: req.reason,
        timestamp: req.createdAt,
    }));
    
    res.json(formattedRequests);
});

// @desc    Get all pending and non-fulfilled requests (Admin only)
// @route   GET /api/v1/requests
// @access  Private (Admin)
const getAllRequests = asyncHandler(async (req, res) => {
    const requests = await Request.find({})
        .populate('requester', 'email role')
        .sort({ status: 1, createdAt: -1 }); // Pending requests first
    res.json(requests);
});

// @desc    Update request status (Admin only) - Includes fulfillment logic
// @route   PUT /api/v1/requests/:id/status
// @access  Private (Admin)
const updateRequestStatus = asyncHandler(async (req, res) => {
    // ... (logic remains the same) ...
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

    // Handle simple status updates (Pending, Approved, Rejected)
    request.status = status;
    request.processedBy = req.user._id;
    const updatedRequest = await request.save();
    
    res.json(updatedRequest);
});


export {
    createBloodRequest,
    getMyRequests,
    getAllRequests,
    updateRequestStatus,
};