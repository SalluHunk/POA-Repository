# POA-BLD-003 — Mothership Experience & Interface

## Design Artifacts (Phases 1–9 preparation)

**Status: DESIGN ARTIFACTS ONLY. No implementation code has been written or changed under this mission yet.** Per the brief's own "IMPORTANT CONSTRAINT" and explicit user direction, this document (A–I) is produced first and paused for review before any UI code is touched.

**Predecessor:** POA-BLD-002 (commit `4b7c3c7`) — functional Mothership Control Panel, 40/40 tests passing, clean typecheck. This document does not redesign from a screenshot; every claim below is checked against the actual current implementation (`50-Mothership/public/app.js`, `styles.css`, `index.html`, `server/api.ts`) as it exists at that commit.

---

## A. UX Audit (Phase 1)

### A.1 — What information currently exists

Inspected directly from `public/app.js` and `server/api.ts`, not inferred:

| Screen | Information shown |
|---|---|
| Home (`#/`) | Organization name/ID, registered-identity count, runtime status string, mission counts by state, aggregate chain-verified/witness-matched/never-checkpointed counts, a static "Known Conditional Conditions" list |
| Mission Console (`#/missions`) | Mission ID, state, origin (fixture/operator) — flat table, plus a create-mission form |
| Mission Detail (`#/missions/:id`) | State, origin, evidence count, head hash, chain-verified bool, witness code, overall-trust badge, a checkpoint button, a lifecycle-transition form, an authorize-and-execute form, and the full evidence list as `<dl>` blocks (sequence, who, why, result, when, envelopeHash, signature) |
| Capability/Authorization (`#/capabilities`) | Per-principal role/engine/active/granted-capabilities table; a flat authorization-decision history table (mission, principal, capability, granted/denied) |
| Isolation Check (`#/isolation`) | Three dropdowns (mission-owning org, mission, requesting org) and a raw JSON result of the access attempt |

### A.2 — Most important information, by audience

