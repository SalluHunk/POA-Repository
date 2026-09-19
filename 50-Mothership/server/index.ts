/**
 * Mothership Control Panel server entry point (POA-BLD-002).
 * Run with: npm run console  (from 50-Mothership/)
 */
import { createMothershipState } from "./state.ts";
import { seedDemoData } from "./seed.ts";
import { createMothershipHttpServer } from "./http.ts";

const port = Number(process.env.PORT ?? 5310);

const state = createMothershipState();
seedDemoData(state);

const server = createMothershipHttpServer(state);
server.listen(port, () => {
  console.log(`POA Mothership Control Panel listening on http://localhost:${port}`);
  console.log(`Independent Witness: TEST DOUBLE ONLY - see IMPLEMENTATION.md`);
});
