/**
 * Module-internal persistence. No other module may import this file
 * directly -- enforced by test/architecture-boundary.test.ts.
 */
import type { SevaBooking } from "./types";

const bookings: SevaBooking[] = [];
let seq = 0;

export function insert(record: Omit<SevaBooking, "id" | "createdAt">): SevaBooking {
  const id = "seva-booking-" + (++seq);
  const full: SevaBooking = { id, createdAt: new Date().toISOString(), ...record };
  bookings.push(full);
  return full;
}

export function findAllForPerson(personId: string): SevaBooking[] {
  return bookings.filter((b) => b.personId === personId);
}

export function _clearForTests(): void {
  bookings.length = 0;
  seq = 0;
}
