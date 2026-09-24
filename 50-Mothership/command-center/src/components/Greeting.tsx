/** Headline/subline block, ported position and typography (POA Command.dc.html lines 86-93). Content is real (loading/stable/attention-derived), never a fabricated named greeting. */
export function Greeting({ headline, subline }: { headline: string; subline: string }) {
  return (
    <div style={{ position: "fixed", left: 52, top: 112, zIndex: 2, width: 400, pointerEvents: "none" }}>
      <div style={{ width: 112, height: 1, background: "linear-gradient(90deg, rgba(127,216,255,.65), transparent)" }} />
      <div style={{ marginTop: 22, fontSize: 44, fontWeight: 300, lineHeight: 1.18, letterSpacing: "-0.015em" }}>{headline}</div>
      {subline && <div style={{ marginTop: 20, fontSize: 18, lineHeight: 1.7, color: "rgba(223,233,247,.78)" }}>{subline}</div>}
    </div>
  );
}
