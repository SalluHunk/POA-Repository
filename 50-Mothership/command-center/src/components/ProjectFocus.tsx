import type { RepositoryReference } from "../api/types";
import type { ProjectRegistryState } from "../state/useCommandCenter";
import { Breadcrumb } from "./shared";

interface Props {
  registry: ProjectRegistryState;
  onReturn: () => void;
}

// PROJECT focus - POA-PJR-001 as committed, via the read-only Slice 001
// feed (Project Surface Decision Brief D2/D5/D6). Everything is rendered
// verbatim as plain text: field names unchanged ("Lifecycle state" /
// "Execution state" are never collapsed into a generic status), confidence
// markers left inline exactly where PJR-001 wrote them, markdown not
// interpreted. Every entry and addendum shows its full Repository
// Reference, never collapsed - that reference is the D3 distinction from
// the fictional demo narrative, which structurally cannot carry one.
// Deliberately absent: any mission relationship (D-A: UNSPECIFIED), any
// action/edit affordance, and any data outside PJR-001.
export function ProjectFocus({ registry, onReturn }: Props) {
  return (
    <div className="depth-contextual converge-in" style={{ borderRadius: 10, padding: "40px 48px", maxWidth: 820, margin: "0 auto" }}>
      <Breadcrumb segments={[{ label: "Presence", onClick: onReturn }, { label: "Projects" }]} />

      <div className="mono" style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 8 }}>
        REPOSITORY RECORD · POA-PJR-001
      </div>
      <div style={{ fontSize: 24, fontWeight: 500, marginBottom: 6 }}>Paravyoma Project Registry</div>
      <div className="mono" style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 22 }}>
        {registry.status === "ok"
          ? `${registry.registry.entries.length} ${registry.registry.entries.length === 1 ? "entry" : "entries"} · ${registry.registry.addenda.length} ${registry.registry.addenda.length === 1 ? "addendum" : "addenda"} · read-only, as committed`
          : "read-only, as committed"}
      </div>

      {(registry.status === "loading" || registry.status === "idle") && (
        <div className="mono" style={{ fontSize: 13, color: "var(--text-faint)" }}>
          Reading the repository…
        </div>
      )}

      {registry.status === "failed" && (
        <div role="alert" className="mono" style={{ fontSize: 13, color: "var(--red)" }}>
          Project Registry unavailable — {registry.code}
          <div style={{ marginTop: 6, color: "var(--text-faint)", fontSize: 12, whiteSpace: "pre-wrap" }}>{registry.detail}</div>
        </div>
      )}

      {registry.status === "ok" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {registry.registry.entries.length === 0 && (
            <div className="mono" style={{ fontSize: 13, color: "var(--text-faint)" }}>
              No entries in the committed registry.
            </div>
          )}

          {registry.registry.entries.map((entry) => (
            <section key={entry.repositoryReference.heading} data-repository-block="entry" style={blockStyle}>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>{entry.repositoryReference.heading}</div>
              <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "minmax(120px, 170px) 1fr", columnGap: 16, rowGap: 10 }}>
                {entry.fields.map((f, i) => (
                  <div key={i} style={{ display: "contents" }}>
                    <dt className="mono" style={{ fontSize: 11.5, color: "var(--text-faint)" }}>
                      {f.field}
                    </dt>
                    <dd style={{ margin: 0, fontSize: 13, color: "var(--text-dim)", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{f.value}</dd>
                  </div>
                ))}
              </dl>
              <RepositoryReferenceLine reference={entry.repositoryReference} />
            </section>
          ))}

          {registry.registry.addenda.length > 0 && (
            <>
              <div className="mono" style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 8 }}>
                REGISTRY ADDENDA — appended after the entries in POA-PJR-001, shown verbatim in registry order
              </div>
              {registry.registry.addenda.map((addendum) => (
                <section key={addendum.repositoryReference.heading} data-repository-block="addendum" style={blockStyle}>
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>{addendum.repositoryReference.heading}</div>
                  <div style={{ fontSize: 13, color: "var(--text-dim)", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{addendum.body}</div>
                  <RepositoryReferenceLine reference={addendum.repositoryReference} />
                </section>
              ))}
            </>
          )}
        </div>
      )}

      <button onClick={onReturn} className="mono" style={{ marginTop: 22, background: "none", border: "none", color: "var(--text-faint)", fontSize: 12, cursor: "pointer", padding: 0 }}>
        ← Return to Presence
      </button>
    </div>
  );
}

function RepositoryReferenceLine({ reference }: { reference: RepositoryReference }) {
  return (
    <div data-testid="repository-reference" className="mono" style={{ marginTop: 14, fontSize: 11, color: "var(--text-faint)", overflowWrap: "anywhere" }}>
      Repository Reference: {reference.path} @ {reference.commit} · “{reference.heading}”
    </div>
  );
}

const blockStyle = {
  padding: "18px 20px",
  borderRadius: 8,
  background: "var(--panel-2)",
  border: "1px solid var(--border-2)",
} as const;
