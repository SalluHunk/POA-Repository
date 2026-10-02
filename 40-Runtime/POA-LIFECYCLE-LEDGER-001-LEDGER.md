# POA-LIFECYCLE-LEDGER-001 — Lifecycle Ledger (derived observation)

**DERIVED OBSERVATION — NOT AUTHORITATIVE — AUTHORIZES NOTHING.**

> "The ledger is an observation of repository evidence, not a reconstruction of organizational reality."
> (binding limitation, Commander ruling of 2026-10-02, restated verbatim as the Mission Package and ADR-001 record require)

| Item | Value |
|---|---|
| Mission | `POA-LIFECYCLE-LEDGER-001` (ratified boundary: `40-Runtime/POA-LIFECYCLE-LEDGER-001-MISSION-PACKAGE.md`) |
| Pin | `f78dea2b2fdb3da71bbd15b16e5b0a356cbc2ccc` — every source read is a committed blob at this commit; the working tree was never read |
| Command | `cd 50-Mothership && npx tsx src/lifecycle-ledger-git.ts --pin f78dea2b2fdb3da71bbd15b16e5b0a356cbc2ccc --repo ..` (stdout only) |
| Tool | `50-Mothership/src/lifecycle-ledger.ts` (pure derivation) and `50-Mothership/src/lifecycle-ledger-git.ts` (read-only reader), committed with this record |
| Stdout SHA-256 | `6bcd6f44f62a35c6127584816726fa30dfeac327546e5d07934286bf0aa9dd11` (the JSON block below is that stdout verbatim, without its trailing newline) |
| Reproduction | Re-running the command against the same pin yields byte-identical output; two runs were compared (execution record §10) |

**How to read it.** `evidencedStates` lists only the lifecycle states that the committed evidence listed in the Mission Package §7 supports; it is not a status of record and assigns no state to any mission. `CLOSED` is never emitted (`POA-STD-011` §6.12 cannot be established mechanically); `READY`, `COMMENCED`, `EXECUTING`, `VERIFIED` and `CLOSED_UNDER_6_12` are always `notEvidenceable`. `UNKNOWN_NOT_PRESENT` = the allowlisted source was examined and the item is absent; `UNKNOWN_NOT_EVIDENCEABLE` = cannot be derived mechanically; `UNKNOWN_NOT_IN_ALLOWLIST` = would need a path outside the three permitted sources; `UNKNOWN_PRE_R_A` = the record predates R-A, which is prospective. `executionRecordPath` is derived by naming convention from the package path (basis `PATH_CONVENTION`). `implementationSha.ancestorOfPin` is `true` only when the recorded SHA appears in the execution record's own commit history cut at the pin (execution record §14, I-2), otherwise `UNKNOWN_NOT_EVIDENCEABLE`. `index` rows carry only an ordinal, the SHA-256 of the heading line and `NOT_IN_ALLOWLIST`: no text of any excluded record is present.

**What it is not.** It is not authorization, acceptance or closure of anything; not a status dashboard or a classifier; not evidence about any record outside the four derived sections; silent about the whole `ORG-KNOWLEDGE`/P5 lineage and every other excluded record, so its R-A coverage statement is partial (34 of 38 H1 headings are index-only).

