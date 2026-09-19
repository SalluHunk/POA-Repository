# POA-BLD-001 — Mothership Foundation

Minimal, local-only, synthetic-data-only implementation proving POA's core
organizational mechanics end to end: Identity -> Capability Enforcement ->
Mission Lifecycle -> Evidence -> Evidence Integrity -> Independent
Witness -> Organization Isolation.

This is NOT a product, NOT a deployable service. It is the smallest
runtime that exercises the architecture against itself, per the
`POA-BLD-001 — Mothership Foundation Execution Brief.md` (Deployment
mirror). See `40-Runtime/POA-BLD-001-COMPLETION-REPORT.md` for the full
mission evidence, adversarial test results, and Gate H determination.

`POA-BLD-002` (below) added the first Control Panel UI on top of this
same runtime - see `40-Runtime/POA-BLD-002-COMPLETION-REPORT.md`.

## Layout

- `src/canonicalize.ts` — deterministic payload serialization
- `src/crypto.ts` — sha256 hashing + Ed25519 identity-bound signing (node:crypto only)
- `src/identity.ts` — Organization / ExecutionPrincipal / capability grants / authorization evaluation
- `src/mission.ts` — mission lifecycle state machine (Created/Running/Succeeded/Failed/Closed)
- `src/evidence.ts` — Canonical Evidence Envelope, hash chain, verification (POA-DEC-SEC-001 S7-S12)
- `src/witness.ts` — Independent Checkpoint/Witness (TEST DOUBLE ONLY — see completion report)
- `src/runtime.ts` — orchestrator tying the above into one mission lifecycle, enforcing organization isolation
- `server/` — Mothership Control Panel HTTP layer (POA-BLD-002): `state.ts` (process runtime instance), `seed.ts` (demo fixtures), `api.ts` (isolation- and secret-safe request handlers), `http.ts` (plain `node:http` router + static file serving), `index.ts` (entry point)
- `public/` — Control Panel frontend: vanilla HTML/CSS/JS, no framework, no build step (POA-BLD-002 S15)

## Run

```
npm install
npm test
npm run typecheck
npm run console       # starts the Control Panel at http://localhost:5310
```

## Scope boundary

No production infrastructure, no production credentials, no cloud
dependency, no second evidence database. In-memory stores only - the
Control Panel's data does not survive a server restart. The Independent
Witness is explicitly a local test double, not a production-independent
trust anchor — see the completion report's Gate H
Treatment section before relying on this for any real trust boundary claim.
