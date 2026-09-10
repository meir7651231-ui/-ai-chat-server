# 🔬 VALIDATOR Report — peruk17 Number Particle

## Findings (Ranked by Severity)

1. **P0 · CONFIRMED** · `machtzev/generator/apps/peruk17.json:82` · `"type": "text"` must be `"type": "num"` for [מספר] particle — police shows `num_particle ❌ 0×` indicating field type blocks numeric rendering · Change line 82 from `"type": "text",` to `"type": "num",`

2. **P1 · CONFIRMED** · `machtzev/generator/specs-ds/peruk17.txt:17` · Particle descriptive text missing "30 " prefix — task says "whose text says: 30 ימים מקבלת המכתב" but spec has only "ימים מקבלת המכתב" (generated constant confirms: `'ימים מקבלת המכתב'` on line 99 of gen_app_peruk17_px1_content.dart) · Change line 17 from `חלקיק תיק: ימים לתגובה = [מספר] ימים לתגובה : ימים מקבלת המכתב` to `חלקיק תיק: ימים לתגובה = [מספר] ימים לתגובה : 30 ימים מקבלת המכתב`

## Auditor Agreement

- Audits (_audit-compile.md, _audit-coverage.md): Both identify **finding 1** as P0 task-not-done (num_particle ❌ 0×).
- Audit (_audit-regression.md): Uniquely identifies **finding 2** as P1 wrong-result (missing "30 " prefix).
- Police report: Confirms `num_particle ❌ 0×` (zero found, should be 1); all other checks pass.

## Verified Correct (No defects)

✅ Spec entity field correctly added (line 7): `ימים לתגובה[30]` — default value 30 present.
✅ Particle plan correctly inferred shape as "number" and wired to KvLine (numeric rendering).
✅ Entity field label correctly included in form (line 81 of peruk17.json).
✅ No state leakage: byte_identical_others ✅ confirms only peruk17 files changed.
✅ Compilation: analyzer errors total=0, gates pass, Dart math sane.

---

FIX-LIST:
1. machtzev/generator/apps/peruk17.json:82 · `"type": "text",` ⇒ `"type": "num",`
2. machtzev/generator/specs-ds/peruk17.txt:17 · append "30 " to particle description text (after colon)
