/**
 * POA Visual DNA (POA-VIS-003 MISSION 4): the common grammar every
 * OrganizationalVisualProfile must honor, regardless of visual metaphor.
 *
 * This is NOT a fixed theme or a universal dashboard design — it is the set
 * of architectural principles that make an expression recognizably "POA."
 * VIS-001/VIS-002 already established this grammar informally (see
 * `src/app/globals.css` header comment and `src/components/ui.tsx` header
 * comment: "executive clarity, restrained motion, no gradients/
 * glassmorphism"). This module makes it a single shared reference so every
 * OrganizationalVisualProfile provably points at the same principles
 * instead of restating (and silently drifting from) them.
 */
export const POA_VISUAL_DNA = [
  "Organizational state must remain legible.",
  "Signals must have meaning — nothing decorative stands in for a real signal.",
  "Visual hierarchy must reflect importance, not arrival order.",
  "Animation communicates state, change, or flow — never mere decoration.",
  "Visual density must remain controlled; executive clarity over exhaustive detail.",
  "Interaction must remain coherent across the console.",
  "Alexis must remain connected to underlying organizational state, not the visual layer.",
  "Visual expression must never fabricate organizational information.",
] as const;
