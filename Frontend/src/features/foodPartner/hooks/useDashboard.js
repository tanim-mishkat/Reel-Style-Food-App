import { useState, useCallback } from "react";

export const useDashboard = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const showError = useCallback((message) => {
        setError(message);
        setSuccess("");
        setTimeout(() => setError(""), 5000);
    }, []);

    const showSuccess = useCallback((message) => {
        setSuccess(message);
        setError("");
        setTimeout(() => setSuccess(""), 3000);
    }, []);

    const clearMessages = useCallback(() => {
        setError("");
        setSuccess("");
    }, []);

    return {
        activeTab,
        setActiveTab,
        error,
        success,
        showError,
        showSuccess,
        clearMessages,
    };
};
