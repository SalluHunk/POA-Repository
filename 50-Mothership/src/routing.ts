/**
 * POA-ORG-KNOW-P5-IMPL-001 - synthetic-fixture routing dry-run (pure function).
 *
 * Authority and boundary: the ratified Mission Package
 * POA-ORG-KNOW-P5-IMPL-001-RESCOPED-MISSION-PACKAGE (execution boundary) and
 * its ratifying Decision Record in POA-ADR-001 (commit aed0e56). The R-1/Q6
 * gate remains fully in force; this module neither satisfies nor lifts it.
 *
 * What this is: a deterministic evaluation of delegation-chain links 1-7
 * (POA-DEC-ORG-KNOWLEDGE-001 S14.1) over a SYNTHETIC declaration set that is
 * passed in by the caller. Evaluation order and the outcome mapping are the
 * Mission Package S7 table, applied as written:
 *   missing owner or role -> ESCALATE; missing grant -> REFUSE;
 *   unresolved / ambiguous / unconfirmed function -> ASK.
 *
 * What this is NOT: no input/output of any kind, no clock, no randomness, no
 * imports, no persistence, no approvals, no commits, no model or agent calls.
 * It is not exported from the package index and exposes no data model beyond
 * the single function below; the types in this file are implementation-private
 * by Commander ruling.
 *
 * Limitation (binding): successful execution of this module's tests is
 * evidence only about this synthetic routing mechanism. It is no evidence that
 * any real organization's declarations route correctly.
 */

type Outcome = "ROUTE" | "ASK" | "ESCALATE" | "REFUSE";

type ReasonCode =
  | "ROUTABLE_DRY_RUN"
  | "MALFORMED_INPUT"
  | "NOT_SYNTHETIC"
  | "PRINCIPAL_REJECTED"
  | "ORG_MISMATCH"
  | "FUNCTION_UNRESOLVED"
  | "FUNCTION_AMBIGUOUS"
  | "INTENT_UNCONFIRMED"
  | "INTENT_REJECTED"
  | "NO_OWNING_UNIT_DECLARED"
  | "NO_RESPONSIBLE_ROLE_DECLARED"
  | "NO_AUTHORIZED_EXECUTOR"
  | "NO_INITIATION_GRANT"
  | "APPROVAL_REQUIREMENT_UNDECLARED";

type LinkStatus = "SATISFIED" | "MISSING" | "AMBIGUOUS" | "NOT_EVALUATED";

interface LinkEvaluation {
  n: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  name: string;
  status: LinkStatus;
  ref: string | null;
}

interface RoutingDecision {
  requestId: string | null;
  outcome: Outcome;
  reasonCode: ReasonCode;
  links: LinkEvaluation[];
  inference: {
    resolvedFunctionId: string | null;
    kind: "INFERENCE";
    confirmed: boolean;
  };
  route: {
    owningUnit: string;
    responsibleRole: string;
    executorSubjectId: string;
  } | null;
  declarationSetVersion: string | null;
  committed: false;
  writes: never[];
  approvalsSimulated: 0;
}

interface FunctionDecl {
  functionId: string;
  label: string;
  aliases: string[];
  owningUnit: string | null;
  responsibleRole: string | null;
}

interface GrantDecl {
  subjectId: string;
  subjectKind: "HUMAN" | "SERVICE" | "EXECUTION_AGENT";
  functionId: string;
  action: "INITIATE" | "APPROVE";
  status: "ACTIVE" | "REVOKED";
}

interface ApprovalRequirementDecl {
  functionId: string;
  declaredAuthority: string | null;
}

interface ParsedDeclarations {
  organization: string;
  version: string;
  functions: FunctionDecl[];
  grants: GrantDecl[];
  approvalRequirements: ApprovalRequirementDecl[];
}

interface ParsedRequest {
  requestId: string;
  principal: { id: string; authenticated: boolean; organization: string | null };
  intentLabel: string;
  principalConfirmation: "CONFIRMED" | "UNCONFIRMED" | "REJECTED";
}

const LINK_NAMES = [
  "Principal",
  "Intent",
  "Business Function",
  "Owning Unit",
  "Responsible Role",
  "Authorized Executor",
  "Approval Requirement",
] as const;

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

/** A declared value that may be explicitly null or absent (a declared gap). */
function nullableName(v: unknown): { ok: boolean; value: string | null } {
  if (v === null || v === undefined) return { ok: true, value: null };
  if (isNonEmptyString(v)) return { ok: true, value: v };
  return { ok: false, value: null };
}

