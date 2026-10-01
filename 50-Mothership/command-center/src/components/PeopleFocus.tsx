import type { Principal } from "../api/types";
import { Chip, Breadcrumb } from "./shared";

interface Props {
  principals: (Principal & { capabilities: string[] })[];
  onFocusPrincipal: (id: string) => void;
  onReturn: () => void;
}

// PEOPLE domain focus - the real principal roster (state.capabilityPrincipals),
// not the narrative DOMAIN_DETAIL overlay the other six domains still use.
// Selecting a row converges on the same PrincipalFocus.tsx used by the
// Command Bar's direct ID lookup and OrbitMarkers - one Principal Focus
// experience, reached two ways, per the functionalization brief.
export function PeopleFocus({ principals, onFocusPrincipal, onReturn }: Props) {
  return (
    <div className="depth-contextual converge-in" style={{ borderRadius: "var(--radius-10)", padding: "40px 48px", maxWidth: 640, margin: "60px auto 0" }}>
      <Breadcrumb segments={[{ label: "Presence", onClick: onReturn }, { label: "People" }]} />

      <div className="mono" style={{ fontSize: "var(--fs-11)", color: "var(--text-faint)", marginBottom: "var(--space-8)" }}>
        DOMAIN
      </div>
      <div style={{ fontSize: "var(--fs-24)", fontWeight: 500, marginBottom: "var(--space-6)" }}>People</div>
      <div className="mono" style={{ fontSize: "var(--fs-12)", color: "var(--text-dim)", marginBottom: "var(--space-22)" }}>
        {principals.length} {principals.length === 1 ? "principal" : "principals"} in this organization
      </div>

      {principals.length === 0 && (
        <div className="mono" style={{ fontSize: "var(--fs-13)", color: "var(--text-faint)" }}>
          No principals registered in this organization.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
        {principals.map((p) => (
          <button
            key={p.id}
            onClick={() => onFocusPrincipal(p.id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-14)",
              padding: "14px 16px",
              borderRadius: "var(--radius-8)",
              background: "var(--panel-2)",
              border: "1px solid var(--border-2)",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
              <span style={{ fontSize: 14.5 }}>{p.id}</span>
              <span className="mono" style={{ fontSize: 11.5, color: "var(--text-faint)" }}>
                {p.role} · {p.capabilities.length} {p.capabilities.length === 1 ? "capability" : "capabilities"}
              </span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "var(--space-10)", flex: "none" }}>
              <Chip tone={p.active ? "green" : "neutral"}>{p.active ? "✓ ACTIVE" : "✕ REVOKED"}</Chip>
              <span style={{ color: "var(--text-faint)", fontSize: "var(--fs-15)" }}>›</span>
            </span>
          </button>
        ))}
      </div>

      <button onClick={onReturn} className="mono" style={{ marginTop: "var(--space-22)", background: "none", border: "none", color: "var(--text-faint)", fontSize: "var(--fs-12)", cursor: "pointer", padding: 0 }}>
        ← Return to Presence
      </button>
    </div>
  );
}
