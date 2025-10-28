/**
 * Middleware to handle requests to undefined routes (404 Not Found).
 * This must be placed after all defined routes and before the general errorHandler.
 */
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass error to the next error handler middleware
};

/**
 * Global error handling middleware.
 * This should be the last middleware loaded in server.js.
 */
export const errorHandler = (err, req, res, next) => {
    // Determine the appropriate status code (default to 500 if not set)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // Send a JSON response with the error message
    res.json({
        success: false,
        message: err.message,
        // Only show stack trace in development mode for security/cleanliness
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

// Named exports are already defined above
