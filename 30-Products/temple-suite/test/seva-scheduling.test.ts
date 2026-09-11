import { describe, it, expect, beforeEach } from "vitest";
import { recordSevaBooking, getSevaHistory, SEVA_BOOKED } from "@/modules/seva-scheduling";
import { eventBus } from "@/shared/eventBus";
import { SYNTHETIC_TENANT_ID } from "@/shared/tenant";
import { SYNTHETIC_SEVA_TYPE, SYNTHETIC_SEVA_SLOT } from "../fixtures/synthetic-data";
import * as store from "@/modules/seva-scheduling/store";

beforeEach(() => {
  store._clearForTests();
});

describe("Seva Scheduling", () => {
  it("creates a seva booking owned solely by the Seva Scheduling module", () => {
    const booking = recordSevaBooking({
      personId: "identity-test-seva-1",
      sevaType: SYNTHETIC_SEVA_TYPE,
      scheduledFor: SYNTHETIC_SEVA_SLOT,
      tenantId: SYNTHETIC_TENANT_ID,
    });
    expect(booking.id).toBeTruthy();
    expect(getSevaHistory("identity-test-seva-1")).toEqual([booking]);
  });

  it("emits SevaBooked on successful booking", () => {
    const received: unknown[] = [];
    eventBus.on(SEVA_BOOKED, (payload) => {
      received.push(payload);
    });
    const booking = recordSevaBooking({
      personId: "identity-test-seva-2",
      sevaType: SYNTHETIC_SEVA_TYPE,
      scheduledFor: SYNTHETIC_SEVA_SLOT,
      tenantId: SYNTHETIC_TENANT_ID,
    });
    expect(received).toHaveLength(1);
    expect((received[0] as { bookingId: string }).bookingId).toBe(booking.id);
  });

  it("getSevaHistory returns every booking for a person, not just the latest", () => {
    recordSevaBooking({
      personId: "identity-test-seva-3",
      sevaType: SYNTHETIC_SEVA_TYPE,
      scheduledFor: SYNTHETIC_SEVA_SLOT,
      tenantId: SYNTHETIC_TENANT_ID,
    });
    recordSevaBooking({
      personId: "identity-test-seva-3",
      sevaType: SYNTHETIC_SEVA_TYPE,
      scheduledFor: SYNTHETIC_SEVA_SLOT,
      tenantId: SYNTHETIC_TENANT_ID,
    });
    expect(getSevaHistory("identity-test-seva-3")).toHaveLength(2);
  });

  it("getSevaHistory does not leak another person's bookings", () => {
    recordSevaBooking({
      personId: "identity-test-seva-4",
      sevaType: SYNTHETIC_SEVA_TYPE,
      scheduledFor: SYNTHETIC_SEVA_SLOT,
      tenantId: SYNTHETIC_TENANT_ID,
    });
    expect(getSevaHistory("identity-test-seva-unrelated")).toHaveLength(0);
  });
});
