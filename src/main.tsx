import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { FlashcardsProvider } from "./context/FlashcardsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FlashcardsProvider>
      <App />
    </FlashcardsProvider>
  </StrictMode>
);
