const express = require('express');
const router = express.Router();
const personRoutes = require('./personRoutes');
const userRoutes = require('./user.routes');

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API routes
router.use('/api/people', personRoutes);
router.use('/api/auth', userRoutes);

// 404 handler for undefined routes
router.use((req, res) => {
    res.status(404).json({
        statusCode: 404,
        message: 'Route not found',
        errors: [`The requested route ${req.originalUrl} does not exist`]
    });
});

module.exports = router;