function parseDeclarations(d: Record<string, unknown>): ParsedDeclarations | null {
  if (!isNonEmptyString(d.organization) || !isNonEmptyString(d.version)) return null;
  if (!Array.isArray(d.functions) || !Array.isArray(d.grants) || !Array.isArray(d.approvalRequirements)) {
    return null;
  }

  const functions: FunctionDecl[] = [];
  for (const f of d.functions) {
    if (!isRecord(f)) return null;
    if (!isNonEmptyString(f.functionId) || !isNonEmptyString(f.label)) return null;
    if (!Array.isArray(f.aliases) || !f.aliases.every(isNonEmptyString)) return null;
    const unit = nullableName(f.owningUnit);
    const role = nullableName(f.responsibleRole);
    if (!unit.ok || !role.ok) return null;
    functions.push({
      functionId: f.functionId,
      label: f.label,
      aliases: f.aliases as string[],
      owningUnit: unit.value,
      responsibleRole: role.value,
    });
  }

  const grants: GrantDecl[] = [];
  for (const g of d.grants) {
    if (!isRecord(g)) return null;
    if (!isNonEmptyString(g.subjectId) || !isNonEmptyString(g.functionId)) return null;
    if (g.subjectKind !== "HUMAN" && g.subjectKind !== "SERVICE" && g.subjectKind !== "EXECUTION_AGENT") return null;
    if (g.action !== "INITIATE" && g.action !== "APPROVE") return null;
    if (g.status !== "ACTIVE" && g.status !== "REVOKED") return null;
    grants.push({
      subjectId: g.subjectId,
      subjectKind: g.subjectKind,
      functionId: g.functionId,
      action: g.action,
      status: g.status,
    });
  }

  const approvalRequirements: ApprovalRequirementDecl[] = [];
  for (const a of d.approvalRequirements) {
    if (!isRecord(a)) return null;
    if (!isNonEmptyString(a.functionId)) return null;
    const authority = nullableName(a.declaredAuthority);
    if (!authority.ok) return null;
    approvalRequirements.push({ functionId: a.functionId, declaredAuthority: authority.value });
  }

  return { organization: d.organization, version: d.version, functions, grants, approvalRequirements };
}

function parseRequest(r: unknown): ParsedRequest | null {
  if (!isRecord(r)) return null;
  if (!isNonEmptyString(r.requestId)) return null;
  if (typeof r.intentLabel !== "string") return null;
  const c = r.principalConfirmation;
  if (c !== "CONFIRMED" && c !== "UNCONFIRMED" && c !== "REJECTED") return null;
  const p = r.principal;
  if (!isRecord(p)) return null;
  if (!isNonEmptyString(p.id) || typeof p.authenticated !== "boolean") return null;
  if (p.organization !== null && !isNonEmptyString(p.organization)) return null;
  return {
    requestId: r.requestId,
    principal: { id: p.id, authenticated: p.authenticated, organization: p.organization },
    intentLabel: r.intentLabel,
    principalConfirmation: c,
  };
}

function freshLinks(): LinkEvaluation[] {
  return LINK_NAMES.map((name, i) => ({
    n: (i + 1) as LinkEvaluation["n"],
    name,
    status: "NOT_EVALUATED" as LinkStatus,
    ref: null,
  }));
}

/**
 * Evaluate links 1-7 for one request over one synthetic declaration set.
 * Pure and total: never throws; never mutates its arguments. Malformed or
 * non-synthetic input yields REFUSE (MALFORMED_INPUT / NOT_SYNTHETIC).
 * Links after the first failing link remain NOT_EVALUATED.
 */
