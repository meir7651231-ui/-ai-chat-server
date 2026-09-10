# 🔍 Auditor Report — Panuy Table Columns (H13)

## Findings

new/dart-data-bs/auto/gen_app_panuy_px1_content.dart:5 · column order reversed: spec requires "שם, זמין, מרחק בקמ, מחיר לשעה" but generated c3='מחיר לשעה' and c4='מרחק בקמ' (swapped) — affects table display order at line 34 of gen_app_panuy_px1.dart · P1 task-not-done · swap c3↔c4 constants and reorder items mapping accordingly in table render (line 34 of px1.dart uses [c5,c6,c7,c8]=['שם','זמין','מחיר לשעה','מרחק בקמ'] which must become ['שם','זמין','מרחק בקמ','מחיר לשעה'])

## Verified Correct

✅ **Dart null-safety & method calls sound:**
- `dart:math` imported, `sqrt(num)` called correctly at ent1.dart:175
- `num.tryParse()` returns `num?`, null-coalesced with `?? 0` throughout ent1.dart:50,172–175 and px1.dart:38–39,45
- `.toStringAsFixed(int)` is valid on `num` types across all files
- `.abs()` used at root.dart:17 on `int` (difference of DateTime objects), correct
- All nested parentheses balanced and type-safe

✅ **Compilation result:** 
- Machine report shows `compiles ✅` with analyzer errors=0
- All ForgeDataGrid usage is syntactically valid (bare:true, columns:[], items:[])
- No non-existent Dart methods on num, String, List, or Map types

✅ **Spec syntax correctly implemented:**
- Particle definition at spec line 6 `[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה` parsed and stored
- Exactly 4 columns rendered (not 14 like ent1's edit-screen table, which is correct—px1 is the restricted particle table)
- Distance in km (מרחק בקמ) present in column set

⚠️ **What could not be checked:**
- Runtime behavior (no Flutter installed): cannot verify whether table actually renders with swapped columns or whether user sees the wrong column order in practice
- Link between content constants and actual field mappings in database schema
- Whether the ent1 entity-edit screen's full 14-column table (line 187) is intentional (appears to show all fields, not restricted to 4)

