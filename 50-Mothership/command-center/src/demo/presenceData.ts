// QUARANTINED DEMO MODULE (POA-DEC-MOTHERSHIP-002): fictional reference content,
// not POA organizational truth. Only reachable when isDemoLayerEnabled().
/**
 * Static reference/demo content ported verbatim from POA Command.dc.html -
 * the domain narrative shown in the Detail overlay, the ask-POA prompts and
 * canned keyword-matched responses, and the phase model. This is
 * deliberately NOT wired to the real backend (useCommandCenter.ts) - it is
 * the reference's own example organizational scenario (Temple Growth,
 * D-016, etc.), kept as its own module so the real data paths elsewhere in
 * the app (missions/principals/decisions/evidence) are untouched.
 */

export interface DomainFact {
  k: string;
  v: string;
}

export interface DomainAction {
  label: string;
  q: string;
}

export interface DomainDetail {
  kicker: string;
  tint: string;
  border: string;
  title: string;
  body: string;
  facts: DomainFact[];
  read: string;
  conf: string;
  confPct: string;
  actions: DomainAction[];
}

// Reference lines 557-606 (DOMAINS) - kicker/title/body/facts/read/conf/
// actions per domain, keyed to the same ids as environment/constants.ts's
// DOMAIN_SPEC. detail.tint/border mirror the reference's per-domain d.c1 /
// 'rgba(127,216,255,.28)' (line 774-775).
export const DOMAIN_DETAIL: Record<string, DomainDetail> = {
  missions: {
    kicker: "DOMAIN · MISSIONS", tint: "#7ef2b8", border: "rgba(127,216,255,.28)",
    title: "Four missions, one in attention",
    body: "Temple Growth is holding nine weeks ahead of plan. Mothership is blocked on one approval from you. Evidence Infrastructure lost integrity at 02:14. HR SaaS has no owner.",
    facts: [{ k: "ACTIVE", v: "4" }, { k: "HOLDING", v: "3" }, { k: "IN ATTENTION", v: "1" }, { k: "UNOWNED", v: "1" }],
    read: "Only Evidence Infrastructure needs you today. HR SaaS slips a quarter if it stays unassigned past 27 Sep.", conf: "0.86", confPct: "86%",
    actions: [{ label: "SHOW ME MISSION RISKS", q: "Show me mission risks" }],
  },
  people: {
    kicker: "DOMAIN · PEOPLE & CAPABILITY", tint: "#9fc6ff", border: "rgba(127,216,255,.28)",
    title: "Thirty-eight people, twelve agents",
    body: "Execution is 66% human, 38% agent, with seven hybrid pairings. The heaviest concentration is Mothership at nine people and five agents.",
    facts: [{ k: "ENGAGED", v: "38" }, { k: "AI AGENTS", v: "12" }, { k: "HYBRID", v: "7" }, { k: "EXTERNAL", v: "3" }],
    read: "No agent holds commit authority anywhere in the organization. Every agent is advisory by grant.", conf: "0.94", confPct: "94%",
    actions: [{ label: "WHO IS WORKING ON WHAT", q: "Tell me about the workforce" }],
  },
  evidence: {
    kicker: "DOMAIN · EVIDENCE · DEGRADED", tint: "#ffd98a", border: "rgba(127,216,255,.28)",
    title: "Integrity lost at 02:14",
    body: "The witness service missed three consecutive integrity checks. No records were lost. A replay is queued for 06:00 and two recovery options are drafted; neither can be committed by an agent.",
    facts: [{ k: "VERIFIED", v: "1,204" }, { k: "FAILED CHECKS", v: "3" }, { k: "RECORDS LOST", v: "0" }, { k: "ANCHOR LAG", v: "41m" }],
    read: "A lag fault, not a corruption fault — which is why I am recommending a recovery path rather than an incident response. This changes if the 06:00 replay also fails.", conf: "0.74", confPct: "74%",
    actions: [{ label: "WHY DID IT FAIL?", q: "Why did evidence fail" }, { label: "WHAT DO YOU RECOMMEND?", q: "What do you think we should fund first?" }],
  },
  systems: {
    kicker: "DOMAIN · SYSTEMS", tint: "#9ff0e4", border: "rgba(127,216,255,.28)",
    title: "Seven of nine layers healthy",
    body: "Evidence is degraded and Witness is lagging forty-one minutes behind it. The witness lag is downstream of the evidence fault, not an independent failure.",
    facts: [{ k: "LAYERS", v: "9" }, { k: "HEALTHY", v: "7" }, { k: "DEGRADED", v: "1" }, { k: "WARNING", v: "1" }],
    read: "One root cause, two symptoms. Fixing the anchor writer clears both layers.", conf: "0.88", confPct: "88%",
    actions: [{ label: "WALK ME THROUGH IT", q: "Why did evidence fail" }],
  },
  authority: {
    kicker: "DOMAIN · AUTHORITY", tint: "#e8f2ff", border: "rgba(127,216,255,.28)",
    title: "Two decisions awaiting you",
    body: "D-016, the evidence store architecture — I favour Option B at 0.78 confidence. D-017, Q4 agent capacity at ₹4.2L — I support it at 0.91 with a cap and a thirty-day review.",
    facts: [{ k: "OPEN", v: "2" }, { k: "BREACHES", v: "0" }, { k: "GRANTS", v: "214" }, { k: "REVOKED 24H", v: "1" }],
    read: "Both sit inside your authority and neither can be committed by an agent. My uncertainty on D-016 is in the migration window, not the architecture.", conf: "0.78", confPct: "78%",
    actions: [{ label: "WHAT IS WAITING?", q: "What decisions are waiting?" }],
  },
  knowledge: {
    kicker: "DOMAIN · KNOWLEDGE", tint: "#e0a7ff", border: "rgba(127,216,255,.28)",
    title: "1,204 sealed records",
    body: "Every claim POA makes traces to a sealed record. Thirty-eight were verified overnight with zero unresolved exceptions before the 02:14 fault.",
    facts: [{ k: "VERIFIED", v: "1,204" }, { k: "NEW TODAY", v: "6" }, { k: "UNRESOLVED", v: "0" }, { k: "OLDEST", v: "14 MAR" }],
    read: "The record is intact. The fault was in checking it, not in the record itself.", conf: "0.91", confPct: "91%",
    actions: [{ label: "SHOW THE EVIDENCE CHAIN", q: "Why did evidence fail" }],
  },
  governance: {
    kicker: "DOMAIN · GOVERNANCE", tint: "#ffb489", border: "rgba(127,216,255,.28)",
    title: "No authority breaches",
    body: "No capability was exercised outside its granted authority in the last thirty days. One grant — deploy-prod for the QA Agent — was revoked at 05:55 and is pending review.",
    facts: [{ k: "BREACHES", v: "0" }, { k: "GRANTS", v: "214" }, { k: "REVOKED", v: "1" }, { k: "IN REVIEW", v: "1" }],
    read: "The revocation was automatic and correct. It needs a human sign-off to close, not a decision.", conf: "0.95", confPct: "95%",
    actions: [{ label: "WHAT CHANGED OVERNIGHT?", q: "What changed overnight?" }],
  },
};

