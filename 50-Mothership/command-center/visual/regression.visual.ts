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

// Deterministic capture needs the page's ~120 infinite CSS animations (stars,
// orb drift, spin, ripple...) genuinely frozen. Playwright's
// `animations: "disabled"` does not do that reliably on this DOM: output kept
// changing with elapsed time (see OVERLAY-STABILITY-PROBE-REPORT), which made
// baselines phase-dependent and the suite intermittently flaky. This is a
// test-harness freeze only; the product keeps its animations at runtime.
const FREEZE_ANIMATIONS = "*,*::before,*::after{animation:none!important;transition:none!important}";

async function openPresence(page: Page) {
  await page.clock.setFixedTime(FIXED_TIME);
  await page.goto("/");
  await expect(page.getByText(/things? require attention|Nothing requires attention/)).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: FREEZE_ANIMATIONS });
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

// Coverage added before the token migration so every surface it touches is
// pixel-guarded (desktop only). Read-only navigation: nothing here triggers a
// state-changing action (no transition/checkpoint/confirm).
test.describe("additional surfaces — desktop", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.desktop);
    await openPresence(page);
  });

  test("Mission focus", async ({ page }) => {
    await page.getByLabel(/Focus mission mission-demo-002/).click();
    await expect(page.getByText(/Mark Running/i)).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot("mission-focus-desktop.png");
  });

  test("Action confirm panel (opened, never confirmed)", async ({ page }) => {
    await page.getByLabel(/Focus mission mission-demo-002/).click();
    await page.getByText(/Mark Running/i).click();
    await expect(page.getByText(/CONFIRM — CONSEQUENTIAL ACTION/i)).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot("action-confirm-desktop.png");
  });

  test("Mission investigate (evidence chain)", async ({ page }) => {
    await page.getByLabel(/Focus mission mission-demo-003/).click();
    await page.getByText(/Investigate/i).first().click();
    await expect(page.getByText(/evidence chain/i)).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot("mission-investigate-desktop.png");
  });

  test("Principal focus", async ({ page }) => {
    await page.getByPlaceholder(/Jump to a mission or principal by ID/i).fill("agent-materializer");
    await page.keyboard.press("Enter");
    await expect(page.getByText(/GRANTED CAPABILITIES/i)).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot("principal-focus-desktop.png");
  });

  test("Project registry", async ({ page }) => {
    await page.getByLabel("Open command overlay").click();
    await page.getByText(/Projects — repository registry/).click();
    await expect(page.getByText(/Return to Presence/i)).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    // The "Repository Reference: <path> @ <commit>" lines embed the git HEAD
    // SHA, which changes with every commit - masked so the baseline stays
    // deterministic (all other pixels on this surface remain compared).
    await expect(page).toHaveScreenshot("project-registry-desktop.png", { mask: [page.getByText(/Repository Reference:/)] });
  });

  test("Command overlay", async ({ page }) => {
    await page.getByLabel("Open command overlay").click();
    await expect(page.getByRole("dialog", { name: "Command overlay" })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot("command-overlay-desktop.png");
  });
});
