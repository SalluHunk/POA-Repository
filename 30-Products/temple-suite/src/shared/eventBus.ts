/**
 * Implementation-level decision (DGP-DEV-001 Phase B, NOT ratified POA
 * architecture): a synchronous, in-process publish/subscribe bus stands in
 * for the internal, in-process domain events cross-module mechanism
 * TSAAS-002 section 9 describes conceptually. TSAAS-002 explicitly leaves
 * the actual mechanism (in-process emitter vs an embedded queue)
 * RECOMMENDED/OPEN at the implementation-detail level; this slice selects
 * the simplest option that satisfies the acceptance tests and does not
 * claim ratified architectural status for this choice.
 */
type Handler<T> = (payload: T) => void;

export class InProcessEventBus {
  private handlers = new Map<string, Handler<any>[]>();
  private deliveryLog: { eventType: string; eventId: string }[] = [];

  on<T>(eventType: string, handler: Handler<T>): void {
    const list = this.handlers.get(eventType) ?? [];
    list.push(handler);
    this.handlers.set(eventType, list);
  }

  emit<T extends { eventId: string }>(eventType: string, payload: T): void {
    this.deliveryLog.push({ eventType, eventId: payload.eventId });
    const list = this.handlers.get(eventType) ?? [];
    for (const handler of list) {
      handler(payload);
    }
  }

  getDeliveryLog(): readonly { eventType: string; eventId: string }[] {
    return this.deliveryLog;
  }
}

export const eventBus = new InProcessEventBus();
