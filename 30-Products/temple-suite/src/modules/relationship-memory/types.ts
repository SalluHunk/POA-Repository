/**
 * Field boundary for THIS SLICE ONLY, per the DGP-DEV-001 Phase B Commander
 * decision (Phase B directive, item 1): name, contactReference,
 * relationshipContextMarker, tenantId, plus technical id/createdAt/updatedAt
 * metadata. This is a SCOPE-LIMITED implementation decision -- it does NOT
 * resolve the complete Relationship Memory entity/field model, which
 * remains OPEN (TSAAS-002 section 7 / section 21; POA-PJR-003 section
 * 4 / section 13).
 */
export interface PersonIdentity {
  id: string;
  name: string;
  contactReference: string;
  relationshipContextMarker: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrGetIdentityInput {
  name: string;
  contactReference: string;
  relationshipContextMarker: string;
  tenantId: string;
}
