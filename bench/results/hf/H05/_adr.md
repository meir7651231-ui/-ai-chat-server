# ADR — Task H05: Sort Cases Table by Key Handover Date

## Opening Question (Protocol ג.1)

**מה:** Sort the cases table (טבלה) in the app generated from `peruk02.txt` by the key-handover date field (תאריך מסירת מפתח), earliest first.

**מקור:** `peruk02.txt` line 10 (חלקיק תיק: [טבלה]); line 6 describes the case entity with תאריך מסירת מפתח field.

**תרגום ל-dial:** This is NOT a dial-drill; it's a table particle that displays cases. The table should be sorted ascending by the date field.

**helper נדרש:** A sort comparator that extracts the date field from each case and sorts by date ascending. This goes in the engine that composes the table, NOT in generated widget code.

**מחרוזות verbatim:** "תאריך מסירת מפתח" (from spec line 6).

**חסום (⛔):** None — date sorting is implementable from the data structure.

## Decision

Fix in the **engine layer** (`machtzev/generator/*.mjs`), not in generated code.
The sort must be applied when the table particle is rendered, before any UI binding.

## Verification

Run `node /tmp/claude-0/-home-user/56411416-50d1-59df-8369-5cc1fc15520c/scratchpad/bench/police-bench.mjs --root . --task H05 --claims ./claims.json` to verify:
- Generated table data is sorted by date
- All cases present (no filter/loss)
- Bytes identical to previous output except table order
