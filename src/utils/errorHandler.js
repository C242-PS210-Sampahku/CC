import multer from "multer";

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
    if (err instanceof multer.MulterError) {
        // Error spesifik dari Multer (misalnya file size terlalu besar)
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: false,
                message: 'File size exceeds the 7MB limit. Please upload a smaller file.',
            });
        }
    }
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
