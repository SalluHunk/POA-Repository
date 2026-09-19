// POA Mothership Control Panel - vanilla JS, no framework, no bundler
// (POA-BLD-002 S15: smallest option consistent with the existing
// repository, which has no frontend framework at all). Every render
// function below fetches from the real HTTP API in server/api.ts, which
// itself only ever reads/writes the real MothershipRuntime - nothing on
// this page is hardcoded demonstration data (POA-BLD-002 S4/S7).

const app = document.getElementById("app");
const orgSelect = document.getElementById("org-select");

let organizations = [];
let currentOrgId = null;

async function api(path, options) {
  const res = await fetch(path, options);
  let body = null;
  try { body = await res.json(); } catch { /* no body */ }
  return { status: res.status, ok: res.ok, body };
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child) node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

function badge(text, kind) {
  return el("span", { class: `badge ${kind}`, text });
}

function originBadge(origin) {
  return origin === "fixture"
    ? badge("TEST FIXTURE", "fixture")
    : badge("OPERATOR-CREATED", "operator");
}

function stateBadge(state) {
  const kind = state === "Closed" || state === "Succeeded" ? "pass" : state === "Failed" ? "fail" : "neutral";
  return badge(state, kind);
}

function boolBadge(value, trueLabel = "PASS", falseLabel = "FAIL") {
  return badge(value ? trueLabel : falseLabel, value ? "pass" : "fail");
}

// --- Organization context (POA-BLD-002 S9) ---------------------------------

async function loadOrganizations() {
  const { body } = await api("/api/organizations");
  organizations = body.organizations ?? [];
  orgSelect.innerHTML = "";
  for (const org of organizations) {
    orgSelect.appendChild(el("option", { value: org.id, text: `${org.name} (${org.id})` }));
  }
  if (!currentOrgId && organizations.length > 0) currentOrgId = organizations[0].id;
  orgSelect.value = currentOrgId ?? "";
}

orgSelect.addEventListener("change", () => {
  currentOrgId = orgSelect.value;
  render();
});

// --- Router ------------------------------------------------------------

