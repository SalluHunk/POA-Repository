/**
 * Plain node:http server for the Mothership Control Panel (POA-BLD-002 S15).
 *
 * No framework: the existing repository has no HTTP layer at all yet, and
 * the API surface here is small and fixed, so `node:http` plus a short
 * manual route table is the smallest option consistent with the existing
 * repository's minimal-dependency posture (POA-BLD-002 S15's own
 * instruction). The frontend is static HTML/CSS/vanilla JS for the same
 * reason - no bundler, no client framework, nothing to build.
 */
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname, resolve } from "node:path";
import type { MothershipState } from "./state.ts";
import type { MissionState } from "@/mission";
import * as api from "./api.ts";

const PUBLIC_DIR = resolve(import.meta.dirname, "..", "public");

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function sendJson(res: ServerResponse, response: api.ApiResponse): void {
  const body = JSON.stringify(response.body, null, 2);
  res.writeHead(response.status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(body);
}

async function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return {};
  }
}

async function serveStatic(pathname: string, res: ServerResponse): Promise<void> {
  const relative = pathname === "/" ? "/index.html" : pathname;
  const target = resolve(join(PUBLIC_DIR, relative));
  // Path-traversal guard: the resolved file must stay inside PUBLIC_DIR.
  if (!target.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  try {
    const data = await readFile(target);
    const type = CONTENT_TYPES[extname(target)] ?? "application/octet-stream";
    // no-cache (not no-store): a local operational console must never let an
    // operator act on a stale cached script/page - discovered live while
    // exercising POA-BLD-002 in a real browser (an edited app.js kept
    // serving its old, already-loaded copy from browser HTTP cache).
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache" });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}

export function createMothershipHttpServer(state: MothershipState) {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");
      const { pathname, searchParams } = url;
      const method = req.method ?? "GET";

      if (!pathname.startsWith("/api/")) {
        if (method === "GET") await serveStatic(pathname, res);
        else {
          res.writeHead(405);
          res.end();
        }
        return;
      }

      const orgParam = () => searchParams.get("org") ?? "";

      // GET /api/health
      if (method === "GET" && pathname === "/api/health") {
        return sendJson(res, api.getHealth());
      }

      // GET /api/organizations
      if (method === "GET" && pathname === "/api/organizations") {
        return sendJson(res, api.listOrganizations(state));
      }

      // GET /api/organizations/:orgId/principals
      let m = pathname.match(/^\/api\/organizations\/([^/]+)\/principals$/);
      if (method === "GET" && m) {
        return sendJson(res, api.listPrincipals(state, decodeURIComponent(m[1])));
      }

      // GET /api/organizations/:orgId/capabilities
      m = pathname.match(/^\/api\/organizations\/([^/]+)\/capabilities$/);
      if (method === "GET" && m) {
        return sendJson(res, api.getCapabilityView(state, decodeURIComponent(m[1])));
      }

      // GET /api/organizations/:orgId/missions
      m = pathname.match(/^\/api\/organizations\/([^/]+)\/missions$/);
      if (method === "GET" && m) {
        return sendJson(res, api.listMissions(state, decodeURIComponent(m[1])));
      }

      // POST /api/missions
      if (method === "POST" && pathname === "/api/missions") {
        const body = await readJsonBody(req);
        return sendJson(res, api.createMission(state, String(body.missionId ?? ""), String(body.organizationId ?? "")));
      }

      // GET /api/missions/:id/evidence?org=...
      m = pathname.match(/^\/api\/missions\/([^/]+)\/evidence$/);
      if (method === "GET" && m) {
        return sendJson(res, api.getMissionEvidence(state, decodeURIComponent(m[1]), orgParam()));
      }

      // GET /api/missions/:id/verify?org=...
      m = pathname.match(/^\/api\/missions\/([^/]+)\/verify$/);
      if (method === "GET" && m) {
        return sendJson(res, api.verifyMission(state, decodeURIComponent(m[1]), orgParam()));
      }

      // POST /api/missions/:id/transition
      m = pathname.match(/^\/api\/missions\/([^/]+)\/transition$/);
      if (method === "POST" && m) {
        const body = await readJsonBody(req);
        return sendJson(
          res,
          api.transitionMission(
            state,
            decodeURIComponent(m[1]),
            String(body.organizationId ?? ""),
            String(body.to ?? "") as MissionState,
            String(body.principalId ?? ""),
          ),
        );
      }

      // POST /api/missions/:id/authorize
      m = pathname.match(/^\/api\/missions\/([^/]+)\/authorize$/);
      if (method === "POST" && m) {
        const body = await readJsonBody(req);
        return sendJson(
          res,
          api.authorizeAndExecute(
            state,
            decodeURIComponent(m[1]),
            String(body.organizationId ?? ""),
            String(body.principalId ?? ""),
            String(body.capability ?? ""),
            String(body.action ?? ""),
          ),
        );
      }

      // POST /api/missions/:id/checkpoint
      m = pathname.match(/^\/api\/missions\/([^/]+)\/checkpoint$/);
      if (method === "POST" && m) {
        const body = await readJsonBody(req);
        return sendJson(res, api.checkpointMission(state, decodeURIComponent(m[1]), String(body.organizationId ?? "")));
      }

      // GET /api/missions/:id?org=... (kept last: least specific pattern)
      m = pathname.match(/^\/api\/missions\/([^/]+)$/);
      if (method === "GET" && m) {
        return sendJson(res, api.getMissionDetail(state, decodeURIComponent(m[1]), orgParam()));
      }

      sendJson(res, { status: 404, body: { ok: false, code: "NOT_FOUND" } });
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: false, code: "INTERNAL_ERROR", detail: String(error) }));
    }
  });
}
