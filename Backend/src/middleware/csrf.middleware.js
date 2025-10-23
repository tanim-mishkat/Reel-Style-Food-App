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
        res.cookie('csrf_token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/'
        });
    }
    next();
}

module.exports = { csrfProtection, setCsrfToken };
