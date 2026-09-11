# 🔍 Audit Report — Regression & State-Leakage Lens (E09: peruk25)

## Verified Correct

**Formula implementation (gen_app_peruk25_ent1.dart:49):** Computed field `פיצויים לשנה` correctly implements `סכום פיצויים * 12` with safe null-handling:
```dart
gen_app_peruk25_ent1_c20: ((num.tryParse(_v[6] ?? '') ?? 0) * 12).toStringAsFixed(2)
```
- Index 6 maps correctly to סכום פיצויים (numeric field at position 6 in _labelsAll)
- num.tryParse handles null/unparseable strings with ?? 0 fallback
- toStringAsFixed(2) formats to 2 decimal places (matches formula pattern in sechirut.txt)
- Formula syntax matches existing computed field patterns (e.g., gen_app_ent6.dart subtraction formula)

**Field count transition:** JSON field count increased 6 → 8 (peruk25.json line ~36).
- סכום פיצויים: type "num", required: false ✓
- פיצויים לשנה: type "text", required: false ✓

**No state leakage:**
- Grep for "סכום פיצויים" outside peruk25: zero matches in new/dart-gen-bs/ and new/dart-data-bs/ ✓
- Grep for "peruk" in machtzev/generator/apps/ diff: only peruk25.json modified ✓
- Previous _labelsAll had [c9…c14]; new has [c9…c14, c19, c20] — append, not mutation ✓

**Other peruk apps untouched:**
- Git diff machtzev/generator/apps/ shows zero changes to peruk01–peruk24, peruk26+ ✓
- Police report: byte_identical_others ✅ (all 27 other peruk apps remain byte-identical) ✓

**Spec file syntax valid:**
- Formula in specs-ds/peruk25.txt line 6: `פיצויים לשנה = סכום פיצויים * 12` matches grammar ✓
- Matches SPEC-LANG.md pattern: `שם = <נוסחה>` with `field * number` operator ✓

**Dart math safety:**
- Uses `num.tryParse` (safe), not unsafe `.toDouble()` ✓
- Multiplication operator `*` valid on num type ✓
- `.toStringAsFixed(2)` valid Dart method ✓
- No use of unavailable methods (e.g., no `.sqrt()` on num directly; would need sqrt(num) function) ✓

**Police gate summary:**
- regen_ok ✅
- no_orphans ✅
- byte_identical_others ✅
- dart_math_sane ✅
- compiles ✅ (0 analyzer errors)
- field ✅ (1 numeric field)
- calc ✅ (1 computed field, consts=1)

**Coverage:** Lens audited formula correctness, field indexing, null-safety, substring over-triggers, shared state mutation, and app isolation. All verified sound. No findings.

