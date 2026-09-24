/** Base stage gradient + 3 accent glows - pure decoration, no data (POA Command.dc.html lines 38-40). */
export function Atmosphere() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "radial-gradient(1500px 900px at 50% 44%, #0a1832 0%, #050b18 42%, var(--bg) 78%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(760px 520px at 16% 78%, rgba(22,84,160,.28), transparent 70%), radial-gradient(620px 420px at 86% 22%, rgba(122,70,180,.16), transparent 70%), radial-gradient(500px 360px at 78% 82%, rgba(16,120,140,.14), transparent 70%)",
        }}
      />
    </div>
  );
}
