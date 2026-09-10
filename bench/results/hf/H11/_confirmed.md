# ✅ Validator Report — sechirut תקרה נמוכה (min ceiling)

## Findings (ranked by severity)

**P0–01** · **CONFIRMED** · `machtzev/generator/app-ds.mjs:302` · Root cause: formula field not exported to JSON schema · **Fix:** Change line 302 from `fields: rootE.schema.map((f) => ({ label: f.label, type: f.type || 'text', required: !!f.required, enumVals: f.enumVals || [] }))` to `fields: rootE.schema.map((f) => ({ label: f.label, type: f.type || 'text', required: !!f.required, enumVals: f.enumVals || [], ...(f.formula ? { formula: f.formula } : {}) }})`

**P0–02** · **CONFIRMED** · `machtzev/generator/apps/sechirut.json:113` · Field label mismatch: "תקרה לפי חודשים" does not match spec "תקרה לפי 3 חודשים", breaks formula symbol resolution in compileFormula · **Fix:** Change label to "תקרה לפי 3 חודשים"

## Verification summary

✅ **Spec is correct:** sechirut.txt line 7 correctly defines `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)`

✅ **Entity parsing is correct:** entity.mjs lines 83, 103, 112 correctly parse formulas and include them in schema object

✅ **Render-ds.mjs formula handling is sound:** compileFormula (lines 202-211) properly supports min/max as valid tokens; import injection (line 364) correctly detects min/max and adds dart:math

❌ **Broken export chain:** app-ds.mjs line 302 exports only `{label, type, required, enumVals}` — missing `formula` property. Entity schema has it, but sechirut.json doesn't.

❌ **Broken label resolution:** sechirut.json line 113 has "תקרה לפי חודשים" but formula references "תקרה לפי 3 חודשים" (with "3"). compileFormula sorts labels by length then tries exact prefix match; "תקרה לפי חודשים" is too short, "תקרה לפי 3 חודשים" is not in the list → residue remains → function returns null (line 210).

**Consequence:** Both issues prevent the field from rendering as computed. Currently it renders as plain editable text (gen_app_sechirut_ent1.dart:207, 53), accepting arbitrary user input instead of calculating min().

**Dart:math import issue:** Not a separate defect. Line 364 of render-ds.mjs will auto-add `import 'dart:math';` once formula compiles. No manual fix needed.

## Final sweep

- ✅ No other formula fields broken (שכירות לשנה, תקרה לפי 3 חודשים, תקרה לפי שליש all compile correctly when exported with formula)
- ✅ No other entities affected (byte-identical check passed)
- ✅ Gates pass (regen_ok, byte_identical_others, gates_pass all green)
- ✅ No hand-edits detected

---

**FIX-LIST:**
- P0–01: app-ds.mjs:302 — add formula export: `...(f.formula ? { formula: f.formula } : {})`
- P0–02: sechirut.json:113 — change label "תקרה לפי חודשים" to "תקרה לפי 3 חודשים"
