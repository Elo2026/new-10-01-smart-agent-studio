import { createRoot } from "react-dom/client";
import "./index.css";
import { MissingEnvScreen } from "./components/system/MissingEnvScreen.tsx";
import { getSupabasePublishableKey, getSupabaseUrl } from "./lib/env.ts";

var REQUIRED_ENV_KEYS =
  (globalThis as { __REQUIRED_ENV_KEYS__?: string[] }).__REQUIRED_ENV_KEYS__ ??
  ((globalThis as { __REQUIRED_ENV_KEYS__?: string[] }).__REQUIRED_ENV_KEYS__ = [
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
  ]);
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

const REQUIRED_ENV_KEYS = ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"] as const;
const env = import.meta.env as Record<string, string | undefined>;
const missingEnvKeys = REQUIRED_ENV_KEYS.filter((key) => !env[key]);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  missingEnvKeys.length > 0 ? <MissingEnvScreen missing={missingEnvKeys} /> : <App />
);
const root = createRoot(rootElement);

if (missingEnvKeys.length > 0) {
  root.render(<MissingEnvScreen missing={missingEnvKeys} />);
} else {
  import("./App").then(({ default: App }) => {
    root.render(<App />);
  });
}
