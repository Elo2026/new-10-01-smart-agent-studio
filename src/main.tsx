import { createRoot } from "react-dom/client";
import "./index.css";
import { MissingEnvScreen } from "./components/system/MissingEnvScreen.tsx";

const REQUIRED_ENV_KEYS = ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"] as const;
const env = import.meta.env as Record<string, string | undefined>;
const missingEnvKeys = REQUIRED_ENV_KEYS.filter((key) => !env[key]);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

if (missingEnvKeys.length > 0) {
  root.render(<MissingEnvScreen missing={missingEnvKeys} />);
} else {
  import("./App").then(({ default: App }) => {
    root.render(<App />);
  });
}