export function routeDryRun(declarations: unknown, request: unknown): RoutingDecision {
  const links = freshLinks();
  const requestIdRaw = isRecord(request) && isNonEmptyString(request.requestId) ? request.requestId : null;
  const versionRaw =
    isRecord(declarations) && isNonEmptyString(declarations.version) ? declarations.version : null;

  let resolvedFunctionId: string | null = null;
  let confirmed = false;

  const finish = (
    outcome: Outcome,
    reasonCode: ReasonCode,
    route: RoutingDecision["route"] = null,
  ): RoutingDecision => ({
    requestId: requestIdRaw,
    outcome,
    reasonCode,
    links,
    inference: { resolvedFunctionId, kind: "INFERENCE", confirmed },
    route,
    declarationSetVersion: versionRaw,
    committed: false,
    writes: [],
    approvalsSimulated: 0,
  });

  const mark = (n: number, status: LinkStatus, ref: string | null): void => {
    links[n - 1] = { n: n as LinkEvaluation["n"], name: LINK_NAMES[n - 1], status, ref };
  };

  // Rule 0: input shape and synthetic marker.
  if (!isRecord(declarations)) return finish("REFUSE", "MALFORMED_INPUT");
  if (declarations.fixtureClass !== "SYNTHETIC") return finish("REFUSE", "NOT_SYNTHETIC");
  const decl = parseDeclarations(declarations);
  const req = parseRequest(request);
  if (decl === null || req === null) return finish("REFUSE", "MALFORMED_INPUT");

  // Link 1 (rule 1): principal authenticated and inside the declaring organization.
  if (!req.principal.authenticated) {
    mark(1, "MISSING", req.principal.id);
    return finish("REFUSE", "PRINCIPAL_REJECTED");
  }
  if (req.principal.organization !== decl.organization) {
    mark(1, "MISSING", req.principal.id);
    return finish("REFUSE", "ORG_MISMATCH");
  }
  mark(1, "SATISFIED", req.principal.id);

  // Link 2: the intent label was supplied (matching is link 3).
  mark(2, "SATISFIED", req.intentLabel);

  // Link 3 (rules 3a-3c): resolve intent to exactly one function; never proceed
  // on an unconfirmed interpretation. Exact alias match only; no inference engine.
  const matched: FunctionDecl[] = [];
  for (const f of decl.functions) {
    if (f.aliases.includes(req.intentLabel) && !matched.some((m) => m.functionId === f.functionId)) {
      matched.push(f);
    }
  }
  if (matched.length === 0) {
    mark(3, "MISSING", null);
    return finish("ASK", "FUNCTION_UNRESOLVED");
  }
  if (matched.length > 1) {
    mark(3, "AMBIGUOUS", null);
    return finish("ASK", "FUNCTION_AMBIGUOUS");
  }
  const fn = matched[0];
  resolvedFunctionId = fn.functionId;
  if (req.principalConfirmation === "UNCONFIRMED") {
    mark(3, "MISSING", fn.functionId);
    return finish("ASK", "INTENT_UNCONFIRMED");
  }
  if (req.principalConfirmation === "REJECTED") {
    mark(3, "MISSING", fn.functionId);
    return finish("REFUSE", "INTENT_REJECTED");
  }
  confirmed = true;
  mark(3, "SATISFIED", fn.functionId);

  // Links 4 and 5 (rules 4, 5): never guess an owner or a role.
  if (fn.owningUnit === null) {
    mark(4, "MISSING", null);
    return finish("ESCALATE", "NO_OWNING_UNIT_DECLARED");
  }
  mark(4, "SATISFIED", fn.owningUnit);
  if (fn.responsibleRole === null) {
    mark(5, "MISSING", null);
    return finish("ESCALATE", "NO_RESPONSIBLE_ROLE_DECLARED");
  }
  mark(5, "SATISFIED", fn.responsibleRole);

  // Link 6 (rule 6): a role without a grant is not an executor. Only an ACTIVE
  // INITIATE grant makes an executor; the first in declared order is selected.
  // APPROVE grants are never read here or anywhere else in this module.
  const executorGrant = decl.grants.find(
    (g) => g.functionId === fn.functionId && g.action === "INITIATE" && g.status === "ACTIVE",
  );
  if (executorGrant === undefined) {
    mark(6, "MISSING", null);
    return finish("REFUSE", "NO_AUTHORIZED_EXECUTOR");
  }
  mark(6, "SATISFIED", executorGrant.subjectId);

  // Link 7 (rule 7): initiation-grant check only, never approval. First the
  // principal's own ACTIVE INITIATE grant, then the declared approval requirement
  // (an entry with an explicit null authority counts as undeclared).
  const principalGrant = decl.grants.find(
    (g) =>
      g.subjectId === req.principal.id &&
      g.functionId === fn.functionId &&
      g.action === "INITIATE" &&
      g.status === "ACTIVE",
  );
  if (principalGrant === undefined) {
    mark(7, "MISSING", null);
    return finish("REFUSE", "NO_INITIATION_GRANT");
  }
  const requirement = decl.approvalRequirements.find((a) => a.functionId === fn.functionId);
  if (requirement === undefined || requirement.declaredAuthority === null) {
    mark(7, "MISSING", null);
    return finish("REFUSE", "APPROVAL_REQUIREMENT_UNDECLARED");
  }
  mark(7, "SATISFIED", requirement.declaredAuthority);

  return finish("ROUTE", "ROUTABLE_DRY_RUN", {
    owningUnit: fn.owningUnit,
    responsibleRole: fn.responsibleRole,
    executorSubjectId: executorGrant.subjectId,
  });
}
