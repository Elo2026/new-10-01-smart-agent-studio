import { createRoot } from "react-dom/client";
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

if (missingEnvKeys.length > 0) {
  console.warn("Missing runtime environment variables:", missingEnvKeys);
}

const root = createRoot(rootElement);

import("./App").then(({ default: App }) => {
  root.render(<App />);
});
const root = createRoot(rootElement);

const resolveMissingEnvKeys = async () => {
  if (missingEnvKeys.length === 0) {
    return missingEnvKeys;
  }

  await new Promise((resolve) => setTimeout(resolve, 200));

  return REQUIRED_ENV_KEYS.filter((key) => {
    if (key === "VITE_SUPABASE_URL") {
      return !getSupabaseUrl();
    }
    if (key === "VITE_SUPABASE_PUBLISHABLE_KEY") {
      return !getSupabasePublishableKey();
    }
    return false;
  });
};

resolveMissingEnvKeys().then((resolvedMissing) => {
  if (resolvedMissing.length > 0) {
    root.render(<MissingEnvScreen missing={resolvedMissing} />);
    return;
  }

  import("./App").then(({ default: App }) => {
    root.render(<App />);
  });
});
if (missingEnvKeys.length > 0) {
  root.render(<MissingEnvScreen missing={missingEnvKeys} />);
} else {
  import("./App").then(({ default: App }) => {
    root.render(<App />);
  });
}
