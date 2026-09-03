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

## What this slice deliberately does not implement

Outbound messaging (WhatsApp/email/SMS), consent-gated communications,
mentor assignment/recommendation, AI/LLM integration, real authentication,
production identity-provider integration, multi-tenant infrastructure,
real client data, production secrets, payment/donation functionality,
volunteer management, inventory, book distribution, analytics platform,
notification platform, background job platform, microservices, a
repository split, and any deployment to production. See the Phase B
directive section "EXPLICITLY EXCLUDED" for the authoritative list.

## Running

    npm install
    npm test
    npm run typecheck
