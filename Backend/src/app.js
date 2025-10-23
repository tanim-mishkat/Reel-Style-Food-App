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

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Debug CSRF page (remove in production after testing)
app.get('/debug-csrf', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSRF Debug</title>
</head>
<body>
    <h1>CSRF Token Debug</h1>
    <div id="results"></div>
    
    <button onclick="checkCsrfToken()">Check CSRF Token</button>
    <button onclick="testFoodPost()">Test Food POST</button>
    
    <script>
        const API_BASE = window.location.origin + '/api';
        
        function getCsrfToken() {
            return document.cookie
                .split(';')
                .map(cookie => cookie.trim())
                .find(cookie => cookie.startsWith('csrf_token='))
                ?.substring('csrf_token='.length);
        }
        
        function log(message) {
            const results = document.getElementById('results');
            results.innerHTML += '<p>' + message + '</p>';
        }
        
        async function checkCsrfToken() {
            document.getElementById('results').innerHTML = '';
            
            try {
                const response = await fetch(API_BASE + '/debug/csrf', {
                    credentials: 'include'
                });
                const data = await response.json();
                log('CSRF Debug Response: ' + JSON.stringify(data, null, 2));
                
                log('All cookies: ' + document.cookie);
                log('CSRF token from cookie: ' + getCsrfToken());
                
            } catch (error) {
                log('Error checking CSRF: ' + error.message);
            }
        }
        
        async function testFoodPost() {
            const csrfToken = getCsrfToken();
            log('Using CSRF token: ' + csrfToken);
            
            if (!csrfToken) {
                log('No CSRF token found! Try clicking "Check CSRF Token" first.');
                return;
            }
            
            try {
                const response = await fetch(API_BASE + '/food', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-csrf-token': csrfToken
                    },
                    body: JSON.stringify({
                        title: 'Test Food',
                        description: 'Test description'
                    })
                });
                
                log('Response status: ' + response.status);
                const responseText = await response.text();
                log('Response body: ' + responseText);
                
            } catch (error) {
                log('Error making POST request: ' + error.message);
            }
        }
    </script>
</body>
</html>`);
});

// Debug endpoint to check CSRF token (remove in production after testing)
app.get('/api/debug/csrf', (req, res) => {
    res.json({
        hasCsrfCookie: !!req.cookies.csrf_token,
        csrfToken: req.cookies.csrf_token ? 'SET' : 'NOT SET',
        cookies: Object.keys(req.cookies),
        headers: {
            origin: req.headers.origin,
            referer: req.headers.referer,
            'user-agent': req.headers['user-agent']
        },
        nodeEnv: process.env.NODE_ENV
    });
});

// Simple endpoint to force CSRF token creation
app.get('/api/init-csrf', (req, res) => {
    res.json({
        message: 'CSRF token initialized',
        hasCsrfCookie: !!req.cookies.csrf_token,
        tokenInHeader: !!res.get('X-CSRF-Token')
    });
});

// Test endpoint for CSRF token validation
app.post('/api/test-csrf', (req, res) => {
    res.json({
        message: 'CSRF token is valid!',
        timestamp: new Date().toISOString()
    });
});

// Global error handler
const errorHandler = require('./middleware/error.middleware.js')
app.use(errorHandler)

module.exports = app
