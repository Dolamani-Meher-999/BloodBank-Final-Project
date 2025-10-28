// backend/models/User.js - SIMPLIFIED VERSION

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        // --- SIMPLIFIED FIELDS (No longer required at registration) ---
        phone: {
            type: String,
            // Removed: required: [true, '...']
        },
        bloodGroup: {
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 
            // Removed: required: [true, '...']
        },
        // -----------------------------------------------------------
        role: {
            type: String,
            // Changed: Not required, let the default handle it (Recommended)
            default: 'Donor', // New users are Donors by default
            enum: ['Admin', 'Donor', 'Recipient'], 
        },
    },
    {
        timestamps: true,
    }
);

// Middleware to hash password before saving (remains the same)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords (remains the same)
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;