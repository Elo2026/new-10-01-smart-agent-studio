import { createRoot } from "react-dom/client";
import "./index.css";
import { MissingEnvScreen } from "./components/system/MissingEnvScreen.tsx";
import { getSupabasePublishableKey, getSupabaseUrl } from "./lib/env.ts";

const REQUIRED_ENV_KEYS = ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"] as const;

const checkEnvKeys = () =>
  REQUIRED_ENV_KEYS.filter((key) => {
    if (key === "VITE_SUPABASE_URL") return !getSupabaseUrl();
    if (key === "VITE_SUPABASE_PUBLISHABLE_KEY") return !getSupabasePublishableKey();
    return false;
  });

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

const resolveMissingEnvKeys = async () => {
  const missing = checkEnvKeys();
  if (missing.length === 0) return missing;

  // Wait for Lovable Cloud runtime injection
  await new Promise((resolve) => setTimeout(resolve, 200));
  return checkEnvKeys();
};

resolveMissingEnvKeys().then((resolvedMissing) => {
  if (resolvedMissing.length > 0) {
    console.warn("Missing runtime environment variables:", resolvedMissing);
    root.render(<MissingEnvScreen missing={resolvedMissing} />);
    return;
  }

  import("./App").then(({ default: App }) => {
    root.render(<App />);
  });
});
