import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev-time proxy only. This is the entire integration with the existing
// Operational Console's API server (POA-BLD-002) - no change to
// server/http.ts, no CORS headers added there. Production hosting/reverse-
// proxy topology is not decided by this package; see the completion report.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5311,
    proxy: {
      "/api": {
        target: "http://localhost:5310",
        changeOrigin: true,
      },
    },
  },
});
