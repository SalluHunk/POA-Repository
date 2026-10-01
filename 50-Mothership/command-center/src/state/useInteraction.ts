import { useCallback, useRef, useState } from "react";
import { createTurn, deterministicInterpreter } from "../interaction";
import type { InteractionSnapshot, InteractionTurn, Interpreter } from "../interaction";

// Bounds in-memory history only; nothing is persisted (authorization D6).
export const MAX_TURNS = 50;

/**
 * Interaction state for the Executive Panel (POA-ORG-KNOW-EXEC-INTERACTION-001,
 * Phase 2). Composes beside `useCommandCenter` without touching it: the caller
 * passes the already-loaded runtime snapshot.
 *
 * Interpretation is synchronous and local, so there is deliberately no
 * "processing" state - a fake thinking phase would be fabrication. The only
 * non-idle state is `error`, set when the interpreter itself throws; in that
 * case no turn (and so no success, no citation) is recorded.
 *
 * Session-scoped, in memory only: no storage, no network.
 */
export function useInteraction(snapshot: InteractionSnapshot, interpreter: Interpreter = deterministicInterpreter) {
  const [turns, setTurns] = useState<InteractionTurn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const nextId = useRef(1);
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;

  const submit = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      try {
        const response = interpreter.interpret(trimmed, snapshotRef.current);
        const turn = createTurn(nextId.current++, "typed", trimmed, response);
        setTurns((prev) => [...prev, turn].slice(-MAX_TURNS));
        setError(null);
      } catch {
        setError("The interpreter failed, so no answer was produced.");
      }
    },
    [interpreter],
  );

  const clear = useCallback(() => {
    setTurns([]);
    setError(null);
  }, []);

  return { turns, error, submit, clear };
}
