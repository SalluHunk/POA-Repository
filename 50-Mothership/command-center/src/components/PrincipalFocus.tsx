import type { AuthorizationDecisionRecord, Principal } from "../api/types";

interface Props {
  principal: Principal | undefined;
  capabilities: string[];
  decisions: AuthorizationDecisionRecord[];
  onReturn: () => void;
}

// S5, Principal-Focused - the second organizational subject
// (POA-BLD-MOTHERSHIP-001 §3/§14). No people-management application; this
// projects the existing ExecutionPrincipal model, nothing more.
//
// Deliberately does NOT render a "reasoning intensity" tier badge: no
// ratified Low/Medium/High mapping function exists anywhere in the chain
// for the opaque `engine` string (open question 2, unresolved) - inventing
// one here would show a value the runtime never computed, which Design
// Principle 4 forbids. The vendor string itself is never shown either.
export function PrincipalFocus({ principal, capabilities, decisions, onReturn }: Props) {
  if (!principal) return null;
  const own = decisions.filter((d) => d.producerId === principal.id);
  const granted = own.filter((d) => d.granted).length;
  const denied = own.length - granted;

  return (
    <div className="depth-contextual converge-in" style={{ borderRadius: 10, padding: "40px 48px", maxWidth: 640, margin: "60px auto" }}>
      <div className="mono" style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 8 }}>
        PRINCIPAL
      </div>
      <div style={{ fontSize: 24, fontWeight: 500, marginBottom: 18 }}>{principal.id}</div>

      <div style={{ display: "flex", gap: 12, marginBottom: 26, flexWrap: "wrap" }}>
        <span
          className="mono"
          style={{
            fontSize: 12.5,
            padding: "5px 11px",
            borderRadius: 4,
            background: principal.active ? "rgba(62,207,142,.12)" : "var(--panel-2)",
            border: `1px solid ${principal.active ? "rgba(62,207,142,.35)" : "var(--border-2)"}`,
            color: principal.active ? "var(--green)" : "var(--text-dim)",
          }}
        >
          {principal.active ? "✓ ACTIVE" : "✕ REVOKED"}
        </span>
        <span className="mono" style={{ fontSize: 12.5, padding: "5px 11px", borderRadius: 4, background: "var(--panel-2)", border: "1px solid var(--border-2)", color: "var(--text-dim)" }}>
          {principal.role}
        </span>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div className="mono" style={{ fontSize: 10.5, color: "var(--text-faint)", marginBottom: 6 }}>
          GRANTED CAPABILITIES
        </div>
        <div style={{ fontSize: 14 }}>{capabilities.length ? capabilities.join(", ") : "(none granted)"}</div>
      </div>

      <div style={{ paddingTop: 22, borderTop: "1px solid var(--border)" }}>
        <div className="mono" style={{ fontSize: 10.5, color: "var(--text-faint)", marginBottom: 6 }}>
          AUTHORIZATION HISTORY
        </div>
        <div style={{ fontSize: 14 }}>
          <span style={{ color: "var(--green)" }}>{granted} granted</span> · <span style={{ color: "var(--red)" }}>{denied} denied</span>
        </div>
      </div>

      <button onClick={onReturn} className="mono" style={{ marginTop: 22, background: "none", border: "none", color: "var(--text-faint)", fontSize: 12, cursor: "pointer", padding: 0 }}>
        ← Return to Presence
      </button>
    </div>
  );
}