```json
{
  "authoritative": false,
  "authorizationImplied": false,
  "derivedObservation": true,
  "index": [
    {
      "headingSha256": "332a7351a80dfd783f762672e2543e0880e99372223c93f9b7f5ddfb844415da",
      "ordinal": 0,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "786d33f74aa2db7596969a91ba2c14eb8ee406fb42f22a17f1e6903fd0cf04f6",
      "ordinal": 1,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "49fa133c5691b869aa0fe6f6976874e97962a760e8c7bb5b934dc1534c8a5935",
      "ordinal": 2,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "d39b698ec07295791fc05c267ca98e98370dde51839104f54de85f6eef226e58",
      "ordinal": 3,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "f79c5c0d343f4e6f83ac848eb15e1b1f032c0da528329660124465d5e6c6802d",
      "ordinal": 4,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "626c29bfb9c6c81c4cc6c8273babcd19aa205de8f0052d8b10536dc8fb84fc70",
      "ordinal": 5,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "6fda5810ddeaced0ccdb9597a96c971a337b06224c4c303891cae1c3abebbcbe",
      "ordinal": 6,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "2a4af1d1110a354e20c2013c36e54e03b013e2da9b3727a39380c614faed9e7d",
      "ordinal": 7,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "1dadd7f3270b6f5ffd4854b66e90b1d9dac6a33b89b30c8c80a4beed8cdec136",
      "ordinal": 8,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "81ba91653876b822809332ae47bbc81b62a0560f34e35bd13770717ce78d765c",
      "ordinal": 9,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "56b3b79277bd876b46b1a0d8df79e45e85021fc9e43796eefbfb5b0a221d2fc0",
      "ordinal": 10,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "252298241c1eb4fac6085cb83824b0bf1872fe7e09c4aec1d61b3119d4a30073",
      "ordinal": 11,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "3908a9a3352cf49ce19943bd0afd9126db3f017f470e00eb8f2c1a592bf0a234",
      "ordinal": 12,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "67d96df048e23c44bf97f41cdccae5a84a65077900b1958a9721e90969580760",
      "ordinal": 13,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "1c379474ec2dfc35c1d06af2cf01e8dad90ee6f944954796ada2c7c4f5d79e4d",
      "ordinal": 14,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "5bc212d55638e6ba7dcd29bbe47496a0bfbe0e6b3ef1177d2ae512130f6c99d7",
      "ordinal": 15,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "9bb46a1a1221d248d6dd0e6a3aefa783171d7738b64db018c6a9c3b74c04c9a5",
      "ordinal": 16,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "bc2d6acddfbb0b475bd37a8cab39e3fc87926a980c94906be834afead4842ce6",
      "ordinal": 17,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "64eea751032cfbfbfdefb3d05e3ae9becb3ec06b01e1b5f4fec9eb940d396c60",
      "ordinal": 18,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "f33a651341733ea42cc665a7df9e85f1feb401e6a34141011b81f0218e9b3f63",
      "ordinal": 19,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "f721f828a969e0e5ccf32f1e007865e6c99b4a40331cfb50f557531ec8fd147f",
      "ordinal": 20,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "f2e185d8d773d77c7338781ffceaa9e797a6828f93847ffb49517cec993791fa",
      "ordinal": 21,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "2fc2c254f351cbbafd2c59713ecd4df87d45e5700bb0a951a948a0098f57d01d",
      "ordinal": 22,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "cce2262294e61408afd5cf21472c63f42fb44487f8fbcc2f919ba9eea24285a6",
      "ordinal": 23,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "499821be69801ab2995d163af508343644ad171c16a684583ec90165d15b5baa",
      "ordinal": 24,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "5b6dc9a214a15b8553789fa4030f620e1d4a87c29e0bb67d7f2efe0ae0bc4c06",
      "ordinal": 25,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "c3df9bf2f33939d04df18c8a3de301a85b5c8aef65f9984e7175fc5321d758ec",
      "ordinal": 26,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "3d9f400065531b14cd3415196305c691d4804a45a1113d9d1cae0294b0f82830",
      "ordinal": 27,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "206d0f252b9c86fcb866fda3af15ac862291b3c751568f22134b9e9222739693",
      "ordinal": 28,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "713342cb8186787ff705d0c549095ba345d7a81565f5a957a780135cc1a7d0ae",
      "ordinal": 29,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "fdac77388c8820d46bcdf8128a4918cecca30bdf72e6459010a571055f56a41b",
      "ordinal": 32,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "35f47c692c616568c531d41086692f2ce497f0024ee112f47701e45132806dbf",
      "ordinal": 33,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "f5f0e4c12459e4e5f56f0e60d02a9ba7ee2e4e3d8d1315e76c841321c27498ff",
      "ordinal": 34,
      "status": "NOT_IN_ALLOWLIST"
    },
    {
      "headingSha256": "d727fb453493227755d5df78c3a02a34d911b5770d3a528710a061841da4abe0",
      "ordinal": 35,
      "status": "NOT_IN_ALLOWLIST"
    }
  ],
  "ledgerVersion": "0",
  "pin": {
    "commit": "f78dea2b2fdb3da71bbd15b16e5b0a356cbc2ccc",
    "pinIsAncestorOfHead": true
  },
  "rows": [
    {
      "acceptanceRecordHeadingPresent": "UNKNOWN_PRE_R_A",
      "decidedDate": "2026-09-30",
      "evidencedStates": [
        "RATIFIED"
      ],
      "executionRecordPath": "UNKNOWN_NOT_PRESENT",
      "executionRecordPresentAtPin": "UNKNOWN_NOT_PRESENT",
      "heading": "POA-R-001 — Commander Ratification: Authorization-Provenance Mechanism & Mothership Implementation Disposition (2026-09-30)",
      "implementationSha": {
        "ancestorOfPin": "UNKNOWN_NOT_PRESENT",
        "state": "FIELD_ABSENT",
        "value": null
      },
      "notEvidenceable": [
        "READY",
        "COMMENCED",
        "EXECUTING",
        "VERIFIED",
        "CLOSED_UNDER_6_12"
      ],
      "ordinal": 30,
      "packagePath": "UNKNOWN_NOT_PRESENT",
      "packagePresentAtPin": "UNKNOWN_NOT_PRESENT",
      "packageStatus": "UNKNOWN_NOT_PRESENT",
      "rAApplicability": "PRE_R_A",
      "rBSectionsPresent": "UNKNOWN_PRE_R_A",
      "ratifiedCommit": "0e73e352570fb2e05750cd7e00242001f66e98bb",
      "recordClass": "UNKNOWN_NOT_EVIDENCEABLE",
      "symmetryNoteHeadingPresent": "UNKNOWN_PRE_R_A"
    },
    {
      "acceptanceRecordHeadingPresent": "UNKNOWN_PRE_R_A",
      "decidedDate": "2026-09-30",
      "evidencedStates": [
        "RATIFIED"
      ],
      "executionRecordPath": "UNKNOWN_NOT_PRESENT",
      "executionRecordPresentAtPin": "UNKNOWN_NOT_PRESENT",
      "heading": "POA-STD-011 Approval — Commander/Chief Architect Act (2026-09-30)",
      "implementationSha": {
        "ancestorOfPin": "UNKNOWN_NOT_PRESENT",
        "state": "FIELD_ABSENT",
        "value": null
      },
      "notEvidenceable": [
        "READY",
        "COMMENCED",
        "EXECUTING",
        "VERIFIED",
        "CLOSED_UNDER_6_12"
      ],
      "ordinal": 31,
      "packagePath": "UNKNOWN_NOT_PRESENT",
      "packagePresentAtPin": "UNKNOWN_NOT_PRESENT",
      "packageStatus": "UNKNOWN_NOT_PRESENT",
      "rAApplicability": "PRE_R_A",
      "rBSectionsPresent": "UNKNOWN_PRE_R_A",
      "ratifiedCommit": "e8a41e409c92a4f3a61b493bd77ff1531a4833d3",
      "recordClass": "UNKNOWN_NOT_EVIDENCEABLE",
      "symmetryNoteHeadingPresent": "UNKNOWN_PRE_R_A"
    },
    {
      "acceptanceRecordHeadingPresent": "UNKNOWN_NOT_PRESENT",
      "decidedDate": "2026-10-02",
      "evidencedStates": [
        "RATIFIED"
      ],
      "executionRecordPath": "UNKNOWN_NOT_PRESENT",
      "executionRecordPresentAtPin": "UNKNOWN_NOT_PRESENT",
      "heading": "Execution Architecture Standing Rulings R-A, R-B, R-C — Decision Record (2026-10-02)",
      "implementationSha": {
        "ancestorOfPin": "UNKNOWN_NOT_PRESENT",
        "state": "FIELD_ABSENT",
        "value": null
      },
      "notEvidenceable": [
        "READY",
        "COMMENCED",
        "EXECUTING",
        "VERIFIED",
        "CLOSED_UNDER_6_12"
      ],
      "ordinal": 36,
      "packagePath": "UNKNOWN_NOT_PRESENT",
      "packagePresentAtPin": "UNKNOWN_NOT_PRESENT",
      "packageStatus": "UNKNOWN_NOT_PRESENT",
      "rAApplicability": "R_A_ERA",
      "rBSectionsPresent": "UNKNOWN_NOT_PRESENT",
      "ratifiedCommit": "6f0a84f347ae19ccaa33f97c0c776979bdaa3271",
      "recordClass": "STANDING_RULING",
      "symmetryNoteHeadingPresent": "UNKNOWN_NOT_PRESENT"
    },
    {
      "acceptanceRecordHeadingPresent": true,
      "decidedDate": "2026-10-02",
      "evidencedStates": [
        "RATIFIED",
        "MATERIALIZED",
        "ACCEPTED"
      ],
      "executionRecordPath": "40-Runtime/POA-SEA-IMPL-001-EXECUTION-RECORD.md",
      "executionRecordPresentAtPin": true,
      "heading": "POA-SEA-IMPL-001 — Lifecycle Verifier (Read-Only) Mission Ratification Decision Record (2026-10-02)",
      "implementationSha": {
        "ancestorOfPin": true,
        "state": "RECORDED",
        "value": "c73a786cac0656d930a7d8da841f9292bb923e47"
      },
      "notEvidenceable": [
        "READY",
        "COMMENCED",
        "EXECUTING",
        "VERIFIED",
        "CLOSED_UNDER_6_12"
      ],
      "ordinal": 37,
      "packagePath": "40-Runtime/POA-SEA-IMPL-001-MISSION-PACKAGE.md",
      "packagePresentAtPin": true,
      "packageStatus": "RATIFIED",
      "rAApplicability": "R_A_ERA",
      "rBSectionsPresent": {
        "missing": [],
        "of": 12,
        "present": 12
      },
      "ratifiedCommit": "6f0a84f347ae19ccaa33f97c0c776979bdaa3271",
      "recordClass": "MISSION",
      "symmetryNoteHeadingPresent": true
    }
  ],
  "sources": [
    {
      "bytes": 252403,
      "path": "20-Shared/DECISIONS/POA-ADR-001.md",
      "sha256": "3e1c1330104b4a05072f3e3b73ee43b32ba2c683672ed107c9eb4cd4dbf86111"
    },
    {
      "bytes": 17518,
      "path": "40-Runtime/POA-SEA-IMPL-001-MISSION-PACKAGE.md",
      "sha256": "88ac655119c7fce372de9867a22fd93e7b14eca495c392c5dc1f8ae9cc3c2c4c"
    },
    {
      "bytes": 24211,
      "path": "40-Runtime/POA-SEA-IMPL-001-EXECUTION-RECORD.md",
      "sha256": "c163c03b10f3201e99e5cea26a8060cd5186419f98e3eab36a459f942a0e4a92"
    }
  ],
  "summary": {
    "derivedRows": 4,
    "h1Count": 38,
    "indexOnlyRows": 34,
    "unknownCounts": {
      "UNKNOWN_NOT_EVIDENCEABLE": 2,
      "UNKNOWN_NOT_IN_ALLOWLIST": 0,
      "UNKNOWN_NOT_PRESENT": 21,
      "UNKNOWN_PRE_R_A": 6
    }
  },
  "writes": []
}
```
