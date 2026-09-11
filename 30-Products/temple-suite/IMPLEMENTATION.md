# Temple Suite -- DGP-DEV-001 Phase B Architecture-Proving Slice

This subtree is NOT the Temple Suite product and NOT a production
application. It materializes exactly the bounded slice authorized by
DGP-DEV-001 Phase B: Synthetic First Contact -> Relationship Memory
Identity -> Events Registration -> Domain Event -> DGP Journey Stage.

Synthetic data only. No real devotee, temple, or client data of any kind
may be added to this subtree. See fixtures/synthetic-data.ts.

## Implementation-level decisions (not POA architecture)

These are documented here per DGP-DEV-001 Phase B governing invariant 10:
implementation-level technical decisions delegated to this mission may be
made, but must be documented as implementation decisions, not represented
as ratified POA-level architecture.

1. Language/runtime: TypeScript on Node.js, matching the RECOMMENDED
   (not DECIDED) choice named in TSAAS-TECH-001 and TSAAS-002. Test
   runner: Vitest, matching the convention already used by
   30-Products/poa-vis-001.
2. Persistence: in-memory only, for this slice. No database is
   introduced. TSAAS-002 section 10 leaves the database-level
   module-boundary enforcement technique OPEN (per-module schema
   namespace vs a flat schema); this slice does not need to resolve that
   question because it has no database at all yet. This is a scope
   reduction, not a resolution of that open question.
3. Cross-module communication: a synchronous, in-process publish/subscribe
   event bus (src/shared/eventBus.ts) stands in for the "internal,
   in-process domain events" mechanism TSAAS-002 section 9 describes
   conceptually. TSAAS-002 leaves the exact mechanism RECOMMENDED/OPEN at
   implementation-detail level.
4. Module-boundary enforcement for this slice: application-code discipline
   only (each module exposes a single index.ts; internal store.ts files
   are never imported by another module), verified automatically by
   test/architecture-boundary.test.ts rather than by a database-level
   mechanism, since no database exists yet.
5. Authentication/authorization: none implemented. Out of scope for this
   slice per the Phase B directive explicit exclusion list.
6. Tenancy: exactly one hardcoded synthetic tenant
   (tenant-synthetic-001, src/shared/tenant.ts). Every authoritative
   record still carries a tenantId field so a future slice introducing
   real multi-tenancy does not need a schema retrofit.
7. DGP journey-stage recording: on receiving EventRegistrationCaptured for
   a given person, DGP records exactly one stage, "Registration" -- it
   does not fabricate unobserved "Awareness" or "Visit" records for that
   same touchpoint, since this slice has no independent evidence source
   for those earlier stages. The stage type itself is structurally
   restricted to Awareness/Visit/Registration only; there is no code path
   that can produce a Belonging-or-later value.

## DGP-DEV-003 additions (Mentor Recommendation & Human Confirmation)

Extends the slice with: Synthetic First Contact -> Relationship Memory
Identity -> Events Registration -> Domain Event -> DGP Journey Stage +
DGP Mentor Recommendation -> Human Confirmation -> Relationship Memory
Follow-Up Context.

8. Relationship Memory extension: no new field was added to
   PersonIdentity. TSAAS-002 section 6 already names a distinct
   "follow-up-context record" and recordFollowUpAssignment /
   getFollowUpContext interfaces as part of Relationship Memory's
   ratified scope -- this slice materializes that already-named record
   type (src/modules/relationship-memory/types.ts,
   FollowUpContextRecord), it does not decide new schema.
9. Mentor recommendation: produced by DGP using a deterministic,
   non-AI synthetic mentor pool (three hardcoded synthetic mentor ids,
   selected round-robin by an internal sequence counter). This proves
   the architectural boundary, not mentor-selection intelligence, per
   the DGP-DEV-003 directive's own instruction.
10. Human confirmation: implemented as a distinct orchestration-level
    function (confirmMentorRecommendation, src/app.ts) rather than
    inside DGP or Relationship Memory. DGP has no write interface into
    Relationship Memory at all -- it is structurally incapable of
    finalizing a mentor relationship, not merely convention-restricted
    from doing so.
11. Idempotency: DGP's processed-event tracking (hasProcessed /
    markProcessed) now guards both of a single domain event's side
    effects (journey-stage write and mentor-recommendation write) as
    one unit, and is exercised by an actual event-redelivery test
    (test/dgp.test.ts) that re-emits the identical captured payload a
    second time through the real event bus.

## DGP-DEV-006 additions (Seva Scheduling Cross-Domain Slice)

Extends the slice with a second, fully independent domain-event producer:
Seva Scheduling -> SevaBooked -> DGP -> Seva Journey Evidence, running
alongside the existing Events -> EventRegistrationCaptured -> DGP ->
Journey Stage chain, both attributable to the same synthetic person.

12. Seva Scheduling module (src/modules/seva-scheduling/): mirrors the
    Events module's structure exactly (types.ts / store.ts / index.ts),
    per TSAAS-002 section 6's ratified Seva Scheduling row --
    recordSevaBooking, getSevaHistory, and the SevaBooked event were
    already ratified, not decided by this mission.
