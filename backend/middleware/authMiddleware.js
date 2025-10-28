import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Middleware to protect routes (verify JWT)
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check for authorization header and confirm it starts with 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header (format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by ID from the decoded token payload and exclude the password field
            // We attach the user object to the request for use in controllers (req.user)
            req.user = await User.findById(decoded.id).select('-password');

            // If user is found, proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401); // Unauthorized
            throw new Error('Not authorized, token failed');
        }
    }

    // If no token is provided
    if (!token) {
        res.status(401); // Unauthorized
        throw new Error('Not authorized, no token');
    }
});

/**
 * Middleware for Role-Based Access Control (RBAC).
 * Checks if the authenticated user's role is included in the allowedRoles array.
 * @param {string[]} allowedRoles - Array of roles allowed to access the route (e.g., ['admin', 'donor']).
 */
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            // Should be caught by 'protect', but good defensive programming
            res.status(401); 
            throw new Error('User role information missing');
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403); // Forbidden
            throw new Error(`Not authorized. Required role(s): ${allowedRoles.join(' or ')}`);
        }

        // Role is valid, proceed
        next();
    };
};


export { protect, authorize };
