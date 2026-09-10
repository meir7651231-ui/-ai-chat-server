# 🔴 AUDIT: Panuy distance-sorting task — CRITICAL FAILURES

## Findings (most-severe first)

### P0 · Task not done: distance-in-km field never calculated
**new/dart-gen-bs/gen_app_panuy_ent1.dart:49**
```dart
gen_app_panuy_ent1_c25: _v[11] ?? '',  // מרחק בקמ just read from input, never calculated
```
The spec says `מרחק בקמ = sqrt(מרחק בריבוע)` but the field is never populated with sqrt result. Records have empty/no km distance, so sorting has nothing to sort by.
**Fix:** In render-ds.mjs compileFormula, ensure sqrt formula output is stored back to the field; in ent1 _save(), compute and assign this field.

### P0 · Sorting by squared-distance instead of km-distance
**new/dart-gen-bs/gen_app_panuy_px1.dart:34**
```dart
sort((a, b) => (num.tryParse(a[gen_app_panuy_px1_c15] ?? '0') ?? 0).compareTo(num.tryParse(b[gen_app_panuy_px1_c16] ?? '0') ?? 0))
```
where `gen_app_panuy_px1_c15` = `gen_app_panuy_px1_c16` = 'مرحق بريبوع' (squared distance, line 17-18 in content file). Should sort by 'مرحق بقم' (km distance) per task spec "nearest first".
**Fix:** Change sort field reference to `gen_app_panuy_px1_c12` ('مرحق بقم'); verify field 12 is the km distance column.

### P0 · sqrt function not imported or defined
**new/dart-gen-bs/gen_app_panuy_ent1.dart** (no line)
render-ds.mjs line 214 outputs `dart.replace(/@func:sqrt@/g, 'sqrt')` but no `import 'dart:math' show sqrt;` appears in any generated file. Compilation will fail: "Undefined name 'sqrt'".
**Fix:** In render-ds.mjs renderEntity(), add `imports.add("import 'dart:math' show sqrt;");` when formula contains sqrt, not `import '../dart/sqrt.dart'`.

### P0 · Wrong sqrt import path (dead code but blocking compilation)
**machtzev/generator/render-ds.mjs:376**
```javascript
funcImports.add(`import '../dart/sqrt.dart';`);  // wrong: sqrt not in custom file, should be dart:math
```
**Fix:** Change to `funcImports.add("import 'dart:math' show sqrt;");`

### P1 · Hebrew in engine code (policy violation)
**machtzev/generator/particles.mjs:387-388**
```javascript
const sortField = entity.schema.find((f) => /^(מרחק|distance)/.test(f.label.toLowerCase())) ||  // חפש שדה "מרחק"
```
**machtzev/generator/render-ds.mjs:201, 211, 213, etc.**
```javascript
// G27ב: תמיכה בפונקציות-מספר (sqrt, min, max) מהאטלס — מפשטות מדעיות בלא Map-wrapper.
// תמיכה בפונקציות-עזר...
// החלף סימני-פונקציה בקריאות-Dart קונקרטיות...
```
Police report: `no_hebrew_in_engine ❌` — engine files must have English-only comments.
**Fix:** Replace Hebrew comments in particles.mjs and render-ds.mjs with English.

### P1 · Wrong sortField selection logic
**machtzev/generator/particles.mjs:387**
Regex `/^(מרחק|distance)/` matches both 'مرحق بريبوع' and 'مرحق بقم' but finds the first in schema order (squared distance). Spec requires sorting by km distance (nearest first).
**Fix:** Change regex to `/^(מרחק בקמ|distance.*km|distance$)/` OR check field name exact match, or use `.find()` to prefer exact 'مرحق بقم' match first.

## Coverage

✅ **Read and verified:**
- Spec: `machtzev/generator/specs-ds/panuy.txt` — requires `مرحق بقم = sqrt(مرحق بريبوע)` and sorted nearest-first
- Generated px1 screen: `gen_app_panuy_px1.dart:34` — sort logic uses wrong field (squared distance not km)
- Generated ent1 entity: `gen_app_panuy_ent1.dart:49, 173` — field never calculated, only reads input
- Generated content: `gen_app_panuy_px1_content.dart:17-18` — c15, c16 both 'مرحق بريبوع'
- Engine code: `particles.mjs:387-391`, `render-ds.mjs:201-223` — sqrt attempt with wrong import, Hebrew comments
- Police report: `_police.md` — confirms sqrt ❌, no_hebrew_in_engine ❌, sort_px ✅ (but sorting wrong field)

❌ **Could not verify (Flutter/Dart not installed):**
- Whether `sqrt` would actually compile and run (no compilation trace available)
- Runtime behavior of sorting with real numeric data
- Whether other panuy calculations work (only spot-checked squared-distance formula structure, math looks structurally correct for squaring, truncated by read limit)

## Verdict

**NOT DONE** — Three P0 blockers: (1) sqrt missing both import and definition, (2) km-distance field not calculated, (3) sorting by wrong field. Task goal "sorted by distance from me (nearest first), real km distance shown" is completely unmet. Builder attempted sqrt support but left it half-finished without imports; sort logic picks wrong field; km field has no calculation logic.
