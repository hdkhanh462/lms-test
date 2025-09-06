import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/App";
import AppProvider from "@/components/providers/app.provider.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);
