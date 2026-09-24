/**
 * Mothership Control Panel server entry point (POA-BLD-002).
 * Run with: npm run console  (from 50-Mothership/)
 */
import { createMothershipState } from "./state.ts";
import { seedDemoData } from "./seed.ts";
import { createMothershipHttpServer } from "./http.ts";
import { findRepositoryRoot, loadRepositoryRecords } from "./repository-records.ts";

const port = Number(process.env.PORT ?? 5310);

const state = createMothershipState();
seedDemoData(state);

// A load failure leaves the affected feed reporting
// REPOSITORY_RECORDS_UNAVAILABLE rather than stopping the console or
// substituting any other data.
try {
  const records = loadRepositoryRecords(findRepositoryRoot(import.meta.dirname));
  state.repositoryRecords = { ok: true, records };
  const { decisionRecords: d, projectRegistry: p } = records;
  console.log(`Repository records @ ${records.commit}`);
  console.log(`  POA-ADR-001: ${d.ok ? `${d.value.length} decision records` : `UNAVAILABLE - ${d.detail}`}`);
  console.log(`  POA-PJR-001: ${p.ok ? `${p.value.entries.length} entries, ${p.value.addenda.length} addenda` : `UNAVAILABLE - ${p.detail}`}`);
} catch (error) {
  state.repositoryRecords = { ok: false, detail: String(error) };
  console.error(`Repository records UNAVAILABLE: ${String(error)}`);
}

const server = createMothershipHttpServer(state);
server.listen(port, () => {
  console.log(`POA Mothership Control Panel listening on http://localhost:${port}`);
  console.log(`Independent Witness: TEST DOUBLE ONLY - see IMPLEMENTATION.md`);
});