function parseRoute() {
  const hash = location.hash.replace(/^#/, "") || "/";
  const [path, query] = hash.split("?");
  const params = new URLSearchParams(query ?? "");
  return { path, params };
}

function setActiveNav(path) {
  for (const a of document.querySelectorAll("#nav a")) {
    const route = a.getAttribute("data-route");
    a.classList.toggle("active", route === path || (route !== "/" && path.startsWith(route)));
  }
}

async function render() {
  const { path } = parseRoute();
  setActiveNav(path);
  app.textContent = "Loading…";

  if (!currentOrgId) {
    app.textContent = "No organization registered in the runtime yet.";
    return;
  }

  const missionMatch = path.match(/^\/missions\/([^/]+)$/);

  try {
    if (path === "/" ) return await renderHome();
    if (path === "/missions") return await renderMissions();
    if (missionMatch) return await renderMissionDetail(decodeURIComponent(missionMatch[1]));
    if (path === "/capabilities") return await renderCapabilities();
    if (path === "/isolation") return await renderIsolation();
    app.textContent = "Unknown route.";
  } catch (e) {
    app.textContent = "";
    app.appendChild(el("div", { class: "notice error", text: `Render error: ${e}` }));
  }
}

window.addEventListener("hashchange", render);

// --- Home (POA-BLD-002 S5A) ---------------------------------------------

async function renderHome() {
  const [health, principalsRes, missionsRes] = await Promise.all([
    api("/api/health"),
    api(`/api/organizations/${encodeURIComponent(currentOrgId)}/principals`),
    api(`/api/organizations/${encodeURIComponent(currentOrgId)}/missions`),
  ]);

  const org = organizations.find((o) => o.id === currentOrgId);
  const principals = principalsRes.body.principals ?? [];
  const missions = missionsRes.body.missions ?? [];
  const byState = {};
  for (const m of missions) byState[m.state] = (byState[m.state] ?? 0) + 1;

  app.textContent = "";
  const card = el("div", { class: "card" }, [
    el("h2", { text: "Organization Context" }),
    el("div", { class: "grid" }, [
      statCard("Organization", `${org?.name ?? "?"}`),
      statCard("Organization ID", org?.id ?? "?", true),
      statCard("Registered identities", String(principals.length)),
      statCard("Runtime status", health.body.status ?? "UNKNOWN"),
    ]),
  ]);
  app.appendChild(card);

  const missionCard = el("div", { class: "card" }, [
    el("h2", { text: "Mission Summary (real runtime state)" }),
    el("div", { class: "grid" }, [
      statCard("Total missions", String(missions.length)),
      statCard("Created", String(byState.Created ?? 0)),
      statCard("Running", String(byState.Running ?? 0)),
      statCard("Succeeded", String(byState.Succeeded ?? 0)),
      statCard("Failed", String(byState.Failed ?? 0)),
      statCard("Closed", String(byState.Closed ?? 0)),
    ]),
  ]);
  app.appendChild(missionCard);

  const integrityCard = el("div", { class: "card" }, [
    el("h2", { text: "Evidence / Integrity Status" }),
    el("p", { class: "muted", text: "Per-mission integrity is computed from live evidence chains - open a mission for its own status. Aggregate below reflects every mission currently in this organization." }),
  ]);
  const results = await Promise.all(
    missions.map((m) => api(`/api/missions/${encodeURIComponent(m.id)}/verify?org=${encodeURIComponent(currentOrgId)}`)),
  );
  const chainOk = results.filter((r) => r.body?.chain?.ok).length;
  const witnessOk = results.filter((r) => r.body?.witness?.ok).length;
  integrityCard.appendChild(
    el("div", { class: "grid" }, [
      statCard("Chain-verified missions", `${chainOk} / ${missions.length}`),
      statCard("Witness-verified missions", `${witnessOk} / ${missions.length}`),
    ]),
  );
  integrityCard.appendChild(
    el("div", { class: "limitation" }, [
      el("strong", { text: "Independent Witness: TEST DOUBLE ONLY. " }),
      "The witness store is an in-process module, not a production-independent trust boundary. " +
        "See 40-Runtime/POA-BLD-001-COMPLETION-REPORT.md, Gate H Treatment.",
    ]),
  );
  app.appendChild(integrityCard);

  const conditionsCard = el("div", { class: "card" }, [
    el("h2", { text: "Known Conditional Conditions (documented, not live runtime state)" }),
    el("ul", {}, [
      el("li", { text: "Independent Witness is a local test double - isolation not process-enforced (POA-DEC-SEC-001 S14)." }),
      el("li", { text: "In-memory only - no persistence across process restarts." }),
      el("li", { text: "Role-level identity only - no per-session/instance identity." }),
    ]),
  ]);
  app.appendChild(conditionsCard);
}

function statCard(label, value, mono) {
  return el("div", { class: "stat" }, [
    el("div", { class: "label", text: label }),
    el("div", { class: `value ${mono ? "mono" : ""}`, text: value }),
  ]);
}

// --- Mission Console (POA-BLD-002 S5B) ----------------------------------

async function renderMissions() {
  const { body } = await api(`/api/organizations/${encodeURIComponent(currentOrgId)}/missions`);
  const missions = body.missions ?? [];

  app.textContent = "";
  const card = el("div", { class: "card" });
  card.appendChild(el("h2", { text: "Mission Console" }));

  if (missions.length === 0) {
    card.appendChild(el("p", { class: "muted", text: "No missions exist yet for this organization." }));
  } else {
    const table = el("table");
    table.appendChild(el("thead", {}, el("tr", {}, [
      el("th", { text: "Mission ID" }),
      el("th", { text: "State" }),
      el("th", { text: "Origin" }),
    ])));
    const tbody = el("tbody");
    for (const m of missions) {
      const row = el("tr", { onclick: () => { location.hash = `#/missions/${encodeURIComponent(m.id)}`; } }, [
        el("td", { class: "mono", text: m.id }),
        el("td", {}, stateBadge(m.state)),
        el("td", {}, originBadge(m.origin)),
      ]);
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    card.appendChild(table);
  }
  app.appendChild(card);

  const createCard = el("div", { class: "card" });
  createCard.appendChild(el("h2", { text: "Create Mission (POA-BLD-002 S8)" }));
  const input = el("input", { placeholder: "mission id, e.g. mission-op-001" });
  const notice = el("div");
  const form = el("form", { class: "inline", onsubmit: async (e) => {
    e.preventDefault();
    if (!input.value.trim()) return;
    const { status, body: result } = await api("/api/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ missionId: input.value.trim(), organizationId: currentOrgId }),
    });
    notice.textContent = "";
    notice.appendChild(el("div", { class: `notice ${status === 201 ? "ok" : "error"}`, text: JSON.stringify(result) }));
    if (status === 201) await renderMissions();
  } }, [input, el("button", { type: "submit", class: "primary", text: "Create" })]);
  createCard.appendChild(form);
  createCard.appendChild(notice);
  app.appendChild(createCard);
}

// --- Mission Detail + Evidence + "Why" chain (POA-BLD-002 S5C/S5D/S6) ---

async function renderMissionDetail(missionId) {
  const [detailRes, evidenceRes, principalsRes] = await Promise.all([
    api(`/api/missions/${encodeURIComponent(missionId)}?org=${encodeURIComponent(currentOrgId)}`),
    api(`/api/missions/${encodeURIComponent(missionId)}/evidence?org=${encodeURIComponent(currentOrgId)}`),
    api(`/api/organizations/${encodeURIComponent(currentOrgId)}/principals`),
  ]);

  app.textContent = "";
  app.appendChild(el("a", { class: "back link", href: "#/missions", text: "← Mission Console" }));

  if (!detailRes.ok) {
    app.appendChild(el("div", { class: "notice error", text: `${detailRes.body.code}: ${detailRes.body.detail ?? ""}` }));
    return;
  }

  const mission = detailRes.body.mission;
  const evidence = evidenceRes.ok ? evidenceRes.body.evidence : [];
  const principals = principalsRes.body.principals ?? [];

  const header = el("div", { class: "card" }, [
    el("h2", { text: `Mission: ${mission.missionId}` }),
    el("div", { class: "grid" }, [
      statCard("State", ""),
      statCard("Origin", ""),
      statCard("Evidence count", String(mission.evidenceCount)),
      statCard("Head hash", mission.headHash ?? "(none)", true),
    ]),
  ]);
  header.querySelectorAll(".stat .value")[0].appendChild(stateBadge(mission.state));
  header.querySelectorAll(".stat .value")[1].appendChild(originBadge(detailRes.body.origin));
  app.appendChild(header);

  const integrity = el("div", { class: "card" });
  integrity.appendChild(el("h2", { text: "Integrity" }));
  const grid = el("div", { class: "grid" });
  grid.appendChild(rowStat("Evidence chain", mission.chainVerified));
  grid.appendChild(rowStat("Independent witness", mission.witnessVerified));
  const overallOk = mission.chainVerified && mission.witnessVerified;
  grid.appendChild(el("div", { class: "stat" }, [
    el("div", { class: "label", text: "Overall evidence trust" }),
    el("div", { class: "value" }, badge(overallOk ? "CONDITIONAL" : "FAIL", overallOk ? "conditional" : "fail")),
  ]));
  integrity.appendChild(grid);
  integrity.appendChild(el("div", { class: "limitation", text: "\"CONDITIONAL\" (not PASS) because the Independent Witness is a test double, not a production-independent trust anchor (POA-DEC-SEC-001)." }));
  integrity.appendChild(el("button", {
    text: "Checkpoint mission",
    onclick: async () => {
      // No full-page re-render before this resolves: checkpointMission only
      // mutates the witness's own store, not evidence/state, so re-fetching
      // and re-rendering the whole mission detail view (which happens next)
      // is what surfaces the updated "Independent witness" status below -
      // no separate transient notice needed (a transient message here would
      // be wiped by that re-render before ever painting to the screen).
      await api(`/api/missions/${encodeURIComponent(missionId)}/checkpoint`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: currentOrgId }),
      });
      await renderMissionDetail(missionId);
    },
  }));
  app.appendChild(integrity);

  // Actions: transition + authorize (POA-BLD-002 S8)
  const actions = el("div", { class: "card" });
  actions.appendChild(el("h2", { text: "Mission Actions" }));
  actions.appendChild(el("h3", { text: "Lifecycle transition" }));
  const stateSelect = el("select", {}, ["Running", "Succeeded", "Failed", "Closed"].map((s) => el("option", { value: s, text: s })));
  const principalSelect1 = principalDropdown(principals);
  const transitionNotice = el("div");
  actions.appendChild(el("form", { class: "inline", onsubmit: async (e) => {
    e.preventDefault();
    const r = await api(`/api/missions/${encodeURIComponent(missionId)}/transition`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId: currentOrgId, to: stateSelect.value, principalId: principalSelect1.value }),
    });
    transitionNotice.textContent = "";
    transitionNotice.appendChild(el("div", { class: `notice ${r.ok ? "ok" : "error"}`, text: JSON.stringify(r.body) }));
    if (r.ok) await renderMissionDetail(missionId);
  } }, [principalSelect1, stateSelect, el("button", { type: "submit", class: "primary", text: "Transition" })]));
  actions.appendChild(transitionNotice);

  actions.appendChild(el("h3", { text: "Authorize & execute action" }));
  const principalSelect2 = principalDropdown(principals);
  const capabilityInput = el("input", { placeholder: "capability, e.g. mission:execute" });
  const actionInput = el("input", { placeholder: "action, e.g. materialize-artifact" });
  const authNotice = el("div");
  actions.appendChild(el("form", { class: "inline", onsubmit: async (e) => {
    e.preventDefault();
    const r = await api(`/api/missions/${encodeURIComponent(missionId)}/authorize`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationId: currentOrgId, principalId: principalSelect2.value,
        capability: capabilityInput.value, action: actionInput.value,
      }),
    });
    authNotice.textContent = "";
    authNotice.appendChild(el("div", { class: `notice ${r.body.ok ? "ok" : "error"}`, text: JSON.stringify(r.body) }));
    await renderMissionDetail(missionId);
  } }, [principalSelect2, capabilityInput, actionInput, el("button", { type: "submit", class: "primary", text: "Authorize & Execute" })]));
  actions.appendChild(authNotice);
  app.appendChild(actions);

  // Evidence / Why chain (POA-BLD-002 S5D, S6)
  const evCard = el("div", { class: "card" });
  evCard.appendChild(el("h2", { text: "Evidence (the \"Why?\" chain)" }));
  if (evidence.length === 0) {
    evCard.appendChild(el("p", { class: "muted", text: "No evidence recorded yet." }));
  }
  for (const e of evidence) {
    const item = el("div", { class: "evidence-item" });
    item.appendChild(el("div", { class: "row1" }, [
      el("span", { class: "what", text: `#${e.sequence} · ${e.payload.what}` }),
      e.authorityBearing ? badge("AUTHORITY-BEARING", "conditional") : badge("LIFECYCLE-ONLY", "neutral"),
    ]));
    item.appendChild(el("dl", {}, [
      el("dt", { text: "who" }), el("dd", { class: "mono", text: e.producerId }),
      el("dt", { text: "why" }), el("dd", { text: e.payload.why }),
      el("dt", { text: "result" }), el("dd", { text: e.payload.result }),
      el("dt", { text: "when" }), el("dd", { class: "mono", text: e.payload.when }),
      el("dt", { text: "envelopeHash" }), el("dd", { class: "mono", text: e.envelopeHash }),
      el("dt", { text: "signature" }), el("dd", { class: "mono", text: e.signature ? `${e.signature.slice(0, 24)}…` : "(none - lifecycle-only evidence is not signed)" }),
    ]));
    evCard.appendChild(item);
  }
  app.appendChild(evCard);
}

