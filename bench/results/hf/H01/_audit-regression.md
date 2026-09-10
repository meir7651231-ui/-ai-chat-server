# 🔴 Audit Report: panuy distance-sort task

## Findings (by severity)

**P0 · Compile-break: sqrt undefined**  
`new/dart-gen-bs/gen_app_panuy_ent1.dart · missing import`  
The formula `מרחק בקמ = sqrt(מרחק בריבוע)` compiles to use `sqrt(...)` but no import exists. Line 16+ should include `import '../dart/sqrt.dart';` but it doesn't appear. The builder's code at render-ds.mjs:376 tries to add it to funcImports, but the import is not rendered in the generated file. **Result: compile fails with "Undefined name 'sqrt'".**  
**Fix:** Verify funcImports are correctly output to file; check if sqrt formula is actually being compiled (expr might be null, causing field to be treated as user-input not calculated).

**P2 · State leakage: Hebrew in engine code**  
`machtzev/generator/particles.mjs:387-388 · regex contains Hebrew`  
```javascript
const sortField = entity.schema.find((f) => /^(מרחק|distance)/.test(f.label.toLowerCase()))
```
Engine code must be language-neutral; Hebrew strings belong only in specs (machtzev/generator/specs-ds/*.txt), not in generator logic. This couples the engine to a specific label in a specific language, breaking portability.  
**Fix:** Extract to a spec-driven config or enum instead of hardcoding Hebrew. E.g., detect field type (`type: 'distance'`) not label.

**P1 · Regression: unintended side effects on other apps**  
`new/dart-gen-bs/gen_app_peruk{02,10,12,28}_px1.dart · sorting added to all apps`  
The sorting logic added to particles.mjs:387–392 now affects **all** apps, not just panuy. peruk02_px1, peruk10_px1, peruk12_px1, peruk28_px1 all gained `.sort()` calls that weren't requested, shifting column indices and content refs (c107→c109, etc.). This violates byte-identical-others.  
**Reason:** The sortField search uses generic criteria (distance field or first numeric field) that match fields in other apps.  
**Fix:** Isolation: only apply sorting to apps that explicitly request it (e.g., a `sort:` directive in spec), or gate by app name (not maintainable).

**P1 · Task not fully done: distance in km not calculated**  
`new/dart-gen-bs/gen_app_panuy_ent1.dart:49 · gen_app_panuy_ent1_c25`  
The field `gen_app_panuy_ent1_c25` (מרחק בקמ) is set to `_v[11] ?? ''` in the save map, treating it as user input, not calculated. It should compute `sqrt(מרחק בריבוע)`. The generated screen shows distance in km in the table (c12), but the underlying record doesn't store the calculated value — the form will lose it on round-trip.  
**Fix:** Check that compileFormula succeeds for the sqrt formula and that the compiled expression is included in the _save() map. If compileFormula returns null, trace why (likely residue check or formula parsing).

---

## Coverage

✅ **Checked:**
- Import statements in gen_app_panuy_ent1.dart and gen_app_panuy_px1.dart (no sqrt import found)
- Generated sort logic in px1 files (present, references c15/c16 = squared distance, correct for sort, but unintended in other apps)
- Entity content constants (c25 = 'מרחק בקמ' correctly defined)
- Spec definition (sqrt formula present in panuy.txt line 4)
- Engine code in particles.mjs (Hebrew regex confirmed at line 387)
- Affected apps listed in police report (peruk02, peruk10, peruk12, peruk28 all have new sort logic with shifted indices)
- sqrt.dart file exists at `new/dart/sqrt.dart` with valid implementation

❌ **Could not check (no runtime/compiler available):**
- Whether Dart analysis actually fails or if sqrt resolves via dart:math shadowing
- Whether funcImports are written by the build pipeline (assumed not, given missing import in output)
- Whether the distance in km value is accessible at runtime (user input field with no computed value)

---

## Summary

The builder implemented auto-sorting for tables with distance fields, but introduced three flaws:
1. **sqrt not available** — import either not being generated or not in correct location
2. **Hebrew hardcoded in engine** — violates language-neutral principle
3. **Unintended side-effects** — sorting applied to all distance-field apps, breaking byte-identical-others guarantee

Task is **NOT DONE**: distance shown in UI (c12) but not calculated/stored in entity record (c25).
