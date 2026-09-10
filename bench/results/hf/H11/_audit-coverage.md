# Audit: sechirut תקרה נמוכה task

## Findings

### P0 — Task not done: Calculated field not generated
**Issue:** The `תקרה נמוכה` field should be a **calculated/read-only** field that displays `min(תקרה לפי 3 חודשים, תקרה לפי שליש)`, but it was generated as a **user-editable text field** instead.

**Evidence:**
- `gen_app_sechirut_ent1.dart:207` renders `תקרה נמוכה` using `ForgeDsField` (user input widget) with `_v[12]` as the value
  - Should be: `_calc(gen_app_sechirut_ent1_c29, min(…))` (read-only display like lines 204-206)
  - Actual: `ForgeDsField(…, control: DsField(…, value: _v[12] ?? '', onChanged: (v) => setState(() => _v[12] = v), …))`
  - This makes it an editable field that stores user input, not a computed value

### P0 — Build-time error: Missing Dart import for min() function
**Issue:** The render-ds.mjs code (line 364) checks if the compiled formula contains `min/max` and adds `import 'dart:math';`, but:
1. The formula was never compiled as a formula (see first finding)
2. The import is not present in the generated file

**Evidence:**
- `gen_app_sechirut_ent1.dart` lines 1-17: no `import 'dart:math';` 
- Remedy: the min() function is a top-level function in dart:math, not a method on num

### Root cause: app-ds.mjs does not serialize formula to app JSON
**Issue:** The app generator (app-ds.mjs:302) creates the app JSON but only includes `label/type/required/enumVals` fields, omitting the `formula` property. When render-ds.mjs reads the app JSON to generate the Dart code, it cannot find the formula and treats the field as a regular text field.

**Evidence:**
- `machtzev/generator/app-ds.mjs:302`: `fields: rootE.schema.map((f) => ({ label: f.label, type: f.type || 'text', required: !!f.required, enumVals: f.enumVals || [] }))`
  - Missing: `formula: f.formula` in the output object
- `machtzev/generator/apps/sechirut.json` field 125-129: no `formula` key for `תקרה נמוכה`
  - Compare to spec: `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)` is in sechirut.txt but lost in JSON

**One-line fix:** `app-ds.mjs:302` change `enumVals: f.enumVals || []` to `enumVals: f.enumVals || [], ...(f.formula ? { formula: f.formula } : {})`

---

## Coverage verified
- ✅ Spec file correctly has the formula: `sechirut.txt:7` includes `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)`
- ✅ render-ds.mjs logic is sound: compileFormula (lines 202-211) supports min/max, and import injection (line 364) checks for it
- ❌ app-ds.mjs is the break point: formula lost when writing app JSON (line 302)
- ❌ Entity form rendering: `gen_app_sechirut_ent1.dart:207` treats it as user input instead of calculated
- ❌ Record save logic: `gen_app_sechirut_ent1.dart:53` assigns `_v[12] ?? ''` (user value) instead of min() result
- ❌ Record card display: `gen_app_sechirut_ent1.dart:106` includes `תקרה נמוכה` in card values as mutable field

**All four surfaces affected:** entity list screen (table view line 219), particle table (line 219), entity form (line 207), and data storage (line 53-54). The field appears everywhere but nowhere is it computed.

Machine report confirms: `calc: ❌ consts=1 calc=0` (1 const field, 0 computed) and `min: ❌ import=false fn=false method=false` (min function not imported/used).
