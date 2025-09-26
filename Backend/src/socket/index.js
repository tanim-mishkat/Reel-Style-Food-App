const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const Notification = require('../models/notification.model.js');

let io;

function authenticateSocket(socket, next) {
    try {
        const parsed = cookie.parse(socket.handshake.headers.cookie || '');
        const token = parsed.user_token || parsed.partner_token || socket.handshake.auth?.token;
        if (!token) return next(new Error('UNAUTHORIZED'));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const role = parsed.partner_token ? 'partner' : (parsed.user_token ? 'user' : decoded.role);
        socket.user = { id: decoded.id, role }; // {id, role: 'user'|'partner'}
        next();
    } catch (e) {
        next(new Error('UNAUTHORIZED'));
    }
}

function initRealtime(server) {
    const allowed = new Set(
        (process.env.CLIENT_ORIGINS || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
    );
    io = new Server(server, {
        cors: {
            origin(origin, cb) {
                if (!origin) return cb(null, true);
                if (origin.startsWith('http://localhost:')) return cb(null, true);
                if (allowed.has(origin)) return cb(null, true);
                return cb(new Error('Not allowed by CORS'));
            },
            credentials: true
        }
    });

    io.use(authenticateSocket);

    io.on('connection', (socket) => {
        const { id, role } = socket.user;

        // personal room
        socket.join(`${role}:${id}`);

        // optional: join specific order room while the details view is open on the client
        socket.on('subscribe:order', (orderId) => {
            if (orderId) socket.join(`order:${orderId}`);
        });

        // delivery receipt (optional)
        socket.on('notification:delivered', async (notificationId) => {
            if (!notificationId) return;
            await Notification.findByIdAndUpdate(notificationId, { deliveredAt: new Date() }).catch(() => { });
        });
        // NEW: allow any viewer to join a public room for a partner profile
        socket.on("subscribe:partner", (partnerId) => {
            if (partnerId) socket.join(`partnerPublic:${partnerId}`);
        });
    });

    return io;
}

function getIO() {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
}

// Save to DB and emit
async function emitTo({ toRole, toId, type, payload }) {
    const notif = await Notification.create({
        to: toId,
        toRole,
        type,
        payload
    });
    getIO().to(`${toRole}:${toId}`).emit(type, { id: notif._id.toString(), ...payload });
    return notif;
}

// NEW: convenience helper to emit the latest follower count
function emitFollowerCount(partnerId, count) {
    const io = getIO();
    io.to(`partner:${partnerId}`)
        .to(`partnerPublic:${partnerId}`)
        .emit("follow:count", { partnerId, count });
}

module.exports = { initRealtime, getIO, emitTo, emitFollowerCount };
