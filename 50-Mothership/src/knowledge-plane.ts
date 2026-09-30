/**
 * Organizational Data Plane (POA-ORG-DATA-001; implements the Knowledge
 * Assertion model of POA-DEC-ORG-KNOWLEDGE-001 S5.3, minimally).
 *
 * Boundary (POA-DEC-ORG-KNOWLEDGE-001 S8.1): "Git holds what POA *is* and
 * what has been *decided*. The organizational data plane holds what has
 * been *observed* and *derived*." This module holds only the latter - it
 * never reads or writes 10-Constitution/, 20-Shared/, or 40-Runtime/, and
 * it is not routed through the authority-bearing evidence chain
 * (evidence.ts/witness.ts): Knowledge Assertions are Provenance-only until
 * an authorized human DECISION cites one (S9.2 rule 5), which this module
 * does not itself perform.
 *
 * Relationships are not a separate type (S5.6): "a relationship is itself
 * an assertion" - recorded here as an ordinary assertion whose predicate
 * names the relationship type and whose value is the related subject's
 * reference.
 *
 * Corrections are never in-place writes (S11.3): supersede() always
 * appends a new assertion and links it to the original via
 * supersedes/supersededBy. The original's own claim fields are never
 * mutated - only its supersededBy pointer is set, so "what we knew then"
 * (a knowledge-time query) still returns its original, unaltered content.
 */
import type { IdentityRegistry } from "@/identity";

export type AssertionKind =
  | "SOURCE-OBSERVATION"
  | "VERIFIED"
  | "DERIVED"
  | "INFERENCE"
  | "ANALYSIS"
  | "RECOMMENDATION"
  | "DECISION"
  | "ACTION"
  | "RESULT";

/** Basis axis (S12.1) - how the value is known. Orthogonal to freshness. */
export type AssertionBasis = "VERIFIED" | "SELF-DECLARED" | "INFERRED" | "ESTIMATED" | "UNKNOWN";

/** Freshness axis (S12.2) - whether the value is still current. Orthogonal to basis. */
export type AssertionFreshness = "CURRENT" | "STALE" | "UNKNOWN";

/** Source authority (S12.4) - whether the source is authoritative for this predicate. */
export type SourceAuthority = "AUTHORITATIVE" | "SUPPORTING" | "NON-AUTHORITATIVE";

export interface AssertionProvenance {
  /** Declared source reference (S7.1), e.g. a Source subject id, or "manual-entry". */
  sourceRef: string;
  /** Identity that produced this assertion (adapter, human, or derivation). */
  producerId: string;
  /** References to supporting evidence (documents, other assertions), if any (S10). */
  evidenceRefs: string[];
}

export interface KnowledgeAssertion {
  /** Stable identity, never reused (S5.3). */
  assertionId: string;
  /** Every assertion belongs to exactly one organization (P1). */
  organizationId: string;
  /** What the assertion is about, e.g. "project:X", "org-unit:finance". */
  subjectRef: string;
  /** Predicate/measure name, e.g. "revenue", "owns", "delivery-status". */
  predicate: string;
  /** The claimed value. UNKNOWN is represented by basis "UNKNOWN", not by omitting value. */
  value: string | number | boolean | null;
  unit?: string;
  /** Period the claim covers, if it is a period measure (e.g. "2026-Q3"). */
  period?: string;
  kind: AssertionKind;
  basis: AssertionBasis;
  freshness: AssertionFreshness;
  sourceAuthority: SourceAuthority;
  provenance: AssertionProvenance;
  /** Time axes (S11.1). */
  validFrom: string;
  validTo?: string;
  sourceUpdatedAt?: string;
  observedAt: string;
  /** When this assertion entered the knowledge plane. Set by recordAssertion; append-only. */
  recordedAt: string;
  /** Required for DECISION/ACTION kinds (S5.3); who acted, under which grant/representation. */
  authorityRef?: string;
  /** Append-only supersession chain (S11.3). Never overwritten in place. */
  supersedes?: string;
  supersededBy?: string;
  /** References to assertions this one contradicts or is contradicted by (S12.3). */
  contradicts?: string[];
}

export type RecordAssertionInput = Omit<
  KnowledgeAssertion,
  "assertionId" | "recordedAt" | "supersededBy"
>;

let nextAssertionSeq = 0;
function generateAssertionId(): string {
  nextAssertionSeq += 1;
  return `assertion-${Date.now().toString(36)}-${nextAssertionSeq}`;
}

export type RecordResult =
  | { ok: true; assertion: KnowledgeAssertion }
  | { ok: false; code: "UNKNOWN_ORGANIZATION" | "UNKNOWN_SUPERSEDED_ASSERTION" | "ORGANIZATION_MISMATCH"; detail: string };

/**
 * Organization-scoped, append-only store of Knowledge Assertions
 * (POA-DEC-ORG-KNOWLEDGE-001 S5). Mirrors IdentityRegistry's isolation
 * discipline (identity.ts): every read method is scoped to one
 * organizationId and never returns another organization's assertions.
 */
