import mongoose from 'mongoose';

const donorProfileSchema = mongoose.Schema(
    {
        // Reference to the User model (required)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Links this profile to the User account
            unique: true, // Ensures a user can only have one profile
        },
        // Basic Donor Information
        firstName: {
            type: String,
            required: [true, 'Please add a first name'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Please add a last name'],
            trim: true,
        },
        contactNumber: {
            type: String,
            required: [true, 'Please add a contact number'],
            match: [/^(\+\d{1,3})?\d{10}$/, 'Please enter a valid phone number'],
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Please add a date of birth'],
        },
        // Location and Address
        address: {
            street: {
                type: String,
                required: [true, 'Please add a street address'],
                trim: true,
            },
            city: {
                type: String,
                required: [true, 'Please add a city'],
                trim: true,
            },
            state: {
                type: String,
                required: [true, 'Please add a state'],
                trim: true,
            },
            zipCode: {
                type: String,
                required: [true, 'Please add a zip code'],
                match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid zip code'],
            },
        },
        // Medical and Donation Specifics
        bloodType: {
            type: String,
            required: [true, 'Please select a blood type'],
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        },
        eligibilityStatus: {
            type: String,
            enum: ['Eligible', 'Ineligible', 'Pending'],
            default: 'Pending',
        },
        lastDonationDate: {
            type: Date,
            default: null,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

const DonorProfile = mongoose.model('DonorProfile', donorProfileSchema);

export default DonorProfile;