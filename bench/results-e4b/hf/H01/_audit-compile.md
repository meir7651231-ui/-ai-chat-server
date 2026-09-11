# Audit: panuy app — distance sort & display

## Findings

new/dart-gen-bs/gen_app_panuy_ent1.dart:50 · sqrt calculation uses undefined form value · P1 wrong result · Extract squared-distance calculation and pass to sqrt, not _v[10]

new/dart-gen-bs/gen_app_panuy_ent1.dart:175 · sqrt display uses undefined form value · P1 wrong result · Inline the squared-distance formula instead of _v[10]

## Coverage

**Verified correct:**
- Sorting field: gen_app_panuy_ent1_c34 = 'מרחק בקמ' ✅
- Sort direction: ascending (compareTo) → nearest first ✅
- Table columns: c12 header = 'מרחק בקמ', c26 value = 'מרחק בקמ' (not squared) ✅
- sqrt import: line 8 imports `dart:math` ✅
- Particle display: shows real distance in km ✅

**Critical defect: distance calculation broken for new records**
- Line 50: `sqrt((num.tryParse(_v[10] ?? '') ?? 0))` — _v[10] is never populated on CREATE (only indices 0–7, 12 are form fields; indices 8–11 are calculated)
- Line 175: Same bug in live display during form edit
- Result: New records always get distance=0; sort fails for new entries
- Compile passes because it's syntactically valid Dart (num.tryParse handles null safely); runtime produces wrong numeric value