function rowStat(label, ok) {
  return el("div", { class: "stat" }, [
    el("div", { class: "label", text: label }),
    el("div", { class: "value" }, boolBadge(ok)),
  ]);
}

function principalDropdown(principals) {
  return el("select", {}, principals.map((p) => el("option", { value: p.id, text: `${p.id} (${p.role}/${p.engine}${p.active ? "" : ", REVOKED"})` })));
}

// --- Capability / Authorization View (POA-BLD-002 S5E) ------------------

async function renderCapabilities() {
  const { body } = await api(`/api/organizations/${encodeURIComponent(currentOrgId)}/capabilities`);
  app.textContent = "";

  const idCard = el("div", { class: "card" });
  idCard.appendChild(el("h2", { text: "Identity → Capability" }));
  const table = el("table");
  table.appendChild(el("thead", {}, el("tr", {}, [
    el("th", { text: "Principal" }), el("th", { text: "Role" }), el("th", { text: "Engine" }),
    el("th", { text: "Active" }), el("th", { text: "Granted capabilities" }),
  ])));
  const tbody = el("tbody");
  for (const p of body.principals ?? []) {
    tbody.appendChild(el("tr", {}, [
      el("td", { class: "mono", text: p.id }),
      el("td", { text: p.role }),
      el("td", { text: p.engine }),
      el("td", {}, boolBadge(p.active, "ACTIVE", "REVOKED")),
      el("td", { text: p.capabilities.length ? p.capabilities.join(", ") : "(none granted)" }),
    ]));
  }
  table.appendChild(tbody);
  idCard.appendChild(table);
  app.appendChild(idCard);

  const decCard = el("div", { class: "card" });
  decCard.appendChild(el("h2", { text: "Authorization Decisions (\"Why was this allowed / denied?\")" }));
  const decisions = body.decisions ?? [];
  if (decisions.length === 0) {
    decCard.appendChild(el("p", { class: "muted", text: "No authorization decisions have been recorded yet in this organization." }));
  } else {
    const dtable = el("table");
    dtable.appendChild(el("thead", {}, el("tr", {}, [
      el("th", { text: "Mission" }), el("th", { text: "Principal" }), el("th", { text: "Capability" }), el("th", { text: "Decision" }),
    ])));
    const dbody = el("tbody");
    for (const d of decisions) {
      dbody.appendChild(el("tr", { onclick: () => { location.hash = `#/missions/${encodeURIComponent(d.missionId)}`; } }, [
        el("td", { class: "mono", text: d.missionId }),
        el("td", { class: "mono", text: d.producerId }),
        el("td", { text: d.capability }),
        el("td", {}, badge(d.reason, d.granted ? "pass" : "fail")),
      ]));
    }
    dtable.appendChild(dbody);
    decCard.appendChild(dtable);
  }
  app.appendChild(decCard);
}

