# 🔍 Audit Report: Conditional Field קרוב

## Findings

new/dart-gen-bs/gen_app_panuy_ent1.dart:91 · Conditional field קרוב returns empty string for true case instead of literal "קרוב" · P1 wrong-result · Line 91: change `(((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? (_v[14] ?? '') : gen_app_panuy_ent1_c33)` to `(((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? gen_app_panuy_ent1_c32 : gen_app_panuy_ent1_c33)` (same pattern on lines 99, 178, 188)

**Root cause**: Line 50 saves the קרוב field as empty string (`gen_app_panuy_ent1_c32: ''`); Line 62 loads it into `_v[14]`; display expressions then use `_v[14]` (which is always '') as the true branch, showing empty instead of the text "קרוב" when distance < 100. The false branch correctly uses the constant `gen_app_panuy_ent1_c33` ('רחוק'). This asymmetry breaks the task requirement: field should show "קרוב" when מרחק בריבוע < 100.

**Impact**: When distance squared is below 100, the field displays empty string instead of "קרוב". Display in cards (line 91), CSV export (line 99), live panel (line 178), and data grid (line 188) all use the same broken expression.

## Verified Correct

- **Condition operator & field selection**: `מרחק בריבוע < 100` correctly uses index _v[10] (c24) and < operator ✓
- **Null-safety**: All numeric parses use `num.tryParse(...) ?? 0` with proper null coalescing ✓  
- **Dart method calls**: `sqrt()` imported from `dart:math` (line 8), `.toStringAsFixed()` called on num (legal method) ✓
- **Syntax & nesting**: Parentheses balanced, expression compiles (flutter analyze: 0 errors per police report) ✓
- **False branch literal**: `gen_app_panuy_ent1_c33` correctly holds string 'רחוק' ✓

**Coverage**: Checked all 4 display locations (card, CSV, live panel, grid) for the conditional expression; traced _v indices through save/load cycle; verified constants in content file; examined spec requirement.

