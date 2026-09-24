// The five-phase journey model shown in the Header (POA Command.dc.html
// lines 787-790). Structural display vocabulary, not organizational data -
// kept outside src/demo/ so real UI never imports from the quarantined
// demo layer (POA-DEC-MOTHERSHIP-002).
export const PHASES = ["OBSERVE", "UNDERSTAND", "DECIDE", "ACT", "EVOLVE"] as const;
export type Phase = (typeof PHASES)[number];
