import { Stage } from "./components/Stage";
import { CommandCenter } from "./components/CommandCenter";
import { Environment } from "./components/environment/Environment";
import { OrbitMarkers } from "./components/OrbitMarkers";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ContextualSurface } from "./components/ContextualSurface";
import { MissionFocus } from "./components/MissionFocus";
import { MissionInvestigate } from "./components/MissionInvestigate";
import { ActionConfirm } from "./components/ActionConfirm";
import { ActionResult } from "./components/ActionResult";
import { PrincipalFocus } from "./components/PrincipalFocus";
import { PeopleFocus } from "./components/PeopleFocus";
import { ProjectFocus } from "./components/ProjectFocus";
import { CommandOverlay } from "./components/CommandOverlay";
import { DomainDetailOverlay } from "./demo/DomainDetailOverlay";
import { AnswerOverlay } from "./demo/AnswerOverlay";
import { ThinkingIndicator } from "./demo/ThinkingIndicator";
import { ListeningOverlay } from "./demo/ListeningOverlay";
import { useCommandCenter } from "./state/useCommandCenter";
import { usePresenceAsk } from "./demo/usePresenceAsk";
import { DOMAIN_SPEC } from "./components/environment/constants";
import { isDemoLayerEnabled, DemoDisclosure } from "./demo/demoLayer";

