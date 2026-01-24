

## Fix App Build Errors

There are two files with syntax/duplication errors that need to be fixed:

### 1. Fix `src/integrations/supabase/client.ts`

**Issue:** Extra `});` at the end of the file (line 36) causing a syntax error.

**Fix:** Remove the stray `});` from line 36.

### 2. Fix `src/main.tsx`

**Issue:** The file has severely duplicated code:
- `REQUIRED_ENV_KEYS` is declared 3 times (lines 6-11, 12, and 23)
- `missingEnvKeys` is declared twice (lines 13-21 and lines 24-25)
- `createRoot` is called twice with conflicting logic (lines 32-34 and 35-43)

**Fix:** Clean up the file to have a single, working version:
- Keep only the proper `REQUIRED_ENV_KEYS` constant
- Keep only one `missingEnvKeys` calculation using the `getSupabaseUrl()` and `getSupabasePublishableKey()` functions
- Keep only the dynamic import pattern for loading the App

### Final Clean Code

**`src/integrations/supabase/client.ts`:**
```typescript
// Lines 1-35 remain the same, just remove line 36 (the stray `});`)
```

**`src/main.tsx`:**
```typescript
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

const root = createRoot(rootElement);

if (missingEnvKeys.length > 0) {
  root.render(<MissingEnvScreen missing={missingEnvKeys} />);
} else {
  import("./App").then(({ default: App }) => {
    root.render(<App />);
  });
}
```

This will resolve both build errors and restore the app to working order.