export class KnowledgePlane {
  private assertions = new Map<string, KnowledgeAssertion>();
  private byOrganization = new Map<string, Set<string>>();
  /**
   * Monotonic insertion order, separate from recordedAt (a wall-clock ISO
   * string whose millisecond resolution can collide when two assertions
   * are recorded in the same tick - the sequence number, not the
   * timestamp, is what "newest" queries below actually order by).
   */
  private insertionSequence = new Map<string, number>();
  private nextSequence = 0;

  constructor(private readonly identity: IdentityRegistry) {}

  private indexFor(organizationId: string): Set<string> {
    const set = this.byOrganization.get(organizationId) ?? new Set<string>();
    this.byOrganization.set(organizationId, set);
    return set;
  }

  recordAssertion(input: RecordAssertionInput): RecordResult {
    if (!this.identity.getOrganization(input.organizationId)) {
      return { ok: false, code: "UNKNOWN_ORGANIZATION", detail: `Unknown organization: ${input.organizationId}` };
    }
    if (input.supersedes) {
      const prior = this.assertions.get(input.supersedes);
      if (!prior) {
        return { ok: false, code: "UNKNOWN_SUPERSEDED_ASSERTION", detail: `Unknown assertion: ${input.supersedes}` };
      }
      if (prior.organizationId !== input.organizationId) {
        return { ok: false, code: "ORGANIZATION_MISMATCH", detail: "Cannot supersede an assertion belonging to a different organization" };
      }
    }
    const assertion: KnowledgeAssertion = {
      ...input,
      assertionId: generateAssertionId(),
      recordedAt: new Date().toISOString(),
    };
    this.assertions.set(assertion.assertionId, assertion);
    this.insertionSequence.set(assertion.assertionId, this.nextSequence++);
    this.indexFor(assertion.organizationId).add(assertion.assertionId);
    if (input.supersedes) {
      // Metadata-only linkage on the prior record (its own claim fields are
      // never touched) - see module-level comment on S11.3.
      const prior = this.assertions.get(input.supersedes)!;
      prior.supersededBy = assertion.assertionId;
    }
    return { ok: true, assertion };
  }

  /** Convenience wrapper: record a new assertion that supersedes an existing one. */
  supersede(priorAssertionId: string, next: Omit<RecordAssertionInput, "supersedes">): RecordResult {
    return this.recordAssertion({ ...next, supersedes: priorAssertionId });
  }

  private forOrganization(organizationId: string): KnowledgeAssertion[] {
    const ids = this.byOrganization.get(organizationId) ?? new Set<string>();
    return [...ids].map((id) => this.assertions.get(id)!).filter((a): a is KnowledgeAssertion => Boolean(a));
  }

  private bySequenceDesc(a: KnowledgeAssertion, b: KnowledgeAssertion): number {
    return (this.insertionSequence.get(b.assertionId) ?? 0) - (this.insertionSequence.get(a.assertionId) ?? 0);
  }

  /** All assertions for one subject, most-recently-recorded first. Org-scoped. */
  listBySubject(organizationId: string, subjectRef: string): KnowledgeAssertion[] {
    return this.forOrganization(organizationId)
      .filter((a) => a.subjectRef === subjectRef)
      .sort((a, b) => this.bySequenceDesc(a, b));
  }

  /**
   * Current knowledge (S9.2 rule 4): non-superseded assertions that are
   * CURRENT freshness and not known-contradicted. Org-scoped.
   */
  listCurrent(organizationId: string, subjectRef?: string): KnowledgeAssertion[] {
    return this.forOrganization(organizationId)
      .filter((a) => !subjectRef || a.subjectRef === subjectRef)
      .filter((a) => !a.supersededBy)
      .filter((a) => a.freshness === "CURRENT")
      .filter((a) => !a.contradicts || a.contradicts.length === 0);
  }

  /**
   * "What did we know at time T" (S11.2 knowledge-time query): assertions
   * with recordedAt <= asOf, excluding later corrections - i.e. the latest
   * assertion per (subject, predicate) as it stood at asOf, even if a
   * further correction was recorded afterward.
   */
  getAsOfKnowledgeTime(organizationId: string, subjectRef: string, predicate: string, asOf: string): KnowledgeAssertion | undefined {
    return this.forOrganization(organizationId)
      .filter((a) => a.subjectRef === subjectRef && a.predicate === predicate && a.recordedAt <= asOf)
      .sort((a, b) => this.bySequenceDesc(a, b))[0];
  }

  /**
   * "What was true as of T" (S11.2 valid-time query, using today's
   * knowledge): the latest-known assertion whose valid period covers asOf,
   * including later corrections.
   */
  getAsOfValidTime(organizationId: string, subjectRef: string, predicate: string, asOf: string): KnowledgeAssertion | undefined {
    return this.forOrganization(organizationId)
      .filter((a) => a.subjectRef === subjectRef && a.predicate === predicate)
      .filter((a) => a.validFrom <= asOf && (!a.validTo || a.validTo >= asOf))
      .sort((a, b) => this.bySequenceDesc(a, b))[0];
  }

  getAssertion(organizationId: string, assertionId: string): KnowledgeAssertion | undefined {
    const a = this.assertions.get(assertionId);
    return a && a.organizationId === organizationId ? a : undefined;
  }
}
