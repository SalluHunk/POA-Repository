import { test, expect, type Page } from "@playwright/test";

// Deterministic capture: frozen clock (the header shows the time), fonts
// awaited, animations disabled at capture. Data is the backend's seeded
// fixture set. Surfaces per Commander brief: Executive Home / Presence and
// People focus at desktop and tablet; mobile is DOCUMENTATION ONLY (the
// fixed-stage limitation is a recorded constraint, not a target).
const FIXED_TIME = new Date("2026-09-30T12:00:00Z");

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
} as const;

async function openPresence(page: Page) {
  await page.clock.setFixedTime(FIXED_TIME);
  await page.goto("/");
  await expect(page.getByText(/things? require attention|Nothing requires attention/)).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

async function openPeopleFocus(page: Page) {
  await openPresence(page);
  await page.locator(".domain-orb").filter({ hasText: /people/i }).click();
  await expect(page.getByText(/principals in this organization/)).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  test(`Executive Home / Presence — ${name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openPresence(page);
    await expect(page).toHaveScreenshot(`presence-${name}.png`);
  });
}

for (const name of ["desktop", "tablet"] as const) {
  test(`People focus — ${name}`, async ({ page }) => {
    await page.setViewportSize(VIEWPORTS[name]);
    await openPeopleFocus(page);
    await expect(page).toHaveScreenshot(`people-focus-${name}.png`);
  });
}
