import mongoose from 'mongoose';

const requestSchema = mongoose.Schema(
    {
        // Reference to the User model (the one making the request)
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        // Details of the blood required
        bloodType: {
            type: String,
            required: [true, 'Please specify the blood type requested'],
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        },
        quantity: {
            type: Number,
            required: [true, 'Please specify the quantity required (in units)'],
            min: 1,
        },
        // Location details for fulfillment
        hospitalName: {
            type: String,
            required: [true, 'Please specify the hospital name'],
            trim: true,
        },
        hospitalAddress: {
            type: String,
            // FIX: Removed 'required: true' to allow form submission to work
            trim: true, 
        },
        // Reason for the request (e.g., specific patient case)
        reason: {
            type: String,
            required: false, // Ensure this is explicitly false
            trim: true,
            default: '' // Add a default empty string for safety
        },
        // Status of the request lifecycle
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Fulfilled', 'Rejected'],
            default: 'Pending',
        },
        // Admin who approved/rejected/fulfilled the request
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Request = mongoose.model('Request', requestSchema);

export default Request;