const crypto = require('crypto');

// Simple CSRF protection using double-submit cookie pattern
function csrfProtection(req, res, next) {
    // Skip CSRF for GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
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
            httpOnly: false, // Must be readable by JS
            sameSite: 'none',
            secure: true,
            path: '/'
        });
    }
    next();
}

module.exports = { csrfProtection, setCsrfToken };
