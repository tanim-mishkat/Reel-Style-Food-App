import { useEffect, useState } from "react";
import { connectSocket } from "../realtime/socket";
import { followService } from "../services/api";

export default function useFollowerCount(partnerId, { initial = 0 } = {}) {
    const [count, setCount] = useState(initial);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const { data } = await followService.getFollowerCount(partnerId);
                if (mounted) setCount(data?.count ?? 0);
            } catch {/* ignore */ }
        })();

        const socket = connectSocket();
        socket.emit("subscribe:partner", partnerId);
        const onCount = ({ partnerId: pid, count }) => {
            if (pid === partnerId) setCount(count ?? 0);
        };
        socket.on("follow:count", onCount);

        return () => {
            mounted = false;
            socket.off("follow:count", onCount);
        };
    }, [partnerId]);

    const toggleFollow = async () => {
        const { data } = await followService.toggleFollow(partnerId);
        return !!data?.following; // count arrives via socket
    };

    return { count, toggleFollow };
}
