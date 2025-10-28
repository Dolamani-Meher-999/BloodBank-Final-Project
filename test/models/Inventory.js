import mongoose from 'mongoose';

const inventorySchema = mongoose.Schema(
    {
        bloodType: {
            type: String,
            required: [true, 'Please select a blood type'],
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        },
        // Quantity stored (e.g., in units or milliliters)
        quantity: {
            type: Number,
            required: [true, 'Please specify the quantity'],
            min: 0,
        },
        // Where the blood is physically stored
        location: {
            type: String,
            required: [true, 'Please specify the storage location'],
            trim: true,
        },
        // Date when this unit/batch was added
        donationDate: {
            type: Date,
            required: [true, 'Please add the donation date'],
        },
        // Expiration date is critical for blood products
        expiryDate: {
            type: Date,
            required: [true, 'Please add the expiry date'],
        },
        // Optional reference to the donor profile for traceability
        donorProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DonorProfile',
            default: null,
        },
        // Who recorded this entry (Admin user)
        recordedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;