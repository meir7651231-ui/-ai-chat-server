machtzev/generator/app-ds.mjs:302 · formula field not exported to JSON schema · P0 compile-break (task not done) · Add `formula` to the exported field object: `fields: rootE.schema.map((f) => ({ label: f.label, type: f.type || 'text', required: !!f.required, enumVals: f.enumVals || [], ...(f.formula ? { formula: f.formula } : {}) }})`

## Coverage

✅ **Verified correct:**
- Spec file (sechirut.txt line 7): Formula correctly defined as `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)`
- entity.mjs: Correctly parses formulas from spec (lines 83, 103, 112) and includes them in schema
- render-ds.mjs: Correctly updated compileFormula (line 207) to accept min/max as valid tokens; correctly adds dart:math import (line 41)
- render-ds.mjs: Correctly applies formula compilation at line 361
- No state-leakage: Changes to render-ds.mjs only affect sechirut; byte-identical check passed for other apps

❌ **Root cause of failure:**
Police report shows `calc ❌ consts=1 calc=0` and `min ❌ import=false fn=false method=false` because:
1. Schema is parsed correctly by entity.mjs with `formula: "min(תקרה לפי 3 חודשים, תקרה לפי שליש)"`
2. But app-ds.mjs line 302 does NOT export the formula field to sechirut.json—only exports `label, type, required, enumVals`
3. When render-ds.mjs reads from JSON (line 305: `if (s.formula)`), formula is undefined
4. Result: Field rendered as plain text with no calculation, no min() function, no dart:math import
5. The field is NOT computed; it's just an empty text field labeled "תקרה נמוכה"

**Not a parse bug; not a regression.** The builder added parsing support but forgot to wire the schema export.
