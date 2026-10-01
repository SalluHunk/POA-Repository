import type {
  Citation,
  InteractionResponse,
  InteractionSnapshot,
  InteractionSource,
  InteractionTurn,
  Interpreter,
  Intent,
  NavigateSuggestion,
  SupportedIntentKind,
  UnsupportedTopic,
} from "./types";

/**
 * Deterministic interpreter (POA-ORG-KNOW-EXEC-INTERACTION-001, Phase 1).
 *
 * Pure: same (text, snapshot) -> same response. No network, no LLM, no agent,
 * no KnowledgePlane, no business-function routing, no approval execution, no
 * timers, no randomness. Every factual statement is read from the snapshot
 * and cited; anything else is an honest unsupported/unknown response.
 */

export const MAX_INPUT_LENGTH = 280;
const MAX_LISTED = 5;

const ACTION_START = /^(?:please\s+)?(?:approve|deny|authori[sz]e|execute|run|start|close|mark|confirm|transition|retry|cancel|fix|delete|create)\b/;
const BUSINESS = /\b(?:revenue|sales|finance|financial|payroll|hiring|marketing|customers?|invoices?|budget|inventory)\b/;
const REASONING = /\b(?:summari[sz]e|summary|draft|write|predict|forecast|recommend|brief|why|explain|analy[sz]e|compare)\b/;

const GREETING = /^(?:hi|hello|hey|greetings|good (?:morning|afternoon|evening))(?:\s+poa)?$/;
const HELP = /^(?:help|commands|what can (?:you|i)(?: do| ask)?|what do you (?:do|support))$|\bhelp\b/;
const ATTENTION = /\b(?:attention|flagged)\b/;
const RISKS = /\b(?:risks?|at risk|failed|failing|denied|compromised)\b/;
const EVIDENCE = /\b(?:evidence|verified|verification|unverified|witness|checkpoint|integrity)\b/;
const NAVIGATE = /^(?:show|open|go to|goto|focus|take me to|view)\s+(?:me\s+)?(?:the\s+)?(.+)$/;

const SUPPORTED_SUMMARY =
  "I can answer from the loaded organizational state: what needs attention, mission risks, and evidence status. I can also offer to open a mission, a principal, People or Projects. I do not take actions or reason beyond that state.";

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ").replace(/[?.!]+$/, "");
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

function response(
  intent: Intent,
  status: InteractionResponse["status"],
  text: string,
  citations: Citation[] = [],
  suggestions: NavigateSuggestion[] = [],
): InteractionResponse {
  return { status, intent, text, evidenceBearing: citations.length > 0, citations, suggestions };
}

function missionCitation(id: string, state?: string): Citation {
  return { kind: "mission", id, label: state ? `Mission ${id} (${state})` : `Mission ${id}` };
}

function snapshotCitation(snapshot: InteractionSnapshot, what: string): Citation {
  return { kind: "snapshot", id: what, label: `Loaded runtime state: ${plural(snapshot.missions.length, "mission", "missions")}` };
}

function classify(raw: string): Intent {
  const t = normalize(raw);
  if (ACTION_START.test(t)) return { status: "unsupported", topic: "action" };
  if (BUSINESS.test(t)) return { status: "unsupported", topic: "business-function" };
  if (REASONING.test(t)) return { status: "unsupported", topic: "reasoning" };
  if (GREETING.test(t)) return { status: "supported", kind: "greeting" };
  if (HELP.test(t)) return { status: "supported", kind: "help" };
  if (NAVIGATE.test(t)) return { status: "supported", kind: "navigate" };
  if (ATTENTION.test(t)) return { status: "supported", kind: "attention" };
  if (RISKS.test(t)) return { status: "supported", kind: "mission-risks" };
  if (EVIDENCE.test(t)) return { status: "supported", kind: "evidence-status" };
  return { status: "unknown" };
}

const UNSUPPORTED_TEXT: Record<UnsupportedTopic, string> = {
  action: "I do not take or confirm actions. Consequential actions are only available from a mission's own surface, with explicit confirmation.",
  "business-function": "I do not have business-function data. I can only answer about the loaded mission, evidence and authority state.",
  reasoning: "I do not summarize, explain or reason over the organization. I can only report what the loaded state directly shows.",
};

function answerAttention(snapshot: InteractionSnapshot, intent: Intent): InteractionResponse {
  const items = snapshot.attention;
  if (items.length === 0) {
    return response(intent, "answered", "Nothing requires attention.", [snapshotCitation(snapshot, "attention")]);
  }
  const shown = items.slice(0, MAX_LISTED);
  const more = items.length - shown.length;
  const lines = shown.map((i) => `${i.missionId}: ${i.label}`);
  const text = `${plural(items.length, "thing requires", "things require")} attention. ${lines.join("; ")}${more > 0 ? `; and ${more} more` : ""}.`;
  const citations = shown.map((i) => missionCitation(i.missionId));
  const suggestions = shown.map((i): NavigateSuggestion => ({ kind: "mission", id: i.missionId, label: `Open ${i.missionId}` }));
  return response(intent, "answered", text, citations, suggestions);
}

