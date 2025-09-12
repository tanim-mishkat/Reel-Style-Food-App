// src/shared/realtime/socket.js
import { io } from "socket.io-client";

let socket;

/**
 * Connect using cookies (httpOnly) sent by your backend.
 * Call connect() once after you know the viewer is authenticated (user or partner).
 */
export function connectSocket() {
    if (socket?.connected) return socket;

    socket = io(import.meta.env.VITE_API_URL?.replace(/\/api$/, ""), {
        transports: ["websocket"],
        withCredentials: true, // send cookies during WS handshake
        autoConnect: true
    });

    // helpful logs (remove in prod)
    socket.on("connect", () => console.log("[ws] connected", socket.id));
    socket.on("disconnect", (reason) => console.log("[ws] disconnected:", reason));

    return socket;
}

export function getSocket() {
    return socket;
}

export function disconnectSocket() {
    try { socket?.disconnect(); } catch (e) {
        // ignore
    }
}
