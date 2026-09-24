// QUARANTINED DEMO MODULE (POA-DEC-MOTHERSHIP-002): fictional reference content,
// not POA organizational truth. Only reachable when isDemoLayerEnabled().
import { useCallback, useEffect, useRef, useState } from "react";
import { computeAnswer, type Answer } from "./presenceData";

/**
 * React equivalent of the reference's Component state/actions for the
 * Presence surface's domain-selection, ask-POA, and listening interaction
 * model (POA Command.dc.html lines 680-868: pickDomain, closeDetail, send,
 * closeAnswer, toggleListen, askOpinion). Deliberately separate from
 * useCommandCenter.ts - this holds only in-memory UI/demo state, no real
 * backend calls, so the existing real-data architecture is untouched.
 */
export function usePresenceAsk() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Reference line 848-849: toggles the same domain off, clears any answer.
  const pickDomain = useCallback((id: string) => {
    setSelectedDomain((current) => (current === id ? null : id));
    setAnswer(null);
  }, []);

  const closeDetail = useCallback(() => setSelectedDomain(null), []);
  const closeAnswer = useCallback(() => setAnswer(null), []);

  // Reference line 754-758 (Component.send): 800ms thinking delay before
  // the canned answer resolves; clears domain/menu/listening the same way.
  const send = useCallback((q: string, opts?: { closeMenu?: () => void }) => {
    if (!q || !q.trim()) return;
    clearTimeout(timer.current);
    setAnswer(null);
    setSelectedDomain(null);
    setListening(false);
    opts?.closeMenu?.();
    setThinking(true);
    timer.current = setTimeout(() => {
      setThinking(false);
      setAnswer(computeAnswer(q));
    }, 800);
  }, []);

  const toggleListen = useCallback(() => setListening((v) => !v), []);
  const askOpinion = useCallback(() => send("What do you think we should fund first?"), [send]);

  return { selectedDomain, answer, thinking, listening, pickDomain, closeDetail, closeAnswer, send, toggleListen, askOpinion };
}
