# Audit Coverage: calendar.txt — משך בדקות + משך בשעות

## Findings

new/dart-gen-bs/gen_app_calendar_ent1.dart:162 · type inference defect · P1 task not done · "משך בדקות" rendered as ForgeDsField (text) instead of numeric widget; typeNum keywords list missing "דקות"

## Coverage

**Checked:**
- spec-lang keyword detection: "דקות" absent from spec-lang.data.json typeNum list (lines 13-26)
- app.json field types: "משך בדקות" marked as type "text" (line 65), "משך בשעות" marked as type "num" (line 71) ✓
- Generated Dart form: line 162 uses ForgeDsField+DsField (text input), not ForgeDsNumberField (numeric input) ✗
- Computed formula: line 163 correctly uses `num.tryParse(_v[5] ?? '') / 60` with proper null handling ✓
- Content file: gen_app_calendar_ent1_content.dart labels correct (c14="משך בדקות", c15="משך בשעות") ✓
- Required field validation: lines 46-47 check only c9/c10 (מה/מועד), משך בדקות optional ✓
- Save logic: line 51 correctly calculates computed field, stores both fields ✓
- Chart/table displays: lines 92-100 include both fields in record card, CSV, data grid ✓
- Police gates: all passed (regen_ok, gates_pass, dart_math_sane, field count=1, calc consts=1) ✓

**Could not verify:**
- Flutter compilation (Dart/Flutter not installed; syntax appears sound)
- Runtime numeric validation on user input (no validation error for non-numeric text in "משך בדקות")
- UI appearance (type "text" field may lack numeric spinner/keyboard vs type "num")

**Task requirement vs actual:**
- Task: "add...a numeric field משך בדקות"  
- Actual: type="text" with `num.tryParse()` fallback (0 if non-numeric input)
- Inconsistency: "משך בשעות" correctly inferred as numeric because "שעות" ∈ typeNum; "משך בדקות" not numeric because "דקות" ∉ typeNum
