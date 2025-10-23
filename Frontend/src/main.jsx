import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import { initializeCSRF } from "./shared/services/api.js";

// Initialize CSRF token when app starts and wait for it
async function startApp() {
  try {
    await initializeCSRF();
    console.log("App starting with CSRF token ready");
  } catch (error) {
    console.warn("Failed to initialize CSRF token:", error);
  }

  createRoot(document.getElementById("root")).render(<App />);
}

startApp();
