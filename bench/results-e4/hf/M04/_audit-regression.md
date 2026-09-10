## Audit Findings — Regression & State-Leakage Lens

### Defects Found

1. **machtzev/generator/specs-ds/peruk17.txt:17** · Incomplete number particle descriptive text · **P1 (wrong result)** · Change `חלקיק תיק: ימים לתגובה = [מספר] ימים לתגובה : ימים מקבלת המכתב` to `חלקיק תיק: ימים לתגובה = [מספר] ימים לתגובה : 30 ימים מקבלת המכתב` (add "30 " prefix to match task requirement "whose text says: 30 ימים מקבלת המכתב")

### Evidence

**Police Report Verdict**: NOT DONE — missing: num_particle
- `num_particle: ❌ 0×` — Expected number particle with "30" value not found
- `| 30 | num_particle | FALSE |` — Claim check: "30" text in num_particle = FALSE

**Generated Code Analysis**:
- `new/dart-gen-bs/gen_app_peruk17_px1.dart:9` (comment) shows the incorrect expression: `ימים לתגובה = [מספר] ימים לתגובה : ימים מקבלת המכתב` without the "30" prefix
- `new/dart-data-bs/auto/gen_app_peruk17_px1_content.dart:97` confirms: `const String gen_app_peruk17_px1_c97 = 'ימים מקבלת המכתב';` (missing "30 " prefix)
- The KvLine rendering (line 35 of px1.dart) is correct and functional, using the field value properly with `num.tryParse` and `toStringAsFixed(0)`
- All downstream generation passed (compiles, zero analyzer errors, no orphans, byte-identical in other apps)

**Root Cause**: The spec file line 17 was edited to add the particle definition but the descriptive text (after the colon) was incomplete — it lacks the "30 " prefix that the task specified.

### Verified Correct

✅ **No state leakage detected**: 
- Only peruk17 files changed (peruk17.json, particle-plan-peruk17.*, py1.dart, px1 content, ent1 content, balagan_moments)
- `byte_identical_others: ✅` confirms no regressions in other apps
- No orphan generated files (`gen_app_*.dart` with unregistered namespace)
- No substring over-triggers (e.g., partial "30" matches in unrelated fields)
- No mutation of shared lists or duplicated constants

✅ **Parser & wiring sound**:
- Particle plan correctly identified shape as "number" and wired to KvLine
- Dart code generation properly uses `num.tryParse()` and `.toStringAsFixed(0)` for number formatting
- Field index mapping (6: gen_app_peruk17_ent1_c20 = '30') is correct for entity form default
- Balagan module registration correctly shows 7 fields including the new one

✅ **Compilation & gates**:
- All compiles, zero analyzer errors, gates pass, no Hebrew in engine, Dart math sane
- Generated Dart is syntactically correct and sound-type-safe

---

**Coverage Summary**: Checked spec syntax, particle plan generation, Dart code wiring (KvLine usage, num.tryParse safety, content constants), state isolation (no cross-app changes), field mappings. Could not check: runtime UI rendering (Flutter not installed), edge cases in appStore record access, actual user-facing text appearance.