export function App() {
  const { state, actions } = useCommandCenter();
  const { subject, depth } = state;
  const { selectedDomain, answer, thinking, listening, pickDomain, closeDetail, closeAnswer, send, toggleListen, askOpinion } = usePresenceAsk();
  // Demo quarantine (POA-DEC-MOTHERSHIP-002): the reference's fictional
  // Layer-B content (domain narrative, canned answers, listening overlay,
  // example figures for unbacked domains) is reachable only when the demo
  // layer is explicitly enabled (`npm run dev:demo`). Off by default.
  const demo = isDemoLayerEnabled();

  const focusedMissionId = subject?.type === "mission" ? subject.id : null;
  const focusedPrincipalId = subject?.type === "principal" ? subject.id : null;
  const focusedMissionDetail = focusedMissionId ? state.missionDetails.get(focusedMissionId) : undefined;
  const focusedPrincipalWithCaps = subject?.type === "principal" ? state.capabilityPrincipals.find((p) => p.id === subject.id) : undefined;

  const isKnownId = (id: string) => state.missions.some((m) => m.id === id) || state.principals.some((p) => p.id === id);

  // PEOPLE is the one domain orb wired to a real Focus surface so far - it
  // bypasses the narrative pickDomain/DomainDetailOverlay path entirely and
  // goes straight to the real principal roster. The other six domain orbs
  // open the reference's fictional narrative overlay only in demo mode;
  // otherwise they are inert.
  const handleSelectDomain = (id: string) => {
    if (id === "people") {
      actions.focusPeople();
      return;
    }
    if (demo) pickDomain(id);
  };

  const missionDetailsList = [...state.missionDetails.values()];
  const verified = missionDetailsList.filter((d) => d.witnessCode === "MATCH").length;
  const unverified = missionDetailsList.length - verified;
  const granted = state.decisions.filter((d) => d.granted).length;
  const denied = state.decisions.length - granted;
  const activePeople = state.principals.filter((p) => p.active).length;

  // 4 of the 7 domains have a real backend concept and get real derived
  // counts. Systems/Knowledge/Governance don't: by default they render the
  // honest DESIGNED "NOT CONNECTED" placeholder. The reference's own example
  // figures for them (l1/l2/flag off DOMAIN_SPEC) are fictional and appear
  // only in demo mode (POA-DEC-MOTHERSHIP-002).
  const specFor = (id: string) => DOMAIN_SPEC.find((d) => d.id === id)!;
  const unbacked = (id: string) => (demo ? { l1: specFor(id).l1, l2: specFor(id).l2, flag: specFor(id).flag } : { l1: "NOT CONNECTED", l2: "no backend source" });
  const domainData = {
    missions: { l1: `${state.missions.length} in flight`, l2: `${state.attention.length} flagged` },
    people: { l1: `${activePeople}/${state.principals.length} active`, l2: "principals" },
    evidence: { l1: `${verified} verified`, l2: `${unverified} unverified`, flag: demo ? specFor("evidence").flag : undefined },
    authority: { l1: `${granted} granted`, l2: `${denied} denied` },
    systems: unbacked("systems"),
    knowledge: unbacked("knowledge"),
    governance: unbacked("governance"),
  };

  return (
    <Stage>
      <Environment recede={depth !== "presence"} domainData={domainData} selectedDomainId={selectedDomain} onSelectDomain={handleSelectDomain} />
      <OrbitMarkers
        missions={state.missions}
        principals={state.principals}
        attention={state.attention}
        focusedMissionId={focusedMissionId}
        focusedPrincipalId={focusedPrincipalId}
        onFocusMission={(id) => void actions.focusMission(id)}
        onFocusPrincipal={(id) => actions.focusPrincipal(id)}
      />
      <Header onToggleOverlay={actions.toggleOverlay} />

      {depth === "presence" && (
        <CommandCenter
          missions={state.missions}
          principals={state.principals}
          missionDetails={state.missionDetails}
          decisions={state.decisions}
          attention={state.attention}
          loading={state.loading}
          error={state.error}
          lookupError={state.lookupError}
          onFocusMission={(id) => void actions.focusMission(id)}
          onLookup={(q) => void actions.lookup(q)}
          onAsk={send}
          isKnownId={isKnownId}
          listening={listening}
          onToggleListen={toggleListen}
        />
      )}

      {/* Reference's hasDetail/hasAnswer/thinking (POA Command.dc.html lines
          236-303) - mutually exclusive, and only meaningful over the
          Presence surface (other depths already cover the screen with
          their own contextual surface). */}
      {demo && depth === "presence" && selectedDomain && !answer && !thinking && <DomainDetailOverlay domainId={selectedDomain} onClose={closeDetail} onAsk={send} />}
      {demo && depth === "presence" && answer && !thinking && <AnswerOverlay answer={answer} onClose={closeAnswer} />}
      {demo && depth === "presence" && thinking && <ThinkingIndicator />}
      {/* Not over the Project surface: the listening narrative names the
          fictional "Temple Growth", which must never share the screen with
          repository-backed projects (Project Surface Decision Brief D3). */}
      {demo && listening && subject?.type !== "project" && <ListeningOverlay onAskOpinion={askOpinion} onStop={toggleListen} />}
      {/* Demo mode also shows fictional example figures on the orbs, so the
          mode itself is disclosed globally, not only per overlay. */}
      {demo && <DemoDisclosure style={{ position: "fixed", right: 32, bottom: 20, zIndex: 50, background: "rgba(6,10,22,.85)" }} />}

      {depth === "context" && subject?.type === "mission" && (
        <ContextualSurface variant="anchored">
          {state.actionResult && <ActionResult result={state.actionResult} detail={focusedMissionDetail} />}
          <MissionFocus
            missionId={subject.id}
            detail={focusedMissionDetail}
            dimmed={Boolean(state.actionPending)}
            onDrill={() => void actions.drillInvestigate()}
            onRequestTransition={(to) => actions.requestAction({ kind: "transition", to })}
            onReturn={() => actions.returnTo("presence")}
          />
          {state.actionPending && (
            <>
              <div className="action-anchor" />
              <ActionConfirm
                missionId={subject.id}
                action={state.actionPending}
                principals={state.principals.filter((p) => p.active)}
                onConfirm={(pid) => void actions.confirmAction(pid)}
                onCancel={actions.cancelAction}
              />
            </>
          )}
        </ContextualSurface>
      )}

      {depth === "investigation" && subject?.type === "mission" && (
        <ContextualSurface variant="scroll">
          <MissionInvestigate
            missionId={subject.id}
            evidence={state.evidence}
            chainVerified={focusedMissionDetail?.mission.chainVerified ?? true}
            onReturn={() => actions.returnTo("context")}
          />
        </ContextualSurface>
      )}

      {depth === "context" && subject?.type === "principal" && (
        <ContextualSurface variant="anchored">
          <PrincipalFocus
            principal={focusedPrincipalWithCaps}
            capabilities={focusedPrincipalWithCaps?.capabilities ?? []}
            decisions={state.decisions}
            onReturn={() => actions.returnTo("presence")}
            onFocusMission={(id) => void actions.focusMission(id)}
          />
        </ContextualSurface>
      )}

      {depth === "context" && subject?.type === "people" && (
        <ContextualSurface variant="anchored">
          <PeopleFocus principals={state.capabilityPrincipals} onFocusPrincipal={(id) => actions.focusPrincipal(id)} onReturn={() => actions.returnTo("presence")} />
        </ContextualSurface>
      )}

      {/* Context depth only - the demo narrative overlays render only at
          Presence, and the listening overlay is excluded for this subject
          above, so repository-backed projects and fictional content are
          never on screen together (Project Surface Decision Brief D3). */}
      {depth === "context" && subject?.type === "project" && (
        <ContextualSurface variant="scroll">
          <ProjectFocus registry={state.projectRegistry} onReturn={() => actions.returnTo("presence")} />
        </ContextualSurface>
      )}

      <CommandOverlay
        open={state.overlayOpen}
        onClose={actions.toggleOverlay}
        onCommandCenter={() => actions.returnTo("presence")}
        onFocusLookup={() => actions.returnTo("presence")}
        onProjects={() => void actions.focusProject()}
      />
      <Footer />
    </Stage>
  );
}
