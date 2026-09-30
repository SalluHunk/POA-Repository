/**
 * Organizational Data Plane tests (POA-ORG-DATA-001).
 */
import { describe, it, expect } from "vitest";
import { IdentityRegistry } from "@/identity";
import { KnowledgePlane, type RecordAssertionInput } from "@/knowledge-plane";

function baseInput(overrides: Partial<RecordAssertionInput> = {}): RecordAssertionInput {
  return {
    organizationId: "org-a",
    subjectRef: "project:apollo",
    predicate: "delivery-status",
    value: "on-track",
    kind: "SOURCE-OBSERVATION",
    basis: "SELF-DECLARED",
    freshness: "CURRENT",
    sourceAuthority: "AUTHORITATIVE",
    sensitivity: "SHOULD",
    provenance: { sourceRef: "manual-entry", producerId: "human-1", evidenceRefs: [] },
    validFrom: "2026-09-01",
    observedAt: "2026-09-01T00:00:00.000Z",
    ...overrides,
  };
}

function setup() {
  const identity = new IdentityRegistry();
  identity.registerOrganization("org-a", "Org A");
  identity.registerOrganization("org-b", "Org B");
  return { identity, knowledge: new KnowledgePlane(identity) };
}

describe("KnowledgePlane", () => {
  it("rejects an assertion for an unknown organization", () => {
    const { knowledge } = setup();
    const result = knowledge.recordAssertion(baseInput({ organizationId: "unknown-org" }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("UNKNOWN_ORGANIZATION");
  });

  it("records and lists a fact/observation assertion", () => {
    const { knowledge } = setup();
    const result = knowledge.recordAssertion(baseInput());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.assertion.assertionId).toBeTruthy();
    expect(result.assertion.recordedAt).toBeTruthy();

    const listed = knowledge.listBySubject("org-a", "project:apollo");
    expect(listed).toHaveLength(1);
    expect(listed[0].assertionId).toBe(result.assertion.assertionId);
  });

  it("represents a relationship as an ordinary assertion (S5.6)", () => {
    const { knowledge } = setup();
    const result = knowledge.recordAssertion(
      baseInput({
        subjectRef: "org-unit:finance",
        predicate: "owns",
        value: "business-function:invoicing",
        kind: "SOURCE-OBSERVATION",
        basis: "SELF-DECLARED",
      }),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.assertion.predicate).toBe("owns");
    expect(result.assertion.value).toBe("business-function:invoicing");
  });

  it("supersede() appends a new assertion and never mutates the original's claim fields", () => {
    const { knowledge } = setup();
    const first = knowledge.recordAssertion(baseInput({ value: "on-track" }));
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const second = knowledge.supersede(first.assertion.assertionId, baseInput({ value: "at-risk" }));
    expect(second.ok).toBe(true);
    if (!second.ok) return;

    // Original retrievable, unaltered in its own claim value.
    const original = knowledge.getAssertion("org-a", first.assertion.assertionId);
    expect(original?.value).toBe("on-track");
    expect(original?.supersededBy).toBe(second.assertion.assertionId);

    // New assertion links back.
    expect(second.assertion.supersedes).toBe(first.assertion.assertionId);
    expect(second.assertion.value).toBe("at-risk");

    // listCurrent returns only the non-superseded, CURRENT one.
    const current = knowledge.listCurrent("org-a", "project:apollo");
    expect(current).toHaveLength(1);
    expect(current[0].assertionId).toBe(second.assertion.assertionId);
  });

  it("rejects superseding an assertion belonging to a different organization", () => {
    const { identity, knowledge } = setup();
    const first = knowledge.recordAssertion(baseInput({ organizationId: "org-a" }));
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const attempt = knowledge.recordAssertion(
      baseInput({ organizationId: "org-b", supersedes: first.assertion.assertionId }),
    );
    expect(attempt.ok).toBe(false);
    if (!attempt.ok) expect(attempt.code).toBe("ORGANIZATION_MISMATCH");
    void identity;
  });

  it("knowledge-time query excludes a later correction; valid-time query includes it", async () => {
    const { knowledge } = setup();
    const first = knowledge.recordAssertion(
      baseInput({ predicate: "revenue", value: 100, validFrom: "2026-Q3", observedAt: "2026-09-01T00:00:00.000Z" }),
    );
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const knownAt = first.assertion.recordedAt;

    // A real, if small, wall-clock gap: recordedAt has millisecond
    // resolution, and the knowledge-time query's cutoff is a wall-clock
    // boundary - it cannot distinguish two writes landing in the same
    // millisecond (ordering between those is what listCurrent's insertion
    // sequence is for, not this query).
    await new Promise((resolve) => setTimeout(resolve, 5));

    const second = knowledge.supersede(first.assertion.assertionId, baseInput({ predicate: "revenue", value: 150, validFrom: "2026-Q3", observedAt: "2026-09-15T00:00:00.000Z" }));
    expect(second.ok).toBe(true);
    if (!second.ok) return;

    // "What did we know at the time of the first recording?" -> still the original value.
    const knownThen = knowledge.getAsOfKnowledgeTime("org-a", "project:apollo", "revenue", knownAt);
    expect(knownThen?.value).toBe(100);

    // "What was true as of that same valid period, using today's knowledge?" -> the correction.
    const validNow = knowledge.getAsOfValidTime("org-a", "project:apollo", "revenue", "2026-Q3");
    expect(validNow?.value).toBe(150);
  });

  it("organization isolation: org B cannot read org A's assertions", () => {
    const { knowledge } = setup();
    const result = knowledge.recordAssertion(baseInput({ organizationId: "org-a" }));
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(knowledge.listBySubject("org-b", "project:apollo")).toHaveLength(0);
    expect(knowledge.listCurrent("org-b")).toHaveLength(0);
    expect(knowledge.getAssertion("org-b", result.assertion.assertionId)).toBeUndefined();
  });

  it("basis and freshness are independent axes and round-trip unchanged", () => {
    const { knowledge } = setup();
    const result = knowledge.recordAssertion(
      baseInput({ basis: "VERIFIED", freshness: "STALE", sourceAuthority: "SUPPORTING" }),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.assertion.basis).toBe("VERIFIED");
    expect(result.assertion.freshness).toBe("STALE");
    expect(result.assertion.sourceAuthority).toBe("SUPPORTING");
  });

  // POA-ORG-DATA-REM-001 D1/D2: classification/sensitivity.
  it("defaults classification to UNCLASSIFIED-DERIVED when omitted (S5.3's own stated default)", () => {
    const { knowledge } = setup();
    const { classification: _omit, ...withoutClassification } = baseInput();
    const result = knowledge.recordAssertion(withoutClassification);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.assertion.classification).toBe("UNCLASSIFIED-DERIVED");
  });

  it("persists and retrieves an explicit classification and sensitivity", () => {
    const { knowledge } = setup();
    const result = knowledge.recordAssertion(
      baseInput({ classification: "POA-PRIVATE", sensitivity: "SENSITIVE-RESTRICTED" }),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.assertion.classification).toBe("POA-PRIVATE");
    expect(result.assertion.sensitivity).toBe("SENSITIVE-RESTRICTED");

    const fetched = knowledge.getAssertion("org-a", result.assertion.assertionId);
    expect(fetched?.classification).toBe("POA-PRIVATE");
    expect(fetched?.sensitivity).toBe("SENSITIVE-RESTRICTED");
  });

  // POA-ORG-DATA-REM-001 D3: authorityRef enforcement for DECISION/ACTION.
  it("rejects a DECISION assertion with no authorityRef", () => {
    const { knowledge } = setup();
    const result = knowledge.recordAssertion(baseInput({ kind: "DECISION" }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("MISSING_AUTHORITY_REF");
  });

  it("rejects an ACTION assertion with no authorityRef", () => {
    const { knowledge } = setup();
    const result = knowledge.recordAssertion(baseInput({ kind: "ACTION" }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("MISSING_AUTHORITY_REF");
  });

  it("accepts a DECISION assertion when authorityRef is present", () => {
    const { knowledge } = setup();
    const result = knowledge.recordAssertion(baseInput({ kind: "DECISION", authorityRef: "human-commander" }));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.assertion.authorityRef).toBe("human-commander");
  });

  it("accepts an ACTION assertion when authorityRef is present", () => {
    const { knowledge } = setup();
    const result = knowledge.recordAssertion(baseInput({ kind: "ACTION", authorityRef: "human-commander" }));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.assertion.authorityRef).toBe("human-commander");
  });

  it("does not require authorityRef for non-DECISION/ACTION kinds", () => {
    const { knowledge } = setup();
    const result = knowledge.recordAssertion(baseInput({ kind: "SOURCE-OBSERVATION" }));
    expect(result.ok).toBe(true);
  });

  // POA-ORG-DATA-REM-001 D4: contradiction-exclusion regression coverage (S12.3).
  it("listCurrent excludes an assertion that carries a contradiction reference", () => {
    const { knowledge } = setup();
    const clean = knowledge.recordAssertion(baseInput({ subjectRef: "project:apollo", predicate: "status" }));
    expect(clean.ok).toBe(true);
    if (!clean.ok) return;

    const contradicted = knowledge.recordAssertion(
      baseInput({ subjectRef: "project:beacon", predicate: "status", contradicts: [clean.assertion.assertionId] }),
    );
    expect(contradicted.ok).toBe(true);
    if (!contradicted.ok) return;

    const current = knowledge.listCurrent("org-a");
    const ids = current.map((a) => a.assertionId);
    expect(ids).toContain(clean.assertion.assertionId);
    expect(ids).not.toContain(contradicted.assertion.assertionId);
  });
});
