import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import { initializeCSRF } from "./shared/services/api.js";

// Initialize CSRF token when app starts
initializeCSRF();

createRoot(document.getElementById("root")).render(<App />);
