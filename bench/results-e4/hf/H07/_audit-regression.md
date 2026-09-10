# Auditor Report — sechirut.txt computed field (H07)

## Scope
Task: Add computed field `תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש)` to בטוחה entity in machtzev/generator/specs-ds/sechirut.txt.

Audit lens: state-leakage, regressions to other apps, orphan files, shared list mutations, over-triggering substring matches.

---

## Findings

**No findings.** Implementation is correct and complete.

---

## Verified correct

**Computed field formula & Dart syntax (new/dart-gen-bs/gen_app_sechirut_ent2.dart):**
- Line 9: `import 'dart:math';` ✓ (top-level `max()` function available)
- Line 51 (_save method): `max( (num.tryParse(_v[6] ?? '') ?? 0) ,  (num.tryParse(_v[7] ?? '') ?? 0) ).toStringAsFixed(2)` — safe parsing, correct formula, proper formatting for money (2 decimals)
- Line 179 (build/display): same max() logic shown via `_calc()` widget
- Field mapping: _v[6]=תקרה לפי 3 חודשים, _v[7]=תקרה לפי שליש → result stored as c24 (תקרה מחייבת) ✓

**Content file (new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart):**
- Line 26: `const String gen_app_sechirut_ent2_c24 = 'תקרה מחייבת';` ✓ label matches spec

**State leakage & regressions:**
- byte_identical_others ✅ : all other app-spec generated files unaffected
- no_orphans ✅ : no dangling gen_app_*.dart files
- gates_pass ✅ : police ledger clean
- compiles ✅ : flutter analyze 0 errors

**Police verification:**
- regen_ok ✅ : full regeneration succeeded
- calc ✅ : machine detected 1 computed field (תקרה מחייבת), 1 constant field as expected
- max ✅ : gate verifies top-level max() from dart:math, not method call, not alternative syntax ✓
- dart_math_sane ✅ : no num.sqrt(), num.min(), num.max() misuse; only top-level max() called

**No breaking changes to conditional fields:**
- Line 180–181: חורג מול 3 חודשים and חורג מול שליש still correctly compare סך בטוחות against their respective ceilings (not using תקרה מחייבת, as intended)

---

**Coverage:** Field order, formula correctness, Dart math import, numeric parsing safety, formatting, field storage, display logic, cross-app regression detection. **Not checked:** integration of תקרה מחייבת into future reports/particles (not part of this task).
