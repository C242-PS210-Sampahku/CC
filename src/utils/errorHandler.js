const errorHandler = (err, req, res, next) => {
    // Default values for status and message
    const statusCode = err.statusCode || 500;
    const status = err.status || false;
    const message = err.message || 'Internal Server Error';

    // Handle circular structure in errors
    let errorDetails;
    try {
        errorDetails = JSON.stringify(err.errors || ''); // Try serializing errors
    } catch (serializeError) {
        // If circular reference detected, use a safe fallback
        errorDetails = 'Error details contain circular structure';
    }

    // Respond with error structure
    res.status(statusCode).json({
        status,
        message,
        errors: errorDetails,
    });
};

export default errorHandler;