13. DGP's response to SevaBooked is a NEW, distinct record type --
    SevaJourneyEvidenceRecord -- not an extension of
    SystemRecordableJourneyStage. This is a deliberate implementation
    choice, not an oversight: POA-PJR-003 section 6 places "Service"
    (the canonical stage seva participation would map to on the 10-stage
    ladder) past the First-Association/Belonging human-judgement
    boundary and among the stages explicitly classified "Future
    capability -- vision, not first-implementation scope." Section 8
    names "seva participation" itself as evidence a human uses to judge
    a transition, not a transition the system computes. Recording it as
    a separate DGP-owned evidence type -- rather than inventing a new
    SystemRecordableJourneyStage literal, or misusing an existing one --
    keeps that boundary intact and leaves "which canonical journey stage
    seva participation implies, if any" correctly OPEN. The invariant at
    item 7 above (SystemRecordableJourneyStage is structurally
    restricted to Awareness/Visit/Registration, with no code path
    producing a Belonging-or-later value) remains true unchanged.
14. Domain-event id collision safety: Events' domain-event ids are
    prefixed "domevt-" and Seva Scheduling's are prefixed "domevt-seva-"
    from independent module-local counters. DGP's processed-event guard
    (hasProcessed / markProcessed) is a single Set shared across every
    producer; distinct prefixes are what make non-collision provable
    rather than merely likely, and test/cross-domain.test.ts exercises
    this directly.
15. SevaBooked deliberately does not trigger a mentor recommendation --
    a separate handler (handleSevaBooked) never calls the mentor-pool
    selection logic, per the DGP-DEV-006 directive's explicit exclusion
    (section 10); test/dgp.test.ts asserts this with a negative
    (zero-recommendations) test.
16. Architecture-boundary enforcement extended, not duplicated: the same
    static source-scanning mechanism from DGP-DEV-001 Phase B
    (test/architecture-boundary.test.ts) now also asserts Seva
    Scheduling never imports from dgp, and dgp never references
    recordSevaBooking or imports seva-scheduling's internal store.

## DGP-DEV-009: persistence runtime-realism slice

A bounded evidence experiment, not a production database architecture.
Proves exactly three properties the in-memory implementation could
never test: restart survival, idempotency-state survival across
restart, and two-tenant isolation.

17. Technology: Node's built-in `node:sqlite` (`DatabaseSync`), chosen
    for zero new dependencies (no `npm install`, no network access, no
    external server process) and true file-based durability -- the
    smallest reproducible local setup available, per mission section 5.
    A minimal ambient typing (`src/shared/node-sqlite.d.ts`) covers the
    surface used, since the project's pinned `@types/node@^20` predates
    this module's typings.
18. The durable path is entirely additive and parallel to the existing
    in-memory system -- zero existing file was modified except
    `test/architecture-boundary.test.ts` (append-only new `describe`
    blocks) and `tsconfig.json` (one new flag,
    `allowImportingTsExtensions`). No existing module's `index.ts`,
    `store.ts`, `app.ts`, `shared/tenant.ts`, `shared/audit.ts`, or
    `shared/eventBus.ts` was touched. All 36 pre-existing tests pass
    unchanged.
19. Each module owns exactly its own durable table(s) via its own new
    `persistence.ts` file: Relationship Memory owns `rm_identities`;
    Events owns `events_registrations`; Seva Scheduling owns
    `seva_bookings`; DGP owns `dgp_journey_stages`,
    `dgp_seva_journey_evidence`, and -- the mission's central
    artifact -- `dgp_processed_domain_events`, the durable idempotency
    guard. No `persistence.ts` file imports another module; extended
    architecture-boundary tests prove this by both import-path and
    table-name-reference scanning.
20. `src/shared/persistent-orchestrator.ts` plays exactly the role
    `src/app.ts` plays for the in-memory system, calling only each
    module's own persistence functions -- never a peer module's table,
    never a module's internal `store.ts`.
21. Deliberate style break: every file in this persistence path uses
    plain relative imports with explicit `.ts` extensions, never the
    `@/` alias the rest of the codebase uses. This is required, not
    stylistic -- the restart-survival tests must invoke this code as a
    genuine separate OS process via a bare `node` command (mission
    section 9), which understands neither tsconfig path aliases nor
    bundler-style extension resolution.
22. `test/persistence-harness.ts` is the restart-survival CLI, invoked
    via `child_process.spawnSync` from `test/persistence-restart.test.ts`
    -- never imported into the vitest process itself. Every invocation
    is a brand-new Node process with zero shared memory; Test D's
    "no duplicate effect" proof rests entirely on a THIRD such process
    independently re-reading durable state.
23. A second, experiment-scoped tenant guard
    (`src/shared/persistence-tenant.ts`, tenant-synthetic-a /
    tenant-synthetic-b) was added rather than loosening the existing
    single-tenant `shared/tenant.ts` -- doing the latter would have
    silently changed the meaning of the tenant boundary for the entire
    existing architecture-proving evidence chain, not just this slice.
24. What this slice does NOT claim, even though every test passes:
    production database readiness, production security, production
    scalability, production concurrency safety, complete tenant
    isolation architecture, or final schema architecture. See
    `40-Runtime/DGP-DEV-009-PERSISTENCE-RUNTIME-REALISM-REPORT.md` for
    the full evidence classification.

## What this slice deliberately does not implement

Outbound messaging (WhatsApp/email/SMS), consent-gated communications,
AI/LLM integration, mentor-selection intelligence, real authentication,
production identity-provider integration, multi-tenant infrastructure,
real client data, production secrets, payment/donation functionality,
volunteer management, inventory, book distribution, analytics platform,
notification platform, background job platform, microservices, a
repository split, and any deployment to production. See the Phase B and
DGP-DEV-003 directives' own exclusion lists for the authoritative sets.

## Running

    npm install
    npm test
    npm run typecheck
