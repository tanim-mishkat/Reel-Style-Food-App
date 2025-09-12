import { useEffect } from "react";
import { connectSocket, getSocket } from "../realtime/socket";
import { notificationService } from "../services/api";

/**
 * role: 'user' | 'partner'
 * Called from a component that exists on every page (Navbar is perfect).
 */
export default function useRealtime(role) {
    useEffect(() => {
        // If not logged in, do nothing
        if (!role) return;

        // 1) connect
        const socket = connectSocket();

        // 2) fetch missed notifications + optionally mark delivered
        (async () => {
            try {
                const res =
                    role === "user"
                        ? await notificationService.getUserNotifications()
                        : await notificationService.getPartnerNotifications();

                const notifications = res.data?.notifications || [];

                // Push to your UI via the same custom event your NotificationBell listens to
                notifications.forEach((n) => {
                    const message = mapNotificationToMessage(n.type, n.payload);
                    window.dispatchEvent(
                        new CustomEvent("triggerBell", {
                            detail: {
                                id: n._id,
                                message,
                                time: new Date(n.createdAt).toLocaleTimeString(),
                                read: !!n.readAt
                            }
                        })
                    );
                });
            } catch (e) {
                // silent
            }
        })();

        // 3) live events
        const onOrderCreated = (payload) => {
            if (role !== "partner") return;
            const message = mapNotificationToMessage("order:created", payload);
            window.dispatchEvent(new CustomEvent("showToast", { detail: message }));
            window.dispatchEvent(
                new CustomEvent("triggerBell", {
                    detail: { id: payload.id, message, time: new Date().toLocaleTimeString(), read: false }
                })
            );
        };

        const onOrderStatusUpdated = (payload) => {
            if (role !== "user") return;
            const message = mapNotificationToMessage("order:statusUpdated", payload);
            window.dispatchEvent(new CustomEvent("showToast", { detail: message }));
            window.dispatchEvent(
                new CustomEvent("triggerBell", {
                    detail: { id: payload.id, message, time: new Date().toLocaleTimeString(), read: false }
                })
            );
        };

        const onReviewCreated = (payload) => {
            if (role !== "partner") return;
            const message = mapNotificationToMessage("review:created", payload);
            window.dispatchEvent(new CustomEvent("showToast", { detail: message }));
            window.dispatchEvent(
                new CustomEvent("triggerBell", {
                    detail: { id: payload.id, message, time: new Date().toLocaleTimeString(), read: false }
                })
            );
        };

        const onFollowCreated = (payload) => {
            if (role !== "partner") return;
            const message = mapNotificationToMessage("follow:created", payload);
            window.dispatchEvent(new CustomEvent("showToast", { detail: message }));
            window.dispatchEvent(
                new CustomEvent("triggerBell", {
                    detail: { id: payload.id, message, time: new Date().toLocaleTimeString(), read: false }
                })
            );
        };

        socket.on("order:created", onOrderCreated);
        socket.on("order:statusUpdated", onOrderStatusUpdated);
        socket.on("review:created", onReviewCreated);
        socket.on("follow:created", onFollowCreated);

        return () => {
            const s = getSocket();
            s?.off("order:created", onOrderCreated);
            s?.off("order:statusUpdated", onOrderStatusUpdated);
            s?.off("review:created", onReviewCreated);
            s?.off("follow:created", onFollowCreated);
            // don't disconnect here, Navbar stays mounted across pages
        };
    }, [role]);
}

/** Pretty message for your existing UI components */
function mapNotificationToMessage(type, payload = {}) {
    switch (type) {
        case "order:created":
            return `📋 New order received (#${String(payload.orderId || "").slice(-6)})`;
        case "order:statusUpdated":
            return {
                ACCEPTED: "✅ Your order was accepted",
                PREPARING: "👨🍳 Your order is being prepared",
                READY: "🎉 Your order is ready for pickup",
                COMPLETED: "✨ Order completed — please leave a review",
            }[payload.status] || `Order status: ${payload.status}`;
        case "review:created":
            return `⭐ New review: ${payload.stars}★ on order #${String(payload.orderId || "").slice(-6)}`;
        case "follow:created":
            return `➕ You have a new follower`;
        default:
            return "New notification";
    }
}
