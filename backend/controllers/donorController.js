import asyncHandler from 'express-async-handler';
import DonorProfile from '../models/DonorProfile.js';
import User from '../models/User.js';

// @desc    Create or update donor profile
// @route   POST /api/v1/donors/profile
// @access  Private (Donor/Admin)
const createDonorProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, contactNumber, dateOfBirth, address, bloodType, lastDonationDate } = req.body;

    // Check if profile already exists for this user
    let profile = await DonorProfile.findOne({ user: req.user._id });

    // If profile exists, update it
    if (profile) {
        // Simple update logic
        profile.firstName = firstName || profile.firstName;
        profile.lastName = lastName || profile.lastName;
        profile.contactNumber = contactNumber || profile.contactNumber;
        profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
        profile.bloodType = bloodType || profile.bloodType;
        profile.lastDonationDate = lastDonationDate || profile.lastDonationDate;

        // Update address subdocument fields
        if (address) {
            profile.address.street = address.street || profile.address.street;
            profile.address.city = address.city || profile.address.city;
            profile.address.state = address.state || profile.address.state;
            profile.address.zipCode = address.zipCode || profile.address.zipCode;
        }
        
        const updatedProfile = await profile.save();
        res.status(200).json(updatedProfile);
    } else {
        // If profile does not exist, create a new one
        profile = new DonorProfile({
            user: req.user._id,
            firstName,
            lastName,
            contactNumber,
            dateOfBirth,
            address,
            bloodType,
            lastDonationDate,
        });

        const createdProfile = await profile.save();

        // Optional: Update the main User document with the Donor role if they just created their profile
        const user = await User.findById(req.user._id);
        if (user && user.role === 'Recipient') {
            user.role = 'Donor';
            await user.save();
        }
        
        res.status(201).json(createdProfile);
    }
});

// @desc    Get current donor's profile
// @route   GET /api/v1/donors/profile
// @access  Private (Donor/Admin)
const getMyDonorProfile = asyncHandler(async (req, res) => {
    const profile = await DonorProfile.findOne({ user: req.user._id }).populate('user', 'email role');

    if (profile) {
        res.json(profile);
    } else {
        res.status(404);
        throw new Error('Donor profile not found for this user.');
    }
});

// @desc    Get all donors (Admin only)
// @route   GET /api/v1/donors
// @access  Private (Admin)
const getAllDonors = asyncHandler(async (req, res) => {
    // Only fetch profiles that belong to users who are marked as 'Donor'
    const profiles = await DonorProfile.find({})
        .populate('user', 'email role')
        .sort({ createdAt: -1 });
    
    res.json(profiles);
});

// @desc    Update eligibility status (Admin only)
// @route   PUT /api/v1/donors/:id/eligibility
// @access  Private (Admin)
const updateEligibilityStatus = asyncHandler(async (req, res) => {
    const profile = await DonorProfile.findById(req.params.id);
    const { eligibilityStatus, isVerified } = req.body;

    if (profile) {
        if (eligibilityStatus) {
            profile.eligibilityStatus = eligibilityStatus;
        }
        
        // This is a boolean flag usually set after physical verification
        if (isVerified !== undefined) {
             profile.isVerified = isVerified;
        }

        const updatedProfile = await profile.save();
        res.json({
            _id: updatedProfile._id,
            user: updatedProfile.user,
            eligibilityStatus: updatedProfile.eligibilityStatus,
            isVerified: updatedProfile.isVerified,
        });
    } else {
        res.status(404);
        throw new Error('Donor profile not found');
    }
});

export {
    createDonorProfile,
    getMyDonorProfile,
    getAllDonors,
    updateEligibilityStatus,
};