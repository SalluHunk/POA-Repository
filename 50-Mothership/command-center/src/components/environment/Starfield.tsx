function seedRand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: seedRand(i * 3.1) * 100,
  y: seedRand(i * 7.7 + 1) * 100,
  r: 0.5 + seedRand(i * 5.3 + 2) * 1.1,
  o: 0.15 + seedRand(i * 9.1 + 3) * 0.55,
  delay: `${(seedRand(i * 2.2 + 4) * 6).toFixed(2)}s`,
  dur: `${(3 + seedRand(i * 4.4 + 5) * 4).toFixed(2)}s`,
}));

/**
 * 70 twinkling stars + faint horizon lines - pure decoration, deterministic
 * seeding not Math.random() (POA Command.dc.html lines 42-60). The horizon
 * lines are static in the reference (no animation attribute on those
 * paths) - a prior "waveFlow" drift on them was invented motion with no
 * source equivalent and has been removed rather than kept as an
 * approximation.
 */
export function Starfield() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ position: "fixed", inset: 0, zIndex: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.85 }}
    >
      <g fill="#cfe6ff">
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.08} opacity={s.o} style={{ animation: `cmTwinkle ${s.dur} ease-in-out infinite`, animationDelay: s.delay }} />
        ))}
      </g>
      <g fill="none" stroke="rgba(88,166,255,.22)" strokeWidth={0.1}>
        <path d="M-4 86 C 18 81, 32 91, 52 87 S 82 80, 104 85" />
        <path d="M-4 90 C 17 84, 33 94, 54 90 S 83 83, 106 88" />
        <path d="M-4 93 C 16 88, 34 98, 56 93 S 84 86, 108 91" />
      </g>
    </svg>
  );
}