- **Executive** (never opens Mission Detail): needs to answer *"is anything wrong, and does anything need my attention"* in under five seconds. Today's Home gives raw counts with no severity signal — a Failed mission and a Closed mission both render as a neutral number in the same grid. There is no "what changed since I last looked" and no "what's blocked."
- **Operator** (drives missions day to day): needs to see, per mission, *what state it's in and what the next legal action is*. Today the operator must know the mission lifecycle state machine by heart (Created→Running→Succeeded/Failed→Closed) — the UI offers all four transition targets in one dropdown regardless of current state, and only tells you it was illegal after you submit.
- **Mission owner** (accountable for one mission's outcome): needs *why* a decision landed the way it did — was an action authorized, by whom, under what capability, is the evidence intact. This exists today only as a flat `<dl>` list per evidence entry; there is no visual distinction between "the hash chain holds" (**Integrity**) and "the right person had the right grant to do this" (**Authority**) — Phase 6 names this exact gap explicitly.

### A.3 — Actions available, primary vs. secondary

| Action | Where | Primary or secondary |
|---|---|---|
| Create mission | Mission Console | Primary (operator) |
| Transition mission lifecycle | Mission Detail | Primary (operator) |
| Authorize & execute an action | Mission Detail | Primary (operator) |
| Checkpoint mission | Mission Detail | Secondary — a maintenance action, currently styled identically to primary actions |
| Attempt cross-org access | Isolation Check | Diagnostic, not an operator workflow — currently sits in primary navigation alongside real work screens |
| Switch organization | Header | Contextual, correctly placed |

### A.4 — Buried information

- **Authorization decisions** exist as real evidence (`AUTHORIZATION_DECISION` entries with a `reason` field distinguishing `AUTHORIZED` from `CAPABILITY_NOT_GRANTED`) but are only visible two ways: scrolling a mission's full evidence `<dl>` list, or a flat unfiltered table on a separate page with no mission context. There is no per-mission "decisions" summary.
- **Origin** (`TEST FIXTURE` vs `OPERATOR-CREATED`) is shown as a badge but never explained anywhere in the UI — a first-time viewer cannot tell why it matters.
- **Which engine executed an action** (`agent-materializer`'s `engine: "claude"`) is visible only inside a dropdown option's parenthetical text, never as a first-class fact anywhere else.

### A.5 — Confusing interactions

- The lifecycle-transition dropdown always offers all four non-`Created` states regardless of current state, so an operator can attempt `Closed → Running` and only learns it's illegal from a raw JSON error blob.
- "Checkpoint mission" and "Transition"/"Authorize & Execute" are visually identical buttons, but checkpoint is idempotent maintenance while the others are consequential state changes — no distinction in weight or confirmation.
- Every form failure/success is rendered as `JSON.stringify(result)` — technically accurate, not human-readable (violates the brief's "executive-grade, fast to understand" target directly).
- Evidence entries show a raw `when` ISO timestamp with no relative framing ("2 minutes ago") and no way to tell evidence order from state changes at a glance without reading `sequence` numbers.

### A.6 — Missing screens (relative to what real data already supports)

- **People / Agents** — real data (`ExecutionPrincipal`: id, role, engine, active, capabilities) currently only surfaces as a side-table on the Capabilities page, never as its own identity-centric view.
- **A per-mission Decisions summary** — real data exists (authorization decisions), no dedicated presentation.
- **System Health at a glance** — real aggregate data exists (mission/evidence/witness counts) but is buried inside Home's generic stat grid with no severity framing.

### A.7 — Screens/data with NO current backing (do not build; see IA §B.3)

Resources, Governance (as a distinct enforced concept beyond capability grants), Repository/Version History, and Intelligence have no corresponding field, endpoint, or entity anywhere in `50-Mothership/src/` or `server/api.ts`. Building screens for these would mean fabricating data, which Phase 7/9 explicitly forbid.

### A.8 — Current components that should become reusable primitives

`statCard`, `badge`/`boolBadge`/`witnessBadge`/`stateBadge`/`originBadge`, the evidence-item block, and the table-with-clickable-rows pattern are already implicitly reusable (used 2–4 times each) but exist as ad hoc inline calls with no shared visual contract (e.g., `overallStatus` badges are built inline in `renderMissionDetail` rather than through a shared status-badge primitive with a fixed vocabulary). Phase 3/9 both call for formalizing these into an actual design system rather than continuing to hand-roll variations per screen.

---

## B. Information Architecture (Phase 2)

### B.1 — Conceptual area → real data mapping

| Conceptual area (brief §Phase 2) | Real backing data today | Disposition |
|---|---|---|
| Executive / Home | Org, principals, missions, aggregate integrity | **Primary nav** — redesigned |
| Mission Control | Missions, states, origin | **Primary nav** — redesigned |
| Mission Detail | Mission, evidence, integrity, actions | **Contextual (drill-down from Mission Control)** — redesigned, evidence chain is the centerpiece |
| Decisions | `AUTHORIZATION_DECISION` evidence entries | **Not a top-level nav item.** Real data, but scoped per-mission — surfaced as a first-class section inside Mission Detail's evidence chain (the "Decision" step of the 7-step chain, §D.6) rather than a separate global screen, because decisions have no meaning outside their mission's context yet |
| Evidence | Evidence envelopes | **Folded into Mission Detail** as the centerpiece experience (not a separate route) — evidence is inherently mission-scoped in the current runtime |
| Organization | Organization id/name, principal roster | **Contextual** — organization identity lives in the header picker; the principal roster is covered by People & Capabilities |
| People / Agents | `ExecutionPrincipal` (id, role, engine, active, capabilities) | **Primary nav** — new dedicated identity-first view, merged with Capabilities (below) |
| Capabilities | Capability grants per principal | **Merged into People & Capabilities** — a capability has no meaning independent of who holds it in this runtime |
| Authorization | Authorization decisions | **Merged into People & Capabilities** (aggregate/global view) and into Mission Detail (per-mission view) — two legitimate audiences, no separate top-level screen needed |
| Resources | *(none)* | **Future module — documented only, not built** |
| Governance | *(none beyond capability grants, already covered above)* | **Future module — documented only, not built** |
| System Health | Mission/evidence/witness aggregate counts | **Folded into Executive/Home**, framed by severity rather than raw counts — not a separate nav item, since it is exactly what an executive opens Home to see |
| Repository / Version History | *(none)* | **Future module — documented only, not built** |
| Intelligence | *(none)* | **Future module — documented only, not built.** Home's "what changed / what needs attention" framing (§F.1) is designed so a future intelligence layer can populate it later without a navigation redesign |

### B.2 — Proposed primary navigation

```
Executive (Home)  ·  Mission Control  ·  People & Capabilities
```

Three items, not five-plus. Isolation Check moves out of primary navigation into a small "Diagnostics" affordance (footer link or a settings-style icon) — it is a verification tool for this mission's own security guarantee, not an operator's daily workflow, and its presence beside real work screens today misrepresents its purpose.

### B.3 — Contextual / drill-down structure

```
Executive (Home)
  → "needs attention" item → Mission Detail (direct deep link)

Mission Control
  → row click → Mission Detail
      → Evidence chain (in-page, not a separate route)
      → Lifecycle actions (in-page, gated by current state)

People & Capabilities
  → principal row → (future: per-principal detail; not built this mission —
    the runtime has no additional per-principal data beyond what's already
    shown in the roster table, so a detail page would either repeat the
    roster row or fabricate content)
```

### B.4 — Future modules (explicitly not built this mission)

Decisions-as-a-global-screen, Governance, Resources, Repository/Version History, Intelligence. Each is named in this document so a future mission has a starting reference point, per the Stopping Rule ("document it and escalate" rather than build speculatively).

---

## C. Mothership Design Principles

Six principles, each directly answerable against any future screen before it ships:

1. **Show severity, not just facts.** A number alone (e.g., "1 Failed") is not information until it is visually distinguishable from "0 Failed" at a glance without reading the label.
2. **State must survive greyscale.** Every semantic status carries a non-color signal (glyph + word), because color is a reinforcement, never the only carrier (Phase 3's explicit requirement).
3. **Integrity and Authority are different questions and must look different.** "Does the hash chain hold" and "did the right identity have the right grant" are never merged into one badge (Phase 6's explicit prohibition).
4. **Never show a number the runtime didn't actually compute.** If a conceptual area has no backing data, say "not yet available," not a plausible-looking zero.
5. **One primary action per screen state.** Secondary/maintenance actions (checkpoint) are visually and posturally distinct from consequential ones (transition, authorize).
6. **Progressive disclosure, always.** Overview → Context → Detail → Evidence → Reasoning → Action, in that order, on every screen — never all five at once.

---

## D. Design System Specification (Phase 3)

### D.1 — Typography hierarchy

| Role | Size | Weight | Use |
|---|---|---|---|
| Display | 28px | 600 | Executive headline metric only (e.g., a single "3 missions need attention" statement on Home) |
| Title | 20px | 600 | Screen title |
| Section | 13px, uppercase, +0.04em tracking | 600 | Card/section headers (existing pattern, kept) |
| Body | 14px | 400 | Default text |
| Body-strong | 14px | 600 | Emphasized inline facts (who/what in evidence) |
| Small | 12.5px | 400 | Metadata, timestamps, secondary labels |
| Mono | 12.5px, monospace | 400 | IDs, hashes, signatures (existing `.mono` pattern, kept) |

### D.2 — Spacing system

Base unit **4px**. Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48. Card padding moves from the current ad hoc `16px 18px` to the scale's `16px`/`24px` pair (compact card / roomy card), consistently.

### D.3 — Grid / layout rules

Content max-width stays at **1080px** (already correct for a data-dense but readable console). Cards use a **12-column** conceptual grid at wide viewports, collapsing to single-column under 720px (tablet-minimum per Phase 14 of BLD-002, preserved).

### D.4 — Surface hierarchy

Three layers (already present, formalized): `--bg` (page) → `--panel` (card) → `--panel-2` (nested/interactive surface, e.g. table row hover, stat tile). A fourth, `--panel-3`, is added for the new "attention" surface on Home (§F.1) so flagged items are visually elevated above ordinary cards without needing a new color family.

### D.5 — Component specifications

| Component | Spec |
|---|---|
| **Card** | Existing pattern kept: bordered, `--panel` background, 8px radius. Adds an optional "attention" variant (`--panel-3` background, left border accent) for flagged content. |
| **Panel** | Same as Card, used for grouping without a heading (e.g., inline forms). |
| **Table** | Existing pattern kept (bordered rows, uppercase headers). Adds a "clickable row" affordance (subtle chevron on hover) so drill-down rows are distinguishable from static ones — today all tables look identical whether clicking does something or not. |
| **Badge** | Reworked: every badge is `[glyph] [WORD]`, never color alone (see D.6). |
| **Status indicator** | New: a compact dot+glyph+label combination for Home's "needs attention" list. |
| **Button** | Existing `button`/`button.primary` kept. Adds `button.caution` (for consequential actions — transition, authorize) and `button.quiet` (for maintenance — checkpoint), visually distinct by weight, not just color. |
| **Input / Dropdown** | Existing pattern kept, unchanged. |
| **Tabs** | New primitive, needed for Mission Detail's progressive disclosure (Overview / Evidence / Actions as tabs rather than one long scroll — see §E). |
| **Navigation** | Reworked per §B.2 (three primary items + a diagnostics affordance). |
| **Breadcrumbs** | New: `Mission Control / mission-demo-001` replaces the current plain "← Mission Console" link, giving location context, not just a back-action. |
| **Modal** | New, used only for consequential-action confirmation (Phase 7) — transition and authorize-and-execute gain a confirm step showing impact/scope/organization/authority before submission. |
| **Drawer** | Not needed this mission — nothing in the current or newly-scoped IA requires a side-panel; documented as available for a future module (e.g., Decisions detail) rather than built speculatively. |
| **Alert / Notification** | Reworked: replaces `JSON.stringify(result)` with a human-readable sentence built from the response's `code`/`detail` fields (e.g., "Denied — org-beta attempted to access a mission owned by org-paravyoma", already present as `detail` server-side, just never rendered as prose). |
| **Empty state** | New consistent primitive: icon + one-sentence explanation + (where applicable) the primary action to resolve it. Replaces today's inconsistent `<p class="muted">` one-liners. |
| **Loading state** | New: a skeleton/placeholder card shape rather than the current literal text "Loading…", which currently causes a visible content flash on every navigation. |
| **Error state** | New consistent primitive (distinct from empty state — a failure, not an absence). |
| **Confirmation state** | New: post-action success feedback follows the same Alert primitive, styled `ok`. |
| **Evidence presentation** | Fully redesigned — see §D.6, the mission's named centerpiece requirement. |
| **Chart / visualization container** | Not built this mission (no metric today justifies a chart over a stat tile — Phase 4 explicitly warns against "meaningless charts"); the container primitive is specified so a future module can use it without a new pattern: a bordered panel matching Card, fixed aspect ratio, always paired with a text summary of what it shows. |

### D.6 — The Evidence chain, redesigned (Phase 6's named requirement)

Today's evidence `<dl>` presents seven real fields per entry but does not organize them into the seven-step chain the brief specifies. The redesign maps every step to a field that already exists — nothing here requires new runtime data:

| Chain step | Real data source | Presented as |
|---|---|---|
| **Evidence** | The envelope itself (`sequence`, `what`) | The entry's headline |
| **Source** | `payload.what` + `mission`/`organization` | "What happened, in which mission/org" |
| **Attribution** | `producerId`, `payload.who` | "Who — which principal, which engine" (joins People & Capabilities data) |
| **Integrity** | `payloadHash`, `envelopeHash`, `prevHash` matching the chain's own verification | A distinct **Integrity** badge: does this entry's hash still match what was recorded — never merged with Authority |
| **Verification** | The mission-level `chainVerified`/`witnessCode` (already computed server-side) | Shown once per mission, referenced from each entry, not recomputed per entry |
| **Authority** | `signature` presence + the matching `AUTHORIZATION_DECISION` entry's `reason` | A distinct **Authority** badge: was this action backed by a real grant, and whose — separate axis from Integrity, per Phase 6's explicit prohibition on merging them |
| **Decision** | `AUTHORIZATION_DECISION` payload (`why`=capability, `result`=reason) | The plain-language outcome: "Authorized — mission:execute granted" or "Denied — capability not granted" |

### D.7 — Semantic states (color + mandatory non-color carrier)

| State | Glyph | Color (reinforcement only) | Meaning |
|---|---|---|---|
| Healthy | ✓ | green | Everything nominal |
| Active | ● (filled) | blue | Currently running/in progress |
| Pending | ◷ | amber | Awaiting an action |
| Warning | ▲ | amber | Needs attention, not yet failed |
| Blocked | ⛔ | red | Cannot proceed without intervention |
| Failed | ✕ | red | Terminal negative outcome |
| Verified | ✓✓ | green | Independently checked and matched |
| Unverified | ○ | grey/neutral | No check has run — absence, not failure (this is exactly the `NO_CHECKPOINT` distinction already fixed at the API layer in BLD-002, now given a first-class visual vocabulary) |
| Conditional | ◐ | amber | Passes, with a disclosed caveat (e.g., test-double witness) |
| Checkpointed | ⚑ | blue | A witness snapshot exists for this state |
| Executing | ◌ (animated sparingly, or static in reduced-motion) | blue | Async action in flight |
| Completed | ✓ | green | Terminal positive outcome |

Every badge in the system is rendered as `[glyph] LABEL`, and a greyscale screenshot test is part of the validation plan (§I).

---

## E. Screen Inventory (Phase 2/9 scope)

| Screen | Route | Status | Primary content |
|---|---|---|---|
| Executive (Home) | `#/` | Redesign | "Needs attention" list (severity-ranked, real data only), organization context, system-health summary (folded from old aggregate stats) |
| Mission Control | `#/missions` | Redesign | Mission list grouped/sortable by state and severity, not a flat table; create-mission action clearly secondary to the list itself |
| Mission Detail | `#/missions/:id` | Major redesign | Tabbed: Overview (identity/objective/status/owner/org/phase/next-action) · Evidence (the 7-step chain, §D.6) · Actions (transition/authorize/checkpoint, with confirmation modal for consequential ones) |
| People & Capabilities | `#/people` (renamed from `#/capabilities`) | Redesign/merge | Identity-first roster (principal, role, engine, active, capabilities) with the authorization-decision history as a secondary, filterable panel on the same screen |
| Isolation Check | `#/diagnostics/isolation` (moved out of primary nav) | Kept, repositioned | Unchanged functionally; reframed as a diagnostic tool, not a workflow screen |
| *(Future modules — not built)* | — | Documented only | Decisions (global), Governance, Resources, Repository/Version History, Intelligence |

---

## F. Primary User Journeys (Phase 5/6)

**F.1 — Executive morning check-in.** Opens Home. Sees a ranked "needs attention" list (e.g., a Failed mission, a mission never checkpointed) above the fold, each item answering "what changed" and linking directly to Mission Detail. If nothing needs attention, Home says so explicitly rather than showing an empty-feeling grid of zeros.

**F.2 — Operator driving a mission.** Opens Mission Control, finds a Running mission, opens Mission Detail's Actions tab. Only the currently-legal transitions are offered (Created→Running only shows Running; Running shows Succeeded/Failed; terminal states show none) — sourced from the same state machine already enforced server-side, mirrored client-side for guidance only, with the server's response remaining authoritative on any mismatch. Authorize-and-execute shows a confirmation step naming the organization and capability before submitting.

**F.3 — Mission owner investigating a denial.** Opens Mission Detail's Evidence tab, finds the denied action, sees Integrity (hash intact) and Authority (capability not granted) as two separate, clearly labeled badges on the same entry, with the plain-language Decision line beneath.

**F.4 — Diagnostic isolation check.** A security reviewer (not a daily operator) navigates to Diagnostics → Isolation Check, unchanged from today functionally, now clearly out of the primary workflow path.

---

## G. Proposed Visual Direction (Phase 4)

The existing dark neutral palette (`#0e1116` background, `#161b22`/`#1c2229` panels, desaturated blue accent) already avoids the brief's named anti-patterns (no gradients, no excessive rounding, no decorative charts) and is kept as the base. Changes:

- **Typography** stays system-font-stack (no new web-font dependency — nothing in this mission justifies adding one, per Phase 9's "no unnecessary dependencies").
- **Iconography**: the glyph set in D.7 is rendered as Unicode/CSS characters, not an icon-font or SVG-sprite dependency — consistent with the zero-dependency posture established in BLD-002.
- **Motion**: state transitions (e.g., a card entering the "attention" list) use a single, short opacity/transform fade (~120ms); no persistent animation, per Phase 4's explicit "avoid excessive animation."
- **Density**: kept high (this is a console for daily use, not a marketing page) but organized via progressive disclosure (tabs) rather than one long scroll, which is today's actual density problem — not too much information, but no ordering to it.

---

## H. Component Architecture (Phase 9 preparation)

Stays vanilla JS / no framework / no bundler (unchanged rationale from BLD-002 S15: the smallest option consistent with the existing repository, and nothing in this mission's requirements changes that calculus). Proposed module split, replacing the current single 528-line `app.js`:

```
public/
  app.js            — router + boot only
  api-client.js     — the existing fetch wrapper
  components/
    primitives.js   — el(), Badge, Card, Table, Button variants, Breadcrumb
    status.js       — the D.7 semantic-state vocabulary (glyph+label+kind), single source of truth
    evidence.js      — the D.6 seven-step evidence chain renderer
    states.js        — EmptyState, LoadingState, ErrorState, ConfirmModal
  views/
    home.js, missions.js, mission-detail.js, people.js, diagnostics.js
```

This is a refactor of existing logic into named, reusable modules — no new runtime dependency, no build step (native ES module `<script type="module">` imports, already how `index.html` loads `app.js` today).

---

## I. Implementation Plan (Phase 9 scope + Phase 10 validation)

**Explicit scope decisions (stated, not silent):**

1. Phase 10 item 3 ("add appropriate UI tests") and item 5 ("use Playwright against the actual application") are treated as **two distinct, separately-satisfied requirements**: item 3 will be met by extending the existing `test/server.test.ts` HTTP-layer tests to cover any new/changed API response shapes this redesign introduces (e.g., if the Evidence-chain redesign needs any additional field from `server/api.ts`); item 5 will be met by a live Playwright pass against the running server, screenshotted, covering every primary screen and the greyscale/non-color-carrier check from D.7. No new frontend test framework (jsdom/testing-library) will be introduced — that would be an unnecessary new dependency for this mission's scope, and the existing pattern (API-layer regression tests + live browser validation) is what BLD-002 already used successfully.
2. Resources, Governance, Repository/Version History, and Intelligence get **zero implementation** this mission — documented above only.
3. "Decisions" gets no standalone screen — folded into Mission Detail's Evidence tab and People & Capabilities' history panel, per §B.1.

**Ordered implementation steps (for the next session, after review):**

1. Extract `components/primitives.js`, `components/status.js` (the D.7 vocabulary) first — every other view depends on these.
2. Build `components/evidence.js` (the D.6 seven-step chain) against `mission-demo-001`'s real seeded data, since it is this mission's named centerpiece.
3. Rebuild Mission Detail with tabs (Overview/Evidence/Actions) and the confirmation-modal primitive for consequential actions.
4. Rebuild Executive/Home around the "needs attention" ranked list.
5. Rebuild Mission Control with severity-aware grouping.
6. Build People & Capabilities (merge of the former Capabilities screen + principal roster).
7. Move Isolation Check to a diagnostics-only surface, out of primary nav.
8. Update `styles.css` for the new typography/spacing scale, badge system, and greyscale-safe glyphs.
9. Run `npm run typecheck` and `npm test` (must remain 40/40 — no BLD-001/002 regression).
10. Extend `test/server.test.ts` for any new API surface (scope decision 1).
11. Run the real server (`npm run console`), drive every primary screen live via Playwright, screenshot each, and re-run one screenshot desaturated to confirm the greyscale requirement (D.7/Design Principle 2).
12. Re-verify organization isolation and the BLD-002 security fixes (cross-org mission-ID collision rejection, `witnessCode` MATCH-vs-NO_CHECKPOINT distinction) still hold through the new UI.
13. Write `40-Runtime/POA-BLD-003-COMPLETION-REPORT.md` following the same VERIFIED/OBSERVED/INFERRED/UNVERIFIED discipline established in the BLD-002 report.

---

**This document is the complete Phase 1–9-preparation deliverable. No implementation has begun. Awaiting review before proceeding to the ordered steps above.**
