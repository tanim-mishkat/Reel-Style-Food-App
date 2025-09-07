const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 50MB.' });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: 'Invalid file field.' });
    }
    
    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Default error
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error'
    });
};

module.exports = errorHandler;