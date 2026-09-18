/**
 * Deterministic payload serialization (POA-DEC-SEC-001 S4 Q1, S8).
 * Object keys are sorted recursively so semantically identical payloads
 * always canonicalize to the same string before hashing/signing.
 */
export function canonicalize(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }
  if (value !== null && typeof value === "object") {
    const input = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(input).sort()) {
      sorted[key] = sortValue(input[key]);
    }
    return sorted;
  }
  return value;
}
