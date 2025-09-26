const express = require('express')
// const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
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

const allowed = new Set(
    (process.env.CLIENT_ORIGINS || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
);

const corsOptions = {
    origin(origin, callback) {
        if (!origin) return callback(null, true); // curl/mobile
        if (origin.startsWith('http://localhost:')) return callback(null, true);
        if (allowed.has(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Preflight first, then CORS middleware
// app.options('/', cors(corsOptions));
// app.options('/:path(*)', cors(corsOptions));
app.use(cors(corsOptions));

/* ---- Proxy/cookies (Render) ---- */
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/food', foodRoutes)
app.use('/api/food-partner', foodPartnerRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/push', pushRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/follow', followRoutes)

// Global error handler
const errorHandler = require('./middleware/error.middleware.js')
app.use(errorHandler)

module.exports = app