# 🔴 AUDIT: Regression Found — M04 (peruk17)

## Findings

**new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart:24-31 · state-leakage into unrelated app · P1 · verify sechirut.txt unchanged and regenerate in isolation**

- **Defect:** Constants in sechirut app were re-indexed when only peruk17 was being modified. Content strings shifted: c25–c30 became c25–c31 with different mappings.
  - OLD: `c25='מפתח חודש'`, `c26='חורג מול שליש'`, `c27='חורג'`, `c28='תקין'`, `c29='טווח פיקדון (0–1000000)'`, `c30='טווח ערבות בנקאית (0–1000000)'`
  - NEW: `c25='חורג'`, `c26='תקין'`, `c27='חורג מול שליש'`, `c28='חורג'`, `c29='תקין'`, `c30='טווח פיקדון'`, `c31='טווח ערבות'`
- **Severity:** P1 (wrong result — sechirut app mutated unintentionally)
- **Impact:** Sechirut app reference constants no longer match old indices; any stored data keyed by old constant names will be misaligned with new indices in display/validation logic.
- **Root cause:** Generator regenerated sechirut when it should have only touched peruk17; spec-ds/sechirut.txt must have been re-read or content ordering changed upstream.
- **Fix:** Confirm machtzev/generator/specs-ds/sechirut.txt was NOT modified; if unchanged, revert gen_app_sechirut_ent2_content.dart to HEAD state.

**machtzev/generator/apps/peruk17.json · task completed correctly · P0 (no issue)**

✅ New field `ימים לתגובה` added at line 81–85 as text field, not required, no enum values.

**machtzev/generator/specs-ds/peruk17.txt · task completed correctly · P0 (no issue)**

✅ Field added to entity definition at line 7: `ישות תיק עם …, ימים לתגובה | שלבים …`  
✅ Particle defined at line 17: `חלקיק תיק: ימים לתגובה = [מספר] ימים לתגובה : 30 ימים מקבלת המכתב`

**new/dart-data-bs/auto/gen_app_peruk17_px1_content.dart:97 · task completed correctly · P0 (no issue)**

✅ Particle description text correctly generated: `gen_app_peruk17_px1_c97 = '30 ימים מקבלת המכתב'` (line 100)

**new/dart-gen-bs/gen_balagan_moments.dart · metadata update legitimate, NOT a regression · P0 (no issue)**

✅ peruk17 BalaganModule (index 18) updated with new field in kBalaganModules list. This is expected — global module registry must reflect schema changes. File is not an app-specific generated file; it is shared infrastructure that documents all peruk* schemas.

---

## Police Report Discrepancy

The police report claims `byte_identical_others ✅ CONFIRMED: No other apps modified; only peruk17 app output changed`.

**VERDICT: FALSE**  
Sechirut app WAS modified (gen_app_sechirut_ent2_content.dart constants re-indexed). The byte_identical_others check missed a mutation in a shared schema registry or content generator.

---

## Coverage

**Verified correct:**
- Peruk17 field added to entity schema (apps/peruk17.json, specs-ds/peruk17.txt)
- Peruk17 particle defined with correct syntax: `[מספר] ימים לתגובה : 30 ימים מקבלת המכתב`
- Generated particle display text matches spec: `'30 ימים מקבלת המכתב'`
- Compile gate passed; particles gate resolved 8/8 particles (num_particle ✅ 1×)
- Dart code compiles with flutter analyze (0 errors)

**Could not verify:**
- Whether sechirut.txt was legitimately modified (would need access to prior spec state)
- Whether constant re-indexing in sechirut reflects a genuine spec change vs. generator-ordering regression
- Root cause of state-leakage (content ordering change, spec mutation, or generator bug)
