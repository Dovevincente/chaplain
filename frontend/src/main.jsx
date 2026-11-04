import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

/**
 * The Chaplaincy Savings and Credit Union (TCSCU) application entry point.
 *
 * Responsibilities:
 * - Load global application styles.
 * - Initialize the React application.
 * - Provide authentication state to the complete application tree.
 * - Fail early with a clear error if the application mount point is missing.
 */

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    'The Chaplaincy Savings and Credit Union (TCSCU) could not start because the "#root" element was not found in index.html.',
  );
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);