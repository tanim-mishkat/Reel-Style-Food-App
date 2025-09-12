import { io } from "socket.io-client";

let socket;
export function connectSocket() {
    if (socket?.connected) return socket;

    const api = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const wsBase = api.replace(/\/api$/, ""); // => http://localhost:3000

    socket = io(wsBase, {
        transports: ["websocket"],
        withCredentials: true,
        autoConnect: true,
    });

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
