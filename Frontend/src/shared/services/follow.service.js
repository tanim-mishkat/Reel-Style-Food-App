import axios from "axios";

const API = (import.meta.env.VITE_API_URL || "http://localhost:3000/api");

export const followService = {
    getFollowerCount: (partnerId) => axios.get(`${API}/follow/count/${partnerId}`, { withCredentials: true }),
    toggleFollow: (partnerId) => axios.post(`${API}/follow/partner`, { partnerId }, { withCredentials: true }),
};
