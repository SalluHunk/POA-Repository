# POA-BLD-001 — Mothership Foundation

Minimal, local-only, synthetic-data-only implementation proving POA's core
organizational mechanics end to end: Identity -> Capability Enforcement ->
Mission Lifecycle -> Evidence -> Evidence Integrity -> Independent
Witness -> Organization Isolation.

This is NOT a product, NOT a UI, NOT a deployable service. It is the
smallest runtime that exercises the architecture against itself, per the
`POA-BLD-001 — Mothership Foundation Execution Brief.md` (Deployment
mirror). See `40-Runtime/POA-BLD-001-COMPLETION-REPORT.md` for the full
mission evidence, adversarial test results, and Gate H determination.

## Layout

- `src/canonicalize.ts` — deterministic payload serialization
- `src/crypto.ts` — sha256 hashing + Ed25519 identity-bound signing (node:crypto only)
- `src/identity.ts` — Organization / ExecutionPrincipal / capability grants / authorization evaluation
- `src/mission.ts` — mission lifecycle state machine (Created/Running/Succeeded/Failed/Closed)
- `src/evidence.ts` — Canonical Evidence Envelope, hash chain, verification (POA-DEC-SEC-001 S7-S12)
- `src/witness.ts` — Independent Checkpoint/Witness (TEST DOUBLE ONLY — see completion report)
- `src/runtime.ts` — orchestrator tying the above into one mission lifecycle, enforcing organization isolation

## Run

```
npm install
npm test
npm run typecheck
```

## Scope boundary

No UI, no production infrastructure, no production credentials, no cloud
dependency, no second evidence database. In-memory stores only. The
Independent Witness is explicitly a local test double, not a
production-independent trust anchor — see the completion report's Gate H
Treatment section before relying on this for any real trust boundary claim.
