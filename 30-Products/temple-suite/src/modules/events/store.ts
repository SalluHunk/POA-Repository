/**
 * Module-internal persistence. No other module may import this file
 * directly -- enforced by test/architecture-boundary.test.ts.
 */
import type { EventRegistration } from "./types";

const registrations: EventRegistration[] = [];
let seq = 0;

export function insert(record: Omit<EventRegistration, "id" | "createdAt">): EventRegistration {
  const id = "registration-" + (++seq);
  const full: EventRegistration = { id, createdAt: new Date().toISOString(), ...record };
  registrations.push(full);
  return full;
}

export function findById(id: string): EventRegistration | undefined {
  return registrations.find((r) => r.id === id);
}

export function _clearForTests(): void {
  registrations.length = 0;
  seq = 0;
}
