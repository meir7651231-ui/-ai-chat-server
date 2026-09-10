# 🔍 Audit Report — panuy app (M06)

## Findings

new/dart-gen-bs/gen_app_panuy_ent1.dart:50 · Computed conditional field קרוב saved as empty string instead of computed value · P1 · Line 50 should set `gen_app_panuy_ent1_c32: (((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? 'קרוב' : 'רחוק')` instead of empty string

new/dart-gen-bs/gen_app_panuy_ent1.dart:91 · Display of conditional field shows stored empty value _v[14] instead of string literal "קרוב" when condition true · P1 · Line 91 should use `(((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? 'קרוב' : gen_app_panuy_ent1_c33)` instead of `(_v[14] ?? '')`

new/dart-gen-bs/gen_app_panuy_ent1.dart:178 · Live preview shows empty value instead of "קרוב" when מרחק בריבוע < 100 · P1 · Line 178 conditional display uses `_v[14]` which defaults empty; should show string literal 'קרוב'

new/dart-gen-bs/gen_app_panuy_ent1.dart:189 · Grid display has same issue with empty value for computed field · P1 · Line 189 should replace `(_v[14] ?? '')` with string literal `'קרוב'`

## Coverage

✅ **Verified correct:**
- regen_ok: spec parsed, field קרוב added to entity (apps/panuy.json confirms c32="קרוב" c33="רחוק")
- byte_identical_others: police report confirms no collateral changes to other apps
- gates_pass: police report confirms gates pass (calc gate detects 1 calc field, far gate detects 1 conditional)
- compiles: flutter analyzer confirms 0 errors (police: compile=0)
- No orphan generated files (police: no_orphans ✅)
- Spec syntax parsing correct (conditional expression `< 100` recognized)

❌ **Could not verify** (would require runtime test):
- Actual runtime behavior: whether records display "קרוב"/"רחוק" correctly when condition true/false
- Whether computed value persists across edit cycle (save→load→edit)

## Verdict

**TASK DONE, BUT WRONG RESULT**: Field added to spec and generated, but display logic treats it as a user-editable field with stored empty value instead of as a read-only computed field with literal "קרוב"/"רחוק" values. When מרחק בריבוע < 100, users will see empty string instead of "קרוב". Severity: User-facing wrong output (P1).
