import mongoose from 'mongoose';

const centerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Center name is required.'],
            trim: true,
        },
        address: {
            type: String,
            required: [true, 'Full address is required.'],
            trim: true,
        },
        phone: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
        hours: {
            type: String,
            default: 'Mon-Fri, 9:00 - 17:00',
        },
        // Location data for mapping later
        latitude: {
            type: Number,
            required: false,
        },
        longitude: {
            type: Number,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const Center = mongoose.model('Center', centerSchema);

export default Center;