// Reference line 830.
export const PROMPTS = ["What needs my attention?", "Show me mission risks", "Why did evidence fail?", "Prepare my morning brief"];


export interface AnswerPanelRow {
  k: string;
  v: string;
  w: string;
  c: string;
}

export interface Answer {
  text: string;
  panelTitle?: string;
  panel?: AnswerPanelRow[];
  conf?: string;
}

/**
 * Ported verbatim from the reference's `answer(q)` (POA Command.dc.html
 * lines 721-752) - keyword-matched canned responses over the reference's
 * own example organizational scenario, not a real reasoning capability.
 */
export function computeAnswer(q: string): Answer {
  const t = q.toLowerCase();
  if (t.includes("risk"))
    return {
      text: "Evidence Infrastructure is the only mission in attention. The witness service missed three integrity checks at 02:14 and anchoring is now forty-one minutes behind. No records were lost. Temple Growth shows a velocity deviation but its outcome is unaffected.",
      panelTitle: "MISSION STATE · NOW",
      panel: [
        { k: "Temple Growth", v: "91 · HOLDING", w: "91%", c: "#2ee6a6" },
        { k: "Mothership", v: "74 · ACTIVE", w: "74%", c: "#4fc9ff" },
        { k: "Evidence Infrastructure", v: "62 · ATTENTION", w: "62%", c: "#f2a53c" },
        { k: "HR SaaS", v: "35 · DORMANT", w: "35%", c: "rgba(160,190,230,.75)" },
      ],
      conf: "CONFIDENCE 0.74 · 34 SEALED RECORDS",
    };
  if (t.includes("overnight") || t.includes("changed"))
    return {
      text: "Four things. Evidence Infrastructure dropped into attention at 02:14. Temple Growth sealed release 2.4 at 05:20. A deploy-prod capability was revoked from the QA Agent at 05:55. Meera moved two people from HR SaaS to Temple Growth at 06:48.",
      conf: "CONFIDENCE 0.91 · 412 SIGNALS SINCE 18:30",
    };
  if (t.includes("decision") || t.includes("waiting") || t.includes("approve") || t.includes("authority"))
    return {
      text: "Two, both inside your authority. The evidence store architecture — I favour Option B at 0.78, and my uncertainty is in the migration window rather than the architecture. And Q4 agent capacity at ₹4.2L, which I support at 0.91 with a cap and a thirty-day review.",
      panelTitle: "CONFIDENCE IN EACH RECOMMENDATION",
      panel: [
        { k: "D-016 Evidence architecture", v: "0.78", w: "78%", c: "#f2a53c" },
        { k: "D-017 Q4 agent capacity", v: "0.91", w: "91%", c: "#4fc9ff" },
      ],
    };
  if (t.includes("brief"))
    return {
      text: "Four missions, thirty-eight people, twelve agents, no authority breaches. Three missions are holding. One is in attention and contained. Two decisions are waiting and both are yours. Nothing else needs you before your eleven o'clock.",
      panelTitle: "ORGANIZATION · THIS MORNING",
      panel: [
        { k: "Missions holding", v: "3 of 4", w: "75%", c: "#2ee6a6" },
        { k: "Evidence verified", v: "1,204", w: "96%", c: "#2ee6a6" },
        { k: "Authority breaches", v: "0", w: "2%", c: "#2ee6a6" },
        { k: "Decisions waiting", v: "2", w: "40%", c: "#f2a53c" },
      ],
      conf: "CONFIDENCE 0.86 · ASSEMBLED 07:42",
    };
  if (t.includes("why") && (t.includes("evidence") || t.includes("fail") || t.includes("witness")))
    return {
      text: "The integrity checker compares a rolling hash of the evidence store against the witness anchor. It failed three times because the anchor writer fell behind and was comparing against a stale anchor. The store itself is intact — a lag fault, not a corruption fault, which is why I am recommending a recovery path rather than an incident response.",
      conf: "CONFIDENCE 0.74 · CHANGES IF THE 06:00 REPLAY ALSO FAILS",
    };
  if (t.includes("think") || t.includes("fund") || t.includes("first"))
    return {
      text: "Evidence recovery first. The capacity budget buys speed on a mission already moving; the evidence work protects the integrity every other decision depends on. If the evidence spine is unreliable, the budget decision itself becomes unverifiable.",
      panelTitle: "IF YOU FUND ONLY ONE",
      panel: [
        { k: "Evidence recovery", v: "Protects 1,204", w: "88%", c: "#f2a53c" },
        { k: "Q4 agent capacity", v: "Saves 3 weeks", w: "46%", c: "#4fc9ff" },
      ],
      conf: "CONFIDENCE 0.81 · SPOKEN CONTEXT NOT YET SEALED",
    };
  if (t.includes("attention") || t.includes("needs me"))
    return {
      text: "Three matters. Evidence Infrastructure is degraded and contained. Decision D-016 needs your authorization. Temple Growth shows a velocity deviation I would not act on yet.",
      conf: "CONFIDENCE 0.86 · 412 SIGNALS",
    };
  if (t.includes("workforce") || t.includes("people") || t.includes("agent"))
    return {
      text: "Twelve agents working, all advisory — none can commit a decision. The Architecture Agent is eighty-two per cent through the evidence store comparison. Thirty-eight people engaged, heaviest on Mothership at nine.",
      panelTitle: "EXECUTION MIX BY MISSION",
      panel: [
        { k: "Mothership · 9 human / 5 AI", v: "14", w: "88%", c: "#4fc9ff" },
        { k: "Temple Growth · 6 / 2", v: "8", w: "50%", c: "#2ee6a6" },
        { k: "Evidence Infra · 4 / 3", v: "7", w: "44%", c: "#f2a53c" },
        { k: "HR SaaS · 2 / 4", v: "6", w: "38%", c: "rgba(160,190,230,.75)" },
      ],
    };
  return {
    text: "I have no grounded answer to that. I answer only from sealed organizational record — ask about risks, what changed overnight, the decisions waiting on you, the workforce, or ask for your brief.",
    conf: "NO ANSWER RETURNED · 0 RECORDS MATCHED",
  };
}
