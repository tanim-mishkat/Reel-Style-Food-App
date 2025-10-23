import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import { initializeCSRF } from "./shared/services/api.js";

// Initialize CSRF token when app starts and wait for it
async function startApp() {
  try {
    await initializeCSRF();
  } catch (error) {
    // CSRF initialization failed - will be handled by interceptors
  }

  createRoot(document.getElementById("root")).render(<App />);
}

startApp();
