import jwt from 'jsonwebtoken';

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 * @param {string} id - The MongoDB ObjectID of the user.
 * @returns {string} The generated JWT.
 */
const generateToken = (id) => {
    // Sign the JWT with the user's ID and the secret key from the environment variables
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        // Set token to expire in 30 days (adjust as needed)
        expiresIn: '30d', 
    });
};

export default generateToken;
