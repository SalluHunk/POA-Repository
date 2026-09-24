import { Atmosphere } from "./Atmosphere";
import { Starfield } from "./Starfield";
import { OrbitalGeometry } from "./OrbitalGeometry";
import { OrganizationalCore } from "./OrganizationalCore";
import { DomainOrbits, type DomainDatum } from "./DomainOrbits";
import { DOMAIN_SPEC } from "./constants";

/**
 * The persistent organizational environment - atmosphere, starfield,
 * orbital geometry, the glowing core, and the 7 domain orbs. Mounts once
 * at the root and stays mounted at every depth (never swapped for a plain
 * page); focused surfaces (ContextualSurface) layer above it, never
 * replace it. `domainData` is supplied by the caller so this stays a pure
 * rendering layer, no API-shape knowledge of its own. `selectedDomainId`
 * drives both the clickable orbs and the core's caption override
 * (reference's coreCaption, POA Command.dc.html line 811-812).
 */
export function Environment({
  recede = false,
  domainData,
  selectedDomainId,
  onSelectDomain,
}: {
  recede?: boolean;
  domainData: Record<string, DomainDatum>;
  selectedDomainId: string | null;
  onSelectDomain: (id: string) => void;
}) {
  const selectedSpec = selectedDomainId ? DOMAIN_SPEC.find((d) => d.id === selectedDomainId) : undefined;
  return (
    <>
      <Atmosphere />
      <Starfield />
      <OrbitalGeometry />
      <OrganizationalCore recede={recede} caption={selectedSpec ? [selectedSpec.label, "IN FOCUS"] : undefined} captionColor={selectedSpec ? "#9fe9ff" : undefined} />
      <DomainOrbits data={domainData} selectedId={selectedDomainId} onSelect={onSelectDomain} />
    </>
  );
}
