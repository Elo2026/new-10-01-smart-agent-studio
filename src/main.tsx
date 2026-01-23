import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MissingEnvScreen } from "./components/system/MissingEnvScreen.tsx";
import { getSupabasePublishableKey, getSupabaseUrl } from "./lib/env.ts";

const REQUIRED_ENV_KEYS = ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"] as const;
const missingEnvKeys = REQUIRED_ENV_KEYS.filter((key) => {
  if (key === "VITE_SUPABASE_URL") {
    return !getSupabaseUrl();
  }
  if (key === "VITE_SUPABASE_PUBLISHABLE_KEY") {
    return !getSupabasePublishableKey();
  }
  return false;
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  missingEnvKeys.length > 0 ? <MissingEnvScreen missing={missingEnvKeys} /> : <App />
);