// --- Organization Isolation Check (POA-BLD-002 S10) ---------------------

async function renderIsolation() {
  app.textContent = "";
  const card = el("div", { class: "card" });
  card.appendChild(el("h2", { text: "Organization Isolation Check" }));
  card.appendChild(el("p", { class: "muted", text: "Pick a mission and a DIFFERENT requesting organization, then attempt to read its evidence. The runtime must deny it (POA-BLD-001 S15, Test I)." }));

  const missionsByOrg = {};
  for (const org of organizations) {
    const { body } = await api(`/api/organizations/${encodeURIComponent(org.id)}/missions`);
    missionsByOrg[org.id] = body.missions ?? [];
  }

  const targetOrgSelect = el("select", {}, organizations.map((o) => el("option", { value: o.id, text: o.name })));
  const missionSelect = el("select");
  const asOrgSelect = el("select", {}, organizations.map((o) => el("option", { value: o.id, text: o.name })));
  const result = el("div");

  function refreshMissionOptions() {
    missionSelect.innerHTML = "";
    for (const m of missionsByOrg[targetOrgSelect.value] ?? []) {
      missionSelect.appendChild(el("option", { value: m.id, text: m.id }));
    }
  }
  targetOrgSelect.addEventListener("change", refreshMissionOptions);
  refreshMissionOptions();

  const form = el("form", { class: "inline", onsubmit: async (e) => {
    e.preventDefault();
    const r = await api(`/api/missions/${encodeURIComponent(missionSelect.value)}/evidence?org=${encodeURIComponent(asOrgSelect.value)}`);
    result.textContent = "";
    const sameOrg = asOrgSelect.value === targetOrgSelect.value;
    const expected = sameOrg ? "expected: ALLOWED" : "expected: DENIED (cross-organization)";
    result.appendChild(el("div", {
      class: `notice ${r.ok ? "ok" : "error"}`,
      text: `${r.ok ? "ALLOWED" : "DENIED"} — ${expected} — ${JSON.stringify(r.body)}`,
    }));
  } }, [
    el("span", { text: "Mission owned by:" }), targetOrgSelect,
    el("span", { text: "mission" }), missionSelect,
    el("span", { text: "requested as org" }), asOrgSelect,
    el("button", { type: "submit", class: "primary", text: "Attempt Access" }),
  ]);
  card.appendChild(form);
  card.appendChild(result);
  app.appendChild(card);
}

// --- Boot ----------------------------------------------------------------

(async function boot() {
  await loadOrganizations();
  await render();
})();
