import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/atmosphere.css";
import { LanguageProvider } from "@/i18n/LanguageContext"; // ✅ إضافة المزوّد

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);
