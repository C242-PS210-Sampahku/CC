const errorHandler = (err, req, res, next) => {
    // Default values for status and message
    const statusCode = err.statusCode || 500;
    const status = err.status || false;
    const message = err.message || 'Internal Server Error';
    if (err.name === 'PrismaClientInitializationError') {
        console.error('Prisma Client Initialization Error:', err.message);

        return res.status(500).json({
            success: false,
            message: 'Internal server error: Database connection issue. Please check the configuration.',
        });
    }
    // if(err.name === 'FirebaseAuthError'){
    //     message =
    // }
    // switch (err.code) {
    //     case 'auth/invalid-email':
    //         return res.status(400).json({ success: false, message: 'Invalid email format.' });
    //     case 'auth/user-not-found':
    //         return res.status(404).json({ success: false, message: 'User not found.' });
    //     case 'auth/wrong-password':
    //         return res.status(401).json({ success: false, message: 'Incorrect password.' });
    //     case 'auth/email-already-exists':
    //         return res.status(401).json({ success: false, message: 'The email address is already in use by another account.' });
    //     default:
    //         return res.status(500).json({ success: false, message: 'Internal server error.' });
    // }

    // Handle circular structure in errors
    let errorDetails = err;
    try {
        errorDetails = JSON.stringify(err.errors || ''); // Try serializing errors
    } catch (serializeError) {
        // If circular reference detected, use a safe fallback
        errorDetails = 'Error details contain circular structure';
    }

    // Respond with error structure
    console.log(err);
    res.status(statusCode).json({
        status,
        message,
    });
};

export default errorHandler;
