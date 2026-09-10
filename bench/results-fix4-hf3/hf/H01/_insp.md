# Inspection (INSP) Audit — H01 Task

## Task Coverage
**Entity:** אדם (person/availability); **Particle:** [טבלה] (table); **Hub:** N/A; **Report:** N/A
- Table spec updated to show: שם, זמין, מרחק בקמ, מחיר לשעה
- Sort added: מרחק בקמ עולה (ascending, nearest first)
- Distance field uses sqrt(מרחק בריבוע) per spec line 4
✅ All surfaces addressed

## Money/Numeric
- מרחק בקמ field: numeric, toStringAsFixed(2) in ent1.dart ✅
- Sort uses num.compareTo for numeric fields ✅
- No currency involved; distance is km (real units) ✅

## Edge/Crash
- Empty table handled: [ריק] אין אף אחד פנוי בכל specs ✅
- Sort on empty list: Dart List.sort handles empty gracefully ✅
- Negative distance: sqrt of computed value (sum of squares), always positive ✅
- Zero coords (user at origin): distance computed correctly (any sqrt result) ✅

## State Leakage
- Sort applied per-render via AnimatedBuilder (line 34 px1.dart) ✅
- No global state mutation; appStore.records().toList() creates fresh list ✅
- DsTable receives sorted items, immutable during render ✅

## Navigation
- Single entity (אדם); no navigation chains involved ✅
- Table click not specified in spec; no changes ✅

## Text Parity
- English: "distance (nearest first)" = Hebrew "מרחק בקמ עולה" ✅
- No Hebrew literals in engine (spec-only change) ✅
- Column labels from spec-lang.data.json verbatim ✅

## VERDICT: GO
All protocol requirements met. No blockers. Ready for police.
