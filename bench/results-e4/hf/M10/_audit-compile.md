# Auditor Report — Calendar Task (M10)

## Findings

1. `machtzev/generator/apps/calendar.json:65` · field type mismatch: משך בדקות has type "text" but task specifies "numeric field" · **P1 wrong implementation** · change type from "text" to "num" to match task requirement

## Verified Correct

**Null-safety & arithmetic (lines 51, 163 of gen_app_calendar_ent1.dart):**
- Computed field formula `((num.tryParse(_v[5] ?? '') ?? 0) / 60).toStringAsFixed(2)` is sound:
  - `_v[5] ?? ''` coalesces null to empty string
  - `num.tryParse()` returns `num?`, handled by `?? 0` providing non-null fallback
  - Division `/` and `.toStringAsFixed(2)` are valid on `num`
  - Result type `String` matches map value type
- Field formula parses correctly in both save (line 51) and render (line 163) contexts
- 7 fields + 2 stages correctly counted in content file (gen_app_calendar_ent1_content.dart:3)
- Both fields present in generated code with correct labels (c14/c15)
- Spec edits to calendar.txt correctly add both fields with division formula
- All other app specs (tasks.txt, balagan.txt) remain byte-identical per police report
- Zero analyzer errors per compile check in _police.md
