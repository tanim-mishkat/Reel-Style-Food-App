const crypto = require('crypto');

// Simple CSRF protection using double-submit cookie pattern
function csrfProtection(req, res, next) {
    // Skip CSRF for GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    // Skip CSRF for auth routes (login/register don't have auth cookies yet)
    if (req.path.startsWith('/api/auth/')) {
        return next();
    }

    // Skip CSRF in development for easier testing
    if (process.env.NODE_ENV === 'development') {
        return next();
    }

    const token = req.headers['x-csrf-token'];
    const cookieToken = req.cookies.csrf_token;

    if (!token || !cookieToken || token !== cookieToken) {
        return res.status(403).json({ message: 'Invalid CSRF token' });
    }

    next();
}

function setCsrfToken(req, res, next) {
    if (!req.cookies.csrf_token) {
        const token = crypto.randomBytes(32).toString('hex');
        const cookieOptions = {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Use 'none' for cross-origin in production
            path: '/',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        };

        res.cookie('csrf_token', token, cookieOptions);
        // Also set the token in a response header as fallback for cross-origin scenarios
        res.set('X-CSRF-Token', token);
    } else {
        // Still set header even if cookie exists
        res.set('X-CSRF-Token', req.cookies.csrf_token);
    }
    next();
}

module.exports = { csrfProtection, setCsrfToken };
