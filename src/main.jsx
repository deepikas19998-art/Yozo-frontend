import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

import SavedProvider from "./context/SavedContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <SavedProvider>
        <App />
      </SavedProvider>
    </AuthProvider>
  </StrictMode>
);