import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    // command-center/ is a separate package (POA-BLD-MOTHERSHIP-001) with
    // its own vitest config and jsdom environment - without this exclude,
    // this root config's default test-file glob picks up its test files
    // too (it lives under 50-Mothership/, not inside node_modules) and
    // runs them in this "node" environment, where `document` doesn't
    // exist. This is a test-runner-scoping fix, not a change to any
    // existing Operational Console behavior - the 40 BLD-001/002 tests
    // are unaffected either way.
    exclude: ["**/node_modules/**", "**/dist/**", "command-center/**"],
  },
});
