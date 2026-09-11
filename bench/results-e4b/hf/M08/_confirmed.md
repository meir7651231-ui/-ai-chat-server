# Validator Report: M08 (peruk08)

## Generic Checks (RULE trigger scan)
All police gates in ./_police.md show ✅ status:
- regen_ok ✅
- byte_identical_others ✅
- gates_pass ✅
- compiles ✅
- no_hebrew_in_engine ✅
- dart_math_sane ✅

No automatic P0 findings from failed generic checks.

## Auditor Findings Verification

### Finding A1: counter-particle-field-key-mismatch
- **File**: new/dart-gen-bs/gen_app_peruk08_px1.dart:35
- **Verdict**: CONFIRMED
- **Bytes**: Line 35 contains `(r[gen_app_peruk08_px1_c123] ?? '')` in counter particle filter
- **Evidence**:
  - `gen_app_peruk08_px1_c13 = 'האם כבר פנו למוכר'` (unscoped, correct)
  - `gen_app_peruk08_px1_c123 = 'תיק האם כבר פנו למוכר'` (scoped, wrong)
  - Entity screen saves records with key `gen_app_peruk08_ent1_c14` = `'האם כבר פנו למוכר'` (unscoped)
  - Counter tries to read with key `'תיק האם כבר פנו למוכר'` (scoped) → always returns null → filter always false → count always 0
- **Severity**: P1 (wrong runtime result)
- **Root cause**: Code generator produced scoped field name for counter constant while entity uses unscoped field names in record storage
- **Fix**: Change `r[gen_app_peruk08_px1_c123]` to `r[gen_app_peruk08_px1_c13]` on line 35

---

FIX-LIST: A1
