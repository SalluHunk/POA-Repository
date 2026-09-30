# POA-ORG-KNOW-P5-NEED-001 — Demonstrated-Need Waiver (Report)

Closes Condition C2 of `POA-ORG-KNOW-P5-PLAN-001-EXECUTION-PLAN.md` §4.9.

## 1. Mission Identity

| Field | Value |
|---|---|
| Mission | `POA-ORG-KNOW-P5-NEED-001` |
| Objective | Record demonstrated need for the routing dry-run, or an explicit Commander waiver of the `CTD-001` Evidence-Gated condition for this specific pilot |
| Authorization basis | Commander decision, 2026-09-30 |

## 2. Finding

No repository record demonstrates a specific operational instance of the problem the routing dry-run addresses (e.g. a real invoicing request that failed to route correctly). `POA-ORG-KNOW-P5-PLAN-001-EXECUTION-PLAN.md` §4.5 item 1 recorded this as a genuine gap against `POA-DEC-ORG-KNOWLEDGE-001` §24's Evidence-Gated preamble ("demonstrated need, existing mechanisms shown insufficient, separate authority decision").

## 3. Commander Waiver

**Commander ruling: WAIVE the demonstrated-need condition for `POA-DEC-ORG-KNOWLEDGE-001` §24 Phase 5 specifically, scoped exactly as follows:**

- The waiver applies only to a routing-and-authorization-check dry-run, for a single function, with no commit/write to any system of record and no approval action — the exact scope `POA-ORG-KNOW-P5-PLAN-001-EXECUTION-PLAN.md` §5 reconstructs.
- Basis for waiver: the pilot is bounded, reversible, produces no side effect, and exists precisely to generate the evidence (correct routing / correct refuse-escalate) that a real demonstrated-need case would otherwise have to argue for in the abstract. Requiring a pre-existing failure instance before running a no-commit dry-run would be evidence-gating a mechanism whose entire purpose is to produce evidence.
- This waiver does **not** extend to Phase 6 (executive-question synthesis) or Phase 7 (Mothership surfaces), or to any function beyond the one piloted under `POA-ORG-KNOW-P5-AUTH-001`. Each of those requires its own Evidence-Gated determination when proposed.

## 4. Scope

This report does not authorize implementation. It closes one condition (C2) toward the authorization act `POA-ORG-KNOW-P5-AUTH-001`, which alone grants build authority.

## 5. Related Mission

`POA-ORG-KNOW-P5-PLAN-001` (naming this as Condition C2).

## 6. Resulting Commit / Repository State

To be recorded once committed.

---

*End of POA-ORG-KNOW-P5-NEED-001 Report. Authorized by: Commander, ruling rendered 2026-09-30.*
