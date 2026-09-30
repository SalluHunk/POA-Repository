import { defineConfig } from "@playwright/test";

// Minimum viable visual regression for POA-ORG-KNOW-P5-UI-FOUND-001 (Commander
// Decision A). Not a testing-framework migration: vitest remains the unit/
// behaviour runner; Playwright is used only for deterministic screenshot
// comparison against baselines committed in visual/__baselines__/.
// Uses the system Chrome (no browser download). Baselines are per-platform.
export default defineConfig({
  testDir: "./visual",
  testMatch: "**/*.visual.ts",
  snapshotPathTemplate: "{testDir}/__baselines__/{platform}/{arg}{ext}",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  outputDir: "./visual/.output",
  use: {
    channel: "chrome",
    baseURL: "http://localhost:5311",
    colorScheme: "dark",
    locale: "en-GB",
    timezoneId: "UTC",
  },
  expect: {
    toHaveScreenshot: { animations: "disabled", maxDiffPixelRatio: 0 },
  },
  webServer: [
    { command: "npm run console", cwd: "..", url: "http://localhost:5310/", reuseExistingServer: true, timeout: 60_000 },
    { command: "npm run dev", url: "http://localhost:5311/", reuseExistingServer: true, timeout: 60_000 },
  ],
});
