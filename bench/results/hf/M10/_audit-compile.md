# Audit Report: Calendar Task (M10)

## Findings

**machtzev/generator/apps/calendar.json:65 · Field "משך בדקות" has type "text" but task requires numeric · P0 (task not done) · Change `"type": "text"` to `"type": "num"`**

## Verification

**Coverage:** Checked spec-to-schema compilation path:
- ✓ Spec file correctly updated with new fields: `משך בדקות, משך בשעות = משך בדקות / 60`
- ✓ Generated calendar.json contains both fields (lines 64-74)
- ✓ Computed formula working in generated Dart code: `(num.tryParse(_v[5] ?? '') ?? 0) / 60` safely parses string to num (new/dart-gen-bs/gen_app_calendar_ent1.dart:51, line 163)
- ✓ No Dart null-safety errors in formula (tryParse returns num?, default 0 handles null)
- ✓ Police report confirms field detection (1×) and calc (1 const + 1 calc)

**Issue identified:**
- Task specification states "add a **numeric field** משך בדקות"
- Actual implementation in calendar.json line 65: `"type": "text"`
- Should be: `"type": "num"`
- The spec parser defaults to "text" type when none is explicitly specified (app-ds.mjs line 302: `type: f.type || 'text'`)
- Runtime workaround (parse string at render time) masks this type error but violates task requirement

**Correct field type inference:** 
The computed field formula `משך בדקות / 60` requires a numeric operand, implying the source field should be numeric. The field should not require runtime string parsing.

---
**Result:** 1 defect found. The task was not completed as specified.
