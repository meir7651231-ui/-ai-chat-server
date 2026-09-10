# 🔍 Audit Report: peruk17 Number Particle

## Findings

`machtzev/generator/apps/peruk17.json:82` · field "ימים לתגובה" has `"type": "text"` but spec demands `[מספר]` (number particle), contradicting particle-plan-peruk17.json:209 which correctly specifies `"shape": "number"` · P0 · change type from "text" to "number"

## Verified Correct

- **Spec file (peruk17.txt)**: particle correctly added at line 17 with `[מספר]` syntax; entity field correctly added at line 7 with `ימים לתגובה[30]` syntax
- **Particle plan (particle-plan-peruk17.json:203-229)**: particle metadata correctly specifies `"shape": "number"`, `"expr": "[מספר] ימים לתגובה : ימים מקבלת המכתב"`, wired to KpiTile/KvLine
- **Documentation (particle-plan-peruk17.md)**: title "ימים לתגובה" correctly indexed across 5 references; render plan correctly shows "number | hero⇒KpiTile"
- **Compile gates**: no Dart analyzer errors; gates pass per _police.md
- **Task intent**: text "30 ימים מקבלת המכתב" (30 days from receipt of letter) matches spec line 7 syntax `ימים לתגובה[30]`

## Severity

**P0 (Task Not Done)** — Police gate confirms `num_particle: ❌ 0×` (zero numeric particles found; should be 1). Machine validates claim "30" against "num_particle" → FALSE. The [מספר] particle was not properly materialized due to wrong field type.

