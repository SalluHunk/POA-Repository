/**
 * Field boundary for Slice 1, unchanged: name, contactReference,
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

/**
 * DGP-DEV-003: the follow-up-context record. This is NOT a new field on
 * PersonIdentity and NOT a new schema decision -- TSAAS-002 section 6
 * already names "follow-up-context record (the fact of an assignment,
 * once confirmed)" as part of Relationship Memory's ratified scope, along
 * with the recordFollowUpAssignment / getFollowUpContext interfaces.
 * Slice 1 simply had not materialized them yet.
 *
 * A recommendation is not a relationship fact (DGP-DEV-003 Phase 2
 * architectural rule). Only a confirmed outcome may exist here -- there is
 * no "pending"/"recommended" status field, by construction: this record
 * type cannot represent an unconfirmed recommendation at all.
 */
export interface FollowUpContextRecord {
  id: string;
  personId: string;
  tenantId: string;
  assignedMentorId: string;
  sourceRecommendationId: string;
  confirmedAt: string;
  createdAt: string;
}

export interface RecordFollowUpAssignmentInput {
  personId: string;
  tenantId: string;
  assignedMentorId: string;
  sourceRecommendationId: string;
}
