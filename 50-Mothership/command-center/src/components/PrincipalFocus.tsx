import type { AuthorizationDecisionRecord, Principal } from "../api/types";
import { Chip, Breadcrumb } from "./shared";

interface Props {
  principal: Principal | undefined;
  capabilities: string[];
  decisions: AuthorizationDecisionRecord[];
  onReturn: () => void;
  onFocusMission: (id: string) => void;
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
export function PrincipalFocus({ principal, capabilities, decisions, onReturn, onFocusMission }: Props) {
  if (!principal) return null;
  const own = decisions.filter((d) => d.producerId === principal.id);
  const granted = own.filter((d) => d.granted).length;
  const denied = own.length - granted;
  // Missions this principal has real, evidenced involvement with - the only
  // grounded principal->mission link the runtime carries (via
  // AuthorizationDecisionRecord.producerId). There is no separate
  // ownership/creation field on Mission, so this is not "missions owned,"
  // it is exactly what it says: missions with authorization activity.
  const missionIds = [...new Set(own.map((d) => d.missionId))];

  return (
    <div className="depth-contextual converge-in" style={{ borderRadius: 10, padding: "40px 48px", maxWidth: 640, margin: "60px auto 0" }}>
      <Breadcrumb segments={[{ label: "Presence", onClick: onReturn }, { label: principal.id }]} />

      <div className="mono" style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 8 }}>
        PRINCIPAL
      </div>
      <div style={{ fontSize: 24, fontWeight: 500, marginBottom: 18 }}>{principal.id}</div>

      <div style={{ display: "flex", gap: 12, marginBottom: 26, flexWrap: "wrap" }}>
        <Chip tone={principal.active ? "green" : "neutral"}>{principal.active ? "✓ ACTIVE" : "✕ REVOKED"}</Chip>
        <Chip>{principal.role}</Chip>
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

      <div style={{ marginTop: 22, paddingTop: 22, borderTop: "1px solid var(--border)" }}>
        <div className="mono" style={{ fontSize: 10.5, color: "var(--text-faint)", marginBottom: 10 }}>
          MISSIONS — via authorization activity
        </div>
        {missionIds.length === 0 ? (
          <div className="mono" style={{ fontSize: 13, color: "var(--text-faint)" }}>
            No missions recorded for this principal yet.
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {missionIds.map((id) => (
              <button
                key={id}
                onClick={() => onFocusMission(id)}
                className="mono"
                style={{ fontSize: 12.5, padding: "7px 13px", borderRadius: 6, background: "var(--panel-2)", border: "1px solid var(--border-2)", color: "var(--cyan)", cursor: "pointer" }}
              >
                {id} →
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={onReturn} className="mono" style={{ marginTop: 22, background: "none", border: "none", color: "var(--text-faint)", fontSize: 12, cursor: "pointer", padding: 0 }}>
        ← Return to Presence
      </button>
    </div>
  );
}
