const express = require('express')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const authRoutes = require('./routes/auth.routes.js')
const foodRoutes = require('./routes/food.routes.js')
const foodPartnerRoutes = require('./routes/food-partner.routes.js')
const menuRoutes = require('./routes/menu.routes.js')
const orderRoutes = require('./routes/order.routes.js')
const reviewRoutes = require('./routes/review.routes.js')
const pushRoutes = require('./routes/push.routes.js')
const notificationRoutes = require('./routes/notification.routes.js')
const followRoutes = require('./routes/follow.routes.js')
const cors = require('cors')

const app = express()

/* ---- Proxy/cookies (Render) ---- */
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const allowed = new Set(
    (process.env.CLIENT_ORIGINS || process.env.FRONTEND_ORIGINS || 'https://reel-style-food-app.onrender.com,http://localhost:5173')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
);

const corsOptions = {
    origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowed.has(origin)) return callback(null, true);
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-csrf-token'],
    exposedHeaders: ['X-CSRF-Token'] // Expose the CSRF token header to frontend
};

app.use(cors(corsOptions));
app.use((req, res, next) => { res.setHeader('Vary', 'Origin'); next(); });

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

// CSRF protection
const { setCsrfToken, csrfProtection } = require('./middleware/csrf.middleware.js')
app.use(setCsrfToken)
app.use(csrfProtection)



app.use('/api/auth', authRoutes)
app.use('/api/food', foodRoutes)
app.use('/api/food-partner', foodPartnerRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/push', pushRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/follow', followRoutes)

app.get('/api/health', (req, res) => res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
}));

// Simple endpoint to force CSRF token creation
app.get('/api/init-csrf', (req, res) => {
    res.json({
        message: 'CSRF token initialized'
    });
});

// Global error handler
const errorHandler = require('./middleware/error.middleware.js')
app.use(errorHandler)

module.exports = app
