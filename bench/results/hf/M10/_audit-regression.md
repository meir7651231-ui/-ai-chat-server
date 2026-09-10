# 🔍 Audit Report — M10 (calendar field addition)

## Findings

**machtzev/generator/apps/calendar.json:64–67** · Field משך בדקות typed as "text" instead of numeric · **P1** · Change type from `"text"` to `"num"` to match task requirement for a numeric field and enable numeric input validation

**new/dart-gen-bs/gen_app_calendar_ent1.dart:162** · Input widget uses `DsField` (text field) for משך בדקות instead of numeric input · **P1** · Swap `DsField` for a numeric input widget (e.g., `ForgeNumInput` or equivalent) to accept only numeric values and prevent malformed input (currently accepts arbitrary text, then coerces to 0 in formula at line 163)

## Verified Correct

✅ **Computed field formula** (gen_app_calendar_ent1.dart:51, 163): Correctly computes משך בשעות = משך בדקות / 60 using `(num.tryParse(_v[5] ?? '') ?? 0) / 60` with proper string formatting.

✅ **State isolation**: Only calendar app files changed; no regression to other apps (confirmed gen_balagan_moments.dart receives expected field metadata update, no unintended side-effects to other specs).

✅ **Syntax & division operator**: Formula syntax valid, division by 60 is sound.

✅ **Constant mapping**: Stage constants correctly remapped (c16/c17 instead of c14/c15 after field insertion); all references in ent1 screen updated.

✅ **Content strings**: New field labels added to content file (c14="משך בדקות", c15="משך בשעות", c16="קבוע", c17="התקיים").

## Coverage

**Checked**: field type annotations in calendar.json; generated Dart input widgets (gen_app_calendar_ent1.dart lines 51–162); computed field formula; constant index shifts; state isolation (only calendar changed); balagan integration; CSV export column order (line 97–100).

**Not checked** (Flutter/Dart not installed): actual UI rendering, input widget appearance, numeric keyboard activation, null safety completeness beyond code inspection, runtime value coercion edge cases (e.g., negative numbers, decimals, scientific notation handling by the specific input widget class if upgraded).

## Summary

**Task completion**: 1/2 specs met.
- ✅ Computed field משך בשעות correctly implemented with formula and displayed.
- ❌ Numeric field משך בדקות specified as text input in schema and UI, breaks input validation.

Both P1 findings must resolve before task can ship.