function answerRisks(snapshot: InteractionSnapshot, intent: Intent): InteractionResponse {
  const risky = snapshot.attention.filter((i) => i.tier <= 2);
  if (risky.length === 0) {
    return response(intent, "answered", `No mission is currently failed, denied or integrity-compromised among ${plural(snapshot.missions.length, "loaded mission", "loaded missions")}.`, [
      snapshotCitation(snapshot, "mission-risks"),
    ]);
  }
  const shown = risky.slice(0, MAX_LISTED);
  const more = risky.length - shown.length;
  const text = `${plural(risky.length, "mission carries", "missions carry")} a failed, denied or integrity-compromised condition. ${shown.map((i) => `${i.missionId}: ${i.label}`).join("; ")}${more > 0 ? `; and ${more} more` : ""}.`;
  const citations: Citation[] = [];
  for (const i of shown) {
    const state = snapshot.missions.find((m) => m.id === i.missionId)?.state;
    citations.push(missionCitation(i.missionId, state));
    if (i.label === "Denied") {
      for (const d of snapshot.decisions) {
        if (d.missionId === i.missionId && !d.granted) {
          citations.push({ kind: "decision", id: `${d.missionId}/${d.capability}`, label: `Decision: ${d.capability} denied for ${d.missionId}` });
        }
      }
    }
  }
  const suggestions = shown.map((i): NavigateSuggestion => ({ kind: "mission", id: i.missionId, label: `Open ${i.missionId}` }));
  return response(intent, "answered", text, citations, suggestions);
}

function answerEvidence(snapshot: InteractionSnapshot, intent: Intent): InteractionResponse {
  let verified = 0;
  let mismatch = 0;
  let noCheckpoint = 0;
  let chainFailed = 0;
  let noDetail = 0;
  const citations: Citation[] = [];
  for (const m of snapshot.missions) {
    const d = snapshot.missionDetails.get(m.id);
    if (!d) {
      noDetail++;
      continue;
    }
    if (!d.mission.chainVerified) chainFailed++;
    if (d.witnessCode === "MATCH") verified++;
    else {
      if (d.witnessCode === "MISMATCH") mismatch++;
      else noCheckpoint++;
      if (citations.length < MAX_LISTED) {
        citations.push(
          d.mission.headHash
            ? { kind: "evidence", id: `${m.id}#${d.mission.headHash}`, label: `Evidence head of ${m.id} (witness ${d.witnessCode})` }
            : missionCitation(m.id, m.state),
        );
      }
    }
  }
  const parts = [
    `${verified} witness-verified`,
    `${noCheckpoint} with no checkpoint`,
    `${mismatch} witness mismatch`,
    `${chainFailed} chain verification failed`,
  ];
  const tail = noDetail > 0 ? ` ${plural(noDetail, "mission has", "missions have")} no loaded detail.` : "";
  const text = `Evidence status across ${plural(snapshot.missions.length, "loaded mission", "loaded missions")}: ${parts.join(", ")}.${tail}`;
  return response(intent, "answered", text, [snapshotCitation(snapshot, "evidence-status"), ...citations]);
}

function answerNavigate(raw: string, snapshot: InteractionSnapshot, intent: Intent): InteractionResponse {
  const target = (NAVIGATE.exec(normalize(raw))?.[1] ?? "").trim();
  if (/^(?:people|team|principals|the team)$/.test(target)) {
    return response(intent, "answered", "People is available. Activate the suggestion to open it.", [], [{ kind: "people", label: "Open People" }]);
  }
  if (/^(?:projects?|project registry|the project registry)$/.test(target)) {
    return response(intent, "answered", "Projects is available. Activate the suggestion to open it.", [], [{ kind: "project", label: "Open Projects" }]);
  }
  const id = target.replace(/^(?:mission|principal)\s+/, "");
  const mission = snapshot.missions.find((m) => m.id.toLowerCase() === id);
  if (mission) {
    return response(intent, "answered", `Mission ${mission.id} is loaded (${mission.state}). Activate the suggestion to open it.`, [missionCitation(mission.id, mission.state)], [
      { kind: "mission", id: mission.id, label: `Open ${mission.id}` },
    ]);
  }
  const principal = snapshot.principals.find((p) => p.id.toLowerCase() === id);
  if (principal) {
    return response(
      intent,
      "answered",
      `Principal ${principal.id} is loaded. Activate the suggestion to open it.`,
      [{ kind: "principal", id: principal.id, label: `Principal ${principal.id}` }],
      [{ kind: "principal", id: principal.id, label: `Open ${principal.id}` }],
    );
  }
  return response(intent, "answered", "I can open People, Projects, or a mission or principal by its exact ID. No loaded mission or principal matches that.", [snapshotCitation(snapshot, "navigate")]);
}

export function interpret(text: string, snapshot: InteractionSnapshot): InteractionResponse {
  if (text.length > MAX_INPUT_LENGTH) {
    return response({ status: "unknown" }, "unknown", `That is longer than ${MAX_INPUT_LENGTH} characters. Please ask a shorter question.`);
  }
  const intent = classify(text);
  if (intent.status === "unknown") {
    return response(intent, "unknown", `I did not recognize that. ${SUPPORTED_SUMMARY}`);
  }
  if (intent.status === "unsupported") {
    return response(intent, "unsupported", UNSUPPORTED_TEXT[intent.topic]);
  }
  const kind: SupportedIntentKind = intent.kind;
  if (kind === "greeting") {
    return response(intent, "answered", "Hello. Ask me what needs attention, about mission risks, or about evidence status. Say help for more.");
  }
  if (kind === "help") return response(intent, "answered", SUPPORTED_SUMMARY);
  if (snapshot.loading) {
    return response(intent, "unavailable", "Runtime state is still loading, so I cannot answer that yet.");
  }
  if (kind === "attention") return answerAttention(snapshot, intent);
  if (kind === "mission-risks") return answerRisks(snapshot, intent);
  if (kind === "evidence-status") return answerEvidence(snapshot, intent);
  return answerNavigate(text, snapshot, intent);
}

export const deterministicInterpreter: Interpreter = { interpret };

/** Pure turn constructor; the caller supplies the id (no clock, no counter here). */
export function createTurn(id: number, source: InteractionSource, input: string, response: InteractionResponse): InteractionTurn {
  return { id, source, input, response };
}
