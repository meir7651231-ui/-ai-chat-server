# ✅ Validator Report — H07 (sechirut) · תקרה מחייבת computed field

**Task**: Add computed field `תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש)` to בטוחה entity, compiled by app.

## Machine Checks (ALL PASS ✅)

| check | result | evidence |
|---|---|---|
| regen_ok | ✅ | Generator ran without error |
| byte_identical_others | ✅ | Only sechirut app modified; all 7 other apps byte-identical |
| gates_pass | ✅ | All 53 gates passed (spec-lang rules + protocol constraints) |
| compiles | ✅ | flutter analyze: 0 errors (line 16) |
| dart_math_sane | ✅ | max() correctly used as top-level fn (calc=true fn=true alt=false method=false, line 14) |
| no_orphans | ✅ | All generated outputs properly wired to render-ds layer |
| no_hebrew_in_engine | ✅ | No Hebrew in engine code |

## Verification vs Bytes

**Spec change** ✓
- File: `machtzev/generator/specs-ds/sechirut.txt` line 8
- Added: `תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש)`
- Placement: After source ceiling fields, before comparison fields (semantic order correct)

**Generated Dart — gen_app_sechirut_ent2.dart** ✓
- Line 9: `import 'dart:math';` — max() function imported correctly
- Line 51 (save): `gen_app_sechirut_ent2_c24: (max( (num.tryParse(_v[6] ?? '') ?? 0) ,  (num.tryParse(_v[7] ?? '') ?? 0) )).toStringAsFixed(2)`
  - _v[6] = תקרה לפי 3 חודשים (first ceiling)
  - _v[7] = תקרה לפי שליש (second ceiling)
  - Both args coalesced to num via `num.tryParse(...) ?? 0` (sound null safety ✓)
  - Result stored as 2-decimal string
- Line 179 (form display): `_calc(gen_app_sechirut_ent2_c24, max( (num.tryParse(_v[6] ?? '') ?? 0) ,  (num.tryParse(_v[7] ?? '') ?? 0) ))`
  - Same computation, displayed via _calc() widget (lines 125–136, formats num as centered value)
  - Computed field (not editable input) — correct pattern

**Dart math correctness** ✓
- max() is top-level function from dart:math, NOT a method on num (num.max() does not exist; correct per Dart semantics)
- Signature: `max<T extends Comparable<T>>(T a, T b) → T`
- Arguments: both (num, num) after coalescing — both Comparable ✓
- Result: num, passed to .toStringAsFixed(2) ✓

**Label** ✓
- File: `new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart` line 26
- `const String gen_app_sechirut_ent2_c24 = 'תקרה מחייבת';`

**Hub metadata** ✓
- File: `new/dart-data-bs/auto/gen_app_sechirut_hub_content.dart` line 10
- Updated: `'10 שדות'` → `'11 שדות'` (בטוחה entity field count increased by 1)

**Coverage** ✓
- Form input (lines 176–178): Both source fields editable
- Form display (line 179): Computed max field rendered via _calc, reactive to input changes
- Card list (line 92 in card method): Includes c24 in display labels and values
- Table/grid (line 191): Column c24 included in ForgeDataGrid
- CSV export (lines 98–100): Header and data rows include c24
- Record save/load (line 51, 63): Persisted and read correctly

**Comparison fields adjusted correctly** ✓
- Line 180: חורג מול 3 חודשים (c25) compares _v[5] > _v[6] (סך בטוחות vs תקרה לפי 3 חודשים) ✓
- Line 181: חורג מול שליש (c28) compares _v[5] > _v[7] (סך בטוחות vs תקרה לפי שליש) ✓
- Index shifts from field insertion absorbed correctly

## Auditor Findings

| file | verdict |
|---|---|
| _audit-compile.md | No compile errors. No task regression. **SHIP READY** ✓ |
| _audit-coverage.md | No defects found. Task complete and correct ✓ |
| _audit-regression.md | No defects found. (Pre-existing label issue c21 not in scope) ✓ |

---

## FIX-LIST: none

**VERDICT: CONFIRMED — Computed field תקרה מחייבת correctly implemented. All machine checks pass. All surfaces integrated (form, card, table, export, persistence). Dart null safety respected. Top-level max() function correctly mapped from spec. No regressions.**

