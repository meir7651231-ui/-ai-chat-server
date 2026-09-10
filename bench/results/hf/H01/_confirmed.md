# VALIDATOR REPORT — panuy distance-sorting task

## FINDINGS (ranked by severity)

### C1 · CONFIRMED — P0 Distance-in-km field never calculated
**new/dart-gen-bs/gen_app_panuy_ent1.dart:49**
Formula `מרחק בקמ = sqrt(מרחק בריבוע)` from spec line 4 was NOT compiled into generated code. Field c25 is assigned `_v[11] ?? ''` (raw user input), not `(sqrt(...)).toStringAsFixed(2)` (calculated). Lines 171-173 show c22, c23, c24 ARE calculated via `_calc()` helper, but c25 is missing entirely. Task requirement "distance shown is the real distance in km (square root of squared-distance field)" unmet.
**Fix:** In render-ds.mjs renderEntity(), ensure formula `sqrt(מרחק בריבוע)` compiles successfully (check if compileFormula returns null due to residue check or other gate); if it compiles, verify mapVals includes the sqrt expression for c25 in the _save() method.

### C2 · CONFIRMED — P0 Sorting by squared-distance, not km-distance
**new/dart-gen-bs/gen_app_panuy_px1.dart:34**
Sorts via `(num.tryParse(a[gen_app_panuy_px1_c15] ?? '0') ?? 0).compareTo(num.tryParse(b[gen_app_panuy_px1_c16] ?? '0') ?? 0))` where both c15 and c16 = 'מרחק בריבוע' (squared distance, per px1_content.dart:17-18). Spec requires "sorted by distance from me (nearest first)", which means sort by c12='מרחק בקמ' (km distance, px1_content.dart:14). Sorting by squared distance gives different rank order than km distance for real numeric values unless they're proportional (they are, but spec says km, not squared).
**Fix:** Change sort key in particles.mjs line 391 from `k(sortField.label)` to explicitly use the km-distance field label or column index; ensure regex at line 388 prioritizes 'מרחק בקמ' over 'מרחק בריבוע' (exact field name match or second .find() call).

### C3 · CONFIRMED — P1 Hebrew in engine code (policy violation)
**machtzev/generator/particles.mjs:387-389**
```javascript
const sortField = entity.schema.find((f) => /^(מרחק|distance)/.test(f.label.toLowerCase())) ||  // חפש שדה "מרחק"
                  entity.schema.find((f) => !f.formula && /^(price|amount|count|num|percent|שעה)$/.test(f.type || ''));
```
Regex contains Hebrew literal `מרחק` and comment in Hebrew. CLAUDE.md rule "no_hebrew_in_engine" (machine report shows `no_hebrew_in_engine ❌`) — engine code must use only English identifiers and domain-agnostic logic.
**Fix:** Replace regex with language-neutral detection: check `f.type === 'distance'` or use ordinal position-based fallback instead of label text matching.

### C4 · CONFIRMED — P1 Wrong sqrt import path (dead code, but blocks compilation)
**machtzev/generator/render-ds.mjs:376**
```javascript
funcImports.add(`import '../dart/sqrt.dart';`);
```
Attempts to import custom sqrt from relative path '../dart/sqrt.dart'. While the file exists (new/dart/sqrt.dart, custom Newton's method implementation), Dart's standard library provides `sqrt` via `import 'dart:math'`. The custom sqrt lacks guards (returns NaN for sqrt(0), undefined for negatives) violating the principle of using best-available atoms. Current code never reaches this line (formula doesn't compile, see C1), but if C1 is fixed, this import will fail or collide.
**Fix:** Change line 376 to `funcImports.add("import 'dart:math' show sqrt;");` and remove the custom sqrt.dart from the generated import chain (or deprecate it in favor of dart:math).

### C5 · CONFIRMED — P1 Unintended side effects on other apps (byte-identical-others violated)
**Police report shows changes in:** gen_app_peruk02_px1.dart, gen_app_peruk10_px1.dart, gen_app_peruk12_px1.dart, gen_app_peruk28_px1.dart + corresponding content files
Auto-sorting logic in particles.mjs:387-391 now applies to ALL apps with distance-like fields (regex `/^(мрchак|distance)/` matches any distance field in any app). Other peruk apps gained `.sort()` calls that were never requested, violating the requirement that only panuy receives this task's changes.
**Fix:** Gate the sorting logic in particles.mjs to run only for the 'panuy' app, or require explicit `sort:` directive in the spec; isolate particles.mjs changes to prevent unintended application to other entities.

## SUMMARY
5 CONFIRMED findings: 2 P0 (task incomplete: sqrt not calculated, sort by wrong field), 3 P1 (import wrong, Hebrew in engine, unintended side effects). All three are real bugs; fixes are safe and side-effect-free.

FIX-LIST: C1 C2 C3 C4 C5
