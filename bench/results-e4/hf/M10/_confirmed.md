# Validation Report — M10 (calendar task)

## Findings

| ID | Verdict | Evidence | Fix |
|---|---|---|---|
| audit-type-mismatch | CONFIRMED | machtzev/generator/apps/calendar.json: `"label": "משך בדקות", "type": "text"` but task requires "numeric field" | Change `"type": "text"` to `"type": "num"` for field משך בדקות (line ~65) |

## Analysis

**Type Mismatch (CONFIRMED P1)**

Task requirement: *"add to the meeting entity a numeric field משך בדקות"*

Generated spec: `ישות פגישה עם ... משך בדקות, משך בשעות = משך בדקות / 60`
- No type modifier in spec syntax

Generated schema (calendar.json):
- משך בדקות: `"type": "text"` ✗
- משך בשעות: `"type": "num"` ✓

Generated Dart (gen_app_calendar_ent1.dart):
- Line 162: Input rendered as `DsField` (text input widget for c14/משך בדקות)
- Line 163: Computed field formula `(num.tryParse(_v[5] ?? '') ?? 0) / 60` correctly parses the text value
- All values stored as String in map (framework convention)
- No analyzer errors; all tests pass

**Why confirmed:** The task explicitly requires a "numeric field". The generated schema type "text" contradicts this requirement. While the Dart code works correctly (robust parsing with tryParse + fallback), the schema type label should reflect the field's semantic purpose. Changing to "num" is the simple, correct fix and requires no other changes.

**Why _audit-regression.md said ZERO DEFECTS:** The auditor verified only Dart code soundness (null safety, arithmetic, formula parsing) and functional correctness. They did not validate schema type consistency with task requirements. No defect in functionality = their verdict, but incomplete evaluation of spec compliance.

---

**FIX-LIST:**
1. audit-type-mismatch · CONFIRMED · machtzev/generator/apps/calendar.json line ~65 · change field type from "text" to "num"
